import Container from "@/components/Container";
import React from "react";

const AboutPage = () => {
  return (
    <Container className="py-10">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-foreground mb-6">About Us</h1>
        <div className="prose prose-lg max-w-none">
          <p className="text-lg text-muted-foreground mb-6">
            Welcome to Cartzi, your premier destination for handpicked clothing and accessories that blend style, comfort, and quality.
          </p>
          <p className="text-muted-foreground mb-6">
            At Cartzi, we believe that fashion is more than just clothing—it's a way to express your unique personality and boost your confidence. Our carefully curated collection features pieces that are not only stylish but also comfortable and durable.
          </p>
          <p className="text-muted-foreground mb-6">
            We work with trusted designers and brands to bring you the latest trends while maintaining our commitment to quality. Every item in our collection is selected with care, ensuring that you can wear confidence every day.
          </p>
          <p className="text-muted-foreground">
            Thank you for choosing Cartzi as your fashion partner. We're excited to help you discover your perfect style and feel amazing in everything you wear.
          </p>
        </div>
      </div>
    </Container>
  );
};

export default AboutPage;
