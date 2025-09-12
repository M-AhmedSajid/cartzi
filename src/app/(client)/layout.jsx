import localFont from "next/font/local";
import "../globals.css";
import Header from "@/components/layout/Header/Header";
import Footer from "@/components/layout/Footer";
import { ClerkProvider } from "@clerk/nextjs";
import USPStrip from "@/components/layout/USPStrip";
import { Toaster } from "sonner";

const outfit = localFont({
  src: "../fonts/outfit.ttf",
  display: "swap",
  variable: "--font-outfit",
});

const manrope = localFont({
  src: "../fonts/manrope.ttf",
  display: "swap",
  variable: "--font-manrope",
});

export const metadata = {
  title: "Cartzi | Ecommerce Clothing Shop",
  description: "Discover premium fashion handpicked for bold personalities.",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body
          suppressHydrationWarning
          className={`${outfit.variable} ${manrope.variable} ${manrope.className} antialiased`}
        >
          <USPStrip />
          <Header />
          {children}
          <Footer />
          <Toaster position="bottom-right" richColors />
        </body>
      </html>
    </ClerkProvider>
  );
}
