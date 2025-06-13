import { NextResponse } from 'next/server';
import { verify } from 'jsonwebtoken';

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-API-Key',
  'Access-Control-Max-Age': '86400',
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get('Authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing token',
          message: 'Authorization header with Bearer token is required',
        },
        { status: 401, headers: corsHeaders }
      );
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    const jwtSecret = process.env.NEXTAUTH_SECRET || 'fallback-secret';

    try {
      const decoded = verify(token, jwtSecret) as any;

      return NextResponse.json(
        {
          success: true,
          message: 'Token is valid',
          data: {
            user: {
              id: decoded.userId,
              email: decoded.email,
              name: decoded.name,
            },
            expiresAt: new Date(decoded.exp * 1000).toISOString(),
          },
        },
        { headers: corsHeaders }
      );
    } catch (jwtError) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid token',
          message: 'Token is expired or invalid',
        },
        { status: 401, headers: corsHeaders }
      );
    }
  } catch (error) {
    console.error('Token verification error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
        message: 'Token verification failed',
      },
      { status: 500, headers: corsHeaders }
    );
  }
}
