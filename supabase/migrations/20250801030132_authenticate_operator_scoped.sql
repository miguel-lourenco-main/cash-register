-- Scope PIN check to selected operator; remove global PIN lookup overload
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
