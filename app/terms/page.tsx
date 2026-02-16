import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'FoodSafe Terms of Service - Understand the rules for using our platform.',
};

export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-8 md:py-12 max-w-4xl">
      <h1 className="text-3xl md:text-4xl font-bold mb-6">Terms of Service</h1>
      
      <div className="prose prose-gray max-w-none space-y-6">
        <p className="text-muted-foreground">
          Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>

        <section>
          <h2 className="text-2xl font-semibold mb-3">Acceptance of Terms</h2>
          <p className="text-muted-foreground">
            By accessing and using FoodSafe, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to these terms, please do not use our services.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">Description of Service</h2>
          <p className="text-muted-foreground">
            FoodSafe is a platform that connects event hosts and food donors with verified NGOs to rescue surplus food and reduce food waste. Our services include:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
            <li>Listing available food donations</li>
            <li>Connecting donors with nearby NGOs</li>
            <li>Facilitating food pickup coordination</li>
            <li>Providing analytics on food rescued</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">User Accounts</h2>
          <h3 className="text-xl font-medium mb-2">Registration Requirements</h3>
          <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
            <li>You must provide accurate and complete information</li>
            <li>NGO accounts require verification of nonprofit status</li>
            <li>You are responsible for maintaining account security</li>
            <li>You must be at least 18 years old to create an account</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">Donor Responsibilities</h2>
          <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
            <li>Provide accurate information about food donations</li>
            <li>Ensure food is safe for consumption</li>
            <li>Maintain proper food storage until pickup</li>
            <li>Be available at the agreed pickup time</li>
            <li>Package food appropriately for transport</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">NGO Responsibilities</h2>
          <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
            <li>Maintain verified nonprofit status</li>
            <li>Respond promptly to donation requests</li>
            <li>Arrive at scheduled pickup times</li>
            <li>Transport food safely and appropriately</li>
            <li>Use donated food for charitable purposes only</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">Prohibited Activities</h2>
          <p className="text-muted-foreground">You agree not to:</p>
          <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
            <li>Post false or misleading food information</li>
            <li>Use the platform for commercial resale</li>
            <li>Harass or abuse other users</li>
            <li>Violate any applicable laws or regulations</li>
            <li>Attempt to gain unauthorized access to the platform</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">Disclaimer of Warranties</h2>
          <p className="text-muted-foreground">
            FoodSafe is provided "as is" without any warranties, express or implied. We do not guarantee that the service will be uninterrupted or error-free.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">Limitation of Liability</h2>
          <p className="text-muted-foreground">
            FoodSafe shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of or inability to use the service.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">Indemnification</h2>
          <p className="text-muted-foreground">
            You agree to indemnify and hold harmless FoodSafe and its officers, directors, and employees from any claims, damages, losses, or expenses arising from your use of the platform.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">Termination</h2>
          <p className="text-muted-foreground">
            We reserve the right to terminate or suspend your account at any time for violation of these terms or for any other reason at our sole discretion.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">Contact Us</h2>
          <p className="text-muted-foreground">
            If you have any questions about these Terms of Service, please contact us at{' '}
            <a href="mailto:legal@foodsafe.org" className="text-primary hover:underline">
              legal@foodsafe.org
            </a>
          </p>
        </section>
      </div>
    </div>
  );
}
