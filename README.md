# 🏪 Cash Register System

> **Real-world Production Application** | Built in under 5 hours for a village religious event

## 🔗 **Live Demo**

[Cash Register](https://cash-register-a85839.gitlab.io/)

[![Next.js](https://img.shields.io/badge/Next.js-15.2.4-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9.2-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.1.11-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![Playwright](https://img.shields.io/badge/Playwright-Testing-green?style=flat-square&logo=playwright)](https://playwright.dev/)
[![Supabase](https://img.shields.io/badge/Supabase-Database-3FCF8E?style=flat-square&logo=supabase)](https://supabase.com/)
[![Radix UI](https://img.shields.io/badge/Radix_UI-Component_Library-9E7DD7?style=flat-square&logo=radix-ui)](https://www.radix-ui.com/)



---

## 🚀 Project Overview

This application was developed as an urgent solution for a village religious event where traditional cash register software was needed. The entire system was designed, coded, and deployed with a complete database in less than 5 hours, showcasing exceptional development velocity and problem-solving skills.

### Key Achievements
- ⚡ **Rapid Development**: Complete application built in under 5 hours
- 🎯 **Real-world Impact**: Successfully used during multi-day religious event
- 📱 **Mobile-First Design**: Optimized for tablet/mobile use in event environment
- 🔄 **Iterative Improvement**: Continuous user feedback integration during event

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

---

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

---

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

---

## 🤖 Automated Code Documentation

This project uses an automated code documentation workflow powered by **n8n**:

### Overview
An n8n workflow runs on an Azure VM that automatically analyzes code changes on every push to the repository. The workflow:
- **Triggers on Push**: Automatically runs when code is pushed to the repository
- **Code Analysis**: Scans the codebase for uncommented code sections
- **Comment Generation**: Automatically generates helpful comments based on the code logic
- **Azure VM Deployment**: Runs reliably on a dedicated Azure virtual machine

### Benefits
- 📝 **Consistent Documentation**: Ensures code remains well-documented without manual effort
- 🔄 **Automated Process**: No need to remember to add comments manually
- 🎯 **Quality Assurance**: Helps maintain code quality standards across the project
- ⚡ **Zero Overhead**: Runs in the background without impacting development workflow

This automation helps maintain high code quality and documentation standards throughout the project lifecycle.

---

## 🤝 Contributing

This is a personal portfolio project, but **ideas, issues, and suggestions are always welcome**. Feel free to open an issue or submit a merge request if you see something that could be improved.

---

## 📄 License

This project is for personal portfolio purposes. **All rights reserved.**

---

**Contact**: [LinkedIn](https://www.linkedin.com/in/miguel-louren%C3%A7o-395335355/) · [GitLab](https://gitlab.com/miguel-lourenco-main) · [Email](mailto:migasoulou@gmail.com)

**Built with ❤️ by Miguel Lourenço**