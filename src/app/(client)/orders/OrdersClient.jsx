"use client";
import React, { useState, useEffect } from "react";
import { Package, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import OrderTabs from "./OrderTabs";
import EmptyOrders from "./EmptyOrder";

const OrdersClient = ({ orders }) => {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("newest");
  const [filteredOrders, setFilteredOrders] = useState(orders || []);

  // Restore saved sort preference
  useEffect(() => {
    const saved = localStorage.getItem("cartzi-order-sort");
    if (saved) setSort(saved);
  }, []);

  // Save sort preference
  useEffect(() => {
    localStorage.setItem("cartzi-order-sort", sort);
  }, [sort]);

  // Run filtering + sorting without blocking typing
  useEffect(() => {
    const handler = setTimeout(() => {
      let result = Array.isArray(orders) ? [...orders] : [];

      // Forgiving search
      if (search.trim()) {
        const q = search.toLowerCase().replace(/[#\s]/g, "");

        result = result.filter((order) => {
          const orderNum = order.orderNumber
            ?.toLowerCase()
            .replace(/[^a-z0-9]/g, "");
          const matchOrderNumber = orderNum?.includes(q);

          const matchProduct = order.items?.some((item) =>
            item.name?.toLowerCase().includes(q)
          );

          return matchOrderNumber || matchProduct;
        });
      }

      // Sort
      switch (sort) {
        case "oldest":
          result.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
          break;
        case "highest":
          result.sort((a, b) => (b.total ?? 0) - (a.total ?? 0));
          break;
        case "lowest":
          result.sort((a, b) => (a.total ?? 0) - (b.total ?? 0));
          break;
        default:
          // newest
          result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      }

      setFilteredOrders(result);
    }, 200); // short debounce for smoother UX

    return () => clearTimeout(handler);
  }, [orders, search, sort]);

  return (
    <div className="bg-card border rounded-lg shadow p-4 pt-3 md:p-5">
      {/* Header & Filters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-5 border-b mb-3 md:mb-4">
        <div className="flex items-center gap-2">
          <Package />
          <h1 className="text-2xl font-semibold">My Orders</h1>
        </div>

        <div className="gap-3 flex flex-col md:flex-row items-center justify-center w-full md:w-auto">
          {/* Search */}
          <div className="relative w-full md:w-[300px]">
            <Input
              type="text"
              placeholder="Search by product or order number..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pr-10"
            />
            {search && (
              <button
                aria-label="Clear search"
                onClick={() => setSearch("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-muted-foreground/10"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Sort */}
          <Select value={sort} onValueChange={setSort}>
            <SelectTrigger className="w-full md:w-60">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
              <SelectItem value="highest">Highest Amount</SelectItem>
              <SelectItem value="lowest">Lowest Amount</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {filteredOrders.length > 0 ? (
        <OrderTabs orders={filteredOrders} />
      ) : search ? (
        <div className="text-center text-muted-foreground py-10 space-y-2">
          <p>No orders match your search.</p>
          <button
            onClick={() => setSearch("")}
            className="text-sm text-primary hover:underline"
          >
            Reset search
          </button>
        </div>
      ) : (
        <EmptyOrders />
      )}
    </div>
  );
};

export default OrdersClient;
