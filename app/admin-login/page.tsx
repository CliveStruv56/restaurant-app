
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export default function AdminLoginPage() {
  const router = useRouter();

  useEffect(() => {
    const autoLogin = async () => {
      try {
        const response = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: 'admin@savorybites.com',
            password: 'admin123'
          }),
          credentials: 'include'
        });

        if (response.ok) {
          const data = await response.json();
          toast.success('Admin logged in successfully');
          router.push('/admin');
        } else {
          toast.error('Login failed');
        }
      } catch (error) {
        console.error('Login error:', error);
        toast.error('Login failed');
      }
    };

    autoLogin();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Admin Auto Login</h1>
        <p>Logging in as admin...</p>
      </div>
    </div>
  );
}
