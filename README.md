# Cash Register App

A modern cash register application built with Next.js, TypeScript, and Supabase. Features a responsive design with mobile-optimized floating cart functionality.

## Features

- **Product Management**: Add and manage products with categories (bebidas/comidas)
- **Order Processing**: Create and manage orders with real-time updates
- **Mobile-First Design**: Responsive layout with floating cart button on mobile devices
- **Real-time Updates**: Live order tracking and status updates

### Mobile Experience

On mobile devices, when products are added to the cart, a floating cart button appears in the bottom-right corner. This button:
- Shows the number of items in the cart
- Provides quick access to the order summary
- Includes smooth scroll animation to the order section
- Features visual feedback with pulse animations

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
