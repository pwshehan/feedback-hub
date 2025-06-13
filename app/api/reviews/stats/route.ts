import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
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
    const accountId = searchParams.get('account_id'); // Allow filtering stats by account ID

    const client = await clientPromise;
    const db = client.db();
    const collection = db.collection('feedback');

    // Build base filter
    const baseFilter = accountId ? { account_id: accountId } : {};

    // Get total counts
    const totalCount = await collection.countDocuments(baseFilter);
    const reviewsCount = await collection.countDocuments({ ...baseFilter, type: 'REVIEW' });
    const reportsCount = await collection.countDocuments({ ...baseFilter, type: 'REPORT' });
    const unreadCount = await collection.countDocuments({ ...baseFilter, isRead: false });

    // Calculate average rating
    const ratingAggregation = await collection
      .aggregate([
        { $match: { ...baseFilter, type: 'REVIEW', rating: { $exists: true, $ne: null } } },
        { $group: { _id: null, averageRating: { $avg: '$rating' }, totalRatings: { $sum: 1 } } },
      ])
      .toArray();

    const ratingStats = ratingAggregation[0] || { averageRating: 0, totalRatings: 0 };

    // Get rating distribution
    const ratingDistribution = await collection
      .aggregate([
        { $match: { ...baseFilter, type: 'REVIEW', rating: { $exists: true, $ne: null } } },
        { $group: { _id: '$rating', count: { $sum: 1 } } },
        { $sort: { _id: 1 } },
      ])
      .toArray();

    const distribution: Record<number, number> = {};
    for (let i = 1; i <= 5; i++) {
      distribution[i] = 0;
    }
    ratingDistribution.forEach((item) => {
      distribution[item._id] = item.count;
    });

    return NextResponse.json(
      {
        success: true,
        data: {
          overview: {
            totalCount,
            reviewsCount,
            reportsCount,
            unreadCount,
          },
          ratings: {
            averageRating: Number(ratingStats.averageRating.toFixed(1)),
            totalRatings: ratingStats.totalRatings,
            distribution,
          },
          ...(accountId && { account_id: accountId }),
        },
      },
      { headers: corsHeaders }
    );
  } catch (error) {
    console.error('Error fetching statistics:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
        message: 'Failed to fetch statistics',
      },
      { status: 500, headers: corsHeaders }
    );
  }
}
