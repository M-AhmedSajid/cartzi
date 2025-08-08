import React from "react";

const PriceFormatter = ({ amount }) => {
  const formattedPrice = new Number(amount).toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  });
  return formattedPrice;
};

export default PriceFormatter;
