import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';

const dataDir = join(process.cwd(), 'data');
const dbPath = join(dataDir, 'passions.json');

// Ensure data directory exists
if (!existsSync(dataDir)) {
  mkdirSync(dataDir, { recursive: true });
}

export interface Passion {
  id: number;
  title: string;
  description: string;
  icon?: string;
  order: number;
  created_at: string;
  updated_at: string;
}

interface PassionsDatabase {
  passions: Passion[];
  nextId: number;
}

function getDb(): PassionsDatabase {
  if (!existsSync(dbPath)) {
    const initialDb: PassionsDatabase = {
      passions: [],
      nextId: 1,
    };
    writeFileSync(dbPath, JSON.stringify(initialDb, null, 2));
    return initialDb;
  }

  const data = readFileSync(dbPath, 'utf-8');
  return JSON.parse(data) as PassionsDatabase;
}

function saveDb(db: PassionsDatabase): void {
  writeFileSync(dbPath, JSON.stringify(db, null, 2));
}

export function getAllPassions(): Passion[] {
  const db = getDb();
  return db.passions.sort((a, b) => a.order - b.order);
}

export function getPassionById(id: number): Passion | null {
  const db = getDb();
  return db.passions.find((p) => p.id === id) || null;
}

export function createPassion(data: {
  title: string;
  description: string;
  icon?: string;
  order: number;
}): Passion {
  const db = getDb();
  const now = new Date().toISOString();

  const newPassion: Passion = {
    id: db.nextId++,
    title: data.title,
    description: data.description,
    icon: data.icon,
    order: data.order,
    created_at: now,
    updated_at: now,
  };

  db.passions.push(newPassion);
  saveDb(db);
  return newPassion;
}

export function updatePassion(
  id: number,
  data: {
    title: string;
    description: string;
    icon?: string;
    order: number;
  }
): Passion | null {
  const db = getDb();
  const passionIndex = db.passions.findIndex((p) => p.id === id);

  if (passionIndex === -1) {
    return null;
  }

  const passion = db.passions[passionIndex];
  passion.title = data.title;
  passion.description = data.description;
  passion.icon = data.icon;
  passion.order = data.order;
  passion.updated_at = new Date().toISOString();

  saveDb(db);
  return passion;
}

export function deletePassion(id: number): boolean {
  const db = getDb();
  const passionIndex = db.passions.findIndex((p) => p.id === id);

  if (passionIndex === -1) {
    return false;
  }

  db.passions.splice(passionIndex, 1);
  saveDb(db);
  return true;
}

