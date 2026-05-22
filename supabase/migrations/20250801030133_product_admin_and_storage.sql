-- Product admin RPCs and storage for product images

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

GRANT EXECUTE ON FUNCTION upsert_product(
  UUID, UUID, TEXT, TEXT, DECIMAL, product_category, TEXT, TEXT
) TO anon, authenticated;

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'product-images',
  'product-images',
  true,
  5242880,
  ARRAY['image/jpeg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

CREATE POLICY "Public read product images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'product-images');

CREATE POLICY "Allow upload product images"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'product-images');

CREATE POLICY "Allow update product images"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'product-images');

CREATE POLICY "Allow delete product images"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'product-images');
