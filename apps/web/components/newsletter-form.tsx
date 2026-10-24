"use client";

import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import React, { useState } from "react";

export const NewsletterForm = () => {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const publicKey = process.env.NEXT_PUBLIC_PENNA_PUBLIC_KEY;

    if (!publicKey) {
      throw new Error("NEXT_PUBLIC_PENNA_PUBLIC_KEY is not configured");
    }
    if (email.trim() === "") {
      setMessage("Email is required");
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setMessage("Please enter a valid email address");
      return;
    }
    setSubmitting(true);
    const res = await fetch("penna-api/newsletters/subscriber/new", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-penna-public-key": publicKey,
      },
      body: JSON.stringify({ email }),
    });

    const json = await res.json();
    setMessage(json.message);

    if (json.success) {
      setSubscribed(true);
    }
    setSubmitting(false);
  };

  return (
    <form className="flex flex-col px-5 min-w-sm gap-2" onSubmit={handleSubmit}>
      <h4 className="font-medium text-lg">Subscribe for updates</h4>

      {subscribed ? (
        <p>{message}</p>
      ) : (
        <>
          <Input
            type="email"
            placeholder="example@email.com"
            value={email}
            required
            onChange={(e) => setEmail(e.target.value)}
          />
          <Button type="submit" disabled={submitting}>
            {submitting ? "Subscribing..." : "Subscribe"}
          </Button>
          {!subscribed && message && <p className="text-red-500">{message}</p>}
          {message && <p>{message}</p>}
        </>
      )}
    </form>
  );
};
