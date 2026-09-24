import {
  ErrorResponse,
  TaskListResponse,
  TaskResponse,
  type ErrorCode,
  type Task,
} from '@pomodoro/shared';
import type { z } from 'zod';

export class ApiError extends Error {
  constructor(
    readonly code: ErrorCode | 'network_error',
    message: string,
  ) {
    super(message);
  }
}

const REQUEST_TIMEOUT_MS = 10_000;
const UNREACHABLE = "Can't reach the server. Is it running?";

async function request<S extends z.ZodType>(
  schema: S,
  path: string,
  init?: RequestInit,
): Promise<z.infer<S>> {
  let res: Response;
  try {
    res = await fetch(path, {
      ...init,
      headers: { 'Content-Type': 'application/json' },
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });
  } catch (error) {
    if (error instanceof DOMException && error.name === 'TimeoutError') {
      throw new ApiError('network_error', "The server didn't answer. Try again.");
    }
    throw new ApiError('network_error', UNREACHABLE);
  }
  const body: unknown = await res.json().catch(() => undefined);
  if (!res.ok) {
    const parsed = ErrorResponse.safeParse(body);
    if (parsed.success) throw new ApiError(parsed.data.error.code, parsed.data.error.message);
    // The API always answers in the error shape. Anything else came from in between, such as
    // the dev server's proxy while the API is down.
    throw new ApiError('network_error', UNREACHABLE);
  }
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    throw new ApiError('internal_error', 'The server sent an unexpected answer. Reload the page.');
  }
  return parsed.data;
}

export const tasksQueryKey = ['tasks'] as const;

export async function fetchTasks(): Promise<Task[]> {
  return (await request(TaskListResponse, '/api/tasks')).tasks;
}

export async function createTask(name: string): Promise<Task> {
  const body = JSON.stringify({ name });
  return (await request(TaskResponse, '/api/tasks', { method: 'POST', body })).task;
}

export async function renameTask(id: string, name: string): Promise<Task> {
  const body = JSON.stringify({ name });
  const path = `/api/tasks/${encodeURIComponent(id)}`;
  return (await request(TaskResponse, path, { method: 'PATCH', body })).task;
}
