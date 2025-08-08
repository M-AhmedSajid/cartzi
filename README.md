# Cartzi - Premium Fashion Ecommerce Platform

A modern, full-stack fashion ecommerce platform built with Next.js 15, Sanity CMS, and Tailwind CSS. Cartzi offers a sophisticated shopping experience with elegant design and robust backend management for clothing and accessories.

## 🎨 Design Philosophy

Cartzi features a sophisticated color palette designed specifically for fashion retail:
- **Primary**: Deep navy blue for trust and elegance
- **Secondary**: Warm beige tones for premium feel
- **Accent**: Coral/rose gold for fashion-forward appeal
- **Supporting**: Clean grays and warm neutrals

## 🚀 Features

### Frontend Excellence
- **Modern Fashion UI**: Elegant design with shadcn/ui components
- **Responsive Design**: Mobile-first approach with adaptive layouts
- **Sophisticated Color Scheme**: Navy, beige, and coral palette
- **Authentication**: Secure user management with Clerk
- **Advanced Search**: Real-time product discovery
- **Smart Shopping Cart**: Interactive cart with state management
- **Product Catalog**: Dynamic listings with category filtering
- **Tab-based Filtering**: Interactive filtering (Tshirt, Jacket, Pant, Hoodie, Short)
- **Enhanced Loading States**: Beautiful skeleton components
- **Product Cards**: Elegant product display with hover effects
- **Empty States**: Sophisticated NoProducts component
- **Animated Backgrounds**: Custom CSS animations and gradient effects
- **Hero Background**: Animated hero with framer-motion

### Backend & CMS
- **Sanity CMS**: Headless content management for fashion content
- **Product Management**: Full CRUD operations with smart pricing
- **Image Optimization**: High-quality image handling with Sanity
- **Content Studio**: Intuitive content editing interface
- **API Integration**: RESTful endpoints for data fetching
- **Smart Pricing**: Automatic discount calculations in Sanity Studio
- **Custom Input Components**: Enhanced form fields for fashion content

### Development Features
- **TypeScript Ready**: Full type safety support
- **ESLint**: Code quality and consistency
- **Turbopack**: Lightning-fast development builds
- **Hot Reload**: Instant development feedback
- **Hydration Error Handling**: Browser extension compatibility

## 🛠️ Tech Stack

### Core Technologies
- **Next.js 15.4.4** - React framework with App Router
- **React 19.1.0** - UI library
- **Tailwind CSS v4** - Utility-first CSS with CSS variables
- **Sanity 4.2.0** - Headless CMS
- **Framer Motion** - Animation library

### UI Components
- **shadcn/ui** - Modern, accessible component library
- **Radix UI** - Accessible component primitives
- **Lucide React** - Icon library
- **Motion** - Animation library
- **Sonner** - Toast notifications

### Authentication & State
- **Clerk** - Authentication and user management
- **Class Variance Authority** - Component variant management

## 📁 Project Structure

```
cartzi/
├── src/
│   ├── app/
│   │   ├── (client)/          # Client-side routes
│   │   │   ├── layout.js      # Root layout with hydration handling
│   │   │   └── page.js        # Home page
│   │   ├── studio/            # Sanity Studio routes
│   │   └── globals.css        # Global styles with fashion color scheme
│   ├── components/
│   │   ├── ui/                # shadcn/ui components
│   │   │   ├── button.jsx     # Button component
│   │   │   ├── card.jsx       # Card component
│   │   │   ├── skeleton.jsx   # Skeleton component
│   │   │   ├── hero-bg.jsx    # Animated hero background
│   │   │   └── ...            # Other UI components
│   │   ├── Header.jsx         # Main header with navigation
│   │   ├── Footer.jsx         # Footer component
│   │   ├── HomeBanner.jsx     # Homepage banner
│   │   ├── CartIcon.jsx       # Shopping cart icon
│   │   ├── SearchBar.jsx      # Search functionality
│   │   ├── ProductGrid.jsx    # Tab-based product filtering
│   │   ├── ProductCard.jsx    # Individual product display
│   │   ├── SkelectonCard.jsx  # Enhanced loading skeleton
│   │   ├── NoProducts.jsx     # Improved empty state component
│   │   └── ...                # Other components
│   ├── sanity/
│   │   ├── env.js             # Sanity configuration
│   │   ├── schemaTypes/       # Content schemas
│   │   │   ├── productType.js # Product schema with discount calculation
│   │   │   └── categoryType.js # Category schema
│   │   └── structure.js       # Studio structure
│   └── lib/                   # Utility functions
├── constants/
│   └── index.jsx              # App constants
├── public/                    # Static assets
├── sanity.config.js           # Sanity configuration
├── next.config.mjs            # Next.js configuration
└── package.json               # Dependencies
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Sanity account

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
- Product details (name, description, price)
- Image management with Sanity
- Category organization (Tshirt, Jacket, Pant, Hoodie, Short)
- Inventory tracking
- Variant support
- SEO-friendly slugs
- Tab-based filtering system
- **Smart Discount Calculation**: Automatic discounted price calculation in Sanity Studio

### Sample Data
The project includes sample products covering:
- Clothing categories (T-shirts, Jackets, Pants, Hoodies, Shorts)
- Kids clothing
- Various price points and statuses
- Complete image references
- Tab-filtered product display

## 🎨 UI Components

### Core Components
- **Header**: Navigation with search and cart
- **Footer**: Site information and links
- **HomeBanner**: Hero section for homepage
- **HeroBg**: Animated background component with framer-motion
- **CartIcon**: Shopping cart indicator
- **SearchBar**: Product search functionality
- **MobileMenu**: Responsive mobile navigation
- **ProductGrid**: Tab-based product filtering with dynamic loading
- **ProductCard**: Individual product display with image, price, and details
- **SkeletonCard**: Enhanced loading skeleton matching product card structure
- **NoProducts**: Improved empty state component with shadcn/ui integration

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

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository
2. Set environment variables
3. Deploy automatically on push

### Other Platforms
- **Netlify**: Compatible with Next.js
- **Railway**: Full-stack deployment
- **AWS**: Custom deployment

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

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
