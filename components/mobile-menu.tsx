'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';

export function MobileMenu({ session }: { session: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="sm"
        className="md:hidden"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {/* Mobile menu dropdown */}
      {isOpen && (
        <div className="absolute top-16 left-0 right-0 bg-background border-b shadow-lg md:hidden">
          <div className="container mx-auto px-4 py-4 flex flex-col space-y-3">
            <Link 
              href="/about" 
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors py-2"
              onClick={() => setIsOpen(false)}
            >
              About
            </Link>
            <Link 
              href="/how-it-works" 
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors py-2"
              onClick={() => setIsOpen(false)}
            >
              How It Works
            </Link>
            <Link 
              href="/impact" 
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors py-2"
              onClick={() => setIsOpen(false)}
            >
              Impact
            </Link>
            <div className="border-t pt-3 mt-2">
              {session ? (
                <div className="flex flex-col space-y-3">
                  {session.user.role === 'ADMIN' && (
                    <Link href="/admin" onClick={() => setIsOpen(false)}>
                      <Button variant="ghost" size="sm" className="w-full justify-start">Admin</Button>
                    </Link>
                  )}
                  {(session.user.role === 'DONOR' || session.user.role === 'NGO') && (
                    <Link 
                      href={session.user.role === 'DONOR' ? '/dashboard/donor' : '/dashboard/ngo'} 
                      onClick={() => setIsOpen(false)}
                    >
                      <Button variant="ghost" size="sm" className="w-full justify-start">Dashboard</Button>
                    </Link>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground px-3">
                      {session.user.name}
                    </span>
                    <Link href="/auth/signout" onClick={() => setIsOpen(false)}>
                      <Button variant="outline" size="sm">Sign Out</Button>
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col space-y-2">
                  <Link href="/auth/login" onClick={() => setIsOpen(false)}>
                    <Button variant="ghost" size="sm" className="w-full">Sign In</Button>
                  </Link>
                  <Link href="/auth/register" onClick={() => setIsOpen(false)}>
                    <Button size="sm" className="w-full">Get Started</Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
