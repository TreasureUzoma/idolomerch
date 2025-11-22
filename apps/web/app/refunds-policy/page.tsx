import React from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Refund Policy - idolomerch",
  description: "Refund Policy for idolomerch",
};

export default function RefundPolicyPage() {
  return (
    <div className="max-w-3xl mx-auto py-12 space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">Refund Policy</h1>
        <p className="text-muted-foreground">
          Last updated: {new Date().toLocaleDateString()}
        </p>
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none space-y-6">
        <section>
          <h2 className="text-2xl font-semibold mb-4">1. Returns</h2>
          <p>
            We have a 30-day return policy, which means you have 30 days after
            receiving your item to request a return.
          </p>
          <p className="mt-2">
            To be eligible for a return, your item must be in the same condition
            that you received it, unworn or unused, with tags, and in its
            original packaging. You’ll also need the receipt or proof of
            purchase.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">
            2. Damaged or Issues
          </h2>
          <p>
            Please inspect your order upon reception and contact us immediately
            if the item is defective, damaged or if you receive the wrong item,
            so that we can evaluate the issue and make it right.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">
            3. Exceptions / Non-returnable items
          </h2>
          <p>
            Certain types of items cannot be returned, like perishable goods
            (such as food, flowers, or plants), custom products (such as
            special orders or personalized items), and personal care goods
            (such as beauty products). We also do not accept returns for
            hazardous materials, flammable liquids, or gases. Please get in
            touch if you have questions or concerns about your specific item.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">4. Exchanges</h2>
          <p>
            The fastest way to ensure you get what you want is to return the
            item you have, and once the return is accepted, make a separate
            purchase for the new item.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">5. Refunds</h2>
          <p>
            We will notify you once we’ve received and inspected your return,
            and let you know if the refund was approved or not. If approved,
            you’ll be automatically refunded on your original payment method.
            Please remember it can take some time for your bank or credit card
            company to process and post the refund too.
          </p>
        </section>
      </div>
    </div>
  );
}
