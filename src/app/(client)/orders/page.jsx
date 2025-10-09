import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import React from "react";
import { Package } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getMyOrders, getVariantInfo } from "@/sanity/helpers";
import OrderTabs from "./OrderTabs";

const OrdersPage = async () => {
  const { userId } = await auth();
  if (!userId) {
    redirect("/");
  }

  const orders = await getMyOrders(userId);

  const hydratedOrders = await Promise.all(
    orders.map(async (order) => {
      const itemsWithVariants = await Promise.all(
        order.items.map(async (item) => {
          const variantInfo = await getVariantInfo(
            item.productId,
            item.variant
          );
          
          // Fallback if Sanity fetch fails or product has no variant
          return {
            ...item,
            sku: variantInfo.sku || item.sku,
            image: variantInfo.image || item.image,
          };
        })
      );
      return { ...order, items: itemsWithVariants };
    })
  );
  console.log(hydratedOrders);
  
  return (
    <div className="max-w-screen-xl mx-auto py-5 md:py-10 px-4">
      <div className="bg-card border rounded-lg shadow p-4 pt-3 md:p-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-5 border-b mb-3 md:mb-4">
          <div className="flex items-center gap-2">
            <Package />
            <h1 className="text-2xl font-semibold">My Orders</h1>
          </div>
          <div className="gap-3 flex flex-col md:flex-row items-center justify-center">
            <Input type="text" placeholder="Search orders..." />
            <Select defaultValue="newest">
              <SelectTrigger className="w-full md:w-60">
                <SelectValue />
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
        <OrderTabs orders={hydratedOrders} />
      </div>
    </div>
  );
};

export default OrdersPage;
