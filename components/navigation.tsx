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
                <path d="M12 3c-1.2 0-3.07.34-4.06 1.12a4.33 4.33 0 0 0-2.87 2.87c-.78 1-1.12 2.87-1.12 4.07 0 4.63 3.83 8.41 8.05 8.41 4.63 0 8.41-3.83 8.41-8.05 0-1.2-.34-2.87-1.12-4.07a4.33 4.33 0 0 0-2.87-2.87C15.07 3.34 13.2 3 12 3Z" />
                <path d="M12 7v.5" />
              </svg>
            </div>
            <span className="font-bold text-xl">FoodSafe</span>
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

