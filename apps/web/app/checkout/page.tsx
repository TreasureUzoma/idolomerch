"use client";

import React, { useState } from "react";
import { useCartStore } from "@/store/cart";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import numeral from "numeral";
import { API_BASE_URL } from "@workspace/constants";

import type {
  OrderInputType,
  AddressInput,
  UserInfoInput,
  CurrencyType,
} from "@workspace/validations";
import { createOrderSchema } from "@workspace/validations";

import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { Label } from "@workspace/ui/components/label";

interface CheckoutFormInput {
  userInfo?: UserInfoInput;
  shippingAddress: AddressInput;
}

const CheckoutFormSchema = createOrderSchema.pick({
  userInfo: true,
  shippingAddress: true,
});

export default function CryptoCheckoutRedirect() {
  const router = useRouter();
  const { cart, clearCart } = useCartStore();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);

  const {
    handleSubmit,
    control,
    formState: { errors },
    getValues,
  } = useForm<CheckoutFormInput>({
    resolver: zodResolver(CheckoutFormSchema),
    defaultValues: {
      userInfo: {
        fullName: "",
        email: "",
        phoneNumber: "",
      },
      shippingAddress: {
        fullName: "",
        phone: "",
        postalCode: "",
        street: "",
        city: "",
        state: "",
        country: "",
      },
    },
    mode: "onBlur",
  });

  const totalAmount = cart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  const currency = (cart[0]?.currency || "USD") as CurrencyType;
  const formattedTotal = numeral(totalAmount).format("0,0.00");

  const onSubmit: SubmitHandler<CheckoutFormInput> = (data) => {
    setStep(2);
  };

  const initiateOrderAndRedirect = async () => {
    if (cart.length === 0) {
      toast.error("Cart is empty");
      return;
    }

    setLoading(true);

    const formData = getValues();

    const payload: OrderInputType = {
      currency,
      products: cart,
      shippingAddress: formData.shippingAddress,
      userInfo: formData.userInfo,
    };

    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json();
        if (errorData.error?.issues) {
          errorData.error.issues.forEach((issue: any) => {
            const field = issue.path.join(".");
            toast.error(`Validation Error: [${field}] ${issue.message}`);
          });
        }
        throw new Error("Failed to create order and checkout link");
      }

      const data = await res.json();
      if (data.checkoutLink) {
        toast.info("Redirecting to payment gateway...");
        clearCart();
        router.push(data.checkoutLink);
      } else {
        throw new Error("Payment link was not received.");
      }
    } catch (err) {
      toast.error(
        err instanceof Error
          ? err?.message
          : "Error processing order. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const renderInputField = (
    name: keyof UserInfoInput | keyof AddressInput,
    label: string,
    placeholder: string,
    type: string,
    group: "userInfo" | "shippingAddress"
  ) => {
    const fieldPath = `${group}.${name}`;
    const error = errors[group] && (errors[group] as any)[name];

    return (
      <div className="space-y-1.5">
        <Label htmlFor={String(name)}>{label}</Label>
        <Controller
          name={fieldPath as any}
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              id={String(name)}
              type={type}
              placeholder={placeholder}
              value={field.value || ""}
              className={error ? "border-red-500" : ""}
            />
          )}
        />
        {error && <p className="text-sm text-red-500">{error.message}</p>}
      </div>
    );
  };

  const renderShippingForm = () => (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <h2 className="text-xl font-semibold border-b pb-2">
        1. Contact & Shipping Details
      </h2>

      <h3 className="text-lg font-medium text-muted-foreground">
        Contact Information (for account/billing)
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {renderInputField(
          "fullName",
          "Full Name *",
          "Enter your full name",
          "text",
          "userInfo"
        )}
        {renderInputField(
          "email",
          "Email *",
          "Enter your email address",
          "email",
          "userInfo"
        )}
        {renderInputField(
          "phoneNumber",
          "Phone Number",
          "Enter your phone number",
          "tel",
          "userInfo"
        )}
      </div>

      <h3 className="text-lg font-medium text-muted-foreground pt-4 border-t">
        Shipping Address
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {renderInputField(
          "fullName",
          "Recipient Name *",
          "Recipient's full name",
          "text",
          "shippingAddress"
        )}
        {renderInputField(
          "phone",
          "Recipient Phone",
          "Recipient's phone number",
          "tel",
          "shippingAddress"
        )}
        {renderInputField(
          "street",
          "Street Address *",
          "123 Main St",
          "text",
          "shippingAddress"
        )}
        {renderInputField(
          "city",
          "City *",
          "New York",
          "text",
          "shippingAddress"
        )}
        {renderInputField(
          "state",
          "State/Region",
          "NY",
          "text",
          "shippingAddress"
        )}
        {renderInputField(
          "postalCode",
          "Postal Code",
          "10001",
          "text",
          "shippingAddress"
        )}
        {renderInputField(
          "country",
          "Country *",
          "USA",
          "text",
          "shippingAddress"
        )}
      </div>

      <Button type="submit" className="w-full" disabled={loading}>
        Continue to Payment Review
      </Button>
    </form>
  );

  const renderReviewAndPay = () => {
    const { userInfo, shippingAddress } = getValues();

    return (
      <div className="space-y-6">
        <h2 className="text-xl font-semibold border-b pb-2">
          2. Review Order & Pay
        </h2>
        <div className="space-y-3 p-4 border rounded-lg">
          <h3 className="text-lg font-medium">Items ({cart.length})</h3>
          {cart.map((item) => (
            <div
              key={item.id}
              className="flex justify-between items-center text-sm"
            >
              <span>
                {item.name} (x{item.quantity})
              </span>
              <span>
                {item.currency}{" "}
                {numeral(item.price * item.quantity).format("0,0.00")}
              </span>
            </div>
          ))}
          <div className="pt-2 border-t font-bold flex justify-between">
            <span>Total:</span>
            <span>
              {currency} {formattedTotal}
            </span>
          </div>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Ship To:</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              {shippingAddress.fullName} ({userInfo?.email})
            </p>
            <p>
              {shippingAddress.street}, {shippingAddress.city},{" "}
              {shippingAddress.state} {shippingAddress.postalCode}
            </p>
            <p>
              {shippingAddress.country} | Phone:{" "}
              {shippingAddress.phone || userInfo?.phoneNumber || "N/A"}
            </p>
          </CardContent>
        </Card>
        <Button onClick={() => setStep(1)} variant="outline" className="w-full">
          Go Back and Edit Details
        </Button>
        <Button
          onClick={initiateOrderAndRedirect}
          disabled={loading}
          className="w-full"
        >
          {loading ? "Creating Order & Redirecting..." : "Pay with Crypto"}
        </Button>
      </div>
    );
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Crypto Checkout</h1>
      {cart.length === 0 ? (
        <p className="text-muted-foreground">Your cart is empty.</p>
      ) : (
        <>
          {step === 1 && renderShippingForm()}
          {step === 2 && renderReviewAndPay()}
        </>
      )}
    </div>
  );
}
