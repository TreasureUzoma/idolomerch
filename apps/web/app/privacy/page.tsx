export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12 space-y-6">
      <h1 className="text-3xl font-bold">Privacy Policy</h1>
      <p>
        At Idolomerch, your privacy is important to us. This Privacy Policy
        outlines how we collect, use, and protect your personal information.
      </p>

      <h2 className="text-xl font-semibold">1. Information We Collect</h2>
      <ul className="list-disc pl-6 space-y-1">
        <li>Your name, email address, and shipping address</li>
        <li>Payment details (processed securely via our third-party provider)</li>
        <li>Browsing behavior on our website (via cookies)</li>
      </ul>

      <h2 className="text-xl font-semibold">2. How We Use Your Information</h2>
      <p>We use your information to:</p>
      <ul className="list-disc pl-6 space-y-1">
        <li>Process and deliver your orders</li>
        <li>Send updates related to your order</li>
        <li>Improve your shopping experience</li>
      </ul>

      <h2 className="text-xl font-semibold">3. Third-Party Services</h2>
      <p>
        We may share your information with trusted third parties like Monnify, Stripe
        (for payments) and delivery services — strictly to fulfill your order.
      </p>

      <h2 className="text-xl font-semibold">4. Your Rights</h2>
      <p>
        You can request to view, update, or delete your personal data by
        contacting us at{" "}
        <a href="mailto:treasure@idolo.dev" className="underline">
          treasure@idolo.dev
        </a>
        .
      </p>

      <h2 className="text-xl font-semibold">5. Updates to This Policy</h2>
      <p>We may update this Privacy Policy from time to time. Please check back periodically.</p>
    </div>
  );
}
