import { NextResponse } from 'next/server';
import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import clientPromise from '@/lib/mongodb';

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
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing credentials',
          message: 'Email and password are required',
        },
        { status: 400, headers: corsHeaders }
      );
    }

    // Connect to MongoDB
    const client = await clientPromise;
    const users = client.db().collection('users');

    // Find user
    const user = await users.findOne({ email });

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid credentials',
          message: 'Invalid email or password',
        },
        { status: 401, headers: corsHeaders }
      );
    }

    // Verify password
    const isValid = await compare(password, user.password);

    if (!isValid) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid credentials',
          message: 'Invalid email or password',
        },
        { status: 401, headers: corsHeaders }
      );
    }

    // Generate JWT token
    const jwtSecret = process.env.NEXTAUTH_SECRET || 'fallback-secret';
    const token = sign(
      {
        userId: user._id.toString(),
        email: user.email,
        name: user.name,
      },
      jwtSecret,
      { expiresIn: '24h' }
    );

    return NextResponse.json(
      {
        success: true,
        message: 'Authentication successful',
        data: {
          token,
          user: {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
          },
          expiresIn: '24h',
        },
      },
      { headers: corsHeaders }
    );
  } catch (error) {
    console.error('External login error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
        message: 'Authentication failed',
      },
      { status: 500, headers: corsHeaders }
    );
  }
}
