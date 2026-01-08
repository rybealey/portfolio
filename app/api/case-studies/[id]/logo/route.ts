import { NextRequest, NextResponse } from 'next/server';
import { isAuthenticated } from '@/lib/auth';
import { getCaseStudyById, updateCaseStudy } from '@/lib/db';
import { writeFile, unlink, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const authenticated = await isAuthenticated();
  if (!authenticated) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const id = parseInt(params.id);
  if (isNaN(id)) {
    return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
  }

  const caseStudy = getCaseStudyById(id);
  if (!caseStudy) {
    return NextResponse.json({ error: 'Case study not found' }, { status: 404 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file || !file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'Invalid file' }, { status: 400 });
    }

    const uploadDir = join(process.cwd(), 'public', 'case-studies', id.toString(), 'logos');
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    // Delete old logo if it exists
    if (caseStudy.logo) {
      const oldLogoPath = join(process.cwd(), 'public', caseStudy.logo);
      if (existsSync(oldLogoPath)) {
        await unlink(oldLogoPath);
      }
    }

    // Save new logo
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const timestamp = Date.now();
    const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const filename = `logo-${timestamp}-${originalName}`;
    const filepath = join(uploadDir, filename);
    const publicPath = `/case-studies/${id}/logos/${filename}`;

    await writeFile(filepath, buffer);

    // Update case study with logo path
    const updatedCaseStudy = updateCaseStudy(id, {
      title: caseStudy.title,
      description: caseStudy.description,
      status: caseStudy.status,
      technologies: caseStudy.technologies,
      production_url: caseStudy.production_url,
      development_url: caseStudy.development_url,
      logo: publicPath,
    });

    return NextResponse.json(updatedCaseStudy);
  } catch (error) {
    console.error('Error uploading logo:', error);
    return NextResponse.json(
      { error: 'Failed to upload logo' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const authenticated = await isAuthenticated();
  if (!authenticated) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const id = parseInt(params.id);
  if (isNaN(id)) {
    return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
  }

  const caseStudy = getCaseStudyById(id);
  if (!caseStudy) {
    return NextResponse.json({ error: 'Case study not found' }, { status: 404 });
  }

  try {
    // Delete logo file
    if (caseStudy.logo) {
      const logoPath = join(process.cwd(), 'public', caseStudy.logo);
      if (existsSync(logoPath)) {
        await unlink(logoPath);
      }
    }

    // Update case study to remove logo
    const updatedCaseStudy = updateCaseStudy(id, {
      title: caseStudy.title,
      description: caseStudy.description,
      status: caseStudy.status,
      technologies: caseStudy.technologies,
      production_url: caseStudy.production_url,
      development_url: caseStudy.development_url,
      logo: undefined,
    });

    return NextResponse.json(updatedCaseStudy);
  } catch (error) {
    console.error('Error deleting logo:', error);
    return NextResponse.json(
      { error: 'Failed to delete logo' },
      { status: 500 }
    );
  }
}

