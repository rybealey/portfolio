import { NextRequest, NextResponse } from 'next/server';
import { isAuthenticated } from '@/lib/auth';
import { getAllCaseStudies, createCaseStudy } from '@/lib/db';

export async function GET() {
  const caseStudies = getAllCaseStudies();
  return NextResponse.json(caseStudies);
}

export async function POST(request: NextRequest) {
  const authenticated = await isAuthenticated();
  if (!authenticated) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const data = await request.json();
    const caseStudy = createCaseStudy(data);
    return NextResponse.json(caseStudy, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid request data' },
      { status: 400 }
    );
  }
}

