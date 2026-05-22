-- Fix RAISE EXCEPTION syntax: cannot set MESSAGE twice (format string + USING MESSAGE)

CREATE OR REPLACE FUNCTION assert_admin_operator(p_operator_id UUID, p_shift_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM operators o
    INNER JOIN shifts s ON s.operator_id = o.id
    WHERE o.id = p_operator_id
      AND o.role = 'admin'
      AND o.active = true
      AND s.id = p_shift_id
      AND s.ended_at IS NULL
  ) THEN
    RAISE EXCEPTION 'unauthorized'
      USING ERRCODE = '42501';
  END IF;
END;
$$;

CREATE OR REPLACE FUNCTION upsert_product(
  p_operator_id UUID,
  p_shift_id UUID,
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
DECLARE
  v_id TEXT;
BEGIN
  PERFORM assert_admin_operator(p_operator_id, p_shift_id);

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
  INSERT INTO products (id, name, price, category, description, image_url, updated_at)
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
    products.id,
    products.name,
    products.price,
    products.category,
    products.description,
    products.image_url,
    products.created_at,
    products.updated_at;
END;
$$;
