import { Outfit, Inter } from "next/font/google";
import "../globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { ClerkProvider } from "@clerk/nextjs";
import USPStrip from "@/components/layout/USPStrip";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const inter = Inter({
  subsets: ["latin"]
});

export const metadata = {
  title: "Cartzi | Ecommerce Clothing Shop",
  description: "Discover premium fashion handpicked for bold personalities.",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body suppressHydrationWarning
          className={`${outfit.variable} ${inter.className} antialiased`}
        >
          <USPStrip />
          <Header />
          {children}
          <Footer />
        </body>
      </html>
    </ClerkProvider>
  );
}
