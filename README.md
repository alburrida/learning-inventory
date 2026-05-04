# Learning Inventory

Aplicación web de inventario conectada a una base de datos PostgreSQL serverless usando Neon.

El proyecto incluye modelado relacional, scripts SQL, backend con Express, frontend con React y documentación técnica.

## Tecnologías utilizadas

- PostgreSQL
- Neon DB
- SQL
- Express
- TypeScript
- React
- Vite
- Vercel

## Estructura del proyecto

```txt
learning-inventory/
├── backend/
├── frontend/
├── sql/
│   ├── schema.sql
│   └── seed.sql
├── docs/
│   ├── arquitectura-datos.md
│   ├── analisis-sql.md
│   └── seguridad-db.md
├── README.md
└── .gitignore
```

## Base de datos

La base de datos utilizada en este proyecto es PostgreSQL, desplegada mediante Neon DB.

El modelo de datos está formado por dos tablas principales:

- `categories`
- `products`

La tabla `categories` almacena las categorías disponibles en el inventario. Cada categoría tiene un identificador único, un nombre único, una descripción y una fecha de creación.

La tabla `products` almacena los productos del inventario. Cada producto tiene un identificador único, nombre, precio, stock, fecha de creación y una referencia a la categoría a la que pertenece.

La relación entre ambas tablas se realiza mediante el campo `category_id` de la tabla `products`, que actúa como foreign key hacia el campo `id` de la tabla `categories`.

Esta relación garantiza la integridad referencial, ya que no permite crear productos asociados a categorías inexistentes.

La foreign key está configurada con `ON DELETE RESTRICT`. Esto significa que PostgreSQL no permitirá eliminar una categoría si existen productos asociados a ella.

Se ha elegido `ON DELETE RESTRICT` en lugar de `ON DELETE CASCADE` porque es el comportamiento más seguro para un sistema de inventario. Si se usara `ON DELETE CASCADE`, al borrar una categoría se borrarían automáticamente todos sus productos, lo que podría provocar una pérdida accidental de datos.

## Scripts SQL

Los scripts están en la carpeta `sql/`.

### `schema.sql`

Crea la extensión necesaria para generar UUID, elimina tablas previas si existen y crea las tablas `categories` y `products` con sus constraints.

Incluye:

- UUID como primary key.
- `UNIQUE` en el nombre de categoría.
- `CHECK` para asegurar precios mayores que 0.
- `CHECK` para evitar stock negativo.
- Foreign key entre productos y categorías.
- `ON DELETE RESTRICT` para proteger los productos asociados a una categoría.

### `seed.sql`

Inserta datos de prueba y contiene operaciones SQL de análisis.

Incluye:

- Inserción de categorías.
- Inserción de productos.
- Actualización de stock.
- Eliminación de un producto.
- Consulta con `INNER JOIN`.
- Consulta con `GROUP BY` y `COUNT`.

## Backend

El backend está desarrollado con Express y TypeScript.

Expone los siguientes endpoints:

```txt
GET /api/products
POST /api/products
```

El endpoint `GET /api/products` devuelve los productos junto con el nombre de su categoría mediante un `INNER JOIN`.

Ejemplo de consulta usada en el backend:

```sql
SELECT
  products.id,
  products.name,
  products.price,
  products.stock,
  products.created_at,
  categories.name AS category_name
FROM products
INNER JOIN categories
  ON products.category_id = categories.id
ORDER BY products.created_at DESC;
```

El endpoint `POST /api/products` permite crear productos usando consultas parametrizadas.

## Frontend

El frontend está desarrollado con React y Vite.

Consume el endpoint del backend mediante `fetch` y renderiza una tabla con:

- Producto
- Categoría
- Precio
- Stock

La URL de la API se configura mediante la variable de entorno `VITE_API_URL`.

## Variables de entorno

En desarrollo, el backend utiliza un archivo `backend/.env.local` con la siguiente estructura:

```env
DATABASE_URL="cadena-de-conexion-de-neon"
PORT=3001
```

El frontend utiliza un archivo `frontend/.env.local` con la siguiente estructura:

```env
VITE_API_URL=http://localhost:3001
```

Los archivos `.env.local` no se suben a GitHub porque contienen configuración sensible o específica del entorno local.

## Seguridad

La aplicación evita la inyección SQL mediante consultas parametrizadas usando `@neondatabase/serverless`.

Ejemplo usado en el endpoint `POST /api/products`:

```ts
const createdProduct = await sql`
  INSERT INTO products (name, price, stock, category_id)
  VALUES (${name}, ${price}, ${stock ?? 0}, ${category_id})
  RETURNING *
`;
```

Los valores se envían como parámetros, no concatenados directamente en la consulta SQL. Esto evita que una entrada del usuario pueda modificar la estructura de la consulta.

## ORM tipado: Drizzle ORM

Aunque este proyecto utiliza SQL directo para entender los fundamentos de PostgreSQL, en proyectos grandes puede ser recomendable usar un ORM tipado como Drizzle ORM.

Drizzle permite definir el esquema de la base de datos en TypeScript y realizar consultas con tipos comprobados por el editor y el compilador.

Ventajas de usar un ORM tipado:

- Mejor autocompletado.
- Menos errores entre código y base de datos.
- Consultas más mantenibles.
- Mayor seguridad al trabajar con tipos.
- Mejor integración con proyectos TypeScript.

Ejemplo conceptual:

```ts
const result = await db.select().from(products);
```

En este proyecto no se ha usado Drizzle en la implementación principal porque el objetivo era practicar SQL puro, relaciones, constraints y consultas manuales.

## Ejecución local

### Backend

```bash
cd backend
npm install
npm run dev
```

El backend se ejecuta por defecto en:

```txt
http://localhost:3001
```

Endpoint principal:

```txt
http://localhost:3001/api/products
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

El frontend se ejecuta normalmente en:

```txt
http://localhost:5173
```


## Entregable

El entregable final incluye:

- URL del frontend desplegado.
- Repositorio de GitHub.
- Código del backend.
- Código del frontend.
- Carpeta `sql/` con scripts de esquema y semilla.
- Carpeta `docs/` con la documentación técnica requerida.

## URLs de despliegue

Frontend desplegado: https://learning-inventory-iwjm.vercel.app

Backend desplegado: https://learning-inventory-tau.vercel.app

Endpoint de productos: https://learning-inventory-tau.vercel.app/api/products