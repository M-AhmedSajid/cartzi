# Cartzi - Modern E-commerce Platform

A modern, full-stack e-commerce platform built with Next.js 15, Sanity CMS, and Tailwind CSS. Cartzi provides a seamless shopping experience with a beautiful UI and robust backend management.

## 🚀 Features

### Frontend
- **Modern UI/UX**: Built with Tailwind CSS and Radix UI components
- **Responsive Design**: Mobile-first approach with adaptive layouts
- **Dark/Light Theme**: Theme switching with next-themes
- **Authentication**: Clerk integration for user management
- **Search Functionality**: Real-time product search
- **Shopping Cart**: Interactive cart with state management
- **Product Catalog**: Dynamic product listings with categories
- **Tab-based Filtering**: Interactive product filtering by category (Tshirt, Jacket, Pant, Hoodie, Short)
- **Loading States**: Skeleton loading components for better UX
- **Product Cards**: Reusable product display components

### Backend & CMS
- **Sanity CMS**: Headless content management system
- **Product Management**: Full CRUD operations for products
- **Image Management**: Optimized image handling with Sanity
- **Content Studio**: Built-in content editing interface
- **API Integration**: RESTful API endpoints for data fetching

### Development Features
- **TypeScript Support**: Full type safety (configurable)
- **ESLint**: Code quality and consistency
- **Turbopack**: Fast development builds
- **Hot Reload**: Instant development feedback

## 🛠️ Tech Stack

### Core Technologies
- **Next.js 15.4.4** - React framework with App Router
- **React 19.1.0** - UI library
- **Tailwind CSS 4** - Utility-first CSS framework
- **Sanity 4.2.0** - Headless CMS

### UI Components
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
│   │   │   ├── layout.js      # Root layout
│   │   │   └── page.js        # Home page
│   │   ├── studio/            # Sanity Studio routes
│   │   └── globals.css        # Global styles
│   ├── components/
│   │   ├── ui/                # Reusable UI components
│   │   ├── Header.jsx         # Main header component
│   │   ├── Footer.jsx         # Footer component
│   │   ├── HomeBanner.jsx     # Homepage banner
│   │   ├── CartIcon.jsx       # Shopping cart icon
│   │   ├── SearchBar.jsx      # Search functionality
│   │   ├── ProductGrid.jsx    # Tab-based product filtering
│   │   ├── ProductCard.jsx    # Individual product display
│   │   ├── SkelectonCard.jsx  # Loading skeleton component
│   │   ├── NoProducts.jsx     # Empty state component
│   │   └── ...                # Other components
│   ├── sanity/
│   │   ├── env.js             # Sanity configuration
│   │   ├── schemaTypes/       # Content schemas
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
   
   # Start Sanity Studio
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
The project includes a comprehensive product schema with:
- Product details (name, description, price)
- Image management with Sanity
- Category organization
- Inventory tracking
- Variant support (Tshirt, Jacket, Pant, Hoodie, Short)
- SEO-friendly slugs
- Tab-based filtering system

### Sample Data
The project includes `products.json` with 12 sample products covering:
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
- **CartIcon**: Shopping cart indicator
- **SearchBar**: Product search functionality
- **MobileMenu**: Responsive mobile navigation
- **ProductGrid**: Tab-based product filtering with dynamic loading
- **ProductCard**: Individual product display with image, price, and details
- **SkeletonCard**: Loading skeleton for better user experience
- **NoProducts**: Empty state component for when no products are found

### Design System
- **Color Scheme**: Muted foreground with accent colors
- **Typography**: Clean, readable fonts
- **Spacing**: Consistent spacing system
- **Animations**: Smooth hover effects and transitions

## 🔧 Configuration

### Sanity Configuration
- **Project ID**: `osdxogmk`
- **Dataset**: `production`
- **API Version**: Latest
- **Studio Path**: `/studio`

### Next.js Configuration
- **App Router**: Enabled
- **Turbopack**: Development optimization
- **Image Optimization**: Next.js Image component
- **TypeScript**: Optional (can be enabled)

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
