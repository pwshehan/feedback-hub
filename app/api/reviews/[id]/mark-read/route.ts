import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;

    // Validate ObjectId
    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: 'Invalid feedback ID' },
        { status: 400, headers: corsHeaders }
      );
    }

    // Connect to MongoDB
    const client = await clientPromise;
    const db = client.db();
    const collection = db.collection('feedbacks');

    // Update the document
    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { isRead: true } }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: 'Feedback not found' },
        { status: 404, headers: corsHeaders }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Feedback marked as read',
      },
      { headers: corsHeaders }
    );
  } catch (error) {
    console.error('Error marking feedback as read:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500, headers: corsHeaders }
    );
  }
}
