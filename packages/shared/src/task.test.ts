import { describe, expect, it } from 'vitest';
import { checkTaskName, sameTaskName, TASK_NAME_MAX_LENGTH } from './task.js';

describe('checkTaskName', () => {
  it('trims leading and trailing whitespace', () => {
    expect(checkTaskName('  Write tests  ')).toEqual({ ok: true, name: 'Write tests' });
  });

  it('rejects empty and whitespace-only names', () => {
    expect(checkTaskName('')).toMatchObject({ ok: false, code: 'name_required' });
    expect(checkTaskName('   \t ')).toMatchObject({ ok: false, code: 'name_required' });
  });

  it('accepts exactly 100 characters after trimming and rejects 101', () => {
    const hundred = 'a'.repeat(TASK_NAME_MAX_LENGTH);
    expect(checkTaskName(`  ${hundred}  `)).toEqual({ ok: true, name: hundred });
    expect(checkTaskName(`${hundred}b`)).toMatchObject({ ok: false, code: 'name_too_long' });
  });

  it('treats names made only of invisible characters as empty', () => {
    expect(checkTaskName('\u200B')).toMatchObject({ ok: false, code: 'name_required' });
    expect(checkTaskName(' \uFEFF\u2060 ')).toMatchObject({ ok: false, code: 'name_required' });
  });

  it('normalizes so look-alike names compare equal', () => {
    expect(checkTaskName('\u200BRefactor\u200B')).toEqual({ ok: true, name: 'Refactor' });
    expect(checkTaskName('Cafe\u0301')).toEqual({ ok: true, name: 'Caf\u00e9' });
    expect(checkTaskName('Line one\nline two')).toEqual({ ok: true, name: 'Line one line two' });
  });

  it('counts characters, not UTF-16 units', () => {
    expect(checkTaskName('🍅'.repeat(TASK_NAME_MAX_LENGTH))).toMatchObject({ ok: true });
  });
});

describe('sameTaskName', () => {
  it('ignores letter case, including non-ASCII letters', () => {
    expect(sameTaskName('FT-1 PRD', 'ft-1 prd')).toBe(true);
    expect(sameTaskName('Задача', 'ЗАДАЧА')).toBe(true);
    expect(sameTaskName('Refactor', 'Refactr')).toBe(false);
  });
});
