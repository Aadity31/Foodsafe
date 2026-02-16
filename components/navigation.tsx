import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function Navigation() {
  let session = null;
  
  try {
    session = await getServerSession(authOptions);
  } catch (error) {
    // Session error - user not logged in or session invalid
    // Continue without session (show logged out state)
    console.warn('Session error:', error);
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5 text-primary-foreground"
              >
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
            </div>
            <span className="font-bold text-xl">SurplusLink</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <Link href="/about" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              About
            </Link>
            <Link href="/how-it-works" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              How It Works
            </Link>
            <Link href="/impact" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Impact
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          {session ? (
            <>
              {session.user.role === 'ADMIN' && (
                <Link href="/admin">
                  <Button variant="ghost" size="sm">Admin</Button>
                </Link>
              )}
              {session.user.role === 'DONOR' && (
                <Link href="/dashboard/donor">
                  <Button variant="ghost" size="sm">Dashboard</Button>
                </Link>
              )}
              {session.user.role === 'NGO' && (
                <Link href="/dashboard/ngo">
                  <Button variant="ghost" size="sm">Dashboard</Button>
                </Link>
              )}
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  {session.user.name}
                </span>
                <Link href="/auth/signout">
                  <Button variant="outline" size="sm">Sign Out</Button>
                </Link>
              </div>
            </>
          ) : (
            <>
              <Link href="/auth/login">
                <Button variant="ghost" size="sm">Sign In</Button>
              </Link>
              <Link href="/auth/register">
                <Button size="sm">Get Started</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

