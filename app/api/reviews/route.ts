import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { FeedbackType, Feedback } from '@/lib/models/feedback';

export const dynamic = 'force-dynamic';

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    // Parse query parameters
    const type = searchParams.get('type') as FeedbackType | null;
    const isReadParam = searchParams.get('isRead');
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);

    // Build query filters
    const filter: Partial<Feedback> = {};

    if (type) {
      filter.type = type;
    }

    if (isReadParam !== null) {
      filter.isRead = isReadParam === 'true';
    }

    // Connect to MongoDB
    const client = await clientPromise;
    const db = client.db();
    const collection = db.collection('feedback');

    // Count total documents matching the filter
    const totalCount = await collection.countDocuments(filter);

    // Get paginated results
    const feedback = await collection
      .find(filter)
      .sort({ createdAt: -1 }) // Sort by newest first
      .skip((page - 1) * limit)
      .limit(limit)
      .toArray();

    // Calculate total pages
    const totalPages = Math.ceil(totalCount / limit);

    return NextResponse.json(
      {
        feedback,
        totalCount,
        totalPages,
        currentPage: page,
      },
      { headers: corsHeaders }
    );
  } catch (error) {
    console.error('Error fetching feedback:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500, headers: corsHeaders }
    );
  }
}
