import { notFound, redirect } from "next/navigation";
import { formatRelativeDate, getStatusBadge, priceFormatter } from "@/lib";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import { getOrderById, getVariantInfo } from "@/sanity/helpers";
import { auth } from "@clerk/nextjs/server";
import OrderActions from "./OrderActions";

export async function generateMetadata({ params }) {
  const { id } = await params;
  const order = await getOrderById(id);

  if (!order) {
    return {
      title: "Order Not Found | Cartzi",
      description:
        "The order you're looking for doesn't exist or has been removed.",
    };
  }

  return {
    title: `Order #${order.orderNumber} | Cartzi`,
    description: `View detailed information for your Cartzi order #${order.orderNumber}. Check items, shipping, and payment details.`,
    openGraph: {
      title: `Order #${order.orderNumber} | Cartzi`,
      description: "Track your Cartzi order and view its details.",
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/orders/${order._id}`,
      siteName: "Cartzi",
      type: "article",
    },
  };
}

export default async function OrderDetailsPage({ params }) {
  const { userId } = await auth();
  if (!userId) redirect("/");

  const { id } = await params;
  const fetchedOrder = await getOrderById(id);

  if (!fetchedOrder) return notFound();
  if (fetchedOrder?.customer?.clerkUserId !== userId) return notFound();

  // Hydrate variant info (same as OrdersPage)
  const hydratedItems = await Promise.all(
    fetchedOrder.items.map(async (item) => {
      const variantInfo = await getVariantInfo(item.productId, item.variant);
      return {
        ...item,
        sku: variantInfo.sku || item.sku,
        image: variantInfo.image || item.image,
      };
    })
  );

  const order = { ...fetchedOrder, items: hydratedItems };
  const placed = formatRelativeDate(order?.createdAt);

  return (
    <div className="max-w-4xl mx-auto py-5 md:py-10 px-4">
      <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
        <div>
          <h1 className="text-2xl font-bold">Order #{order.orderNumber}</h1>
          <span className="text-sm text-muted-foreground">
            {placed.isAbsolute ? "Placed on " : "Placed "}
            <time dateTime={order?.createdAt} title={placed.text}>
              {placed.text}
            </time>
          </span>
        </div>
        {getStatusBadge(order.status)}
      </div>

      {/* Card */}
      <div className="bg-card border rounded-lg shadow-sm p-4 md:p-6 space-y-5">
        {/* Items */}
        <div className="space-y-3">
          {order.items.map((item, idx) => (
            <div
              key={idx}
              className="flex items-center gap-3 border-b pb-3 last:border-none"
            >
              {item?.image && item?.variant ? (
                <Image
                  src={urlFor(item?.image[0])
                    .width(70)
                    .height(85)
                    .auto("format")
                    .url()}
                  alt={item?.image[0]?.alt}
                  width={70}
                  height={85}
                  priority
                  className="rounded-md border object-cover"
                />
              ) : (
                <Image
                  src={urlFor(item?.image)
                    .width(70)
                    .height(85)
                    .auto("format")
                    .url()}
                  alt={item?.image?.alt}
                  width={70}
                  height={85}
                  priority
                  className="rounded-md border object-cover"
                />
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{item.name}</p>
                <p className="text-xs text-muted-foreground">
                  {item.variant} {item.variant && "•"} Qty {item.quantity}
                </p>
              </div>
              <p className="text-sm font-semibold whitespace-nowrap">
                {priceFormatter(item.subtotal)}
              </p>
            </div>
          ))}
        </div>

        <Separator />

        {/* Summary */}
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Items Total</span>
            <span>
              {priceFormatter(
                order.items.reduce((s, i) => s + (i.subtotal ?? 0), 0)
              )}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Shipping ({order.shipping?.rule?.name})</span>
            <span>
              {order.shipping?.cost === 0
                ? "Free"
                : priceFormatter(order.shipping?.cost)}
            </span>
          </div>
          {order.discount && (
            <div className="flex justify-between text-green-600">
              <span>Discount ({order.discount.code})</span>
              <span>
                {order.discount.discountType === "percentage"
                  ? `-${order.discount.value}%`
                  : order.discount.discountType === "fixed"
                    ? `-${priceFormatter(order.discount.value)}`
                    : "Free Shipping"}
              </span>
            </div>
          )}
          <Separator />
          <div className="flex justify-between font-semibold text-base">
            <span>Total Paid</span>
            <span>{priceFormatter(order.total)}</span>
          </div>
        </div>

        <Separator />

        {/* Payment & Shipping */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="space-y-2">
            <h3 className="font-semibold text-base">Shipping Info</h3>
            <p>
              Line 1:{" "}
              <span className="text-muted-foreground">
                {order.shipping?.address?.line1}
              </span>
            </p>
            {order.shipping?.address?.line2 && (
              <p>
                Line 2:{" "}
                <span className="text-muted-foreground">
                  {order.shipping?.address?.line2}
                </span>
              </p>
            )}
            <p>
              City:{" "}
              <span className="text-muted-foreground">
                {order.shipping?.address?.city},{" "}
                {order.shipping?.address?.country}
              </span>
            </p>
            {order.shipping?.address?.state && (
              <p>
                State:{" "}
                <span className="text-muted-foreground">
                  {order.shipping?.address?.state}
                </span>
              </p>
            )}
            {order.shipping?.address?.postalCode && (
              <p>
                Postal Code:{" "}
                <span className="text-muted-foreground">
                  {order.shipping?.address?.postalCode}
                </span>
              </p>
            )}
            <p>
              Delivery:{" "}
              <span className="text-muted-foreground">
                {order.shipping?.rule?.deliveryTime}
              </span>
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="font-semibold text-base">Payment Details</h3>
            <p>
              Provider:{" "}
              <span className="text-muted-foreground">
                {order.payment?.provider}
              </span>
            </p>
            <p>
              Status:{" "}
              <span className="text-muted-foreground">
                {order.payment?.status}
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <OrderActions order={order} />
    </div>
  );
}
