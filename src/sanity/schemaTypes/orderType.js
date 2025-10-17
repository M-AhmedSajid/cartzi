import { defineType, defineField } from "sanity";
import { Receipt } from "lucide-react";

export const orderType = defineType({
    name: "order",
    title: "Order",
    type: "document",
    icon: Receipt,
    fields: [
        defineField({
            name: "orderNumber",
            title: "Order Number",
            type: "string",
            readOnly: true,
        }),
        defineField({
            name: "customer",
            title: "Customer",
            type: "object",
            fields: [
                { name: "accountName", title: "Account Name", type: "string" },
                { name: "shippingName", title: "Shipping Name", type: "string" },
                { name: "email", title: "Email", type: "string" },
                { name: "clerkUserId", title: "Clerk User ID", type: "string" },
            ],
        }),
        defineField({
            name: "items",
            title: "Order Items",
            type: "array",
            of: [
                {
                    type: "object",
                    fields: [
                        { name: "product", title: "Product", type: "reference", to: [{ type: "product" }] },
                        { name: "name", title: "Name", type: "string" },
                        { name: "sku", title: "SKU", type: "string" },
                        { name: "variant", title: "Variant", type: "string" }, // color/size text
                        { name: "quantity", title: "Quantity", type: "number" },
                        { name: "price", title: "Unit Price", type: "number" },
                        { name: "subtotal", title: "Subtotal", type: "number" },
                    ],
                },
            ],
            preview: {
                select: {
                    product: "product.name",
                    quantity: "quantity",
                    image: "product.image",
                    price: "product.price",
                },
                prepare({ product, quantity, image, price }) {
                    return {
                        title: `${product} x ${quantity}`,
                        subtitle: `${price * quantity}`,
                        media: `${image}`,
                    };
                },
            },
        }),
        defineField({
            name: "shipping",
            title: "Shipping",
            type: "object",
            fields: [
                { name: "rule", title: "Rule", type: "reference", to: [{ type: "shippingRule" }] },
                {
                    name: "address", title: "Address", type: "object",
                    fields: [
                        { name: "line1", type: "string" },
                        { name: "line2", type: "string" },
                        { name: "city", type: "string" },
                        { name: "state", type: "string" },
                        { name: "postalCode", type: "string" },
                        { name: "country", type: "string" },
                    ],
                },
                { name: "cost", title: "Shipping Cost", type: "number" },
            ],
        }),
        defineField({
            name: "discount",
            title: "Discount",
            type: "reference",
            to: [{ type: "discountCode" }],
        }),
        defineField({
            name: "total",
            title: "Total Amount",
            type: "number",
        }),
        defineField({
            name: "status",
            title: "Status",
            type: "string",
            options: {
                list: [
                    { title: "Pending", value: "pending" },
                    { title: "Paid", value: "paid" },
                    { title: "Shipped", value: "shipped" },
                    { title: "Delivered", value: "delivered" },
                    { title: "Cancelled", value: "cancelled" },
                ],
                layout: "radio",
            },
            initialValue: "pending",
        }),
        defineField({
            name: "cancelledAt",
            title: "Cancelled At",
            type: "datetime",
            readOnly: true,
            hidden: ({ parent }) => parent?.status !== "cancelled",
        }),
        defineField({
            name: "payment",
            title: "Payment",
            type: "object",
            fields: [
                { name: "provider", title: "Provider", type: "string" }, // e.g. Stripe
                { name: "sessionId", title: "Checkout Session ID", type: "string" },
                { name: "paymentIntentId", title: "Payment Intent ID", type: "string" },
                { name: "status", title: "Payment Status", type: "string" },
            ],
        }),
        defineField({
            name: "createdAt",
            title: "Created At",
            type: "datetime",
            initialValue: () => new Date().toISOString(),
        }),
    ],
    preview: {
        select: {
            title: "orderNumber",
            subtitle: "status",
            shippingName: "customer.shippingName",
            accountName: "customer.accountName",
        },
        prepare({ title, subtitle, shippingName, accountName }) {
            return {
                title: title || "Order",
                subtitle: `${subtitle} • ${shippingName || accountName || "Guest"}`,
            };
        },
    },
});
