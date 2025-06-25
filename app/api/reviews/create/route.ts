import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { z } from 'zod';

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

// Define the schema for review validation
const reviewSchema = z.object({
  type: z.enum(['REVIEW', 'REPORT']),
  account_id: z.string().min(1),
  username: z.string().min(1),
  message: z.string().min(1),
  rating: z.number().optional().nullable(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validate the request body
    const validationResult = reviewSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid request data', details: validationResult.error.format() },
        { status: 400, headers: corsHeaders }
      );
    }

    const { type, account_id, username, message, rating } = validationResult.data;

    // Additional validation
    if (type === 'REVIEW' && (rating === undefined || rating === null)) {
      return NextResponse.json(
        { error: 'Rating is required for reviews' },
        { status: 400, headers: corsHeaders }
      );
    }

    // Connect to MongoDB
    const client = await clientPromise;
    const db = client.db();
    const collection = db.collection('feedbacks');

    // Create the feedback document
    const feedbackDoc = {
      type,
      account_id,
      username,
      message,
      rating: type === 'REVIEW' ? rating : null,
      createdAt: new Date(),
      isRead: false,
    };

    // Insert the document
    const result = await collection.insertOne(feedbackDoc);

    return NextResponse.json(
      {
        success: true,
        message: 'Feedback submitted successfully',
        id: result.insertedId,
      },
      { status: 201, headers: corsHeaders }
    );
  } catch (error) {
    console.error('Error creating feedback:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500, headers: corsHeaders }
    );
  }
}
