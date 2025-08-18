# Cartzi – Modern Fashion Ecommerce Platform

Cartzi is a premium, full-stack fashion ecommerce platform built with **Next.js 15**, **Sanity CMS**, and **shadcn/ui**.  
It delivers a modern shopping experience with elegant UI, advanced product galleries, seamless cart and wishlist actions, and a fashion-focused design system.  

⚠️ **Note**: This project is open-source for learning and inspiration. It is **not for commercial use** or resale.

---

## 📋 Table of Contents
- [✨ Overview](#-overview)
- [🚀 Features](#-features)
- [🖼️ Homepage Flow](#️-homepage-flow)
- [🛠️ Tech Stack](#️-tech-stack)
- [📁 Project Structure](#-project-structure)
- [🚀 Getting Started](#-getting-started)
- [📊 Data Management](#-data-management)
- [🎨 UI Components](#-ui-components)
- [🔧 Configuration](#-configuration)
- [🤝 Contributing](#-contributing)
- [📝 License](#-license)
- [📌 Notes](#-notes)
- [👨‍💻 Developed by](#️-developed-by)
- [⭐️ Show Support](#️-show-support)

---

## ✨ Overview

Cartzi blends **style, speed, and scalability**.  
It’s designed to look and feel like a high-end fashion store, while giving developers a clean architecture, headless CMS integration, and customizable components.

Key Highlights:
- Modern **bento grid homepage**
- Advanced **image gallery with lightbox + thumbnails**
- **Tab-based product filtering**
- **Sanity-powered product schema** with automatic discounting
- Secure **Clerk authentication**
- Premium design system (navy, beige, gold accents)

---

## 🚀 Features

### 🛍️ Shopping Experience
- Featured product carousel in hero
- Bento grid category showcase (Men, Women, Kids, Accessories)
- Tab-based product filtering (T-shirts, Jackets, Pants, Hoodies, Shorts)
- Smart cart & wishlist management
- Size & color variations
- Shipping & returns info, size guides, and product sharing options

### 🖼️ Product Galleries
- Embla carousel with swipe support
- Lightbox mode with smooth framer-motion animations
- Thumbnail navigation with active indicators
- Optimized images via Next.js & Sanity
- Wishlist integration (heart button)

### 📦 Content & Backend
- **Sanity CMS** for products, categories, and content pages
- Automatic discount calculation inside Sanity Studio
- Rich schema with inventory, SEO slugs, variants
- Ready-to-use About, Contact, FAQ, Shipping/Returns, and Policy pages

### 👨‍💻 Developer Experience
- TypeScript, ESLint, Turbopack
- Hydration-safe components
- Modular architecture with shadcn/ui
- Custom Aurora hero background
- Reusable design tokens and theming

---

## 🖼️ Homepage Flow

The homepage is structured like a professional fashion brand:

1. **Hero Section** – Featured products carousel + CTA  
2. **Featured Collections** – Bento grid with Men, Women, Kids, Accessories  
3. **Trending Now** – Bestsellers carousel or grid with ratings  
4. **Seasonal Campaign Banner** – Highlight new arrivals or sales  
5. **Brand Story** – Short “About Us” blurb  
6. **Trust Section** – Reviews, shipping/returns badges, payment icons  
7. **Newsletter Signup** – Quick email subscription field  
8. **Instagram/Lookbook Feed** (optional)  
9. **Footer** – Logo, short About, quick links, policies, newsletter, socials  

---

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)  
- **CMS**: Sanity v4  
- **UI**: Tailwind CSS v4, shadcn/ui, Radix UI, Lucide Icons  
- **State**: Zustand  
- **Auth**: Clerk  
- **Payments**: Stripe  
- **Animations**: Framer Motion  
- **Carousel**: Embla  
- **Notifications**: Sonner  

---

## 📁 Project Structure

```
cartzi/
├── src/
│   ├── app/
│   │   ├── (client)/          # Client-side routes
│   │   │   ├── layout.js      # Root layout with hydration handling
│   │   │   ├── page.js        # Home page
│   │   │   └── (user)/        # User-facing pages
│   │   │       ├── about/     # About Us page
│   │   │       ├── contact/   # Contact Us page
│   │   │       ├── faqs/      # FAQs page
│   │   │       ├── privacy-policy/ # Privacy Policy page
│   │   │       ├── shipping-returns/ # Shipping & Returns page
│   │   │       └── terms-and-conditions/ # Terms & Conditions page
│   │   ├── studio/            # Sanity Studio routes
│   │   └── globals.css        # Global styles with fashion color scheme
│   ├── components/
│   │   ├── ui/                # shadcn/ui components
│   │   │   ├── button.jsx     # Button component
│   │   │   ├── card.jsx       # Card component
│   │   │   ├── skeleton.jsx   # Skeleton component
│   │   │   ├── hero-bg.jsx    # Animated hero background
│   │   │   ├── accordion.jsx  # Accordion component for FAQs
│   │   │   ├── input.jsx      # Input component
│   │   │   ├── textarea.jsx   # Textarea component
│   │   │   ├── carousel.jsx   # Embla carousel component
│   │   │   └── ...            # Other UI components
│   │   ├── Header.jsx         # Main header with navigation
│   │   ├── Footer.jsx         # Footer component with quick links
│   │   ├── HomeBanner.jsx     # Homepage banner
│   │   ├── CartIcon.jsx       # Shopping cart icon
│   │   ├── SearchBar.jsx      # Search functionality
│   │   ├── ProductGrid.jsx    # Tab-based product filtering
│   │   ├── ProductCard.jsx    # Individual product display
│   │   ├── SkelectonCard.jsx  # Enhanced loading skeleton
│   │   ├── NoProducts.jsx     # Improved empty state component
│   │   ├── ImageGallery.jsx   # Advanced image gallery with lightbox
│   │   ├── ProductActions.jsx # Product actions (cart, wishlist)
│   │   └── ...                # Other components
│   ├── sanity/
│   │   ├── env.js             # Sanity configuration
│   │   ├── schemaTypes/       # Content schemas
│   │   │   ├── productType.js # Product schema with discount calculation
│   │   │   └── categoryType.js # Category schema
│   │   └── structure.js       # Studio structure
│   └── lib/                   # Utility functions
├── constants/
│   └── index.jsx              # App constants (quickLinks, categories, FAQs)
├── public/                    # Static assets
├── sanity.config.js           # Sanity configuration
├── next.config.mjs            # Next.js configuration
└── package.json               # Dependencies
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Sanity & Clerk accounts

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd cartzi
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_key
   CLERK_SECRET_KEY=your_clerk_secret
   NEXT_PUBLIC_SANITY_PROJECT_ID=your_sanity_project_id
   NEXT_PUBLIC_SANITY_DATASET=production
   SANITY_API_TOKEN=your_sanity_token
   ```

4. **Sanity Setup**
   ```bash
   # Initialize Sanity (if not already done)
   npx sanity init
   
   # Start development server
   npm run dev
   # Visit http://localhost:3000/studio
   ```

5. **Import Sample Data**
   ```bash
   # Convert JSON to NDJSON format and import
   npx sanity dataset import products.json production
   ```

### Development

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint
```

## 📊 Data Management

### Product Schema
The project includes a comprehensive fashion product schema with:
- Name, description, price
- Sanity image fields
- Categories (Men, Women, Kids, Accessories)
- Sizes (XS, S, M, L, XL, XXL)
- Colors (selectable swatches)
- Inventory tracking
- SEO-friendly slugs
- Automatic discount calculation

## 🎨 UI Components

### Core Components
- **Header**: Navigation with search and cart
- **Footer**: Site information and quick links (About, Contact, Terms, Privacy, Shipping, FAQs)
- **HomeBanner**: Hero section for homepage
- **HeroBg**: Animated background component with framer-motion
- **CartIcon**: Shopping cart indicator
- **SearchBar**: Product search functionality
- **MobileMenu**: Responsive mobile navigation
- **ProductGrid**: Tab-based product filtering with dynamic loading
- **ProductCard**: Individual product display with image, price, and details
- **SkeletonCard**: Enhanced loading skeleton matching product card structure
- **NoProducts**: Improved empty state component with shadcn/ui integration

### Advanced Image Gallery
- **ImageGallery**: Interactive product image viewer with:
  - Smooth carousel navigation
  - Full-screen lightbox mode
  - Thumbnail navigation with active states
  - Smooth animations using Framer Motion
  - Wishlist integration (heart button)
  - Responsive design for all devices

### Product Actions
- **ProductActions**: Product interaction components:
  - Add to Cart button
  - Wishlist button (heart icon)
  - Quantity management
  - Price calculations

### Newly Added Pages
- **AboutPage**: Company information and mission
- **ContactPage**: Contact form with business details
- **FAQsPage**: Interactive FAQ section with accordion
- **PrivacyPolicyPage**: Privacy policy and data handling
- **ShippingReturnsPage**: Shipping information and return policies
- **TermsConditionsPage**: Terms of service and conditions

### Design System
- **Color Scheme**: Navy primary, beige secondary, coral accent
- **Typography**: Clean, readable fonts
- **Spacing**: Consistent spacing system
- **Animations**: Smooth hover effects and transitions
- **Aurora Effects**: Custom CSS animations and gradient backgrounds
- **shadcn/ui Integration**: Modern, accessible component library

## 🔧 Configuration

### Sanity Configuration
- **Project ID**: `your_project_id`
- **Dataset**: `your_dataset`
- **API Version**: Latest
- **Studio Path**: `/studio`
- **Custom Input Components**: Enhanced form fields for better UX

### Next.js Configuration
- **App Router**: Enabled
- **Turbopack**: Development optimization
- **Image Optimization**: Next.js Image component
- **Hydration Handling**: Browser extension compatibility

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.
⚠️ Not for commercial use or resale.

## 📌 Notes

- This project is open-source but meant for educational or inspirational use.
- Do **not** directly copy personal content or assets without permission.

---

## 👨‍💻 Developed by

**M. Ahmed Sajid**  
Full Stack Developer 💻 | 3+ Yrs Helping Startups, Brands & Agencies Build Fast, Scalable Websites | Join 1.3k+ for Dev Tips & Tools
🌐 [Visit My Portfolio](https://ahmed-sajid.web.app)

---

## ⭐️ Show Support

If you like this project:

- 🌟 Star the repo  
- 🔁 Share it with friends  
- 💬 Give feedback or suggest improvements!
