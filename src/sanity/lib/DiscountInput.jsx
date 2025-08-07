import { useEffect } from "react";
import { useFormValue } from "sanity";

export default function DiscountedPriceInput({ value }) {
  const price = useFormValue(["price"]);
  const discount = useFormValue(["discount"]);

  const calculatedPrice = (() => {
    if (typeof price === "number" && typeof discount === "number") {
      return price - (price * discount) / 100;
    }
    return 0;
  })();

  return (
    <p className="culjtj" data-scheme="dark" data-tone="default" style={{border: "1px solid #555c75"}}>
      ${calculatedPrice.toFixed(2)}
    </p>
  );
}
