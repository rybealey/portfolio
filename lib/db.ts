import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import { generateSlug, generateUniqueSlug } from './slug';

const dataDir = join(process.cwd(), 'data');
const dbPath = join(dataDir, 'case-studies.json');

// Ensure data directory exists
if (!existsSync(dataDir)) {
  mkdirSync(dataDir, { recursive: true });
}

export interface CaseStudyImage {
  id: string;
  filename: string;
  alt?: string;
  order: number;
}

export interface CaseStudy {
  id: number;
  slug: string;
  title: string;
  description: string;
  status: 'Completed' | 'Ongoing' | 'Planned';
  technologies: string[];
  images: CaseStudyImage[];
  logo?: string;
  production_url?: string;
  development_url?: string;
  created_at: string;
  updated_at: string;
}

type StoredCaseStudy = Omit<CaseStudy, 'technologies' | 'images'> & {
  images?: CaseStudyImage[];
  slug?: string;
};

interface Database {
  caseStudies: StoredCaseStudy[];
  technologies: { id: number; name: string }[];
  caseStudyTechnologies: { case_study_id: number; technology_id: number }[];
  nextCaseStudyId: number;
  nextTechnologyId: number;
}

function getDb(): Database {
  if (!existsSync(dbPath)) {
    const initialDb: Database = {
      caseStudies: [],
      technologies: [],
      caseStudyTechnologies: [],
      nextCaseStudyId: 1,
      nextTechnologyId: 1,
    };
    writeFileSync(dbPath, JSON.stringify(initialDb, null, 2));
    return initialDb;
  }

  const data = readFileSync(dbPath, 'utf-8');
  return JSON.parse(data) as Database;
}

function saveDb(db: Database): void {
  try {
    writeFileSync(dbPath, JSON.stringify(db, null, 2));
  } catch (error) {
    console.error('Error saving database:', error);
    // In production/serverless environments, filesystem writes may fail
    // This is expected behavior - consider migrating to a database solution
    throw new Error(
      'Failed to save database. In production, file-based databases are not supported. ' +
      'Please migrate to a database solution (PostgreSQL, MongoDB, etc.) or use a platform with persistent storage.'
    );
  }
}

export function getAllCaseStudies(): CaseStudy[] {
  const db = getDb();

  return db.caseStudies
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .map((study) => {
      const technologyIds = db.caseStudyTechnologies
        .filter((cst) => cst.case_study_id === study.id)
        .map((cst) => cst.technology_id);

      const technologies = db.technologies
        .filter((tech) => technologyIds.includes(tech.id))
        .map((tech) => tech.name)
        .sort();

      // Ensure slug exists for legacy data
      if (!study.slug) {
        const baseSlug = generateSlug(study.title);
        const existingSlugs = db.caseStudies
          .filter(s => s.id !== study.id && s.slug)
          .map(s => s.slug!);
        study.slug = generateUniqueSlug(baseSlug, existingSlugs);
        saveDb(db);
      }

      return {
        ...study,
        technologies,
        images: study.images || [],
        slug: study.slug!,
      };
    });
}

export function getCaseStudyById(id: number): CaseStudy | null {
  const db = getDb();
  const study = db.caseStudies.find((s) => s.id === id);

  if (!study) {
    return null;
  }

  const technologyIds = db.caseStudyTechnologies
    .filter((cst) => cst.case_study_id === id)
    .map((cst) => cst.technology_id);

  const technologies = db.technologies
    .filter((tech) => technologyIds.includes(tech.id))
    .map((tech) => tech.name)
    .sort();

  // Ensure slug exists for legacy data
  if (!study.slug) {
    const baseSlug = generateSlug(study.title);
    const existingSlugs = db.caseStudies
      .filter(s => s.id !== study.id && s.slug)
      .map(s => s.slug!);
    study.slug = generateUniqueSlug(baseSlug, existingSlugs);
    saveDb(db);
  }

  return {
    ...study,
    technologies,
    images: study.images || [],
    slug: study.slug!,
  };
}

export function getCaseStudyBySlug(slug: string): CaseStudy | null {
  const db = getDb();
  
  // First try to find by slug
  let study = db.caseStudies.find((s) => s.slug === slug);
  
  // If not found and slug looks like a number, try by ID for backward compatibility
  if (!study && /^\d+$/.test(slug)) {
    study = db.caseStudies.find((s) => s.id === parseInt(slug));
  }

  if (!study) {
    return null;
  }

  const technologyIds = db.caseStudyTechnologies
    .filter((cst) => cst.case_study_id === study!.id)
    .map((cst) => cst.technology_id);

  const technologies = db.technologies
    .filter((tech) => technologyIds.includes(tech.id))
    .map((tech) => tech.name)
    .sort();

  // Ensure slug exists for legacy data
  if (!study.slug) {
    const baseSlug = generateSlug(study.title);
    const existingSlugs = db.caseStudies
      .filter(s => s.id !== study!.id && s.slug)
      .map(s => s.slug!);
    study.slug = generateUniqueSlug(baseSlug, existingSlugs);
    saveDb(db);
  }

  return {
    ...study,
    technologies,
    images: study.images || [],
    slug: study.slug!,
  };
}

export function createCaseStudy(data: {
  title: string;
  description: string;
  status: 'Completed' | 'Ongoing' | 'Planned';
  technologies: string[];
  production_url?: string;
  development_url?: string;
}): CaseStudy {
  const db = getDb();
  const now = new Date().toISOString();

  // Generate unique slug
  const baseSlug = generateSlug(data.title);
  const existingSlugs = db.caseStudies
    .filter(s => s.slug)
    .map(s => s.slug!);
  const slug = generateUniqueSlug(baseSlug, existingSlugs);

  const newStudy = {
    id: db.nextCaseStudyId++,
    slug,
    title: data.title,
    description: data.description,
    status: data.status,
    images: [],
    production_url: data.production_url || undefined,
    development_url: data.development_url || undefined,
    created_at: now,
    updated_at: now,
  };

  db.caseStudies.push(newStudy);

  // Handle technologies
  data.technologies.forEach((techName) => {
    let tech = db.technologies.find((t) => t.name === techName);
    if (!tech) {
      tech = { id: db.nextTechnologyId++, name: techName };
      db.technologies.push(tech);
    }
    db.caseStudyTechnologies.push({
      case_study_id: newStudy.id,
      technology_id: tech.id,
    });
  });

  saveDb(db);
  return getCaseStudyById(newStudy.id)!;
}

export function updateCaseStudy(
  id: number,
  data: {
    title: string;
    description: string;
    status: 'Completed' | 'Ongoing' | 'Planned';
    technologies: string[];
    production_url?: string;
    development_url?: string;
    logo?: string;
  }
): CaseStudy | null {
  const db = getDb();
  const studyIndex = db.caseStudies.findIndex((s) => s.id === id);

  if (studyIndex === -1) {
    return null;
  }

  const study = db.caseStudies[studyIndex];
  
  // Update slug if title changed
  if (study.title !== data.title) {
    const baseSlug = generateSlug(data.title);
    const existingSlugs = db.caseStudies
      .filter(s => s.id !== id && s.slug)
      .map(s => s.slug!);
    study.slug = generateUniqueSlug(baseSlug, existingSlugs);
  }
  
  study.title = data.title;
  study.description = data.description;
  study.status = data.status;
  study.production_url = data.production_url || undefined;
  study.development_url = data.development_url || undefined;
  study.logo = data.logo !== undefined ? data.logo : study.logo;
  study.updated_at = new Date().toISOString();

  // Remove old technology associations
  db.caseStudyTechnologies = db.caseStudyTechnologies.filter(
    (cst) => cst.case_study_id !== id
  );

  // Add new technology associations
  data.technologies.forEach((techName) => {
    let tech = db.technologies.find((t) => t.name === techName);
    if (!tech) {
      tech = { id: db.nextTechnologyId++, name: techName };
      db.technologies.push(tech);
    }
    db.caseStudyTechnologies.push({
      case_study_id: id,
      technology_id: tech.id,
    });
  });

  saveDb(db);
  return getCaseStudyById(id);
}

export function updateCaseStudyImages(
  id: number,
  images: CaseStudyImage[]
): CaseStudy | null {
  const db = getDb();
  const studyIndex = db.caseStudies.findIndex((s) => s.id === id);

  if (studyIndex === -1) {
    return null;
  }

  const study = db.caseStudies[studyIndex];
  study.images = images;
  study.updated_at = new Date().toISOString();

  saveDb(db);
  return getCaseStudyById(id);
}

export function deleteCaseStudy(id: number): boolean {
  const db = getDb();
  const studyIndex = db.caseStudies.findIndex((s) => s.id === id);

  if (studyIndex === -1) {
    return false;
  }

  db.caseStudies.splice(studyIndex, 1);
  db.caseStudyTechnologies = db.caseStudyTechnologies.filter(
    (cst) => cst.case_study_id !== id
  );

  saveDb(db);
  return true;
}
