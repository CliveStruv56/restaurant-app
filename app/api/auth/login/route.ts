
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { verifyPassword, generateToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Verify password
    const isValidPassword = await verifyPassword(password, user.password);
    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Generate JWT token
    const userForToken = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role
    };
    const token = generateToken(userForToken);

    // Create response with cookie
    const response = NextResponse.json({
      success: true,
      user: userForToken
    });

    // Determine if we're in preview environment
    const isPreview = request.headers.get('host')?.includes('preview.abacusai.app') || 
                     process.env.VERCEL_URL?.includes('preview.abacusai.app') ||
                     process.env.NODE_ENV === 'production';

    // Configure cookie settings for preview environment
    const cookieOptions = {
      httpOnly: true,
      secure: isPreview, // Always secure for preview/production
      sameSite: isPreview ? 'none' as const : 'lax' as const, // 'none' for cross-site contexts
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/'
    };

    // Add domain for preview environment
    if (isPreview && request.headers.get('host')?.includes('preview.abacusai.app')) {
      (cookieOptions as any).domain = '.preview.abacusai.app';
    }

    console.log('🍪 Setting auth cookie with options:', {
      isPreview,
      host: request.headers.get('host'),
      cookieOptions,
      userAgent: request.headers.get('user-agent'),
      origin: request.headers.get('origin'),
      referer: request.headers.get('referer'),
      timestamp: new Date().toISOString()
    });

    response.cookies.set('auth-token', token, cookieOptions);

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
