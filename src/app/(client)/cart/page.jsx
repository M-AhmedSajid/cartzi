import CartPage from "./CartPage";

export const metadata = {
  title: "Your Shopping Cart | Cartzi",
  description:
    "Review your Cartzi items before checkout. Fast, secure checkout with free returns and reliable shipping.",
  robots: {
    index: false,
    follow: true,
  },
  openGraph: {
    title: "Shopping Cart | Cartzi",
    description:
      "See your selected Cartzi products and checkout securely with free returns & fast shipping.",
    url: `${process.env.NEXT_PUBLIC_BASE_URL}/cart`,
    siteName: "Cartzi",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Cartzi Shopping Cart",
    description: "Review your items and checkout securely on Cartzi.",
  },
};

const Cart = () => {
  return (
    <div className="max-w-screen-xl mx-auto py-5 md:py-10 px-4">
      <CartPage />
    </div>
  );
};

export default Cart;
