-- Payment & price-snapshot columns.
-- All columns nullable so already-deployed clients keep inserting during rollout.

ALTER TABLE orders
    ADD COLUMN total DECIMAL(10,2),
    ADD COLUMN amount_tendered DECIMAL(10,2),
    ADD COLUMN change_due DECIMAL(10,2);

ALTER TABLE order_items
    ADD COLUMN unit_price DECIMAL(10,2);

-- Best-effort backfill from current product prices (historical totals previously
-- drifted whenever a product price was edited; snapshots fix that going forward).
UPDATE order_items oi
SET unit_price = p.price
FROM products p
WHERE p.id = oi.product_id
  AND oi.unit_price IS NULL;

UPDATE orders o
SET total = sub.t
FROM (
    SELECT order_id, SUM(unit_price * quantity) AS t
    FROM order_items
    GROUP BY order_id
) sub
WHERE sub.order_id = o.id
  AND o.total IS NULL;
