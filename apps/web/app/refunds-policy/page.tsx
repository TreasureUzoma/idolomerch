export default function RefundPolicyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12 space-y-6">
      <h1 className="text-3xl font-bold">Refund & Return Policy</h1>

      <p>
        We want you to love what you buy from Idolomerch. If you're not satisfied, here's what you need to know.
      </p>

      <h2 className="text-xl font-semibold">1. Returns</h2>
      <p>
        We accept returns within 7 days of delivery if the item is:
      </p>
      <ul className="list-disc pl-6 space-y-1">
        <li>Unworn, unwashed, and in original condition</li>
        <li>In its original packaging</li>
        <li>Accompanied by proof of purchase</li>
      </ul>

      <h2 className="text-xl font-semibold">2. Refunds</h2>
      <p>
        Once we receive and inspect your return, we’ll notify you. If approved, a refund will be processed to your original payment method within 5–10 business days.
      </p>

      <h2 className="text-xl font-semibold">3. Non-Returnable Items</h2>
      <ul className="list-disc pl-6 space-y-1">
        <li>Gift cards</li>
        <li>Digital items or downloads</li>
        <li>Clearance / final sale items</li>
      </ul>

      <h2 className="text-xl font-semibold">4. Damaged or Incorrect Items</h2>
      <p>
        If you received a defective or wrong item, please contact us within 48 hours with photos so we can resolve it quickly.
      </p>

      <h2 className="text-xl font-semibold">5. Contact</h2>
      <p>
        For returns, refunds, or questions, email us at{" "}
        <a href="mailto:treasure@idolo.dev" className="underline">
          treasure@idolo.dev
        </a>
        .
      </p>
    </div>
  );
}
