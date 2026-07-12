declare module 'sql.js' {
  export interface SqlJsStatement {
    bind(values: any[]): void;
    step(): boolean;
    getAsObject(): Record<string, any>;
    free(): void;
  }

  export class Database {
    constructor(data?: ArrayBuffer | Uint8Array);
    run(sql: string, params?: any[]): void;
    prepare(sql: string): SqlJsStatement;
    exec(sql: string): void;
    export(): Uint8Array;
    getRowsModified(): number;
  }

  export default function initSqlJs(): Promise<{
    Database: typeof Database;
  }>;
}
