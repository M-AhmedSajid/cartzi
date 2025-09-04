import { usps } from "@/constants";
import React from "react";

const USPStrip = () => {
  return (
    <div className="bg-primary text-primary-foreground text-xs flex justify-center gap-4 py-2 px-2">
      {usps.map((usp, i) => (
        <span key={i}>{usp.text}</span>
      ))}
    </div>
  );
};

export default USPStrip;
