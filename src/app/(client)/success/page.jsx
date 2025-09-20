import { Suspense } from "react";
import SuccessPage from "./SuccessPage";

export const metadata = {
  title: "Order Successful | Cartzi",
  description:
    "Thank you for shopping with Cartzi! Your order has been placed successfully. We'll send you a confirmation email with the details shortly.",
  openGraph: {
    title: "Order Successful | Cartzi",
    description:
      "Your order was placed successfully at Cartzi. Track your order and enjoy fast shipping with free returns.",
    url: "https://cartzi.vercel.app/success",
    siteName: "Cartzi",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Order Successful | Cartzi",
    description:
      "Your Cartzi order has been placed successfully. Thank you for trusting us!",
  },
};

const Success = () => {
  return (
    <div className="py-10 md:py-20 flex items-center justify-center">
      <Suspense fallback={<p>Loading</p>}>
        <SuccessPage />
      </Suspense>
    </div>
  );
};

export default Success;
