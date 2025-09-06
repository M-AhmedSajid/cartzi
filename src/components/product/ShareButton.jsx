"use client";
import { useState } from "react";
import { Button } from "../ui/button";
import { Share } from "lucide-react";

export default function ShareButton({ productName, productUrl }) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: productName,
          text: `Check out this product from Cartzi: ${productName}`,
          url: productUrl,
        });
      } catch (error) {
        console.log("Share cancelled or failed", error);
      }
    } else {
      try {
        await navigator.clipboard.writeText(productUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error("Failed to copy link", err);
      }
    }
  };

  return (
    <Button variant="link" onClick={handleShare}>
      <Share className="inline-block mr-2" />
      <span>{copied ? "Link Copied!" : "Share"}</span>
    </Button>
  );
}
