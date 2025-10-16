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
    url: `${process.env.NEXT_PUBLIC_BASE_URL}/success`,
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
    <div className="py-5 md:py-10 flex items-center justify-center">
      <Suspense fallback={<p>Loading</p>}>
        <SuccessPage />
      </Suspense>
    </div>
  );
};

export default Success;
