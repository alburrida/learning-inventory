# Análisis SQL

## Inserción de datos

La aplicación utiliza sentencias `INSERT` para crear registros en las tablas `categories` y `products`.

Primero se insertan las categorías y después los productos, ya que cada producto necesita una categoría existente mediante el campo `category_id`.

Ejemplo de inserción de categorías:

```sql
INSERT INTO categories (name, description) VALUES
('Electrónica', 'Dispositivos tecnológicos y accesorios'),
('Hogar', 'Productos para casa y decoración');
```

Ejemplo de inserción de productos:

```sql
INSERT INTO products (name, price, stock, category_id) VALUES
(
  'Teclado mecánico',
  79.99,
  12,
  (SELECT id FROM categories WHERE name = 'Electrónica')
);
```

## Actualización de datos

Se ha incluido una operación `UPDATE` para simular una venta:

```sql
UPDATE products
SET stock = stock - 1
WHERE name = 'Teclado mecánico'
  AND stock > 0;
```

Esta consulta reduce el stock de un producto únicamente si todavía queda stock disponible.

La condición `stock > 0` evita que el inventario pueda quedar con valores negativos.

## Eliminación de datos

Se ha incluido una operación `DELETE` para eliminar un producto concreto:

```sql
DELETE FROM products
WHERE name = 'Café molido';
```

La eliminación se realiza sobre productos, no sobre categorías, para evitar conflictos con las claves foráneas.

En este proyecto, las categorías están protegidas mediante `ON DELETE RESTRICT`, por lo que PostgreSQL no permite borrar una categoría si tiene productos asociados.

## INNER JOIN

`INNER JOIN` devuelve únicamente las filas que tienen coincidencia en ambas tablas.

En este proyecto, una consulta con `INNER JOIN` entre `products` y `categories` devuelve solamente productos que tienen una categoría válida asociada.

Escenario real: mostrar el catálogo público de una tienda. Solo interesa enseñar productos correctamente clasificados, por lo que se usa `INNER JOIN`.

Ejemplo:

```sql
SELECT
  products.name AS product_name,
  products.price,
  categories.name AS category_name
FROM products
INNER JOIN categories
  ON products.category_id = categories.id;
```

## LEFT JOIN

`LEFT JOIN` devuelve todas las filas de la tabla izquierda y, si hay coincidencias en la tabla derecha, añade esos datos. Si no hay coincidencia, los campos de la tabla derecha aparecen como `NULL`.

En este proyecto, un `LEFT JOIN` desde `categories` hacia `products` permite mostrar todas las categorías, incluso aquellas que todavía no tienen productos.

Escenario real: panel de administración del inventario. Interesa ver todas las categorías existentes, aunque algunas estén vacías, para poder gestionarlas.

Ejemplo:

```sql
SELECT
  categories.name AS category_name,
  products.name AS product_name
FROM categories
LEFT JOIN products
  ON products.category_id = categories.id;
```

## GROUP BY y COUNT

La consulta con `GROUP BY` permite agrupar los productos por categoría.

La función `COUNT()` permite contar cuántos productos hay dentro de cada grupo.

Ejemplo:

```sql
SELECT
  categories.name AS category_name,
  COUNT(products.id) AS total_products
FROM categories
LEFT JOIN products
  ON products.category_id = categories.id
GROUP BY categories.name
ORDER BY categories.name;
```

Esta consulta es útil para obtener una visión resumida del inventario, mostrando cuántos productos hay en cada categoría.

## Conclusión

Las consultas SQL utilizadas en este proyecto permiten crear, modificar, eliminar y consultar datos de forma estructurada.

El uso de `JOIN`, `GROUP BY` y funciones agregadas demuestra cómo una base de datos relacional permite obtener información útil a partir de varias tablas relacionadas.