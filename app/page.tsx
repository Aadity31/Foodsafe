import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function LandingPage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-background" />
        <div className="container mx-auto px-4 relative">
          <div className="max-w-3xl mx-auto text-center">
            <Badge variant="secondary" className="mb-4">
              Real-Time Food Rescue Network
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
              Turn Surplus Food Into{' '}
              <span className="text-primary">Hope</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Connect event hosts with verified NGOs to rescue surplus food in real-time.
              Fight hunger while reducing food waste — one meal at a time.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth/register?role=donor">
                <Button size="lg" className="w-full sm:w-auto">
                  Donate Food
                </Button>
              </Link>
              <Link href="/auth/register?role=ngo">
                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                  Join as NGO
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Statement */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-8">The Food Waste Crisis</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-4xl font-bold text-primary">1.3B</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-lg">
                    Tons of food wasted globally every year — enough to feed the hungry twice over.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-4xl font-bold text-primary">40%</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-lg">
                    Of food produced globally is wasted before reaching consumers.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-4xl font-bold text-primary">828M</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-lg">
                    People go to bed hungry every night while edible food is thrown away.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">How SurplusLink Works</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary mx-auto mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-8 w-8 text-primary-foreground"
                >
                  <path d="M12 2L2 7l10 5 10-5-10-5z" />
                  <path d="M2 17l10 5 10-5" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">1. Host Reports Surplus</h3>
              <p className="text-muted-foreground">
                Event hosts quickly report surplus food with details — type, quantity, storage, and location.
                Auto-calculated expiry windows ensure safety.
              </p>
            </div>
            <div className="text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary mx-auto mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-8 w-8 text-primary-foreground"
                >
                  <circle cx="12" cy="10" r="3" />
                  <path d="M12 21.7C17.3 17 20 13 20 10a8 8 0 1 0-16 0c0 3 2.7 7 8 11.7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">2. NGOs Get Notified</h3>
              <p className="text-muted-foreground">
                Nearby verified NGOs receive instant notifications based on geo-location.
                Nearest NGOs are prioritized for fastest pickup.
              </p>
            </div>
            <div className="text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary mx-auto mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-8 w-8 text-primary-foreground"
                >
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">3. Secure Pickup</h3>
              <p className="text-muted-foreground">
                NGOs accept and pick up with secure OTP verification.
                Photos and timestamps ensure accountability and transparency.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Metrics */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Our Impact</h2>
          <div className="grid md:grid-cols-4 gap-8 max-w-4xl mx-auto text-center">
            <div>
              <div className="text-4xl font-bold mb-2">10,000+</div>
              <p className="text-primary-foreground/80">Meals Rescued</p>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">500+</div>
              <p className="text-primary-foreground/80">Partner NGOs</p>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">1,200+</div>
              <p className="text-primary-foreground/80">Active Donors</p>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">50T</div>
              <p className="text-primary-foreground/80">CO₂ Emissions Saved</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Card className="overflow-hidden">
              <div className="grid md:grid-cols-2">
                <div className="p-8 flex flex-col justify-center">
                  <h2 className="text-2xl font-bold mb-4">For Event Hosts</h2>
                  <p className="text-muted-foreground mb-6">
                    Turn your event surplus into community support. Reduce waste costs and make a positive impact.
                  </p>
                  <Link href="/auth/register?role=donor">
                    <Button>Register as Donor</Button>
                  </Link>
                </div>
                <div className="p-8 flex flex-col justify-center border-t md:border-t-0 md:border-l">
                  <h2 className="text-2xl font-bold mb-4">For NGOs</h2>
                  <p className="text-muted-foreground mb-6">
                    Access reliable food sources for your community. Expand your reach with geo-matched donations.
                  </p>
                  <Link href="/auth/register?role=ngo">
                    <Button variant="outline">Register as NGO</Button>
                  </Link>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
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
                <span className="font-bold">SurplusLink</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Real-Time Event Food Rescue Network. Fighting hunger, reducing waste.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Platform</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/about" className="hover:text-foreground">About Us</Link></li>
                <li><Link href="/how-it-works" className="hover:text-foreground">How It Works</Link></li>
                <li><Link href="/impact" className="hover:text-foreground">Impact</Link></li>
                <li><Link href="/faq" className="hover:text-foreground">FAQ</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">For Organizations</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/auth/register?role=donor" className="hover:text-foreground">Become a Donor</Link></li>
                <li><Link href="/auth/register?role=ngo" className="hover:text-foreground">Join as NGO</Link></li>
                <li><Link href="/success-stories" className="hover:text-foreground">Success Stories</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>contact@surpluslink.org</li>
                <li>Support: help@surpluslink.org</li>
                <li>Phone: 1-800-SURPLUS</li>
              </ul>
            </div>
          </div>
          <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p>© 2024 SurplusLink. All rights reserved. A non-profit initiative.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
