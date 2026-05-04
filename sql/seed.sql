INSERT INTO categories (name, description) VALUES
('Electrónica', 'Dispositivos tecnológicos y accesorios'),
('Hogar', 'Productos para casa y decoración'),
('Papelería', 'Material de oficina y estudio'),
('Alimentación', 'Productos de consumo diario');

INSERT INTO products (name, price, stock, category_id) VALUES
(
  'Teclado mecánico',
  79.99,
  12,
  (SELECT id FROM categories WHERE name = 'Electrónica')
),
(
  'Ratón inalámbrico',
  29.99,
  25,
  (SELECT id FROM categories WHERE name = 'Electrónica')
),
(
  'Silla de escritorio',
  149.90,
  8,
  (SELECT id FROM categories WHERE name = 'Hogar')
),
(
  'Cuaderno A4',
  3.50,
  100,
  (SELECT id FROM categories WHERE name = 'Papelería')
),
(
  'Café molido',
  5.25,
  40,
  (SELECT id FROM categories WHERE name = 'Alimentación')
);

-- Simulación de venta: restar stock a un producto
UPDATE products
SET stock = stock - 1
WHERE name = 'Teclado mecánico'
  AND stock > 0;

-- Eliminar un producto concreto
DELETE FROM products
WHERE name = 'Café molido';

-- Consulta con INNER JOIN: productos con categoría
SELECT
  products.name AS product_name,
  products.price,
  categories.name AS category_name
FROM products
INNER JOIN categories
  ON products.category_id = categories.id
ORDER BY categories.name, products.name;

-- Consulta con GROUP BY y COUNT: productos por categoría
SELECT
  categories.name AS category_name,
  COUNT(products.id) AS total_products
FROM categories
LEFT JOIN products
  ON products.category_id = categories.id
GROUP BY categories.name
ORDER BY categories.name;