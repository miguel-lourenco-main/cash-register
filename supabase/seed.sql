-- Seed data for products table
INSERT INTO products (id, name, price) VALUES
    ('cerveja', 'Cerveja', 1.00),
    ('metro-cerveja-11-imperiais', 'Metro de cerveja (11 imperiais)', 10.00),
    ('sidra', 'Sidra', 1.50),
    ('vinho-copo', 'Vinho (copo)', 0.50),
    ('jarra-vinho', 'Jarra de Vinho', 4.50),
    ('garrafa-vinho-monte-velho', 'Garrafa de Vinho Monte Velho', 6.50),
    ('cerveja-sem-alcool', 'Cerveja s/ álcool', 1.50),
    ('agua-33cl', 'Água 33cl', 0.80),
    ('agua-com-gas', 'Água c/ gás', 1.20),
    ('coca-cola-ice-tea-sumo', 'Coca-cola/ Ice Tea/ Sumo lata', 1.50),
    ('ginja-copo-chocolate', 'Ginja em copo de chocolate', 1.20),
    ('vinho-porto', 'Vinho do Porto', 1.50),
    ('favaios', 'Favaios', 1.00),
    ('licor-beirao', 'Licor Beirão', 3.00),
    ('shot', 'Shot', 1.50),
    ('caipirao', 'Caipirão', 3.50),
    ('porto-tonico', 'Porto tónico', 3.50),
    ('whiskey', 'Whiskey', 3.00),
    ('whiskey-agua-pedras', 'Whiskey c/ água das pedras', 3.50),
    ('gin-tonico', 'Gin tónico', 4.00),
    ('cafe-descafeinado', 'Café/ descafeínado', 0.80),
    ('batata-fritas', 'Batata Fritas', 1.00),
    ('bifanas', 'Bifanas', 3.00),
    ('pica-pau', 'Pica pau', 5.00),
    ('moelas', 'Moelas', 3.50),
    ('gelado', 'Gelado', 1.50),
    ('chupa-caramelo', 'Chupa, Caramelo', 0.50)
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