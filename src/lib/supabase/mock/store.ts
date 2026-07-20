import fs from "node:fs";
import path from "node:path";

const DATA_DIR = path.join(process.cwd(), ".mock-data");

function filePath(table: string) {
  return path.join(DATA_DIR, `${table}.json`);
}

export function readTable<T>(table: string): T[] {
  try {
    return JSON.parse(fs.readFileSync(filePath(table), "utf-8")) as T[];
  } catch {
    return [];
  }
}

export function writeTable<T>(table: string, rows: T[]) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  fs.writeFileSync(filePath(table), JSON.stringify(rows, null, 2));
}
