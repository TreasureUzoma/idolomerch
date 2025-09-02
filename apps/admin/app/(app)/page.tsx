"use client";

import { useEffect, useState } from "react";
import { baseUrl } from "@/constants";

interface SalesPoint {
  date: string;
  amount: number;
}

interface SummaryData {
  totalProducts?: number;
  totalOrders?: number;
  totalRevenue?: number;
  salesOverTime?: SalesPoint[];
}

export default function DashboardPage() {
  const [data, setData] = useState<SummaryData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`${baseUrl}/summary`, {
      credentials: "include",
    })
      .then(async (res) => {
        if (!res.ok) {
          const text = await res.text();
          throw new Error(text || "Failed to fetch summary");
        }
        return res.json();
      })
      .then((res: SummaryData) => {
        setData(res || {});
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching summary:", err);
        setError("Failed to load summary.");
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <p className="p-4">Loading summary...</p>;
  }

  if (error) {
    return <p className="p-4 text-red-500">{error}</p>;
  }

  // Safe defaults if fields are missing
  const totalProducts = data?.totalProducts ?? 0;
  const totalOrders = data?.totalOrders ?? 0;
  const totalRevenue = data?.totalRevenue ?? 0;
  const salesOverTime = Array.isArray(data?.salesOverTime)
    ? data.salesOverTime
    : [];

  return (
    <div className="p-4 space-y-6">
      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="border rounded-lg p-4 shadow">
          <h3 className="text-sm text-gray-500">Total Products</h3>
          <p className="text-2xl font-bold">{totalProducts}</p>
        </div>
        <div className="border rounded-lg p-4 shadow">
          <h3 className="text-sm text-gray-500">Total Orders</h3>
          <p className="text-2xl font-bold">{totalOrders}</p>
        </div>
        <div className="border rounded-lg p-4 shadow">
          <h3 className="text-sm text-gray-500">Total Revenue</h3>
          <p className="text-2xl font-bold">${totalRevenue.toLocaleString()}</p>
        </div>
      </div>

      {/* Sales Over Time */}
      <div className="border rounded-lg p-4 shadow">
        <h3 className="text-md font-semibold mb-2">Sales (Last 7 Days)</h3>

        {salesOverTime.length > 0 ? (
          <ul className="space-y-1">
            {salesOverTime.map((sale) => (
              <li
                key={sale.date}
                className="flex justify-between text-sm text-gray-700"
              >
                <span>{sale.date}</span>
                <span>${sale.amount?.toLocaleString() ?? 0}</span>
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
