-- Add category enum type
CREATE TYPE product_category AS ENUM ('comida', 'bebida');

-- Add category column to products table
ALTER TABLE products ADD COLUMN category product_category NOT NULL DEFAULT 'bebida';

-- Create index for faster category filtering
CREATE INDEX idx_products_category ON products(category);

-- Update existing products with their appropriate categories
UPDATE products SET category = 'bebida' WHERE id IN (
    'cerveja', 'metro-cerveja-11-imperiais', 'sidra', 'vinho-copo', 'jarra-vinho', 
    'garrafa-vinho-monte-velho', 'cerveja-sem-alcool', 'agua-33cl', 'agua-com-gas', 
    'coca-cola-ice-tea-sumo', 'ginja-copo-chocolate', 'vinho-porto', 'favaios', 
    'licor-beirao', 'shot', 'caipirao', 'porto-tonico', 'whiskey', 'whiskey-agua-pedras', 
    'gin-tonico', 'cafe-descafeinado'
);

UPDATE products SET category = 'comida' WHERE id IN (
    'batata-fritas', 'bifanas', 'pica-pau', 'moelas', 'gelado', 'chupa-caramelo'
); 