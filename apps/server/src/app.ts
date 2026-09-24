import { zValidator } from '@hono/zod-validator';
import { serveStatic } from '@hono/node-server/serve-static';
import { ERROR_MESSAGES, TaskNameBody, checkTaskName, type ErrorCode } from '@pomodoro/shared';
import { Hono, type Context } from 'hono';
import { bodyLimit } from 'hono/body-limit';
import { HTTPException } from 'hono/http-exception';
import type { ContentfulStatusCode } from 'hono/utils/http-status';
import { isOpenNameViolation, type Database } from './db.js';
import { getTask, insertTask, listOpenTasks, openNameTaken, renameTask } from './tasks.js';

type AppOptions = {
  /** Directory of the built web app, relative to the working directory. Omit to serve the API only. */
  staticRoot?: string;
};

/** A Task name is at most 100 characters, so any real request body is tiny. */
const MAX_BODY_BYTES = 16 * 1024;

/**
 * The server listens on loopback only, but a web page elsewhere could still reach it through
 * DNS rebinding. Such requests carry that page's host name, so only loopback names are served.
 */
const LOOPBACK_HOST = /^(localhost|127\.0\.0\.1|\[::1\])(:\d+)?$/i;

function fail(c: Context, code: ErrorCode, status: ContentfulStatusCode, message = ERROR_MESSAGES[code]) {
  return c.json({ error: { code, message } }, status);
}

export function createApp(db: Database, options: AppOptions = {}) {
  const api = new Hono();

  const nameBody = zValidator('json', TaskNameBody, (result, c) => {
    if (!result.success) return fail(c, 'invalid_request', 400);
  });

  api.get('/tasks', (c) => c.json({ tasks: listOpenTasks(db) }));

  api.post('/tasks', nameBody, (c) => {
    const check = checkTaskName(c.req.valid('json').name);
    if (!check.ok) return fail(c, check.code, 400);
    if (openNameTaken(db, check.name)) return fail(c, 'duplicate_name', 409);
    return c.json({ task: insertTask(db, check.name, Date.now()) }, 201);
  });

  // Renames a Task in any state; only Open Tasks count as duplicates.
  api.patch('/tasks/:id', nameBody, (c) => {
    const id = c.req.param('id');
    if (!getTask(db, id)) return fail(c, 'not_found', 404);
    const check = checkTaskName(c.req.valid('json').name);
    if (!check.ok) return fail(c, check.code, 400);
    if (openNameTaken(db, check.name, id)) return fail(c, 'duplicate_name', 409);
    const task = renameTask(db, id, check.name, Date.now());
    return task ? c.json({ task }) : fail(c, 'not_found', 404);
  });

  const app = new Hono();

  app.use('*', async (c, next) => {
    const host = c.req.header('host');
    if (host !== undefined && !LOOPBACK_HOST.test(host)) {
      return fail(c, 'invalid_request', 403, 'Open the app at http://localhost.');
    }
    await next();
  });
  app.use(
    '/api/*',
    bodyLimit({
      maxSize: MAX_BODY_BYTES,
      onError: (c) => fail(c, 'invalid_request', 413, 'The request is too large.'),
    }),
  );

  app.route('/api', api);
  // Unknown API paths get the error shape too, and never fall through to the web app.
  app.all('/api/*', (c) => fail(c, 'not_found', 404, 'Not found.'));

  if (options.staticRoot) {
    // `/` serves index.html. There is no client-side router, so nothing else falls back to it.
    app.use('/*', serveStatic({ root: options.staticRoot }));
  }

  app.onError((error, c) => {
    if (isOpenNameViolation(error)) return fail(c, 'duplicate_name', 409);
    // Malformed JSON and similar request errors raised by Hono itself keep their status.
    if (error instanceof HTTPException && error.status < 500) {
      return fail(c, 'invalid_request', error.status);
    }
    console.error(error);
    return fail(c, 'internal_error', 500);
  });

  return app;
}
