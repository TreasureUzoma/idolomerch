import { API_BASE_URL } from "@workspace/constants";
import { notFound } from "next/navigation";

export default async function CheckoutSuccessPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const res = await fetch(`${API_BASE_URL}/api/v1/orders/${id}`);
  const json = await res.json();
  const order = json?.data;

  if (!order) return notFound();

  if (order.paymentStatus !== "paid") {
    return (
      <div className="p-8 text-center">
        <h1 className="text-2xl font-bold text-yellow-600">
          Payment Pending or Failed ⏳
        </h1>
        <p className="mt-4">
          We are still waiting for confirmation from the payment gateway
          (NOWPayments). This is normal for crypto payments. Please check back
          later or wait for an email confirmation.
        </p>
      </div>
    );
  }

  const finalCurrency = order.currency;
  const formattedAmount = `${finalCurrency} ${order.totalAmount}`;

  const currentStatus = order.status;

  // Calculate a simple estimated delivery date (e.g., 5 days from order date)
  const orderDate = new Date(order.createdAt);
  const estimatedDeliveryDate = new Date(
    orderDate.setDate(orderDate.getDate() + 5)
  ).toLocaleDateString();

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6">
        <div className="text-center">
          <svg
            className="mx-auto h-16 w-16 text-green-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h1 className="mt-4 text-3xl font-extrabold text-gray-900">
            Order Placed Successfully! 🎉
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Your payment has been confirmed. A confirmation email has been sent
            to your inbox.
          </p>
        </div>
        <div className="mt-8 border-t border-gray-200 pt-8">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Order Summary
          </h3>
          <dl className="mt-4 space-y-4">
            <div className="flex justify-between text-sm font-medium">
              <dt className="text-gray-500">Order ID:</dt>
              <dd className="text-gray-900 font-mono">**{order.id}**</dd>
            </div>
            <div className="flex justify-between text-sm font-medium">
              <dt className="text-gray-500">Current Status:</dt>
              <dd className="text-indigo-600 font-medium capitalize">
                **{currentStatus}**
              </dd>
            </div>
            <div className="flex justify-between text-sm font-medium">
              <dt className="text-gray-500">Est. Delivery:</dt>
              <dd className="text-gray-900 font-medium">
                {estimatedDeliveryDate}
              </dd>
            </div>
            <div className="flex justify-between text-sm font-medium">
              <dt className="text-gray-500">Total Paid:</dt>
              <dd className="text-green-600 font-bold">
                **{formattedAmount}**
              </dd>
            </div>
            <div className="flex justify-between text-sm font-medium">
              <dt className="text-gray-500">Date:</dt>
              <dd className="text-gray-900">
                {new Date(order.createdAt).toLocaleDateString()}
              </dd>
            </div>
          </dl>
        </div>
        <div className="mt-8 flex justify-center">
          <a
            href="/"
            className="text-indigo-600 hover:text-indigo-500 text-sm font-medium"
          >
            Continue Shopping &rarr;
          </a>
        </div>
      </div>
    </div>
  );
}
