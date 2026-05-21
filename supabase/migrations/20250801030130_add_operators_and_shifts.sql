-- Operators, shifts, and order accountability
-- Runs after products/orders tables (20250801030127–129)

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Operators (PIN-based staff)
CREATE TABLE operators (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    pin_hash TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'vendedor' CHECK (role IN ('vendedor', 'admin')),
    active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_operators_active ON operators(active) WHERE active = true;

-- Shifts
CREATE TABLE shifts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    operator_id UUID NOT NULL REFERENCES operators(id) ON DELETE RESTRICT,
    started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    ended_at TIMESTAMPTZ
);

CREATE INDEX idx_shifts_operator_id ON shifts(operator_id);
CREATE INDEX idx_shifts_started_at ON shifts(started_at DESC);

-- Extend orders with accountability
ALTER TABLE orders
    ADD COLUMN registered_by UUID REFERENCES operators(id) ON DELETE SET NULL,
    ADD COLUMN shift_id UUID REFERENCES shifts(id) ON DELETE SET NULL;

CREATE INDEX idx_orders_registered_by ON orders(registered_by);
CREATE INDEX idx_orders_shift_id ON orders(shift_id);

-- Extend products for UI cards
ALTER TABLE products
    ADD COLUMN image_url TEXT,
    ADD COLUMN description TEXT;

-- RLS for operators (no direct pin_hash exposure to anon)
ALTER TABLE operators ENABLE ROW LEVEL SECURITY;
ALTER TABLE shifts ENABLE ROW LEVEL SECURITY;

-- Column-level grants: anon can read public fields only (not pin_hash)
REVOKE ALL ON operators FROM anon, authenticated;
GRANT SELECT (id, name, role, active, created_at) ON operators TO anon, authenticated;

CREATE POLICY "operators_select_public" ON operators
    FOR SELECT TO anon, authenticated
    USING (true);

CREATE POLICY "Shifts viewable by everyone" ON shifts
    FOR SELECT USING (true);

CREATE POLICY "Shifts insertable by everyone" ON shifts
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Shifts updatable by everyone" ON shifts
    FOR UPDATE USING (true);

-- Authenticate one operator by ID + PIN (no cross-account PIN probing)
CREATE OR REPLACE FUNCTION authenticate_operator(p_operator_id UUID, p_pin TEXT)
RETURNS TABLE (id UUID, name TEXT, role TEXT)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions
AS $$
BEGIN
    RETURN QUERY
    SELECT o.id, o.name, o.role
    FROM operators o
    WHERE o.id = p_operator_id
      AND o.active = true
      AND o.pin_hash = extensions.crypt(p_pin, o.pin_hash);
END;
$$;

-- List active operators (for PIN screen picker)
CREATE OR REPLACE FUNCTION list_active_operators()
RETURNS TABLE (id UUID, name TEXT, role TEXT)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public, extensions
AS $$
    SELECT o.id, o.name, o.role
    FROM operators o
    WHERE o.active = true
    ORDER BY o.name;
$$;

-- Start a shift for an operator
CREATE OR REPLACE FUNCTION start_shift(p_operator_id UUID)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions
AS $$
DECLARE
    v_shift_id UUID;
BEGIN
    INSERT INTO shifts (operator_id)
    VALUES (p_operator_id)
    RETURNING shifts.id INTO v_shift_id;

    RETURN v_shift_id;
END;
$$;

-- End a shift
CREATE OR REPLACE FUNCTION end_shift(p_shift_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions
AS $$
BEGIN
    UPDATE shifts
    SET ended_at = NOW()
    WHERE id = p_shift_id AND ended_at IS NULL;

    RETURN FOUND;
END;
$$;

-- Seed operators (PIN: 1234 for demo vendedores, 5678 for admin — change in production)
INSERT INTO operators (name, pin_hash, role) VALUES
    ('Carlos R.', extensions.crypt('1234', extensions.gen_salt('bf')), 'vendedor'),
    ('Maria S.', extensions.crypt('1234', extensions.gen_salt('bf')), 'vendedor'),
    ('João P.', extensions.crypt('1234', extensions.gen_salt('bf')), 'vendedor'),
    ('Ana L.', extensions.crypt('5678', extensions.gen_salt('bf')), 'admin');

-- Grant execute on RPCs to anon (static export client)
GRANT EXECUTE ON FUNCTION authenticate_operator(UUID, TEXT) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION list_active_operators() TO anon, authenticated;
GRANT EXECUTE ON FUNCTION start_shift(UUID) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION end_shift(UUID) TO anon, authenticated;
