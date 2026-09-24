import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, relative } from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { ErrorResponse, TaskListResponse, TaskResponse } from '@pomodoro/shared';
import { createApp } from './app.js';
import { isOpenNameViolation, migrate, openDatabase, schemaVersion, type Database } from './db.js';
import { insertTask } from './tasks.js';

let db: Database;
let app: ReturnType<typeof createApp>;

beforeEach(() => {
  db = openDatabase(':memory:');
  app = createApp(db);
});

afterEach(() => db.close());

function send(method: string, path: string, body?: unknown) {
  return app.request(path, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: body === undefined ? undefined : typeof body === 'string' ? body : JSON.stringify(body),
  });
}

async function create(name: string) {
  const res = await send('POST', '/api/tasks', { name });
  expect(res.status).toBe(201);
  return TaskResponse.parse(await res.json()).task;
}

async function list() {
  const res = await send('GET', '/api/tasks');
  expect(res.status).toBe(200);
  return TaskListResponse.parse(await res.json()).tasks;
}

async function expectError(res: Response, status: number, code: string) {
  expect(res.status).toBe(status);
  const body = ErrorResponse.parse(await res.json());
  expect(body.error.code).toBe(code);
  expect(body.error.message).not.toBe('');
}

describe('create a Task', () => {
  it('saves the name trimmed, Open, with no Completed Pomodoros', async () => {
    const task = await create('  Write tests  ');
    expect(task).toMatchObject({ name: 'Write tests', state: 'open', completedCount: 0 });
    expect(task.createdAt).toBe(task.updatedAt);
    expect(await list()).toEqual([task]);
  });

  it('accepts a name of exactly 100 characters', async () => {
    await create('x'.repeat(100));
  });

  it.each([
    ['empty', '', 400, 'name_required'],
    ['whitespace-only', '   ', 400, 'name_required'],
    ['101 characters after trimming', ` ${'x'.repeat(101)} `, 400, 'name_too_long'],
    ['same name in another case', 'ft-1 prd', 409, 'duplicate_name'],
    ['same name with spaces around it', '  FT-1 PRD  ', 409, 'duplicate_name'],
  ])('rejects a %s name and writes nothing', async (_label, name, status, code) => {
    const existing = await create('FT-1 PRD');
    await expectError(await send('POST', '/api/tasks', { name }), status, code);
    expect(await list()).toEqual([existing]);
  });

  it.each([
    ['a missing name', {}],
    ['a non-string name', { name: 42 }],
    ['malformed JSON', '{"name":'],
  ])('rejects %s as invalid_request', async (_label, body) => {
    await expectError(await send('POST', '/api/tasks', body), 400, 'invalid_request');
    expect(await list()).toEqual([]);
  });
});

describe('rename a Task', () => {
  it('keeps the id through a spelling fix and a case-only change', async () => {
    const task = await create('Refactr');
    for (const name of ['Refactor', 'REFACTOR']) {
      const res = await send('PATCH', `/api/tasks/${task.id}`, { name });
      expect(res.status).toBe(200);
      expect(TaskResponse.parse(await res.json()).task).toMatchObject({ id: task.id, name });
    }
    expect(await list()).toEqual([expect.objectContaining({ id: task.id, name: 'REFACTOR' })]);
  });

  it('rejects the name of another Open Task and changes nothing', async () => {
    await create('FT-1 PRD');
    const other = await create('Write tests');
    await expectError(
      await send('PATCH', `/api/tasks/${other.id}`, { name: ' ft-1 PRD ' }),
      409,
      'duplicate_name',
    );
    expect((await list()).map((t) => t.name)).toEqual(['FT-1 PRD', 'Write tests']);
  });

  it.each([
    ['', 'name_required'],
    [' '.repeat(3), 'name_required'],
    ['y'.repeat(101), 'name_too_long'],
  ])('applies the create name rules to %j', async (name, code) => {
    const task = await create('Keep me');
    await expectError(await send('PATCH', `/api/tasks/${task.id}`, { name }), 400, code);
    expect((await list())[0]?.name).toBe('Keep me');
  });

  it('checks a Done Task only against Open Tasks', async () => {
    await create('FT-1 PRD');
    const done = await create('Old work');
    const doneTwin = await create('Archived name');
    db.prepare(`UPDATE tasks SET state = 'done' WHERE id IN (?, ?)`).run(done.id, doneTwin.id);

    await expectError(
      await send('PATCH', `/api/tasks/${done.id}`, { name: 'ft-1 prd' }),
      409,
      'duplicate_name',
    );
    const res = await send('PATCH', `/api/tasks/${done.id}`, { name: '  archived NAME  ' });
    expect(res.status).toBe(200);
    expect(TaskResponse.parse(await res.json()).task).toMatchObject({
      id: done.id,
      name: 'archived NAME',
      state: 'done',
    });
  });

  it('answers not_found for an unknown id', async () => {
    await expectError(
      await send('PATCH', '/api/tasks/7f1c1c8e-3a3a-4c2f-9d59-000000000000', { name: 'x' }),
      404,
      'not_found',
    );
  });
});

describe('Task list', () => {
  it('lists Open Tasks only, oldest first', async () => {
    const first = await create('First');
    const done = await create('Done one');
    const third = await create('Third');
    db.prepare(`UPDATE tasks SET state = 'done' WHERE id = ?`).run(done.id);
    expect((await list()).map((t) => t.id)).toEqual([first.id, third.id]);
  });

  it('answers unknown API paths with the error shape', async () => {
    await expectError(await send('GET', '/api/nope'), 404, 'not_found');
  });
});

describe('database', () => {
  it('enforces Open-name uniqueness in the schema as well', () => {
    insertTask(db, 'FT-1 PRD', 1);
    expect(() => insertTask(db, 'ft-1 prd', 2)).toThrow(/UNIQUE/);
  });

  it('recognises the Open-name index violation the API maps to duplicate_name', () => {
    insertTask(db, 'Taken', 1);
    let caught: unknown;
    try {
      insertTask(db, 'TAKEN', 2);
    } catch (error) {
      caught = error;
    }
    expect(isOpenNameViolation(caught)).toBe(true);
    expect(isOpenNameViolation(new Error('other'))).toBe(false);
  });

  it('keeps Tasks across restarts and applies each migration once', () => {
    const dir = mkdtempSync(join(tmpdir(), 'pomodoro-'));
    const file = join(dir, 'nested', 'pomodoro.sqlite');
    try {
      const first = openDatabase(file);
      expect(schemaVersion(first)).toBe(1);
      insertTask(first, 'Survives restarts', 1);
      first.close();

      const second = openDatabase(file);
      expect(schemaVersion(second)).toBe(1);
      expect(() => migrate(second)).not.toThrow();
      expect(schemaVersion(second)).toBe(1);
      const rows = second.prepare('SELECT name FROM tasks').all();
      expect(rows).toEqual([{ name: 'Survives restarts' }]);
      const mode = second.prepare('PRAGMA journal_mode').get() as { journal_mode: string };
      expect(mode.journal_mode).toBe('wal');
      second.close();
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });

  it('refuses a database written by a newer build', () => {
    const dir = mkdtempSync(join(tmpdir(), 'pomodoro-'));
    const file = join(dir, 'pomodoro.sqlite');
    try {
      const newer = openDatabase(file);
      newer.exec('PRAGMA user_version = 99');
      newer.close();
      expect(() => openDatabase(file)).toThrow(/newer than this build/);
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });
});

describe('request guards', () => {
  it('rejects requests addressed to a host other than this machine', async () => {
    const res = await app.request('/api/tasks', { headers: { Host: 'evil.example:3000' } });
    await expectError(res, 403, 'invalid_request');
    for (const host of ['localhost:3000', '127.0.0.1:3000', 'localhost:5173']) {
      expect((await app.request('/api/tasks', { headers: { Host: host } })).status).toBe(200);
    }
  });

  it('rejects oversized bodies before reading the name', async () => {
    const res = await send('POST', '/api/tasks', { name: 'x'.repeat(100_000) });
    await expectError(res, 413, 'invalid_request');
    expect(await list()).toEqual([]);
  });

  it('matches look-alike names as duplicates', async () => {
    await create('Caf\u00e9');
    await expectError(await send('POST', '/api/tasks', { name: 'cafe\u0301' }), 409, 'duplicate_name');
    await expectError(await send('POST', '/api/tasks', { name: '\u200B' }), 400, 'name_required');
  });

  it('gives unknown API paths a message that is not about Tasks', async () => {
    const res = await send('GET', '/api/nope');
    const body = ErrorResponse.parse(await res.json());
    expect(body.error.message).toBe('Not found.');
  });
});

describe('static web app', () => {
  it('serves index.html at / but not for missing files', async () => {
    const dir = mkdtempSync(join(tmpdir(), 'pomodoro-web-'));
    try {
      mkdirSync(join(dir, 'assets'));
      writeFileSync(join(dir, 'index.html'), '<!doctype html><title>t</title>');
      writeFileSync(join(dir, 'assets', 'app.js'), 'export {};');
      const web = createApp(db, { staticRoot: relative(process.cwd(), dir) });

      const root = await web.request('/');
      expect(root.status).toBe(200);
      expect(root.headers.get('content-type')).toMatch(/text\/html/);
      expect((await web.request('/assets/app.js')).status).toBe(200);
      expect((await web.request('/assets/old-hash.js')).status).toBe(404);
      await expectError(await web.request('/api/nope'), 404, 'not_found');
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });
});
