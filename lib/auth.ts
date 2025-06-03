
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { NextRequest } from 'next/server';
import { prisma } from './db';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: string;
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

export function generateToken(user: AuthUser): string {
  return jwt.sign(
    { id: user.id, email: user.email, name: user.name, role: user.role },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

export function verifyToken(token: string): AuthUser | null {
  try {
    return jwt.verify(token, JWT_SECRET) as AuthUser;
  } catch {
    return null;
  }
}

export async function getUserFromRequest(request: NextRequest): Promise<AuthUser | null> {
  const startTime = Date.now();
  
  try {
    console.log('🔐 User Auth: Starting authentication check', {
      timestamp: new Date().toISOString(),
      url: request.url,
      method: request.method,
      userAgent: request.headers.get('user-agent'),
      cookies: request.cookies.getAll().map(c => ({ name: c.name, hasValue: !!c.value }))
    });

    const token = request.cookies.get('auth-token')?.value;
    if (!token) {
      console.log('ℹ️ User Auth: No auth token found', {
        availableCookies: request.cookies.getAll().map(c => c.name),
        timestamp: new Date().toISOString()
      });
      return null;
    }

    console.log('🔍 User Auth: Token found, verifying...', {
      tokenLength: token.length,
      tokenPrefix: token.substring(0, 10) + '...'
    });

    const user = verifyToken(token);
    if (!user) {
      console.error('❌ User Auth: Token verification failed', {
        tokenLength: token.length,
        timestamp: new Date().toISOString()
      });
      return null;
    }

    console.log('✅ User Auth: Token verified, checking database...', {
      userId: user.id,
      userEmail: user.email,
      userRole: user.role
    });

    // Verify user still exists in database
    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { id: true, email: true, name: true, role: true }
    });

    const responseTime = Date.now() - startTime;

    if (!dbUser) {
      console.error('❌ User Auth: User not found in database', {
        userId: user.id,
        userEmail: user.email,
        responseTime: `${responseTime}ms`
      });
      return null;
    }

    console.log('✅ User Auth: Authentication successful', {
      userId: dbUser.id,
      userEmail: dbUser.email,
      userRole: dbUser.role,
      responseTime: `${responseTime}ms`,
      timestamp: new Date().toISOString()
    });

    return dbUser;
  } catch (error: any) {
    const responseTime = Date.now() - startTime;
    
    console.error('💥 User Auth: Authentication error', {
      error: error.message,
      errorName: error.name,
      stack: error.stack,
      responseTime: `${responseTime}ms`,
      timestamp: new Date().toISOString(),
      url: request.url
    });

    return null;
  }
}

export function isAdmin(user: AuthUser | null): boolean {
  return user?.role === 'ADMIN';
}

export async function requireAdmin(request: NextRequest): Promise<AuthUser> {
  const startTime = Date.now();
  
  try {
    console.log('🔐 Admin Auth: Starting admin authentication check', {
      timestamp: new Date().toISOString(),
      url: request.url,
      method: request.method,
      userAgent: request.headers.get('user-agent')
    });

    // Check for admin-token first, then fall back to auth-token
    const adminToken = request.cookies.get('admin-token')?.value;
    const authToken = request.cookies.get('auth-token')?.value;
    
    const tokenToUse = adminToken || authToken;
    const tokenSource = adminToken ? 'admin-token' : 'auth-token';
    
    if (tokenToUse) {
      console.log(`🔍 Admin Auth: ${tokenSource} found, verifying...`, {
        tokenLength: tokenToUse.length,
        tokenPrefix: tokenToUse.substring(0, 10) + '...',
        tokenSource
      });

      try {
        // For auth-token, the structure is different (includes more fields)
        const decoded = jwt.verify(tokenToUse, JWT_SECRET) as any;
        
        console.log('✅ Admin Auth: Token decoded successfully', {
          userId: decoded.id || decoded.userId,
          role: decoded.role,
          tokenSource,
          decodedFields: Object.keys(decoded)
        });
        
        const userId = decoded.id || decoded.userId;
        
        if (decoded.role !== 'ADMIN') {
          console.error('❌ Admin Auth: Invalid role in token', {
            expectedRole: 'ADMIN',
            actualRole: decoded.role,
            userId: userId,
            tokenSource
          });
          throw new Error('Insufficient permissions - Admin role required');
        }

        const user = await prisma.user.findUnique({
          where: { id: userId },
          select: { id: true, email: true, name: true, role: true }
        });

        if (!user) {
          console.error('❌ Admin Auth: Admin user not found in database', {
            userId: userId,
            tokenSource
          });
          throw new Error('Admin user not found');
        }

        if (user.role !== 'ADMIN') {
          console.error('❌ Admin Auth: User role mismatch in database', {
            userId: user.id,
            userEmail: user.email,
            expectedRole: 'ADMIN',
            actualRole: user.role,
            tokenSource
          });
          throw new Error('User does not have admin privileges');
        }

        const responseTime = Date.now() - startTime;
        
        console.log('✅ Admin Auth: Admin authentication successful', {
          userId: user.id,
          userEmail: user.email,
          userRole: user.role,
          responseTime: `${responseTime}ms`,
          timestamp: new Date().toISOString(),
          tokenSource
        });

        return user;
      } catch (jwtError: any) {
        console.error('❌ Admin Auth: Token verification failed', {
          error: jwtError.message,
          tokenLength: tokenToUse.length,
          tokenSource
        });
        // Fall through to regular user auth check
      }
    }

    // Fallback to regular user authentication
    console.log('🔍 Admin Auth: No admin token, checking regular user auth...');
    const user = await getUserFromRequest(request);
    
    if (!user) {
      console.error('❌ Admin Auth: No user found', {
        availableCookies: request.cookies.getAll().map(c => c.name),
        timestamp: new Date().toISOString()
      });
      throw new Error('Authentication required - No valid user session');
    }

    if (!isAdmin(user)) {
      console.error('❌ Admin Auth: User is not admin', {
        userId: user.id,
        userEmail: user.email,
        userRole: user.role,
        expectedRole: 'ADMIN'
      });
      throw new Error('Admin access required - Insufficient permissions');
    }

    const responseTime = Date.now() - startTime;
    
    console.log('✅ Admin Auth: Regular user admin authentication successful', {
      userId: user.id,
      userEmail: user.email,
      userRole: user.role,
      responseTime: `${responseTime}ms`,
      timestamp: new Date().toISOString()
    });

    return user;
    
  } catch (error: any) {
    const responseTime = Date.now() - startTime;
    
    console.error('💥 Admin Auth: Authentication failed', {
      error: error.message,
      errorName: error.name,
      stack: error.stack,
      responseTime: `${responseTime}ms`,
      timestamp: new Date().toISOString(),
      url: request.url,
      availableCookies: request.cookies.getAll().map(c => c.name)
    });

    // Re-throw with more specific error message
    throw new Error(`Admin authentication failed: ${error.message}`);
  }
}
