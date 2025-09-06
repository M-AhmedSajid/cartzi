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
It's designed to look and feel like a high-end fashion store, while giving developers a clean architecture, headless CMS integration, and customizable components.

Key Highlights:
- Modern **bento grid homepage**
- Advanced **image gallery with lightbox + thumbnails**
- **Tab-based product filtering**
- **Real-time search dialog** with comprehensive product filtering
- **Sanity-powered product schema** with automatic discounting
- Secure **Clerk authentication**
- Premium design system (navy, beige, gold accents)
- **Enhanced data management** with image prompts and organized assets

---

## 🚀 Features

### 🛍️ Shopping Experience
- **Featured Products Section** – "Hot Right Now" with responsive carousel and grid layout
- Bento grid category showcase (Men, Women, Kids, Accessories)
- Tab-based product filtering (T-shirts, Jackets, Pants, Hoodies, Shorts)
- **Advanced search dialog** with real-time product filtering
- **Zustand-powered cart system** with persistent storage
- Smart cart & wishlist management with stock validation
- Size & color variations with variant-specific pricing
- Shipping & returns info, size guides, and product sharing options

### 🖼️ Product Galleries
- Embla carousel with swipe support
- Lightbox mode with smooth framer-motion animations
- Thumbnail navigation with active indicators
- Optimized images via Next.js & Sanity
- Wishlist integration (heart button)
- **Enhanced image prompts system** for better content management

### 📦 Content & Backend
- **Sanity CMS** for products, categories, and content pages
- Automatic discount calculation inside Sanity Studio
- Rich schema with inventory, SEO slugs, variants
- Ready-to-use About, Contact, FAQ, Shipping/Returns, and Policy pages
- **Organized data structure** with NDJSON format for easy imports

### 👨‍💻 Developer Experience
- TypeScript, ESLint, Turbopack
- Hydration-safe components
- Modular architecture with shadcn/ui
- Custom Aurora hero background
- Reusable design tokens and theming
- **Restructured component organization** for better maintainability

---

## 🖼️ Homepage Flow

The homepage is structured like a professional fashion brand:

1. **Hero Section** – Dynamic hero with call-to-action  
2. **Featured Products** – "Hot Right Now" section with responsive carousel (mobile) and grid layout (desktop)    
8. **Newsletter Signup** – Quick email subscription field  
10. **Footer** – Logo, short About, quick links, policies, newsletter, socials  

---

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)  
- **CMS**: Sanity v4  
- **UI**: Tailwind CSS v4, shadcn/ui, Radix UI, Lucide Icons  
- **State**: Zustand (with persistent cart storage)  
- **Auth**: Clerk  
- **Payments**: Stripe  
- **Animations**: Framer Motion  
- **Carousel**: Embla  
- **Notifications**: Sonner  
- **Styling**: Styled Components (for advanced styling needs)

---

## 📁 Project Structure

```
cartzi/
├── src/
│   ├── app/
│   │   ├── (client)/          # Client-side routes
│   │   │   ├── layout.js      # Root layout with hydration handling
│   │   │   ├── page.js        # Home page
│   │   │   ├── (user)/        # User-facing pages
│   │   │   │   ├── about/     # About Us page
│   │   │   │   ├── contact/   # Contact Us page
│   │   │   │   ├── faqs/      # FAQs page
│   │   │   │   ├── privacy-policy/ # Privacy Policy page
│   │   │   │   ├── shipping-returns/ # Shipping & Returns page
│   │   │   │   └── terms-and-conditions/ # Terms & Conditions page
│   │   │   └── product/       # Product pages
│   │   │       └── [slug]/    # Dynamic product routes
│   │   ├── studio/            # Sanity Studio routes
│   │   └── globals.css        # Global styles with fashion color scheme
│   ├── components/
│   │   ├── layout/            # Layout components (reorganized)
│   │   │   ├── Header/        # Header components directory
│   │   │   │   ├── Header.jsx     # Main header with navigation
│   │   │   │   ├── HeaderMenu.jsx # Header menu component
│   │   │   │   ├── MobileMenu.jsx # Mobile navigation
│   │   │   │   └── Sidebar.jsx    # Sidebar component
│   │   │   ├── Footer.jsx     # Footer component with quick links
│   │   │   ├── Container.jsx  # Container wrapper component
│   │   │   ├── Logo.jsx       # Logo component
│   │   │   └── USPStrip.jsx   # Unique selling proposition strip
│   │   ├── home/              # Homepage-specific components
│   │   │   ├── HeroSection.jsx # Hero section component
│   │   │   └── FeaturedProducts.jsx # Featured products section
│   │   ├── product/           # Product-related components (reorganized)
│   │   │   ├── ProductCard.jsx # Individual product display
│   │   │   ├── ProductGrid.jsx # Tab-based product filtering
│   │   │   ├── ProductDetails.jsx # Detailed product view
│   │   │   ├── ProductActions.jsx # Product actions (cart, wishlist)
│   │   │   ├── ImageGallery.jsx # Advanced image gallery with lightbox
│   │   │   ├── VariantsSelection.jsx # Size & color selection
│   │   │   ├── QuantityButtons.jsx # Quantity management
│   │   │   ├── ProductView.jsx # Product page wrapper
│   │   │   ├── ProductPageSkeleton.jsx # Loading skeleton
│   │   │   ├── SkelectonCard.jsx # Enhanced loading skeleton
│   │   │   └── NoProducts.jsx # Empty state component
│   │   ├── ui/                # shadcn/ui components
│   │   │   ├── button.jsx     # Button component
│   │   │   ├── card.jsx       # Card component
│   │   │   ├── skeleton.jsx   # Skeleton component
│   │   │   ├── hero-bg.jsx    # Animated hero background
│   │   │   ├── accordion.jsx  # Accordion component for FAQs
│   │   │   ├── input.jsx      # Input component
│   │   │   ├── textarea.jsx   # Textarea component
│   │   │   ├── carousel.jsx   # Embla carousel component
│   │   │   ├── alert.jsx      # Alert component
│   │   │   ├── breadcrumb.jsx # Breadcrumb navigation
│   │   │   ├── badge.jsx      # Badge component
│   │   │   ├── collapsible.jsx # Collapsible component
│   │   │   ├── command.jsx    # Command palette
│   │   │   ├── dialog.jsx     # Dialog/modal component
│   │   │   ├── label.jsx      # Label component
│   │   │   ├── popover.jsx    # Popover component
│   │   │   ├── scroll-area.jsx # Scrollable area
│   │   │   ├── separator.jsx  # Separator component
│   │   │   ├── sonner.jsx     # Toast notifications
│   │   │   ├── table.jsx      # Table component
│   │   │   ├── tabs.jsx       # Tab component
│   │   │   ├── tooltip.jsx    # Tooltip component
│   │   │   └── ...            # Other UI components
│   │   ├── product/           # Product-related components
│   │   │   ├── CartIcon.jsx       # Shopping cart icon
│   │   │   ├── PriceDisplay.jsx   # Enhanced price display component
│   │   │   └── ShareButton.jsx    # Social sharing
│   │   ├── SearchBar.jsx      # Search functionality
│   │   ├── SearchDialog.jsx   # Advanced search dialog with real-time filtering
│   │   ├── Title.jsx          # Title component
│   │   └── SocialMedia.jsx    # Social media links
│   ├── sanity/
│   │   ├── env.js             # Sanity configuration
│   │   ├── helpers/           # Sanity helper functions
│   │   ├── schemaTypes/       # Content schemas
│   │   │   ├── productType.js # Product schema with discount calculation
│   │   │   ├── categoryType.js # Category schema
│   │   │   ├── colorType.js   # Color schema
│   │   │   └── materialType.js # Material schema
│   │   └── structure.js       # Studio structure
│   └── lib/                   # Utility functions
├── data/                      # Data files (NDJSON format)
│   ├── products.ndjson        # Product data
│   ├── categories.ndjson      # Category data
│   ├── colors.ndjson          # Color data
│   ├── materials.ndjson       # Material data
│   ├── images-prompts.ndjson  # Image prompts for content
│   └── backup.json            # Backup data
├── images/                    # Image assets
├── constants/
│   └── index.jsx              # App constants (quickLinks, categories, FAQs)
├── store.js                   # Zustand cart state management
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
   # Import data from NDJSON files
   npx sanity dataset import data/products.ndjson production
   npx sanity dataset import data/categories.ndjson production
   npx sanity dataset import data/colors.ndjson production
   npx sanity dataset import data/materials.ndjson production
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
- Materials (fabric types)
- Inventory tracking
- SEO-friendly slugs
- Automatic discount calculation

### Data Organization
- **NDJSON Format**: All data files use NDJSON for easy Sanity imports
- **Image Prompts**: Enhanced content management with image prompts
- **Organized Assets**: Images stored in dedicated directory
- **Backup System**: Comprehensive data backup and recovery

## 🛒 Cart System

### Zustand State Management
The cart system is built with **Zustand** for efficient state management and includes:

#### Core Features
- **Persistent Storage**: Cart data persists across browser sessions
- **Product Variants**: Full support for size, color, and variant-specific pricing
- **Stock Validation**: Real-time stock checking and quantity limits
- **Discount Handling**: Automatic discount calculation and price comparison
- **Migration Support**: Seamless data migration for future updates

#### Cart Operations
- `addItem()`: Add products with variant selection
- `increment()` / `decrement()`: Adjust quantities with stock validation
- `updateQuantity()`: Direct quantity updates
- `removeItem()`: Remove specific items from cart
- `resetCart()`: Clear entire cart
- `getCartCount()`: Get total item count
- `getSubtotalCents()`: Calculate cart subtotal
- `isInCart()`: Check if product is in cart

#### Integration Points
- **ProductActions**: Add to cart functionality
- **QuantityButtons**: Quantity management controls
- **SearchDialog**: Quick add to cart from search results
- **CartIcon**: Real-time cart count display

#### Data Structure
```javascript
{
  key: "product-sku",           // Unique cart item identifier
  productId: "product-id",      // Sanity product ID
  name: "Product Name",         // Display name
  slug: "product-slug",         // Product URL slug
  image: "image-url",           // Product image
  variant: {                    // Variant details
    colorRef: "color-id",
    colorName: "Color Name",
    size: "M",
    sku: "variant-sku",
    priceOverride: 29.99,
    stock: 10
  },
  unitPriceCents: 2999,         // Price in cents
  compareAtCents: 3999,         // Original price (if discounted)
  quantity: 2                   // Item quantity
}
```

## 🎨 UI Components

### Layout Components
- **Header**: Main header with navigation, search, and cart
  - **HeaderMenu**: Header menu component
  - **MobileMenu**: Responsive mobile navigation
  - **Sidebar**: Sidebar navigation component
- **Footer**: Site information and quick links (About, Contact, Terms, Privacy, Shipping, FAQs)
- **Container**: Layout container wrapper
- **Logo**: Brand logo component
- **USPStrip**: Unique selling proposition strip component

### Homepage Components
- **HeroSection**: Enhanced hero section for homepage
- **FeaturedProducts**: "Hot Right Now" featured products section with responsive carousel and grid layout

### Product Components
- **ProductGrid**: Tab-based product filtering with dynamic loading
- **ProductCard**: Individual product display with image, price, and details
- **ProductDetails**: Comprehensive product information view
- **ProductActions**: Product interaction components (cart, wishlist, quantity)
- **ImageGallery**: Interactive product image viewer with lightbox
- **VariantsSelection**: Size and color selection interface
- **QuantityButtons**: Quantity management controls
- **ProductView**: Product page wrapper component
- **ProductPageSkeleton**: Loading skeleton for product pages
- **SkeletonCard**: Enhanced loading skeleton matching product card structure
- **NoProducts**: Improved empty state component with shadcn/ui integration

### Core Components
- **WishlistButton**: Wishlist functionality with tooltip integration
- **HeroBg**: Animated background component with framer-motion
- **CartIcon**: Shopping cart indicator with real-time count
- **SearchBar**: Product search functionality
- **SearchDialog**: Advanced search dialog with real-time product filtering and comprehensive search capabilities
- **PriceDisplay**: Enhanced price display component with discount handling and responsive sizing
- **Title**: Title component
- **ShareButton**: Social sharing functionality
- **SocialMedia**: Social media links

### Advanced UI Components
- **Alert**: Alert and notification components
- **Breadcrumb**: Navigation breadcrumbs
- **Badge**: Badge and tag components
- **Collapsible**: Collapsible content sections
- **Command**: Command palette interface
- **Dialog**: Modal and dialog components
- **Label**: Form label components
- **Popover**: Popover components
- **ScrollArea**: Scrollable area components
- **Separator**: Visual separators
- **Sonner**: Toast notifications
- **Table**: Data table components
- **Tabs**: Tabbed interface components
- **Tooltip**: Tooltip components

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
- **Enhanced Styling**: Styled Components for advanced styling needs

## 🔧 Configuration

### Sanity Configuration
- **Project ID**: `your_project_id`
- **Dataset**: `your_dataset`
- **API Version**: Latest
- **Studio Path**: `/studio`
- **Custom Input Components**: Enhanced form fields for better UX
- **Helper Functions**: Streamlined content management utilities

### Next.js Configuration
- **App Router**: Enabled
- **Turbopack**: Development optimization
- **Image Optimization**: Next.js Image component
- **Hydration Handling**: Browser extension compatibility

### Enhanced Features
- **Image Prompts**: Better content management workflow
- **Organized Assets**: Streamlined image and data organization
- **Component Restructuring**: Improved maintainability and organization

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
- **Recent Updates**: Project has been restructured for better organization and maintainability.
- **Component Organization**: Reorganized components into logical directories (Header/, home/, product/) for improved maintainability and cleaner codebase structure.
- **Featured Products**: Added "Hot Right Now" section to homepage with responsive carousel (mobile) and grid layout (desktop), including autoplay functionality and skeleton loading states.
- **Enhanced Data Management**: New image prompts system and organized asset structure.
- **New Search Feature**: Advanced search dialog with real-time product filtering across multiple fields (name, description, categories, variants, materials, tags).
- **Component Updates**: Replaced PriceFormatter with enhanced PriceDisplay component for better price handling and discount display.
- **Cart System**: Implemented comprehensive Zustand-based cart state management with persistent storage, variant support, and stock validation.
- **Wishlist Integration**: Added WishlistButton component with tooltip functionality across product cards and actions.

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
