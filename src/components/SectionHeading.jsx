import React from "react";
import Title from "./Title";

const SectionHeading = ({ title, txt }) => {
  return (
    <div className="text-center mb-6 md:mb-10">
      <Title>{title}</Title>
      <p className="text-sm">{txt}</p>
    </div>
  );
};

export default SectionHeading;
