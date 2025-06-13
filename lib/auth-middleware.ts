import { NextRequest } from 'next/server';
import { verify } from 'jsonwebtoken';

export interface AuthenticatedUser {
  userId: string;
  email: string;
  name: string;
}

export async function verifyToken(request: NextRequest): Promise<AuthenticatedUser | null> {
  try {
    const authHeader = request.headers.get('Authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    const jwtSecret = process.env.NEXTAUTH_SECRET || 'fallback-secret';

    const decoded = verify(token, jwtSecret) as any;

    return {
      userId: decoded.userId,
      email: decoded.email,
      name: decoded.name,
    };
  } catch (error) {
    return null;
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function createAuthResponse(message: string, status: number = 401) {
  return {
    success: false,
    error: 'Authentication required',
    message,
  };
}
