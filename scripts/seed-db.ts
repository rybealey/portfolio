import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';

const dataDir = join(process.cwd(), 'data');
const dbPath = join(dataDir, 'case-studies.json');

// Ensure data directory exists
if (!existsSync(dataDir)) {
  mkdirSync(dataDir, { recursive: true });
}

interface Database {
  caseStudies: Array<{
    id: number;
    title: string;
    description: string;
    status: 'Completed' | 'Ongoing' | 'Planned';
    created_at: string;
    updated_at: string;
  }>;
  technologies: Array<{ id: number; name: string }>;
  caseStudyTechnologies: Array<{ case_study_id: number; technology_id: number }>;
  nextCaseStudyId: number;
  nextTechnologyId: number;
}

function getDb(): Database {
  if (!existsSync(dbPath)) {
    return {
      caseStudies: [],
      technologies: [],
      caseStudyTechnologies: [],
      nextCaseStudyId: 1,
      nextTechnologyId: 1,
    };
  }
  const data = readFileSync(dbPath, 'utf-8');
  return JSON.parse(data) as Database;
}

function saveDb(db: Database): void {
  writeFileSync(dbPath, JSON.stringify(db, null, 2));
}

const db = getDb();

// Reset if database already has data (for seeding)
if (db.caseStudies.length > 0) {
  console.log('Database already contains data. Clearing existing data...');
  db.caseStudies = [];
  db.technologies = [];
  db.caseStudyTechnologies = [];
  db.nextCaseStudyId = 1;
  db.nextTechnologyId = 1;
}

// Add technologies
const technologies = [
  'Next.js',
  'Supabase',
  'Payment Integration',
  'Entity Management',
  'WordPress',
  'Linux',
  'Server Administration',
  'Web Design',
];

technologies.forEach((name) => {
  const existing = db.technologies.find((t) => t.name === name);
  if (!existing) {
    db.technologies.push({
      id: db.nextTechnologyId++,
      name,
    });
  }
});

// Helper to get technology ID by name
const getTechId = (name: string): number => {
  const tech = db.technologies.find((t) => t.name === name);
  if (!tech) throw new Error(`Technology not found: ${name}`);
  return tech.id;
};

// Add Case Study 1: Impeccabyte
const now = new Date().toISOString();
const caseStudy1 = {
  id: db.nextCaseStudyId++,
  title: 'Impeccabyte',
  description:
    'Full-fledged web application facilitating entity formation, management, and digital payment through partnerships with Bizee, Maverick Payments, CheckHQ, and Bridge.',
  status: 'Completed' as const,
  created_at: now,
  updated_at: now,
};
db.caseStudies.push(caseStudy1);

const tech1Ids = ['Next.js', 'Supabase', 'Payment Integration', 'Entity Management'].map(getTechId);
tech1Ids.forEach((techId) => {
  db.caseStudyTechnologies.push({
    case_study_id: caseStudy1.id,
    technology_id: techId,
  });
});

// Add Case Study 2: SERVERIZZ Portfolio
const caseStudy2 = {
  id: db.nextCaseStudyId++,
  title: 'SERVERIZZ Portfolio',
  description:
    'Design and development of visually compelling websites, server infrastructure administration, and inbound marketing strategies for clients across diverse industries.',
  status: 'Ongoing' as const,
  created_at: now,
  updated_at: now,
};
db.caseStudies.push(caseStudy2);

const tech2Ids = ['WordPress', 'Linux', 'Server Administration', 'Web Design'].map(getTechId);
tech2Ids.forEach((techId) => {
  db.caseStudyTechnologies.push({
    case_study_id: caseStudy2.id,
    technology_id: techId,
  });
});

saveDb(db);

console.log('Database seeded successfully!');
console.log(`Inserted ${db.caseStudies.length} case studies`);
console.log(`Inserted ${db.technologies.length} technologies`);
