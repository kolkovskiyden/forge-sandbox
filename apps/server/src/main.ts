import { relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { serve } from '@hono/node-server';
import { createApp } from './app.js';
import { openDatabase } from './db.js';

// Loopback only: the app is for one person on this machine and has no login.
const HOST = '127.0.0.1';
const DEFAULT_PORT = 3000;
const DEFAULT_DB_PATH = './data/pomodoro.sqlite';

function exitWith(message: string): never {
  console.error(message);
  process.exit(1);
}

function readPort(): number {
  const raw = process.env.PORT?.trim();
  if (!raw) return DEFAULT_PORT;
  const port = Number(raw);
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    exitWith(`PORT must be a whole number from 1 to 65535, got "${raw}".`);
  }
  return port;
}

function readDbPath(): string {
  const raw = process.env.DB_PATH?.trim() || DEFAULT_DB_PATH;
  return raw === ':memory:' ? raw : resolve(raw);
}

const port = readPort();
const dbPath = readDbPath();
const webDist = fileURLToPath(new URL('../../web/dist', import.meta.url));

let db: ReturnType<typeof openDatabase>;
try {
  db = openDatabase(dbPath);
} catch (error) {
  exitWith(`Cannot open the database at ${dbPath}: ${error instanceof Error ? error.message : error}`);
}
const app = createApp(db, { staticRoot: relative(process.cwd(), webDist) || '.' });

const server = serve({ fetch: app.fetch, hostname: HOST, port }, () => {
  console.log(`Pomodoro tracker: http://localhost:${port} (database ${dbPath})`);
});

server.on('error', (error: NodeJS.ErrnoException) => {
  db.close();
  if (error.code === 'EADDRINUSE') {
    exitWith(`Port ${port} is already in use. Stop the other process or set PORT.`);
  }
  exitWith(`Server error: ${error.message}`);
});

let stopping = false;
function shutdown() {
  // A second Ctrl+C exits at once, even if a connection is still open.
  if (stopping) process.exit(1);
  stopping = true;
  server.close(() => {
    db.close();
    process.exit(0);
  });
}
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
