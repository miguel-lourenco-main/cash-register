-- Fix authenticate_operator: pgcrypto in extensions schema; PIN scoped to operator
DROP FUNCTION IF EXISTS authenticate_operator(TEXT);

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

GRANT EXECUTE ON FUNCTION authenticate_operator(UUID, TEXT) TO anon, authenticated;

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
