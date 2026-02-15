import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export const metadata = {
  title: 'About | SurplusLink',
  description: 'Learn about SurplusLink - Real-Time Event Food Redistribution Network connecting event hosts with verified NGOs to rescue surplus food.',
};

export default function AboutPage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-28 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-background" />
        <div className="container mx-auto px-4 relative">
          <div className="max-w-3xl mx-auto text-center">
            <Badge variant="secondary" className="mb-4">
              About SurplusLink
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
              Real-Time Food Redistribution{' '}
              <span className="text-primary">For Events</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              SurplusLink connects event organizers with verified NGOs to rescue surplus food in real-time. 
              We bridge the gap between food surplus and food insecurity through technology, ensuring 
              quality-assured meals reach those who need them before they go to waste.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth/register?role=donor">
                <Button size="lg" className="w-full sm:w-auto">
                  Join as Donor
                </Button>
              </Link>
              <Link href="/auth/register?role=ngo">
                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                  Register as NGO
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* The Problem Section - Data Backed */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-4">The Problem We Solve</h2>
            <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
              India generates massive amounts of surplus food from events, weddings, corporate functions, 
              and social gatherings—while millions go hungry. The disconnect between surplus and need 
              creates unnecessary waste.
            </p>
            
            {/* Stats Grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              <Card className="text-center py-6">
                <CardContent>
                  <div className="text-4xl font-bold text-primary mb-2">40%</div>
                  <p className="text-sm text-muted-foreground">
                    of food produced globally is wasted annually
                  </p>
                </CardContent>
              </Card>
              <Card className="text-center py-6">
                <CardContent>
                  <div className="text-4xl font-bold text-primary mb-2">68M</div>
                  <p className="text-sm text-muted-foreground">
                    tons of food wasted in India every year
                  </p>
                </CardContent>
              </Card>
              <Card className="text-center py-6">
                <CardContent>
                  <div className="text-4xl font-bold text-primary mb-2">3hrs</div>
                  <p className="text-sm textuted-foreground">
                    average window to rescue perishable food
                  </p>
                </CardContent>
              </Card>
              <Card className="text-center py-6">
                <CardContent>
                  <div className="text-4xl font-bold text-primary mb-2">194M</div>
                  <p className="text-sm text-muted-foreground">
                    people in India living below poverty line
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="text-center">
              <h3 className="text-xl font-semibold mb-4">Why Surplus Food Doesn't Reach Those in Need</h3>
              <div className="grid md:grid-cols-3 gap-8 text-left">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="h-8 w-8 rounded-full bg-red-100 flex items-center justify-center">
                      <svg className="h-4 w-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <span className="font-semibold">Time Sensitivity</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Perishable food has a narrow window. Without real-time coordination, 
                    surplus expires before reaching distribution centers.
                  </p>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="h-8 w-8 rounded-full bg-orange-100 flex items-center justify-center">
                      <svg className="h-4 w-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <span className="font-semibold">Logistics Gap</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Event locations and NGOs often lack visibility into each other's 
                    needs and availability. Manual coordination fails at scale.
                  </p>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                      <svg className="h-4 w-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </div>
                    <span className="font-semibold">Trust Deficit</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Without verification and accountability, both donors and NGOs 
                    hesitate to participate. Quality and safety concerns persist.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Approach Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-16">Our Approach</h2>
          
          <div className="max-w-5xl mx-auto space-y-16">
            {/* Real-time Geo-matching */}
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <div className="inline-flex items-center justify-center h-12 w-12 rounded-lg bg-primary mb-4">
                  <svg className="h-6 w-6 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold mb-4">Real-Time Geo-Matching</h3>
                <p className="text-muted-foreground mb-4">
                  Our intelligent algorithm matches surplus food with the nearest verified NGOs 
                  within minutes of posting. Geographic proximity ensures minimal transit time 
                  and maximum freshness.
                </p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <svg className="h-5 w-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    Instant NGO notifications within 5km radius
                  </li>
                  <li className="flex items-center gap-2">
                    <svg className="h-5 w-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    Smart priority based on pickup capability
                  </li>
                  <li className="flex items-center gap-2">
                    <svg className="h-5 w-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    Live tracking until pickup completion
                  </li>
                </ul>
              </div>
              <div className="bg-muted/50 rounded-lg p-8">
                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-4 bg-background rounded-lg shadow-sm">
                    <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                      <svg className="h-5 w-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium">Hotel Wedding Hall</p>
                      <p className="text-sm text-muted-foreground">2.1 km away • Available now</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-4 bg-background rounded-lg shadow-sm">
                    <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                      <svg className="h-5 w-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium">Food for All NGO</p>
                      <p className="text-sm text-muted-foreground">3.4 km away • Can pick up in 30 min</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-4 bg-background rounded-lg shadow-sm">
                    <div className="h-10 w-10 rounded-full bg-yellow-100 flex items-center justify-center">
                      <svg className="h-5 w-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium">Community Kitchen</p>
                      <p className="text-sm text-muted-foreground">4.8 km away • Responding...</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Expiry-Controlled System */}
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="order-2 md:order-1 bg-muted/50 rounded-lg p-8">
                <div className="space-y-6">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">Time Remaining</span>
                      <span className="text-sm text-red-600 font-semibold">2h 15m</span>
                    </div>
                    <div className="h-2 bg-red-100 rounded-full overflow-hidden">
                      <div className="h-full bg-red-500 rounded-full" style={{ width: '35%' }} />
                    </div>
                  </div>
                  <div className="p-4 bg-background rounded-lg">
                    <div className="flex items-center gap-3 mb-2">
                      <svg className="h-5 w-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                      <span className="font-semibold">Best Before: 6:00 PM</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      System automatically prioritizes this listing for immediate pickup
                    </p>
                  </div>
                </div>
              </div>
              <div className="order-1 md:order-2">
                <div className="inline-flex items-center justify-center h-12 w-12 rounded-lg bg-primary mb-4">
                  <svg className="h-6 w-6 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold mb-4">Expiry-Controlled System</h3>
                <p className="text-muted-foreground mb-4">
                  Food safety is paramount. Our system automatically calculates and tracks 
                  remaining shelf life, prioritizing urgent listings and preventing 
                  expired food from being offered.
                </p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <svg className="h-5 w-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    Auto-calculation based on preparation time
                  </li>
                  <li className="flex items-center gap-2">
                    <svg className="h-5 w-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    Color-coded urgency indicators
                  </li>
                  <li className="flex items-center gap-2">
                    <svg className="h-5 w-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    Auto-archival after expiry window
                  </li>
                </ul>
              </div>
            </div>

            {/* Verified NGO Network */}
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <div className="inline-flex items-center justify-center h-12 w-12 rounded-lg bg-primary mb-4">
                  <svg className="h-6 w-6 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold mb-4">Verified NGO Network</h3>
                <p className="text-muted-foreground mb-4">
                  Every NGO on SurplusLink undergoes rigorous verification. We partner only 
                  with legitimate organizations committed to food distribution, ensuring 
                  your surplus reaches those who need it most.
                </p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <svg className="h-5 w-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    Government registration verification
                  </li>
                  <li className="flex items-center gap-2">
                    <svg className="h-5 w-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    On-ground distribution capability check
                  </li>
                  <li className="flex items-center gap-2">
                    <svg className="h-5 w-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    Food safety compliance verification
                  </li>
                </ul>
              </div>
              <div className="bg-muted/50 rounded-lg p-8">
                <div className="space-y-4">
                  <div className="p-4 bg-background rounded-lg border border-green-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold">Food for All Foundation</span>
                      <Badge className="bg-green-100 text-green-700">Verified</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">Reg. No: 12ABC/2020</p>
                    <div className="mt-2 flex items-center gap-4 text-sm">
                      <span className="flex items-center gap-1">
                        <svg className="h-4 w-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        </svg>
                        3.2 km
                      </span>
                      <span className="flex items-center gap-1">
                        <svg className="h-4 w-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        30 min pickup
                      </span>
                    </div>
                  </div>
                  <div className="p-4 bg-background rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold">Aahara Trust</span>
                      <Badge variant="secondary">Verified</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">Reg. No: 45XYZ/2021</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Secure OTP Pickup */}
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="order-2 md:order-1 bg-muted/50 rounded-lg p-8">
                <div className="text-center">
                  <div className="inline-block p-6 bg-background rounded-lg border-2 border-dashed border-primary/30">
                    <p className="text-sm text-muted-foreground mb-2">One-Time Pickup Code</p>
                    <p className="text-4xl font-bold tracking-widest text-primary">7 4 2 9</p>
                  </div>
                  <p className="text-sm text-muted-foreground mt-4">
                    Shared with verified NGO upon arrival
                  </p>
                </div>
              </div>
              <div className="order-1 md:order-2">
                <div className="inline-flex items-center justify-center h-12 w-12 rounded-lg bg-primary mb-4">
                  <svg className="h-6 w-6 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold mb-4">Secure OTP Pickup</h3>
                <p className="text-muted-foreground mb-4">
                  Every food pickup is secured with a one-time password (OTP) system. 
                  Only the assigned NGO representative can complete the pickup, 
                  ensuring complete accountability.
                </p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <svg className="h-5 w-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    6-digit OTP generated for each request
                  </li>
                  <li className="flex items-center gap-2">
                    <svg className="h-5 w-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    Donor verifies NGO identity on-site
                  </li>
                  <li className="flex items-center gap-2">
                    <svg className="h-5 w-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    Digital handoff confirmation
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust & Safety Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-4">Trust & Safety</h2>
            <p className="text-muted-foreground text-center mb-12">
              We build platform legitimacy through rigorous safety measures and complete transparency.
            </p>
            
            <div className="grid md:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <div className="h-10 w-10 rounded-lg bg-green-100 flex items-center justify-center mb-2">
                    <svg className="h-5 w-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <CardTitle>Expiry Auto-Control</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Our system automatically calculates safe consumption windows based on 
                    food type, preparation time, and storage conditions. Listings automatically 
                    expire when safety thresholds are crossed.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center mb-2">
                    <svg className="h-5 w-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <CardTitle>NGO Verification</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    All NGOs complete a multi-step verification process including 
                    government registration checks, site visits, and food safety 
                    compliance verification before activation.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="h-10 w-10 rounded-lg bg-purple-100 flex items-center justify-center mb-2">
                    <svg className="h-5 w-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                    </svg>
                  </div>
                  <CardTitle>OTP Pickup Confirmation</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Every pickup requires a unique OTP verified by the donor. This 
                    ensures only the assigned NGO receives the food and creates a 
                    verifiable chain of custody.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="h-10 w-10 rounded-lg bg-orange-100 flex items-center justify-center mb-2">
                    <svg className="h-5 w-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                    </svg>
                  </div>
                  <CardTitle>Audit Trail Logging</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Every action on the platform is logged with timestamps. From food 
                    listing to pickup completion, complete transparency ensures 
                    accountability at every step.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Vision Statement Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-8">Our Vision</h2>
            <div className="prose prose-lg mx-auto">
              <p className="text-xl text-muted-foreground mb-8">
                We envision a future where no surplus food goes to waste while people go hungry. 
                SurplusLink aims to become the backbone of urban food redistribution infrastructure, 
                enabling seamless coordination between food sources and distribution networks.
              </p>
            </div>
            
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
              <div className="p-6 bg-muted/50 rounded-lg">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <svg className="h-6 w-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <h3 className="font-semibold mb-2">Smart Cities Integration</h3>
                <p className="text-sm text-muted-foreground">
                  Partnering with municipal bodies to integrate food rescue into 
                  urban waste management systems
                </p>
              </div>
              
              <div className="p-6 bg-muted/50 rounded-lg">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <svg className="h-6 w-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                  </svg>
                </div>
                <h3 className="font-semibold mb-2">CSR Partnerships</h3>
                <p className="text-sm text-muted-foreground">
                  Enabling corporate Social Responsibility programs with 
                  measurable food rescue impact metrics
                </p>
              </div>
              
              <div className="p-6 bg-muted/50 rounded-lg">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <svg className="h-6 w-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="font-semibold mb-2">Carbon Impact Tracking</h3>
                <p className="text-sm text-muted-foreground">
                  Measuring and reporting carbon footprint reduction from 
                  rescued surplus food
                </p>
              </div>
              
              <div className="p-6 bg-muted/50 rounded-lg">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <svg className="h-6 w-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="font-semibold mb-2">Data-Driven Impact</h3>
                <p className="text-sm text-muted-foreground">
                  Building the largest dataset on urban food surplus patterns 
                  for predictive distribution
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Make an Impact?</h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Join SurplusLink today and be part of the solution. Whether you're an event organizer 
            or an NGO, together we can reduce food waste and fight hunger.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/register?role=donor">
              <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                Join as Donor
              </Button>
            </Link>
            <Link href="/auth/register?role=ngo">
              <Button size="lg" variant="outline" className="w-full sm:w-auto border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
                Register as NGO
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
