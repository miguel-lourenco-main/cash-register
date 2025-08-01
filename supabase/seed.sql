-- Seed data for products table
INSERT INTO products (id, name, price, category) VALUES
    -- Bebidas (Drinks)
    ('cerveja', 'Cerveja', 1.00, 'bebida'),
    ('metro-cerveja-11-imperiais', 'Metro de cerveja (11 imperiais)', 10.00, 'bebida'),
    ('sidra', 'Sidra', 1.50, 'bebida'),
    ('vinho-copo', 'Vinho (copo)', 0.50, 'bebida'),
    ('jarra-vinho', 'Jarra de Vinho', 4.50, 'bebida'),
    ('garrafa-vinho-monte-velho', 'Garrafa de Vinho Monte Velho', 6.50, 'bebida'),
    ('cerveja-sem-alcool', 'Cerveja s/ álcool', 1.50, 'bebida'),
    ('agua-33cl', 'Água 33cl', 0.80, 'bebida'),
    ('agua-com-gas', 'Água c/ gás', 1.20, 'bebida'),
    ('coca-cola-ice-tea-sumo', 'Coca-cola/ Ice Tea/ Sumo lata', 1.50, 'bebida'),
    ('ginja-copo-chocolate', 'Ginja em copo de chocolate', 1.20, 'bebida'),
    ('vinho-porto', 'Vinho do Porto', 1.50, 'bebida'),
    ('favaios', 'Favaios', 1.00, 'bebida'),
    ('licor-beirao', 'Licor Beirão', 3.00, 'bebida'),
    ('shot', 'Shot', 1.50, 'bebida'),
    ('caipirao', 'Caipirão', 3.50, 'bebida'),
    ('porto-tonico', 'Porto tónico', 3.50, 'bebida'),
    ('whiskey', 'Whiskey', 3.00, 'bebida'),
    ('whiskey-agua-pedras', 'Whiskey c/ água das pedras', 3.50, 'bebida'),
    ('gin-tonico', 'Gin tónico', 4.00, 'bebida'),
    ('cafe-descafeinado', 'Café/ descafeínado', 0.80, 'bebida'),
    -- Comida (Food)
    ('batata-fritas', 'Batata Fritas', 2.40, 'comida'),
    ('bifanas', 'Bifanas', 3.00, 'comida'),
    ('pica-pau', 'Pica pau', 5.00, 'comida'),
    ('moelas', 'Moelas', 3.50, 'comida'),
    ('gelado', 'Gelado', 1.50, 'comida'),
    ('chupa-caramelo', 'Chupa, Caramelo', 0.50, 'comida')
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