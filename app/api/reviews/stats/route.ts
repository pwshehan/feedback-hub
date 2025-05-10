import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

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

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db();
    const collection = db.collection('feedback');

    // Get total counts
    const totalCount = await collection.countDocuments();
    const reviewsCount = await collection.countDocuments({ type: 'REVIEW' });
    const reportsCount = await collection.countDocuments({ type: 'REPORT' });

    // Calculate average rating
    const ratingAggregation = await collection
      .aggregate([
        { $match: { type: 'REVIEW', rating: { $exists: true } } },
        { $group: { _id: null, averageRating: { $avg: '$rating' } } },
      ])
      .toArray();

    const averageRating = ratingAggregation[0]?.averageRating || 0;

    return NextResponse.json(
      {
        totalCount,
        reviewsCount,
        reportsCount,
        averageRating: Number(averageRating.toFixed(1)),
      },
      { headers: corsHeaders }
    );
  } catch (error) {
    console.error('Error fetching statistics:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500, headers: corsHeaders }
    );
  }
}
