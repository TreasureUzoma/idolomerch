"use client";

import { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@workspace/ui/components/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import { Input } from "@workspace/ui/components/input";
import { Skeleton } from "@workspace/ui/components/skeleton";
import { useGetAllOrders, useUpdateOrderStatus } from "@/hooks/use-orders";
import { ErrorPage } from "@/components/error-page";
import { AdminOrderUpdateInput } from "@workspace/validations";

export default function OrdersPage() {
  const [search, setSearch] = useState("");
  const { mutate: updateOrder, isPending: isUpdatingOrder } =
    useUpdateOrderStatus();

  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useGetAllOrders({
    search,
    sort: "newest",
    page: 1,
    limit: 20,
    currency: "USD",
  });

  const orders = data?.pages.flatMap((page) => page.data) ?? [];

  const orderStatus = [
    "pending",
    "processing",
    "shipped",
    "delivered",
    "cancelled",
    "refunded",
  ];

  const updateOrderStatus = (id: string, status: string) => {
    updateOrder({ id, body: { status } as AdminOrderUpdateInput });
  };

  if (error) return <ErrorPage error={error} />;

  return (
    <div className="px-6 py-4">
      <h1 className="text-2xl font-bold mb-6">Orders</h1>

      <Input
        type="text"
        placeholder="Search by customer or item..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-6 w-full py-5"
      />

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-8 w-32" />
              </CardHeader>
              <CardContent className="space-y-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : orders.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {orders.map((order: any) => (
              <Card key={order.id}>
                <CardHeader>
                  <CardTitle className="text-lg">Order #{order.id}</CardTitle>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">
                      Customer:
                    </span>
                    <span className="font-medium">
                      {order.customer?.name || "N/A"}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">
                      Total:
                    </span>
                    <span className="font-semibold">
                      ${order.total.toFixed(2)}
                    </span>
                  </div>

                  <div>
                    <span className="text-sm font-medium">Items:</span>
                    <ul className="ml-4 list-disc text-sm mt-1 text-muted-foreground">
                      {order.items?.map((item: any, idx: number) => (
                        <li key={idx}>
                          {item.name} × {item.qty}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex flex-col gap-2">
                    <span className="text-sm font-medium">Status:</span>
                    <Select
                      value={order.status}
                      disabled={isUpdatingOrder}
                      onValueChange={(value) =>
                        updateOrderStatus(order.id, value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {orderStatus.map((order) => (
                          <SelectItem
                            key={order}
                            className="capitalize"
                            value={order}
                          >
                            {order}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {hasNextPage && (
            <div className="mt-8 text-center">
              <button
                onClick={() => fetchNextPage()}
                disabled={isFetchingNextPage}
                className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50"
              >
                {isFetchingNextPage ? "Loading more..." : "Load More Orders"}
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center text-muted-foreground py-12">
          No orders found.
        </div>
      )}
    </div>
  );
}
