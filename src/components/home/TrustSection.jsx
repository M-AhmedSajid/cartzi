import React from "react";
import SectionHeading from "../SectionHeading";
import { RefreshCcw, Ruler, Shield, Truck } from "lucide-react";
const uspData = [
  {
    icon: <RefreshCcw size={20} />,
    title: "Free Returns",
    text: "30-day hassle-free returns",
  },
  {
    icon: <Truck size={20} />,
    title: "Fast Shipping",
    text: "3-5 day delivery nationwide",
  },
  {
    icon: <Shield size={20} />,
    title: "Secure Checkout",
    text: "Trusted payments & SSL secured",
  },
  {
    icon: <Ruler size={20} />,
    title: "Size Guide",
    text: "Find your perfect fit easily",
  },
];
const TrustSection = () => {
  return (
    <section>
      <SectionHeading
        title="Why Shop With Cartzi?"
        txt="Trusted quality, easy returns, fast delivery"
      />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
        {uspData.map((usp) => (
          <div
            key={usp.title}
            className="flex flex-col items-center gap-2 p-4 rounded-lg bg-card text-card-foreground shadow-md border hover:ring-primary hover:ring-2 hoverEffect cursor-default"
          >
            <div className="text-primary">{usp.icon}</div>
            <h3 className="font-medium">{usp.title}</h3>
            <p className="text-sm text-muted-foreground">{usp.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TrustSection;
