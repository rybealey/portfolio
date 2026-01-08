import { NextRequest, NextResponse } from 'next/server';
import { isAuthenticated } from '@/lib/auth';
import { getCaseStudyById, updateCaseStudyImages } from '@/lib/db';
import { unlink } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string; imageId: string } }
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
    const imageId = params.imageId;
    const image = caseStudy.images.find((img) => img.id === imageId);
    
    if (!image) {
      return NextResponse.json({ error: 'Image not found' }, { status: 404 });
    }

    // Delete the file
    const filepath = join(process.cwd(), 'public', 'case-studies', id.toString(), image.filename);
    if (existsSync(filepath)) {
      await unlink(filepath);
    }

    // Update the case study images
    const updatedImages = caseStudy.images.filter((img) => img.id !== imageId);
    const updatedCaseStudy = updateCaseStudyImages(id, updatedImages);

    return NextResponse.json(updatedCaseStudy);
  } catch (error) {
    console.error('Error deleting image:', error);
    return NextResponse.json(
      { error: 'Failed to delete image' },
      { status: 500 }
    );
  }
}

