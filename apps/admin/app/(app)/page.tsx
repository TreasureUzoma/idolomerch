"use client";

import { useEffect, useState } from "react";
import { baseUrl } from "@/constants";

interface SalesPoint {
  date: string;
  amount: number;
}

interface SummaryData {
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  salesOverTime: SalesPoint[];
}

export default function DashboardPage() {
  const [data, setData] = useState<SummaryData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${baseUrl}/summary`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((res) => {
        setData(res);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return <p className="p-4">Loading summary...</p>;
  }

  if (!data) {
    return <p className="p-4 text-red-500">Failed to load summary.</p>;
  }

  const hasSalesData =
    Array.isArray(data.salesOverTime) && data.salesOverTime.length > 0;

  return (
    <div className="p-4 space-y-6">
      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="border rounded-lg p-4 shadow">
          <h3 className="text-sm text-gray-500">Total Products</h3>
          <p className="text-2xl font-bold">{data.totalProducts}</p>
        </div>
        <div className="border rounded-lg p-4 shadow">
          <h3 className="text-sm text-gray-500">Total Orders</h3>
          <p className="text-2xl font-bold">{data.totalOrders}</p>
        </div>
        <div className="border rounded-lg p-4 shadow">
          <h3 className="text-sm text-gray-500">Total Revenue</h3>
          <p className="text-2xl font-bold">
            ₦{data.totalRevenue.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Sales Over Time */}
      <div className="border rounded-lg p-4 shadow">
        <h3 className="text-md font-semibold mb-2">Sales (Last 7 Days)</h3>

        {hasSalesData ? (
          <ul className="space-y-1">
            {data.salesOverTime.map((sale) => (
              <li
                key={sale.date}
                className="flex justify-between text-sm text-gray-700"
              >
                <span>{sale.date}</span>
                <span>₦{sale.amount.toLocaleString()}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-gray-500">
            No sales data for the last 7 days.
          </p>
        )}
      </div>
    </div>
  );
}
