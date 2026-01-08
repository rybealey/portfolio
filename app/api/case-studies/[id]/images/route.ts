import { NextRequest, NextResponse } from 'next/server';
import { isAuthenticated } from '@/lib/auth';
import { getCaseStudyById, updateCaseStudyImages, CaseStudyImage } from '@/lib/db';
import { writeFile, mkdir } from 'fs/promises';
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
    const files = formData.getAll('files') as File[];

    if (files.length === 0) {
      return NextResponse.json({ error: 'No files provided' }, { status: 400 });
    }

    const uploadDir = join(process.cwd(), 'public', 'case-studies', id.toString());
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    const uploadedImages: CaseStudyImage[] = [];
    const existingImages = caseStudy.images || [];
    let maxOrder = existingImages.length > 0 
      ? Math.max(...existingImages.map(img => img.order))
      : -1;

    for (const file of files) {
      if (!file.type.startsWith('image/')) {
        continue;
      }

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Generate unique filename
      const timestamp = Date.now();
      const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
      const filename = `${timestamp}-${originalName}`;
      const filepath = join(uploadDir, filename);

      await writeFile(filepath, buffer);

      maxOrder++;
      uploadedImages.push({
        id: `${id}-${timestamp}-${Math.random().toString(36).substring(7)}`,
        filename,
        alt: file.name.replace(/\.[^/.]+$/, ''),
        order: maxOrder,
      });
    }

    const updatedImages = [...existingImages, ...uploadedImages];
    const updatedCaseStudy = updateCaseStudyImages(id, updatedImages);

    return NextResponse.json(updatedCaseStudy);
  } catch (error) {
    console.error('Error uploading images:', error);
    return NextResponse.json(
      { error: 'Failed to upload images' },
      { status: 500 }
    );
  }
}

export async function PUT(
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

  try {
    const { images } = await request.json();
    const updatedCaseStudy = updateCaseStudyImages(id, images);
    
    if (!updatedCaseStudy) {
      return NextResponse.json({ error: 'Case study not found' }, { status: 404 });
    }

    return NextResponse.json(updatedCaseStudy);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update images' },
      { status: 500 }
    );
  }
}

