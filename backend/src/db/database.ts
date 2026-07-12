import initSqlJs, { Database as SqlJsDatabase } from 'sql.js';
import fs from 'fs';
import path from 'path';

const DB_PATH = path.join(__dirname, '..', '..', 'transitops.db');

let rawDb: SqlJsDatabase;
let shouldAutoSave = true;

/**
 * Database wrapper that provides a better-sqlite3 compatible API
 * on top of sql.js (WASM-based SQLite).
 */
class DatabaseWrapper {
  private db: SqlJsDatabase;

  constructor(db: SqlJsDatabase) {
    this.db = db;
  }

  prepare(sql: string) {
    const db = this.db;
    return {
      run(...params: any[]) {
        db.run(sql, params);
        if (shouldAutoSave) {
          saveToDisk(db);
        }
        return { changes: db.getRowsModified(), lastInsertRowid: getLastInsertRowId(db) };
      },
      get(...params: any[]) {
        const stmt = db.prepare(sql);
        stmt.bind(params);
        if (stmt.step()) {
          const row = stmt.getAsObject();
          stmt.free();
          return row;
        }
        stmt.free();
        return undefined;
      },
      all(...params: any[]) {
        const results: any[] = [];
        const stmt = db.prepare(sql);
        stmt.bind(params);
        while (stmt.step()) {
          results.push(stmt.getAsObject());
        }
        stmt.free();
        return results;
      },
    };
  }

  exec(sql: string) {
    this.db.exec(sql);
    saveToDisk(this.db);
  }

  transaction<T>(fn: () => T): () => T {
    const db = this.db;
    return () => {
      shouldAutoSave = false;
      db.run('BEGIN');
      try {
        const result = fn();
        db.run('COMMIT');
        saveToDisk(db);
        return result;
      } catch (err) {
        db.run('ROLLBACK');
        throw err;
      } finally {
        shouldAutoSave = true;
      }
    };
  }

  getRawDb() {
    return this.db;
  }
}

function getLastInsertRowId(db: SqlJsDatabase): number {
  const stmt = db.prepare('SELECT last_insert_rowid() as id');
  stmt.step();
  const row = stmt.getAsObject();
  stmt.free();
  return row.id as number;
}

function saveToDisk(db: SqlJsDatabase) {
  const data = db.export();
  const buffer = Buffer.from(data);
  fs.writeFileSync(DB_PATH, buffer);
}

let wrapper: DatabaseWrapper;

export async function initDatabase(): Promise<void> {
  const SQL = await initSqlJs();

  if (fs.existsSync(DB_PATH)) {
    const fileBuffer = fs.readFileSync(DB_PATH);
    rawDb = new SQL.Database(fileBuffer);
  } else {
    rawDb = new SQL.Database();
  }

  // Enable WAL mode and foreign keys
  rawDb.run('PRAGMA journal_mode = WAL');
  rawDb.run('PRAGMA foreign_keys = ON');

  wrapper = new DatabaseWrapper(rawDb);
  saveToDisk(rawDb);
}

export function getDb(): DatabaseWrapper {
  if (!wrapper) {
    throw new Error('Database not initialized. Call initDatabase() first.');
  }
  return wrapper;
}

export function persistDatabase(): void {
  if (!rawDb) {
    throw new Error('Database not initialized. Call initDatabase() first.');
  }
  saveToDisk(rawDb);
}
