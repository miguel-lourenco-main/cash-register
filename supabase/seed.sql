-- Seed data for products table
-- Generated from lib/seed-products.json — run `pnpm seed:generate` after edits
INSERT INTO products (id, name, price, category, image_url, description) VALUES
    -- Bebidas (Drinks)
    ('cerveja', 'Cerveja', 1.00, 'bebida', NULL, 'Imperial de cerveja'),
    ('metro-cerveja-11-imperiais', 'Metro de cerveja (11 imperiais)', 10.00, 'bebida', NULL, 'Metro com 11 imperiais'),
    ('sidra', 'Sidra', 1.50, 'bebida', NULL, 'Copo de sidra'),
    ('vinho-copo', 'Vinho (copo)', 0.50, 'bebida', NULL, 'Copo de vinho tinto ou branco'),
    ('jarra-vinho', 'Jarra de Vinho', 4.50, 'bebida', NULL, 'Jarra de vinho para partilhar'),
    ('garrafa-vinho-monte-velho', 'Garrafa de Vinho Monte Velho', 6.50, 'bebida', NULL, 'Garrafa de vinho Monte Velho'),
    ('cerveja-sem-alcool', 'Cerveja s/ álcool', 1.50, 'bebida', NULL, 'Cerveja sem álcool'),
    ('agua-33cl', 'Água 33cl', 0.80, 'bebida', NULL, 'Garrafa de água 33cl'),
    ('agua-com-gas', 'Água c/ gás', 1.20, 'bebida', NULL, 'Água com gás'),
    ('coca-cola-ice-tea-sumo', 'Coca-cola/ Ice Tea/ Sumo lata', 1.50, 'bebida', NULL, 'Refrigerante ou sumo em lata'),
    ('ginja-copo-chocolate', 'Ginja em copo de chocolate', 1.20, 'bebida', NULL, 'Ginja servida num copo comestível de chocolate'),
    ('vinho-porto', 'Vinho do Porto', 1.50, 'bebida', NULL, 'Copo de vinho do Porto'),
    ('favaios', 'Favaios', 1.00, 'bebida', NULL, 'Copo de vinho moscatel de Favaios'),
    ('licor-beirao', 'Licor Beirão', 3.00, 'bebida', NULL, 'Copo de Licor Beirão'),
    ('shot', 'Shot', 1.50, 'bebida', NULL, 'Shot de licor à escolha'),
    ('caipirao', 'Caipirão', 3.50, 'bebida', NULL, 'Caipirinha com Licor Beirão'),
    ('porto-tonico', 'Porto tónico', 3.50, 'bebida', NULL, 'Vinho do Porto com tónico'),
    ('whiskey', 'Whiskey', 3.00, 'bebida', NULL, 'Copo de whiskey'),
    ('whiskey-agua-pedras', 'Whiskey c/ água das pedras', 3.50, 'bebida', NULL, 'Whiskey com água das pedras'),
    ('gin-tonico', 'Gin tónico', 4.00, 'bebida', NULL, 'Gin com tónico'),
    ('cafe-descafeinado', 'Café/ descafeínado', 0.80, 'bebida', NULL, 'Café ou descafeinado'),
    -- Comida (Food)
    ('batata-fritas', 'Batata Fritas', 2.40, 'comida', NULL, 'Porção de batatas fritas'),
    ('bifanas', 'Bifanas', 3.00, 'comida', NULL, 'Bifana no pão'),
    ('pica-pau', 'Pica pau', 5.00, 'comida', NULL, 'Prato de carne em cubos com molho'),
    ('moelas', 'Moelas', 3.50, 'comida', NULL, 'Moelas de frango em molho picante'),
    ('gelado', 'Gelado', 1.50, 'comida', NULL, 'Gelado individual'),
    ('chupa-caramelo', 'Chupa, Caramelo', 0.50, 'comida', NULL, 'Chupa-chupa ou caramelo')
ON CONFLICT (id) DO NOTHING;

-- Sample orders for testing
INSERT INTO orders (id, created_at) VALUES
    ('ord-001', NOW() - INTERVAL '2 hours'),
    ('ord-002', NOW() - INTERVAL '1 hour'),
    ('ord-003', NOW() - INTERVAL '30 minutes')
ON CONFLICT (id) DO NOTHING;

-- Sample order items
INSERT INTO order_items (order_id, product_id, quantity) VALUES
    ('ord-001', 'cerveja', 3),
    ('ord-001', 'batata-fritas', 2),
    ('ord-002', 'metro-cerveja-11-imperiais', 1),
    ('ord-002', 'bifanas', 4),
    ('ord-002', 'cafe-descafeinado', 2),
    ('ord-003', 'gin-tonico', 2),
    ('ord-003', 'pica-pau', 1),
    ('ord-003', 'gelado', 3);
