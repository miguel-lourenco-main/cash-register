-- Seed data for products table
INSERT INTO products (id, name, price) VALUES
    ('tkt-001', 'General Admission', 25.00),
    ('tkt-002', 'Child Admission (Under 12)', 15.00),
    ('tkt-003', 'Senior Admission (65+)', 20.00),
    ('tkt-004', 'VIP Experience', 75.00),
    ('tkt-005', 'Family Pass (2A, 2C)', 70.00),
    ('tkt-006', 'Student Pass', 18.00),
    ('addon-001', '3D Glasses', 3.50),
    ('addon-002', 'Souvenir Program', 10.00),
    ('addon-003', 'Audio Guide', 12.00),
    ('addon-004', 'Photo Package', 15.00),
    ('addon-005', 'Gift Shop Voucher', 10.00),
    ('addon-006', 'Parking Pass', 8.00),
    ('addon-007', 'Priority Access', 25.00),
    ('addon-008', 'Locker Rental', 5.00),
    ('addon-009', 'Refreshment Voucher', 12.00)
ON CONFLICT (id) DO NOTHING;

-- Sample orders for testing
INSERT INTO orders (id, created_at) VALUES
    ('ord-001', NOW() - INTERVAL '2 hours'),
    ('ord-002', NOW() - INTERVAL '1 hour'),
    ('ord-003', NOW() - INTERVAL '30 minutes')
ON CONFLICT (id) DO NOTHING;

-- Sample order items
INSERT INTO order_items (order_id, product_id, quantity) VALUES
    ('ord-001', 'tkt-001', 2),
    ('ord-001', 'addon-001', 2),
    ('ord-002', 'tkt-005', 1),
    ('ord-002', 'addon-002', 1),
    ('ord-003', 'tkt-004', 1),
    ('ord-003', 'addon-007', 1),
    ('ord-003', 'addon-005', 1); 