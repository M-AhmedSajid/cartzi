import { urlFor } from "@/sanity/lib/image";
import jsPDF from "jspdf";
import { dateFormatter, priceFormatter } from ".";

async function getBase64FromUrl(url) {
    const response = await fetch(url);
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
}

export async function generateInvoice(order) {
    const doc = new jsPDF({ unit: "pt", format: "a4" });
    const pageWidth = doc.internal.pageSize.getWidth();
    console.log(order);

    // Fonts & Colors
    const primary = "#1e2f41";
    const black = "#0d0d0d";
    const gray = "#5d5446";
    const green = "#00a63e";

    let y = 60;

    // Header
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.setTextColor(primary);
    doc.text("CARTZI", 40, y);
    y += 40;

    // Order Info
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text(`Order #${order.orderNumber}`, 40, y);
    doc.setTextColor(black);
    doc.setFont("helvetica", "normal");
    y += 16;
    doc.text(`Placed on ${dateFormatter(order.createdAt)}`, 40, y);
    y += 14;
    doc.text(`Status: ${order.status.toUpperCase()}`, 40, y);

    // Payment Info
    const rightX = pageWidth - 200;
    y = 100;
    doc.setFont("helvetica", "normal");
    doc.text(`Payment: ${order.payment.provider}: (${order.payment.status})`, rightX, y);
    y += 14;
    doc.text(`Delivery: ${order.shipping.rule.deliveryTime}`, rightX, y);

    y = 160;
    doc.setFont("helvetica", "bold");
    doc.setTextColor(primary);
    doc.text("Customer Details", 40, y);
    doc.setFont("helvetica", "normal");
    y += 16;
    doc.setTextColor(black);
    doc.text(`Name: ${order.customer.accountName ?? order.customer.shippingName ?? "N/A"}`, 40, y);
    y += 14;
    doc.text(`Email: ${order.customer.email ?? "N/A"}`, 40, y);

    y = 220;
    doc.setFont("helvetica", "bold");
    doc.setTextColor(primary);
    doc.text("Shipping Address", 40, y);
    doc.setFont("helvetica", "normal");
    y += 16;
    doc.setTextColor(black);
    doc.text(`Line 1: ${order.shipping.address.line1}`, 40, y);
    y += 14;
    if (order.shipping.address.line2) {
        doc.text(`Line 2: ${order.shipping.address.line2}`, 40, y);
        y += 14;
    }
    doc.text(`City: ${order.shipping.address.city}, Postal Code: ${order.shipping.address.postalCode}`, 40, y);
    y += 14;
    doc.text(`${order.shipping.address.state === null ? "" : "State: " + order.shipping.address.state + " "}Country: ${order.shipping.address.country}`, 40, y);

    // Divider line
    y += 20;
    doc.setDrawColor(200);
    doc.line(40, y, pageWidth - 40, y);
    y += 30;

    // Table Header
    doc.setFont("helvetica", "bold");
    doc.text("Item", 40, y);
    doc.text("Qty", pageWidth - 135, y);
    doc.text("Subtotal", pageWidth - 40, y, { align: "right" });

    y += 10;
    doc.setDrawColor("#d7d7d7");
    doc.line(40, y, pageWidth - 40, y);
    y += 40;

    // Items
    for (const item of order.items) {
        // Image
        if (item.image) {
            try {
                const imageBase64 = await getBase64FromUrl(urlFor(item?.image[0] || item?.image)
                    .width(50)
                    .height(67)
                    .auto("format")
                    .url());
                doc.addImage(imageBase64, "JPEG", 40, y - 33.335, 50, 66.67);
            } catch (e) {
                console.warn("Image failed", e);
            }
        }

        // Item name
        doc.setFont("helvetica", "normal");
        doc.text(item.name, 100, y);
        doc.setFontSize(10);
        y += 12;
        if (item.variant) {
            doc.setTextColor(gray);
            doc.text(item.variant, 100, y);
        }
        doc.setTextColor(black);
        doc.setFontSize(12);

        // Qty + Price
        doc.text(String(item.quantity), pageWidth - 130, y - 10);
        doc.text(priceFormatter(item.subtotal), pageWidth - 40, y - 10, { align: "right" });

        y += 30;
        doc.setDrawColor("#d7d7d7");
        doc.line(40, y, pageWidth - 40, y);
        
        y += 40;
        if (y > doc.internal.pageSize.getHeight() - 100) {
            doc.addPage();
            y = 60;
        }
    }

    const summaryX = pageWidth - 40;

    const subtotal = order.items.reduce((s, i) => s + (i.subtotal ?? 0), 0);
    doc.setFont("helvetica", "normal");
    doc.text("Items Total", 40, y);
    doc.text(priceFormatter(subtotal), summaryX, y, { align: "right" });
    y += 20;

    const shipping = order.shipping?.cost ?? 0;
    doc.text(`Shipping (${order.shipping.rule.name})`, 40, y);
    doc.text(shipping === 0 ? "Free" : priceFormatter(shipping), summaryX, y, { align: "right" });
    y += 20;

    const discount = order.discount?.discountType === "percentage"
        ? (subtotal * (order.discount.value ?? 0)) / 100
        : order.discount?.discountType === "fixed"
            ? order.discount.value
            : 0;
    doc.setTextColor(green);
    doc.text(`Discount (${order.discount?.code})`, 40, y);
    doc.text(`-${priceFormatter(discount)}`, summaryX, y, { align: "right" });
    doc.setTextColor(black);

    y += 30;
    doc.setFont("helvetica", "bold");
    doc.text("Total Paid", 40, y);
    doc.text(priceFormatter(order.total), summaryX, y, { align: "right" });

    // Footer
    y += 80;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(gray);
    doc.text("Thank you for shopping with Cartzi!", pageWidth / 2, y, { align: "center" });
    y += 14;
    doc.setTextColor(primary);
    doc.text("cartzi.vercel.app", pageWidth / 2, y, { align: "center" });
    y += 25;
    doc.setFontSize(8);
    doc.setTextColor(gray);
    doc.text(
        "All items are subject to Cartzi's return policy. Visit cartzi.vercel.app/shipping-returns for details.",
        pageWidth / 2,
        y,
        { align: "center" }
    );

    doc.save(`Cartzi_Invoice_${order.orderNumber}.pdf`);
}
