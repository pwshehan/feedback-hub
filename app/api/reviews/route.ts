import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { FeedbackType } from '@/lib/models/feedback';
import { verifyToken, createAuthResponse } from '@/lib/auth-middleware';

export const dynamic = 'force-dynamic';

// Enhanced CORS headers for external API access
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-API-Key',
  'Access-Control-Max-Age': '86400',
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function GET(request: Request) {
  try {
    // Verify authentication for external API access
    const user = await verifyToken(request as any);
    if (!user) {
      return NextResponse.json(createAuthResponse('Valid authentication token required'), {
        status: 401,
        headers: corsHeaders,
      });
    }

    const { searchParams } = new URL(request.url);

    // Parse query parameters
    const type = searchParams.get('type') as FeedbackType | null;
    const isReadParam = searchParams.get('isRead');
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = Math.min(parseInt(searchParams.get('limit') || '10', 10), 100); // Cap at 100 items per page
    const accountId = searchParams.get('account_id'); // Allow filtering by account ID

    // Build query filters
    const filter: any = {};

    if (type && ['REVIEW', 'REPORT'].includes(type)) {
      filter.type = type;
    }

    if (isReadParam !== null) {
      filter.isRead = isReadParam === 'true';
    }

    if (accountId) {
      filter.account_id = accountId;
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
        success: true,
        data: {
          feedback,
          pagination: {
            totalCount,
            totalPages,
            currentPage: page,
            limit,
            hasNext: page < totalPages,
            hasPrev: page > 1,
          },
        },
      },
      { headers: corsHeaders }
    );
  } catch (error) {
    console.error('Error fetching feedback:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
        message: 'Failed to fetch feedback data',
      },
      { status: 500, headers: corsHeaders }
    );
  }
}
