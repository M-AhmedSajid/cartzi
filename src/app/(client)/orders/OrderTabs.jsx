"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { orderFilters } from "@/constants";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { priceFormatter } from "@/lib";
import {
  CircleCheck,
  Clock,
  Truck,
  CircleX,
  Loader2,
  PackageOpen,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { urlFor } from "@/sanity/lib/image";
import Image from "next/image";
import { useMemo, useState } from "react";

const OrderTabs = ({ orders }) => {
  const [activeFilter, setActiveFilter] = useState("all");

  function formatRelativeDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    // If more than 30 days old → return formatted date
    if (diffDays > 30) {
      return date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    }

    // Otherwise → relative time
    if (diffDays >= 1)
      return `about ${diffDays} day${diffDays > 1 ? "s" : ""} ago`;

    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    if (diffHours >= 1)
      return `about ${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;

    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    if (diffMinutes >= 1)
      return `about ${diffMinutes} minute${diffMinutes > 1 ? "s" : ""} ago`;

    return "just now";
  }

  function getStatusBadge(status) {
    switch (status) {
      case "pending":
        return (
          <Badge
            variant="outline"
            className="border-amber-400 text-amber-600 group-[&[data-state=open]]:bg-amber-200"
          >
            <Loader2 className="animate-spin [animation-duration:3s]" />
            Pending
          </Badge>
        );

      case "paid":
        return (
          <Badge
            variant="outline"
            className="border-blue-400 text-blue-600 group-[&[data-state=open]]:bg-blue-200"
          >
            <Clock />
            Processing
          </Badge>
        );

      case "shipped":
        return (
          <Badge
            variant="outline"
            className="border-purple-400 text-purple-600 group-[&[data-state=open]]:bg-purple-200"
          >
            <Truck />
            Shipped
          </Badge>
        );

      case "delivered":
        return (
          <Badge
            variant="outline"
            className="border-green-400 text-green-600 group-[&[data-state=open]]:bg-green-200"
          >
            <CircleCheck />
            Delivered
          </Badge>
        );

      case "cancelled":
        return (
          <Badge
            variant="outline"
            className="border-red-400 text-red-600 group-[&[data-state=open]]:bg-red-200"
          >
            <CircleX />
            Cancelled
          </Badge>
        );

      default:
        return (
          <Badge variant="outline">
            <PackageOpen />
            Unknown
          </Badge>
        );
    }
  }

  const filteredOrders = useMemo(() => {
    if (activeFilter === "all") return orders;
    return orders.filter((order) => order.status === activeFilter);
  }, [orders, activeFilter]);

  return (
    <Tabs
      value={activeFilter}
      onValueChange={setActiveFilter}
      className="md:gap-5"
    >
      <TabsList>
        {orderFilters.map((filter) => (
          <TabsTrigger value={filter.value} key={filter.value}>
            {filter.icon} {filter.title}
          </TabsTrigger>
        ))}
      </TabsList>
      <TabsContent value={activeFilter}>
        <Accordion type="single" collapsible className="space-y-5">
          {filteredOrders.length ? (
            filteredOrders.map((order) => {
              const subtotal =
                order?.items?.reduce(
                  (acc, item) => acc + (item?.subtotal ?? 0),
                  0
                ) || 0;
              return (
                <AccordionItem
                  value={order?._id}
                  className="border-b-0"
                  key={order?._id}
                >
                  <AccordionTrigger className="border rounded-lg overflow-hidden bg-background px-4 py-3 md:p-4 items-center hoverEffect hover:no-underline hover:shadow-md hover:border-primary [&[data-state=open]]:hover:border-b-border [&[data-state=open]]:hover:shadow-none [&[data-state=open]]:rounded-b-none [&[data-state=open]]:border-t-primary [&[data-state=open]]:border-x-primary group">
                    <div className="flex-1 flex items-center justify-between">
                      <div>
                        <div className="flex md:items-center flex-col-reverse md:flex-row gap-1.5 md:gap-3">
                          <h3 className="font-medium text-lg text-gray-900">
                            {order?.orderNumber}
                          </h3>
                          {getStatusBadge(order?.status)}
                        </div>
                        <div className="font-normal text-sm">
                          <time
                            dateTime={formatRelativeDate(order?.createdAt)}
                            title={formatRelativeDate(order?.createdAt)}
                          >
                            {formatRelativeDate(order?.createdAt)}
                          </time>
                          <span className="mx-1">•</span>
                          <span>
                            {order?.items?.length} item
                            {order?.items?.length > 1 && "s"}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <span className="font-medium text-gray-900">
                          {priceFormatter(order?.total)}
                        </span>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="bg-background px-4 py-3 md:p-4 rounded-b-lg border border-t-0 border-primary">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-6">
                      <div className="space-y-3">
                        {order?.items.map((item) => (
                          <div
                            key={item?.sku}
                            className="flex items-center gap-3 border-b pb-2 last:border-none"
                          >
                            {item?.image && item?.variant ? (
                              <Image
                                src={urlFor(item?.image[0])
                                  .width(60)
                                  .height(75)
                                  .auto("format")
                                  .url()}
                                alt={item?.image[0]?.alt}
                                width={60}
                                height={75}
                                priority
                                className="rounded-md border object-cover"
                              />
                            ) : (
                              <Image
                                src={urlFor(item?.image)
                                  .width(60)
                                  .height(75)
                                  .auto("format")
                                  .url()}
                                alt={item?.image?.alt}
                                width={60}
                                height={75}
                                priority
                                className="rounded-md border object-cover"
                              />
                            )}
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium truncate">
                                {item?.name}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {item?.variant} {item?.variant && "•"} Qty{" "}
                                {item?.quantity}
                              </p>
                            </div>
                            <p className="text-sm font-semibold whitespace-nowrap">
                              {priceFormatter(item?.subtotal)}
                            </p>
                          </div>
                        ))}
                      </div>
                      <div className="space-y-3 border-t md:border-t-0 md:border-l pt-3 md:pt-0 md:pl-6">
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between gap-3">
                            <span>Items Total</span>
                            <span>{priceFormatter(subtotal)}</span>
                          </div>
                          <div className="flex justify-between gap-3">
                            <span>
                              Shipping ({order?.shipping?.rule?.name})
                            </span>
                            <span>
                              {order?.shipping.cost === 0
                                ? "Free"
                                : priceFormatter(order?.shipping?.cost)}
                            </span>
                          </div>
                          {order?.discount && (
                            <div className="flex justify-between gap-3 text-green-600">
                              <span>Discount ({order?.discount?.code})</span>
                              <span>
                                {order?.discount?.discountType === "percentage"
                                  ? "-" + order?.discount?.value + "%"
                                  : order?.discount?.discountType === "fixed"
                                    ? "-" +
                                      priceFormatter(order?.discount?.value)
                                    : "Free Shipping"}
                              </span>
                            </div>
                          )}
                          <Separator />
                          <div className="flex justify-between gap-3 font-semibold text-base">
                            <span>Total Paid</span>
                            <span>{priceFormatter(order?.total)}</span>
                          </div>

                          <Separator />

                          <div className="space-y-1">
                            <p>
                              <span className="text-muted-foreground">
                                Payment:
                              </span>{" "}
                              {order?.payment?.provider} (
                              {order?.payment?.status})
                            </p>
                            <p>
                              <span className="text-muted-foreground">
                                Shipping To:
                              </span>{" "}
                              {order?.shipping?.address?.line1},{" "}
                              {order?.shipping?.address?.city}
                            </p>
                            <p>
                              <span className="text-muted-foreground">
                                Estimated Delivery:
                              </span>{" "}
                              {order?.shipping?.rule?.deliveryTime}
                            </p>
                          </div>

                          <Separator className="my-3" />

                          <div
                            className={`grid gap-2 ${["cancelled", "shipped"].includes(order.status) ? "grid-cols-2" : "grid-cols-2 md:grid-cols-3"}`}
                          >
                            <Button>View Details</Button>

                            {order.status === "delivered" && (
                              <Button
                                variant="outline"
                                onClick={() => handleReorder(order.items)}
                              >
                                Buy Again
                              </Button>
                            )}

                            {["pending", "paid"].includes(order.status) && (
                              <Button
                                variant="destructive"
                                onClick={() => handleCancelOrder(order._id)}
                              >
                                Cancel Order
                              </Button>
                            )}

                            <Button
                              variant="outline"
                              className={
                                ["cancelled", "shipped"].includes(order.status)
                                  ? ""
                                  : "col-span-2 md:col-span-1"
                              }
                              asChild
                            >
                              <a href="/contact">Need Help?</a>
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              );
            })
          ) : (
            <p className="text-center text-muted-foreground py-4">
              No {activeFilter} orders found.
            </p>
          )}
        </Accordion>
      </TabsContent>
    </Tabs>
  );
};

export default OrderTabs;
