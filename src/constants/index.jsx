import {
  Archive,
  CircleCheck,
  CircleX,
  Clock,
  Facebook,
  Github,
  Instagram,
  Linkedin,
  Loader2,
  PackageOpen,
  Truck,
} from "lucide-react";

export const headerData = [
  { title: "Home", href: "/" },
  { title: "Men", href: "/men" },
  { title: "Women", href: "/women" },
  { title: "Kids", href: "/kids" },
  { title: "New", href: "/new" },
  { title: "Featured", href: "/featured" },
  { title: "Gift", href: "/gift" },
];

export const socialLinks = [
  { title: "Facebook", href: "/", icon: <Facebook className="size-5" /> },
  { title: "Instagram", href: "/", icon: <Instagram className="size-5" /> },
  { title: "Linkedin", href: "/", icon: <Linkedin className="size-5" /> },
  { title: "Github", href: "/", icon: <Github className="size-5" /> },
];

export const productType = [
  { title: "T-Shirts" },
  { title: "Jacket" },
  { title: "Pants" },
  { title: "Hoodie" },
  { title: "Short" },
];

export const quickLinks = [
  { title: "About us", href: "/about" },
  { title: "Contact us", href: "/contact" },
  { title: "Terms & Conditions", href: "/terms-and-conditions" },
  { title: "Privacy Policy", href: "/privacy-policy" },
  { title: "Shipping & Returns", href: "/shipping-returns" },
  { title: "FAQs", href: "/faqs" },
];

export const categoriesData = [
  { title: "Men", href: "/men" },
  { title: "Women", href: "/women" },
  { title: "Kids", href: "/kids" },
  { title: "Accessories", href: "/accessories" },
  { title: "New Arrivals", href: "/new" },
  { title: "Featured", href: "/featured" },
  { title: "Gift", href: "/gift" },
];

export const faqs = [
  {
    question: "How do I place an order?",
    answer:
      "Placing an order is easy! Simply browse our collection, select your desired items, add them to your cart, and proceed to checkout. You'll need to create an account or sign in, provide shipping and billing information, and complete your payment.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We accept all major credit cards (Visa, MasterCard, American Express, Discover), PayPal, and Apple Pay. All payments are processed securely through our payment partners.",
  },
  {
    question: "How long does shipping take?",
    answer:
      "Shipping times vary by location and method chosen. Standard shipping typically takes 5-7 business days, express shipping takes 2-3 business days, and overnight shipping delivers the next business day. Free shipping is available on orders over $75.",
  },
  {
    question: "Can I return or exchange items?",
    answer:
      "Yes! Most items can be returned within 30 days of delivery for a full refund or exchange. Items must be unworn, unwashed, and in original condition with all tags attached. Please see our Returns & Exchanges page for complete details.",
  },
  {
    question: "Do you ship internationally?",
    answer:
      "Yes, we currently ship to the United States, Canada, United Kingdom, European Union countries, Australia, and New Zealand. International shipping rates and delivery times vary by location.",
  },
  {
    question: "How do I track my order?",
    answer:
      "Once your order ships, you'll receive a confirmation email with tracking information. You can also track your order through your account dashboard by logging into your Cartzi account.",
  },
  {
    question: "What if my item arrives damaged or defective?",
    answer:
      "If your item arrives damaged or defective, please contact our customer service team immediately. We'll arrange for a replacement or refund at no additional cost to you.",
  },
  {
    question: "Do you offer size recommendations?",
    answer:
      "Yes! Each product page includes a size guide with detailed measurements. We recommend measuring yourself and comparing with our size chart to find the best fit. If you're between sizes, we typically recommend sizing up.",
  },
  {
    question: "Can I cancel my order after it's placed?",
    answer:
      "Orders can typically be cancelled within 2 hours of placement if they haven't been processed for shipping. After that, the order will need to be returned once received. Please contact our customer service team for assistance.",
  },
  {
    question: "Do you offer gift wrapping?",
    answer:
      "Yes! We offer gift wrapping services for an additional $5.99 per order. Gift-wrapped items come in beautiful packaging with a personalized message card.",
  },
  {
    question: "How do I care for my clothing?",
    answer:
      "Care instructions are provided on the care label of each garment. We recommend following these instructions to maintain the quality and longevity of your clothing. Most items can be machine washed on gentle cycles.",
  },
  {
    question: "Do you have a loyalty program?",
    answer:
      "Yes! Our Cartzi Rewards program allows you to earn points on every purchase. Points can be redeemed for discounts on future orders. Sign up is free and automatic when you create an account.",
  },
  {
    question: "What if I'm not satisfied with my purchase?",
    answer:
      "We want you to love your purchase! If you're not completely satisfied, please contact our customer service team. We're committed to resolving any issues and ensuring your satisfaction with our products and service.",
  },
  {
    question: "Do you offer student discounts?",
    answer:
      "Yes! Students with a valid .edu email address can receive a 10% discount on their first order. Please contact our customer service team to verify your student status and receive your discount code.",
  },
  {
    question: "How do I contact customer service?",
    answer:
      "Our customer service team is available Monday through Friday, 9:00 AM to 6:00 PM EST. You can reach us by email at support@cartzi.vercel.app, by phone at +1 (555) 123-4567, or through the contact form on our website.",
  },
];

export const usps = [
  { text: "Free Returns" },
  { text: "3-5 Day Delivery" },
  { text: "Secure Checkout" },
];

export const orderFilters = [
  { title: "All", value: "all", icon: <PackageOpen /> },
  { title: "Processing", value: "paid", icon: <Clock /> },
  { title: "Shipped", value: "shipped", icon: <Truck /> },
  { title: "Delivered", value: "delivered", icon: <CircleCheck /> },
  { title: "Pending", value: "pending", icon: <Loader2 className="animate-spin animation-duration-[3s]" /> },
  { title: "Cancelled", value: "cancelled", icon: <CircleX /> },
];
