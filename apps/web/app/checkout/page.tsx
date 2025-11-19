"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useCartStore } from "@/store/cart";
import { useRouter } from "next/navigation";
import { QRCodeSVG } from "qrcode.react";
import { toast } from "sonner";
import numeral from "numeral";
import { API_BASE_URL } from "@workspace/constants";

interface Invoice {
  id: string;
  status: "new" | "paid" | "expired";
  cryptoCode: string;
  cryptoAmount: string;
  checkoutLink: string;
  address: string;
}

export default function CryptoCheckout() {
  const router = useRouter();
  const { cart, clearCart } = useCartStore();
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(false);
  const [polling, setPolling] = useState(false);

  const totalAmount = cart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  const currency = cart[0]?.currency || "USD";

  // 1. Create invoice
  const createInvoice = async () => {
    if (cart.length === 0) {
      toast.error("Cart is empty");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/invoice`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: totalAmount, currency }),
      });

      if (!res.ok) throw new Error("Failed to create invoice");

      const data: Invoice = await res.json();
      setInvoice(data);
      setPolling(true);
      toast.success("Invoice created! Scan QR or pay with wallet.");
    } catch (err: any) {
      toast.error(err.message || "Error creating invoice");
    } finally {
      setLoading(false);
    }
  };

  // 2. Poll invoice status
  useEffect(() => {
    if (!invoice || !polling) return;

    const interval = setInterval(async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/v1/invoice/${invoice.id}`);
        const data: Invoice = await res.json();

        if (data.status === "paid") {
          setInvoice(data);
          setPolling(false);
          toast.success("Payment received!");
          clearCart();
        } else if (data.status === "expired") {
          setInvoice(data);
          setPolling(false);
          toast.error("Invoice expired. Please try again.");
        }
      } catch (err) {
        console.error(err);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [invoice, polling]);

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Crypto Checkout</h1>

      {cart.length === 0 ? (
        <p className="text-muted-foreground">Your cart is empty.</p>
      ) : (
        <>
          <div className="space-y-4 mb-6">
            {cart.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-4 p-4 border rounded-lg bg-muted/10"
              >
                <div className="relative w-20 h-20 shrink-0">
                  <Image
                    src={item.image || "/images/default.png"}
                    alt={item.name}
                    width={80}
                    height={80}
                    className="object-cover rounded"
                  />
                </div>

                <div className="flex-1">
                  <h2 className="text-lg font-medium">{item.name}</h2>
                  <p className="text-sm text-muted-foreground">
                    {item.currency} {numeral(item.price).format("0,0.00")} x{" "}
                    {item.quantity}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {!invoice ? (
            <button
              onClick={createInvoice}
              disabled={loading}
              className="w-full bg-black text-white py-3 rounded-lg hover:opacity-90 transition"
            >
              {loading ? "Creating Invoice..." : "Pay with Crypto"}
            </button>
          ) : (
            <div className="mt-6 text-center">
              <h2 className="text-xl font-semibold mb-2">
                Pay {invoice.cryptoAmount} {invoice.cryptoCode}
              </h2>
              <QRCodeSVG value={invoice.address} size={200} />
              <p className="mt-2 break-all">{invoice.address}</p>
              {invoice.status === "paid" && (
                <p className="text-green-600 font-semibold mt-4">
                  Payment received! Thank you.
                </p>
              )}
              {invoice.status === "expired" && (
                <p className="text-red-500 font-semibold mt-4">
                  Invoice expired. Try again.
                </p>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
