"use client";

import { useState, useEffect } from "react";
import Script from "next/script";
import { useCart } from "@/context/cart";
import { useCurrency } from "@/context/currency";
import { convertCurrency } from "@repo/ui/lib/currency";
import { formatCurrency } from "@repo/ui/lib/format-currency";
import { toast } from "@repo/ui/components/ui/sonner";
import { Input } from "@repo/ui/components/ui/input";
import { Label } from "@repo/ui/components/ui/label";
import { CheckCircle } from "lucide-react";
import Link from "next/link";

export default function CheckoutPage() {
  const { cart, clearCart } = useCart();
  const { currency } = useCurrency();

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    country: "Nigeria",
  });

  const [monnifyReady, setMonnifyReady] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [convertedTotal, setConvertedTotal] = useState<number | null>(null);

  const totalAmount = cart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  useEffect(() => {
    // Convert only once on load or when cart/currency changes
    convertCurrency(totalAmount, currency).then((amount) => {
      setConvertedTotal(amount);
    });
  }, [cart, currency, totalAmount]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePayment = () => {
    if (currency !== "NGN") {
      toast.error("Sorry, payment is only available in NGN.");
      return;
    }

    if (!monnifyReady || typeof window === "undefined") {
      toast.warning("Monnify is still loading. Please wait...");
      return;
    }

    const reference = `TX-${Date.now()}`;

    // @ts-ignore
    window.MonnifySDK.initialize({
      amount: convertedTotal || totalAmount,
      currency: "NGN",
      reference,
      customerFullName: form.fullName,
      customerEmail: form.email,
      apiKey: process.env.NEXT_PUBLIC_MONNIFY_API_KEY!,
      contractCode: process.env.NEXT_PUBLIC_MONNIFY_CONTRACT_CODE!,
      paymentDescription: "Order Payment",
      metadata: {
        cart: cart.map((item) => item.name).join(", "),
        shipping: {
          phone: form.phone,
          address: form.address,
          city: form.city,
          state: form.state,
          country: form.country,
        },
      },
      onComplete: (response: any) => {
        if (response.status === "PAID") {
          toast.success("Payment successful!");
          clearCart();
          setPaymentSuccess(true);
        }
      },
      onClose: () => {
        toast.info("Payment window closed");
      },
    });
  };

  const formFields = [
    { name: "fullName", label: "Full Name", placeholder: "e.g. John Doe" },
    { name: "email", label: "Email", placeholder: "e.g. john@example.com" },
    { name: "phone", label: "Phone", placeholder: "e.g. 08012345678" },
    { name: "address", label: "Address", placeholder: "Street address" },
    { name: "city", label: "City", placeholder: "e.g. Ikeja" },
    { name: "state", label: "State", placeholder: "e.g. Lagos State" },
    { name: "country", label: "Country", placeholder: "e.g. Nigeria" },
  ];

  return (
    <div className="max-w-xl mx-auto px-4 py-6">
      <Script
        src="https://sdk.monnify.com/plugin/monnify.js"
        strategy="afterInteractive"
        onLoad={() => setMonnifyReady(true)}
      />

      <h1 className="text-2xl font-bold mb-6">
        {paymentSuccess ? "Payment Successful" : "Checkout"}
      </h1>

      {paymentSuccess ? (
        <div className="flex flex-col items-center gap-4">
          <CheckCircle className="text-green-600 w-16 h-16" />
          <p className="text-lg font-medium text-center">
            Thank you for your purchase!
          </p>
          <Link
            href="/"
            className="bg-primary text-white px-6 py-2 rounded hover:bg-primary/90"
          >
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {formFields.map(({ name, label, placeholder }) => (
            <div key={name} className="grid gap-2">
              <Label htmlFor={name}>{label}</Label>
              <Input
                id={name}
                name={name}
                type="text"
                value={form[name as keyof typeof form]}
                onChange={handleChange}
                placeholder={placeholder}
              />
            </div>
          ))}

          <div className="flex justify-between items-center pt-4">
            <span className="font-semibold">
              Total:{" "}
              {convertedTotal !== null
                ? formatCurrency(convertedTotal, currency)
                : "..."}
            </span>
            <button
              onClick={handlePayment}
              className="bg-primary text-white px-6 py-2 rounded hover:bg-primary/90 disabled:opacity-50"
              disabled={!convertedTotal}
            >
              Complete Payment
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
