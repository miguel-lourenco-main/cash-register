-- Create orders table
CREATE TABLE orders (
    id TEXT PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create order_items table
CREATE TABLE order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id TEXT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id TEXT NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_order_items_product_id ON order_items(product_id);

-- Enable Row Level Security (RLS)
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Create policies for orders
CREATE POLICY "Orders are viewable by everyone" ON orders
    FOR SELECT USING (true);

CREATE POLICY "Orders can be inserted by everyone" ON orders
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Orders can be updated by authenticated users" ON orders
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Orders can be deleted by authenticated users" ON orders
    FOR DELETE USING (auth.role() = 'authenticated');

-- Create policies for order_items
CREATE POLICY "Order items are viewable by everyone" ON order_items
    FOR SELECT USING (true);

CREATE POLICY "Order items can be inserted by everyone" ON order_items
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Order items can be updated by authenticated users" ON order_items
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Order items can be deleted by authenticated users" ON order_items
    FOR DELETE USING (auth.role() = 'authenticated');
