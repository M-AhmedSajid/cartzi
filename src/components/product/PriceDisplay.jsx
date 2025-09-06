const sizeMap = {
  "text-2xl": "text-base",
  "text-xl": "text-sm",
  "text-lg": "text-xs",
  "text-base": "text-xs",
  "text-sm": "text-xs", // fallback
};

function PriceDisplay({ size = "text-xl", product, variant }) {
  const baseSize = sizeMap[size] || "text-sm";

  const basePrice = variant?.priceOverride ?? product?.price;
  const discount = product?.discount ?? 0;

  const discountedPrice = basePrice - (basePrice * discount) / 100;

  const priceFormatter = function (amount) {
    const formattedPrice = new Number(amount).toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    });
    return formattedPrice;
  };

  return (
    <p>
      <span className={`font-bold text-foreground ${size}`}>
        {priceFormatter(discountedPrice)}
      </span>{" "}
      {basePrice && discount !== 0 && (
        <span
          className={`line-through font-semibold text-muted-foreground ${baseSize}`}
        >
          {priceFormatter(basePrice)}
        </span>
      )}
    </p>
  );
}

export default PriceDisplay;