import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'FoodSafe Privacy Policy - Learn how we protect your data.',
};

export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-8 md:py-12 max-w-4xl">
      <h1 className="text-3xl md:text-4xl font-bold mb-6">Privacy Policy</h1>
      
      <div className="prose prose-gray max-w-none space-y-6">
        <p className="text-muted-foreground">
          Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>

        <section>
          <h2 className="text-2xl font-semibold mb-3">Introduction</h2>
          <p className="text-muted-foreground">
            FoodSafe ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how your personal information is collected, used, disclosed, and safeguarded by FoodSafe when you use our platform.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">Information We Collect</h2>
          <h3 className="text-xl font-medium mb-2">Personal Information</h3>
          <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
            <li>Name and email address when you register</li>
            <li>Organization details for NGO and donor accounts</li>
            <li>Phone number for account verification</li>
            <li>Location data for finding nearby food donations</li>
            <li>Food donation details you submit</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">How We Use Your Information</h2>
          <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
            <li>To provide and maintain our services</li>
            <li>To verify your identity and organization</li>
            <li>To connect donors with verified NGOs</li>
            <li>To send you important updates and notifications</li>
            <li>To improve our services and user experience</li>
            <li>To comply with legal obligations</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">Data Protection</h2>
          <p className="text-muted-foreground">
            We implement appropriate technical and organizational measures to protect your personal data against unauthorized access, alteration, disclosure, or destruction. All data is encrypted in transit and at rest.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">Sharing Your Information</h2>
          <p className="text-muted-foreground">
            We do not sell your personal information. We may share your information with:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
            <li>Verified NGOs to facilitate food donations</li>
            <li>Service providers who assist in our operations</li>
            <li>Legal authorities when required by law</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">Your Rights</h2>
          <p className="text-muted-foreground">
            You have the right to access, update, or delete your personal information. You can manage your account settings or contact us to exercise these rights.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">Contact Us</h2>
          <p className="text-muted-foreground">
            If you have any questions about this Privacy Policy, please contact us at{' '}
            <a href="mailto:privacy@foodsafe.org" className="text-primary hover:underline">
              privacy@foodsafe.org
            </a>
          </p>
        </section>
      </div>
    </div>
  );
}
