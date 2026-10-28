import fs from 'fs';
import path from 'path';
import { getDatabase } from './connection';

export function runMigrations(dbPath?: string): void {
  const db = getDatabase(dbPath);
  const schemaFile = path.resolve(__dirname, 'schema.sql');
  const schemaSql = fs.readFileSync(schemaFile, 'utf8');

  // Execute schema as a single script
  db.exec(schemaSql);
}
