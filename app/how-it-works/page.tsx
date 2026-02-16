import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export const metadata = {
  title: 'How It Works | FoodSafe',
  description: 'Learn how FoodSafe connects event hosts with verified NGOs to rescue surplus food in real-time.',
};

const faqs = [
  {
    question: 'Is the food safe to consume?',
    answer: 'Yes. FoodSafe implements strict safety protocols including expiry time tracking, storage condition verification, and quality checks. Only food within safe consumption windows is eligible for pickup. We also verify all NGOs for proper food handling capabilities.'
  },
  {
    question: 'Who is liable for food safety?',
    answer: 'The donor (event organizer) is responsible for ensuring the food was prepared and stored safely until pickup. NGOs verify the food condition upon pickup. FoodSafe provides the platform and verification systems but is not liable for food quality. All parties must acknowledge receipt and condition at pickup.'
  },
  {
    question: 'Is this service free?',
    answer: 'Yes, FoodSafe is completely free for both donors and NGOs. We are a mission-driven platform focused on reducing food waste and fighting hunger. Our operations are funded through partnerships with CSR programs and government subsidies.'
  },
  {
    question: 'What cities are currently supported?',
    answer: 'FoodSafe is currently available in major metropolitan areas. Our platform is expanding to new cities. Contact us to bring FoodSafe to your city. We work with local municipal bodies and NGOs to establish networks in new locations.'
  },
  {
    question: 'How are NGOs verified?',
    answer: 'Every NGO undergoes a multi-step verification process: (1) Government registration verification, (2) Document submission (NGO certificate, FSSAI license), (3) Site visit for capability assessment, (4) Reference checks with partner organizations. Only verified NGOs can participate in food pickup.'
  }
];

export default function HowItWorksPage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-28 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-background" />
        <div className="container mx-auto px-4 relative">
          <div className="max-w-3xl mx-auto text-center">
            <Badge variant="secondary" className="mb-4">
              How It Works
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
              From Surplus to{' '}
              <span className="text-primary">Sufficiency</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              A transparent, step-by-step process that connects surplus food with those who need it most—quickly, safely, and efficiently.
            </p>
          </div>
        </div>
      </section>

      {/* Section 1: For Event Hosts (Donors) */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-4">For Event Hosts (Donors)</h2>
            <p className="text-muted-foreground text-center mb-12">
              Simple steps to report your surplus food and make an impact.
            </p>

            <div className="space-y-8">
              {/* Step 1 */}
              <div className="flex gap-6 p-6 bg-muted/30 rounded-xl">
                <div className="flex-shrink-0">
                  <div className="h-16 w-16 rounded-full bg-primary flex items-center justify-center">
                    <svg className="h-8 w-8 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-2">1. Upload Surplus Details</h3>
                  <p className="text-muted-foreground mb-3">
                    Report available surplus food through our intuitive platform. Enter food type, quantity, preparation time, storage conditions, and pickup location.
                  </p>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Food type and description</li>
                    <li>• Quantity and serving count</li>
                    <li>• Storage conditions (temperature, packaging)</li>
                    <li>• Pickup location and available time window</li>
                  </ul>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex gap-6 p-6 bg-muted/30 rounded-xl">
                <div className="flex-shrink-0">
                  <div className="h-16 w-16 rounded-full bg-primary flex items-center justify-center">
                    <svg className="h-8 w-8 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-2">2. System Assigns Safe Expiry Window</h3>
                  <p className="text-muted-foreground mb-3">
                    Our system automatically calculates a safe consumption window based on food type, preparation time, and storage conditions.
                  </p>
                  <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg inline-block">
                    <span className="text-sm text-orange-700">
                      ⏱ Safe until: 8:00 PM today
                    </span>
                  </div>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex gap-6 p-6 bg-muted/30 rounded-xl">
                <div className="flex-shrink-0">
                  <div className="h-16 w-16 rounded-full bg-primary flex items-center justify-center">
                    <svg className="h-8 w-8 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-2">3. Nearby Verified NGOs Notified</h3>
                  <p className="text-muted-foreground mb-3">
                    Verified NGOs within your area receive instant notifications. The system prioritizes based on proximity and pickup capability.
                  </p>
                  <div className="flex gap-2 flex-wrap">
                    <Badge variant="outline">5 NGOs notified</Badge>
                    <Badge variant="outline">5km radius</Badge>
                  </div>
                </div>
              </div>

              {/* Step 4 */}
              <div className="flex gap-6 p-6 bg-muted/30 rounded-xl">
                <div className="flex-shrink-0">
                  <div className="h-16 w-16 rounded-full bg-primary flex items-center justify-center">
                    <svg className="h-8 w-8 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-2">4. NGO Accepts Request</h3>
                  <p className="text-muted-foreground mb-3">
                    NGOs review the listing and accept if they can pick up within the time window. The first accepted NGO gets the assignment.
                  </p>
                  <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-sm text-green-700">
                      ✓ Food for All Foundation accepted • Arriving in 25 mins
                    </p>
                  </div>
                </div>
              </div>

              {/* Step 5 */}
              <div className="flex gap-6 p-6 bg-muted/30 rounded-xl">
                <div className="flex-shrink-0">
                  <div className="h-16 w-16 rounded-full bg-primary flex items-center justify-center">
                    <svg className="h-8 w-8 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                    </svg>
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-2">5. OTP Verified Pickup</h3>
                  <p className="text-muted-foreground mb-3">
                    When the NGO arrives, share the one-time password (OTP) with their representative. They enter it in the app to verify pickup.
                  </p>
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-background border rounded-lg">
                      <span className="text-lg font-mono font-bold text-primary">7 4 2 9</span>
                    </div>
                    <span className="text-sm text-muted-foreground">Share this code with NGO volunteer</span>
                  </div>
                </div>
              </div>

              {/* Step 6 */}
              <div className="flex gap-6 p-6 bg-muted/30 rounded-xl">
                <div className="flex-shrink-0">
                  <div className="h-16 w-16 rounded-full bg-primary flex items-center justify-center">
                    <svg className="h-8 w-8 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-2">6. Completion Logged</h3>
                  <p className="text-muted-foreground mb-3">
                    Once verified, the pickup is logged with timestamp. You receive impact metrics showing meals rescued and CO₂ saved.
                  </p>
                  <div className="flex gap-4">
                    <div className="text-center p-3 bg-background rounded-lg">
                      <div className="text-2xl font-bold text-primary">150</div>
                      <div className="text-xs text-muted-foreground">Meals Rescued</div>
                    </div>
                    <div className="text-center p-3 bg-background rounded-lg">
                      <div className="text-2xl font-bold text-green-600">45 kg</div>
                      <div className="text-xs text-muted-foreground">CO₂ Saved</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: For NGOs */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-4">For NGOs</h2>
            <p className="text-muted-foreground text-center mb-12">
              Join our verified network and start receiving food rescue requests.
            </p>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Step 1 */}
              <Card>
                <CardHeader>
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 mb-3">
                    <svg className="h-6 w-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <CardTitle className="text-lg">1. Register & Verify</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Create your NGO account and complete verification. Submit government registration, FSSAI license, and distribution area details.
                  </p>
                </CardContent>
              </Card>

              {/* Step 2 */}
              <Card>
                <CardHeader>
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 mb-3">
                    <svg className="h-6 w-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <CardTitle className="text-lg">2. Set Service Radius</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Define your NGO's service area. Set the maximum distance you're willing to travel for food pickups.
                  </p>
                </CardContent>
              </Card>

              {/* Step 3 */}
              <Card>
                <CardHeader>
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 mb-3">
                    <svg className="h-6 w-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                  </div>
                  <CardTitle className="text-lg">3. Receive Nearby Alerts</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Get instant notifications when surplus food is reported within your service radius. View food details and pickup requirements.
                  </p>
                </CardContent>
              </Card>

              {/* Step 4 */}
              <Card>
                <CardHeader>
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 mb-3">
                    <svg className="h-6 w-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <CardTitle className="text-lg">4. Accept Pickup</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Accept requests you can fulfill. First NGO to accept gets the assignment. Anti-double booking lock ensures fairness.
                  </p>
                </CardContent>
              </Card>

              {/* Step 5 */}
              <Card>
                <CardHeader>
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 mb-3">
                    <svg className="h-6 w-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <CardTitle className="text-lg">5. Upload Proof</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    After pickup, upload photos and confirm the quantity received. This creates a complete audit trail.
                  </p>
                </CardContent>
              </Card>

              {/* Step 6 */}
              <Card>
                <CardHeader>
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 mb-3">
                    <svg className="h-6 w-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <CardTitle className="text-lg">6. Track Impact Dashboard</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    View your NGO's impact metrics: meals rescued, organizations served, carbon footprint reduction, and more.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: Safety Workflow Diagram */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4">Safety Workflow</h2>
          <p className="text-muted-foreground text-center mb-12">
            How we ensure food safety at every step.
          </p>

          <div className="max-w-4xl mx-auto">
            {/* Workflow Diagram */}
            <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-2 mb-16">
              {/* Donor */}
              <div className="flex flex-col items-center">
                <div className="h-20 w-20 rounded-full bg-primary flex items-center justify-center mb-2">
                  <svg className="h-10 w-10 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <span className="font-semibold">Donor</span>
                <span className="text-xs text-muted-foreground">Reports surplus</span>
              </div>

              {/* Arrow 1 */}
              <div className="hidden md:block text-primary">
                <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>
              <div className="md:hidden rotate-90 text-primary">
                <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>

              {/* Platform */}
              <div className="flex flex-col items-center">
                <div className="h-20 w-20 rounded-full bg-blue-500 flex items-center justify-center mb-2">
                  <svg className="h-10 w-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                  </svg>
                </div>
                <span className="font-semibold">Platform</span>
                <span className="text-xs text-muted-foreground">Auto-expiry + Geo</span>
              </div>

              {/* Arrow 2 */}
              <div className="hidden md:block text-primary">
                <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>
              <div className="md:hidden rotate-90 text-primary">
                <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>

              {/* NGO */}
              <div className="flex flex-col items-center">
                <div className="h-20 w-20 rounded-full bg-green-500 flex items-center justify-center mb-2">
                  <svg className="h-10 w-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <span className="font-semibold">NGO</span>
                <span className="text-xs text-muted-foreground">Verified pickup</span>
              </div>

              {/* Arrow 3 */}
              <div className="hidden md:block text-primary">
                <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>
              <div className="md:hidden rotate-90 text-primary">
                <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>

              {/* OTP */}
              <div className="flex flex-col items-center">
                <div className="h-20 w-20 rounded-full bg-purple-500 flex items-center justify-center mb-2">
                  <svg className="h-10 w-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                  </svg>
                </div>
                <span className="font-semibold">OTP</span>
                <span className="text-xs text-muted-foreground">Verification</span>
              </div>

              {/* Arrow 4 */}
              <div className="hidden md:block text-primary">
                <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>
              <div className="md:hidden rotate-90 text-primary">
                <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>

              {/* Completion */}
              <div className="flex flex-col items-center">
                <div className="h-20 w-20 rounded-full bg-green-600 flex items-center justify-center mb-2">
                  <svg className="h-10 w-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span className="font-semibold">Done</span>
                <span className="text-xs text-muted-foreground">Completion logged</span>
              </div>
            </div>

            {/* Safety Features */}
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="border-t-4 border-t-orange-500">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <svg className="h-5 w-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Auto Expiry Control
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    System automatically calculates safe consumption windows based on food type and storage conditions. Listings expire automatically when unsafe.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-t-4 border-t-blue-500">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <svg className="h-5 w-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Geo Filtering
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    NGOs only receive alerts within their specified service radius. This ensures timely pickup and reduces food transit time.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-t-4 border-t-purple-500">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <svg className="h-5 w-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    Anti Double-Booking
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    First NGO to accept gets the assignment. System locks the request instantly to prevent double-booking and ensure fair distribution.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Section 4: FAQ */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4">Frequently Asked Questions</h2>
          <p className="text-muted-foreground text-center mb-12">
            Common questions about FoodSafe.
          </p>

          <div className="max-w-3xl mx-auto space-y-4">
            {faqs.map((faq, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="text-lg">{faq.question}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Join FoodSafe today and help us reduce food waste while feeding those in need.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/register?role=donor">
              <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                Register as Donor
              </Button>
            </Link>
            <Link href="/auth/register?role=ngo">
              <Button size="lg" variant="outline" className="w-full sm:w-auto border-primary-foreground text-red-500 hover:bg-primary-foreground hover:text-primary">
                Register as NGO
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
