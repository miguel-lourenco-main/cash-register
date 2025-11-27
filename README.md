# 🏪 Cash Register System

> **Real-world Production Application** | Built in under 5 hours for a village religious event

A simple, full-stack cash register application built with Next.js 15, TypeScript, and Supabase. This project demonstrates rapid development skills, real-world problem-solving, and the ability to deliver production-ready software under tight deadlines.

## 🚀 Project Overview

This application was developed as an urgent solution for a village religious event where traditional cash register software was needed. The entire system was designed, coded, and deployed with a complete database in less than 5 hours, showcasing exceptional development velocity and problem-solving skills.

### Key Achievements
- ⚡ **Rapid Development**: Complete application built in under 5 hours
- 🎯 **Real-world Impact**: Successfully used during multi-day religious event
- 📱 **Mobile-First Design**: Optimized for tablet/mobile use in event environment
- 🔄 **Iterative Improvement**: Continuous user feedback integration during event

## 🛠️ Technical Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **TypeScript** - Full type safety across the application
- **Tailwind CSS v4** - Modern utility-first styling
- **Radix UI** - Accessible component primitives
- **Lucide React** - Modern icon library

### Backend & Database
- **Supabase** - PostgreSQL database with real-time capabilities
- **Row Level Security (RLS)** - Secure data access policies
- **TypeScript Integration** - Auto-generated database types

### Key Features
- **Real-time Order Management** - Live order processing
- **Product Catalog** - Categorized food and beverage items
- **Order History** - Complete transaction tracking
- **Responsive Design** - Works on all device sizes
- **Theme System** - Light/dark mode support
- **Error Handling** - Robust error management
- **Loading States** - Smooth user experience

## 📱 Application Features

### Cash Register Interface
- **Product Selection**: Visual grid of categorized products (food/beverages)
- **Order Management**: Add/remove items with quantity controls
- **Real-time Totals**: Automatic price calculations
- **Order Confirmation**: Secure order processing with unique IDs
- **Mobile Optimization**: Touch-friendly interface for tablet use

### Order Management
- **Order History**: Complete list of all transactions
- **Order Details**: Detailed view of individual orders
- **Search & Filter**: Easy order lookup by ID
- **Status Tracking**: Real-time order status updates

## 🛠️ Development Commands

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Database operations
pnpm supabase:start
pnpm supabase:stop
pnpm supabase:reset
```

## 🔧 Configuration

### Environment Setup
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Database Setup
```bash
# Start Supabase locally
npx supabase start

# Apply migrations
npx supabase db reset

# Generate types
npx supabase gen types typescript --local > lib/database.types.ts
```