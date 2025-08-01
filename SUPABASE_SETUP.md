# Supabase Local Development Setup

## Environment Variables

Create a `.env.local` file in your project root with the following content:

```env
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0
```

## Database Schema

The following tables have been created:

### Products Table
- `id` (TEXT) - Primary key
- `name` (TEXT) - Product name
- `price` (DECIMAL) - Product price
- `created_at` (TIMESTAMP) - Creation timestamp
- `updated_at` (TIMESTAMP) - Update timestamp

### Orders Table  
- `id` (TEXT) - Primary key
- `created_at` (TIMESTAMP) - Order creation time
- `updated_at` (TIMESTAMP) - Update timestamp

### Order Items Table
- `id` (UUID) - Primary key
- `order_id` (TEXT) - Foreign key to orders
- `product_id` (TEXT) - Foreign key to products
- `quantity` (INTEGER) - Item quantity
- `created_at` (TIMESTAMP) - Creation timestamp

## Commands

### Start Supabase
```bash
npx supabase start
```

### Reset Database (with migrations and seed data)
```bash
npx supabase db reset
```

### Stop Supabase
```bash
npx supabase stop
```

### Generate TypeScript Types
```bash
npx supabase gen types typescript --local > lib/database.types.ts
```
*Run this command whenever you modify the database schema to update the TypeScript types.*

### Access Supabase Studio
Open http://127.0.0.1:54323 in your browser to manage your database through the web interface.

## Seed Data

The database comes pre-seeded with:
- 15 products (tickets and add-ons)
- 3 sample orders with order items

You can view and modify the seed data in `supabase/seed.sql`.

## TypeScript Integration

- **`lib/database.types.ts`**: Auto-generated TypeScript types from your database schema
- **`lib/supabase.ts`**: Configured Supabase client with full type safety
- The types are automatically generated from your database schema and provide full IntelliSense support 