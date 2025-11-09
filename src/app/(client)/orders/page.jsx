import { auth } from "@clerk/nextjs/server";
import OrdersClient from "./OrdersClient";
import { getMyOrders, getVariantInfo } from "@/sanity/helpers";
import { redirect } from "next/navigation";

export const metadata = {
  title: "My Orders | Cartzi",
  description:
    "View all your Cartzi orders in one place — track your recent purchases, shipping status, and past orders easily.",
  openGraph: {
    title: "My Orders | Cartzi",
    description:
      "Check your Cartzi orders, see order history, and track deliveries.",
    url: `${process.env.NEXT_PUBLIC_BASE_URL}/orders`,
    siteName: "Cartzi",
    type: "website",
  },
};

export default async function OrdersPage() {
  const { userId } = await auth();
  if (!userId) redirect("/");

  const orders = await getMyOrders(userId);

  const hydratedOrders = await Promise.all(
    orders.map(async (order) => {
      const itemsWithVariants = await Promise.all(
        order.items.map(async (item) => {
          const variantInfo = await getVariantInfo(
            item.productId,
            item.variant
          );
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

  return (
    <div className="max-w-7xl mx-auto py-5 md:py-10 px-4">
      <OrdersClient orders={hydratedOrders} />
    </div>
  );
}
