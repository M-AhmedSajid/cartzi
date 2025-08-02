import { useEffect } from "react";
import { useFormValue, set } from "sanity";

export default function DiscountedPriceInput({ value, onChange }) {
  const price = useFormValue(["price"]);
  const discount = useFormValue(["discount"]);

  useEffect(() => {
    if (typeof price === "number" && typeof discount === "number") {
      const calculated = price - (price * discount) / 100;
      onChange(set(Number(calculated.toFixed(2))));
    }
  }, [price, discount, onChange]);

  return (
    <p className="culjtj" data-scheme="dark" data-tone="default" style={{border: "1px solid #555c75"}}>
      ${value || 0}
    </p>
  );
}
