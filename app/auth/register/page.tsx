'use client';

import { Suspense, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { registerUser } from '@/lib/actions/auth';

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Default to donor if no role specified
  const defaultRole = searchParams.get('role')?.toUpperCase() || 'DONOR';
  const isNgo = defaultRole === 'NGO';

  async function handleSubmit(formData: FormData) {
    setError(null);
    setLoading(true);

    try {
      formData.append('role', defaultRole);
      const result = await registerUser(formData);

      if (result.error) {
        setError(result.error);
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">
          Create Account
        </CardTitle>
        <CardDescription className="text-center">
          Register as an {isNgo ? 'NGO' : 'Event Host'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">
              {isNgo ? 'Organization Name' : 'Your Name'}
            </Label>
            <Input
              id="name"
              name="name"
              placeholder={isNgo ? 'Feeding Hope Foundation' : 'John Doe'}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              required
            />
            <p className="text-xs text-muted-foreground">
              Minimum 8 characters with uppercase, lowercase, and number
            </p>
          </div>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Creating account...' : 'Create Account'}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col space-y-4">
        <p className="text-sm text-muted-foreground text-center">
          Already have an account?{' '}
          <Link href="/auth/login" className="text-primary hover:underline">
            Sign in
          </Link>
        </p>
        <div className="text-xs text-muted-foreground text-center">
          By registering, you agree to our{' '}
          <Link href="/terms" className="underline">Terms of Service</Link>
          {' '}and{' '}
          <Link href="/privacy" className="underline">Privacy Policy</Link>
        </div>
      </CardFooter>
    </Card>
  );
}

export default function RegisterPage() {
  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center py-12 px-4">
      <Suspense fallback={
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Create Account</CardTitle>
            <CardDescription className="text-center">Loading...</CardDescription>
          </CardHeader>
        </Card>
      }>
        <RegisterForm />
      </Suspense>
    </div>
  );
}
