import React from "react";

const FormattedPrice = ({price, discount}) => {
    const formattedPrice = new Number(price).toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 2,
      });
      const formattedDiscount = new Number(
        price + (price * discount) / 100
      ).toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 2,
      });
  return (
    <p>
      <span className="font-semibold text-foreground text-xl">
        {price && formattedPrice}
      </span>{" "}
      {price && discount && (
        <span className="line-through font-medium text-sm text-muted-foreground">
          {formattedDiscount}
        </span>
      )}
    </p>
  );
};

export default FormattedPrice;
