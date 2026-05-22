-- Fix upsert_product: ambiguous RETURNING columns + drop shift requirement for admin check.
-- Product management only requires an active admin operator (not an open shift).

CREATE OR REPLACE FUNCTION assert_admin_operator(p_operator_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM operators o
    WHERE o.id = p_operator_id
      AND o.role = 'admin'
      AND o.active = true
  ) THEN
    RAISE EXCEPTION 'unauthorized'
      USING ERRCODE = '42501';
  END IF;
END;
$$;

CREATE OR REPLACE FUNCTION upsert_product(
  p_operator_id UUID,
  p_id TEXT,
  p_name TEXT,
  p_price DECIMAL(10, 2),
  p_category product_category,
  p_description TEXT DEFAULT NULL,
  p_image_url TEXT DEFAULT NULL
)
RETURNS TABLE (
  id TEXT,
  name TEXT,
  price DECIMAL(10, 2),
  category product_category,
  description TEXT,
  image_url TEXT,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
#variable_conflict use_column
DECLARE
  v_id TEXT;
BEGIN
  PERFORM assert_admin_operator(p_operator_id);

  v_id := lower(trim(p_id));
  IF v_id IS NULL OR v_id = '' THEN
    RAISE EXCEPTION 'invalid_id'
      USING ERRCODE = '22023';
  END IF;

  IF p_name IS NULL OR trim(p_name) = '' THEN
    RAISE EXCEPTION 'invalid_name'
      USING ERRCODE = '22023';
  END IF;

  IF p_price IS NULL OR p_price < 0 THEN
    RAISE EXCEPTION 'invalid_price'
      USING ERRCODE = '22023';
  END IF;

  RETURN QUERY
  INSERT INTO products AS p (id, name, price, category, description, image_url, updated_at)
  VALUES (
    v_id,
    trim(p_name),
    p_price,
    p_category,
    nullif(trim(p_description), ''),
    nullif(trim(p_image_url), ''),
    NOW()
  )
  ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    price = EXCLUDED.price,
    category = EXCLUDED.category,
    description = EXCLUDED.description,
    image_url = EXCLUDED.image_url,
    updated_at = NOW()
  RETURNING
    p.id,
    p.name,
    p.price,
    p.category,
    p.description,
    p.image_url,
    p.created_at,
    p.updated_at;
END;
$$;

GRANT EXECUTE ON FUNCTION upsert_product(
  UUID, TEXT, TEXT, DECIMAL, product_category, TEXT, TEXT
) TO anon, authenticated;

-- Drop old overload that required shift_id
DROP FUNCTION IF EXISTS upsert_product(
  UUID, UUID, TEXT, TEXT, DECIMAL, product_category, TEXT, TEXT
);
