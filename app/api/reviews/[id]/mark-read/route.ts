import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { verifyToken, createAuthResponse } from '@/lib/auth-middleware';

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

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    // Verify authentication for external API access
    const user = await verifyToken(request as any);
    if (!user) {
      return NextResponse.json(createAuthResponse('Valid authentication token required'), {
        status: 401,
        headers: corsHeaders,
      });
    }

    const { id } = params;

    // Validate ObjectId
    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid ID format',
          message: 'The provided feedback ID is not valid',
        },
        { status: 400, headers: corsHeaders }
      );
    }

    // Connect to MongoDB
    const client = await clientPromise;
    const db = client.db();
    const collection = db.collection('feedback');

    // Update the document
    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          isRead: true,
          readAt: new Date(),
          readBy: user.userId,
        },
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'Feedback not found',
          message: 'No feedback found with the provided ID',
        },
        { status: 404, headers: corsHeaders }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Feedback marked as read successfully',
        data: {
          id,
          isRead: true,
          readAt: new Date(),
          readBy: user.userId,
        },
      },
      { headers: corsHeaders }
    );
  } catch (error) {
    console.error('Error marking feedback as read:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
        message: 'Failed to update feedback status',
      },
      { status: 500, headers: corsHeaders }
    );
  }
}
