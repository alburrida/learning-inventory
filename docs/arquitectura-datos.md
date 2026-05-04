# Arquitectura de datos

La aplicación utiliza una base de datos relacional PostgreSQL desplegada en Neon. El objetivo es almacenar productos y categorías de forma persistente, evitando que los datos dependan de la memoria del navegador o del servidor.

## Modelo relacional

El modelo está compuesto por dos tablas principales:

- `categories`
- `products`

La tabla `categories` almacena las categorías del inventario. Cada categoría tiene un identificador único `id`, un nombre único, una descripción y una fecha de creación.

La tabla `products` almacena los productos. Cada producto tiene un identificador único, nombre, precio, stock y una referencia a la categoría a la que pertenece.

## Claves primarias

Ambas tablas utilizan un campo `id` de tipo UUID como clave primaria.

El uso de UUID permite generar identificadores únicos sin depender de números autoincrementales. Esto es útil en sistemas modernos y distribuidos, donde los datos pueden crearse desde distintos entornos.

## Foreign key category_id

El campo `category_id` de la tabla `products` es una foreign key que apunta al campo `id` de la tabla `categories`.

Esto significa que un producto no puede estar asociado a una categoría inexistente. PostgreSQL se encarga de validar esta relación y rechaza cualquier inserción o actualización que rompa la integridad referencial.

Por ejemplo, si se intenta crear un producto con un `category_id` que no existe en `categories`, la base de datos no permitirá la operación.

## ON DELETE CASCADE vs ON DELETE RESTRICT

`ON DELETE CASCADE` elimina automáticamente los productos asociados cuando se borra una categoría.

`ON DELETE RESTRICT` impide borrar una categoría si existen productos relacionados con ella.

En este proyecto se ha elegido `ON DELETE RESTRICT` porque es el comportamiento más seguro para un sistema de inventario. Borrar una categoría no debería eliminar productos automáticamente, ya que podría provocar pérdida accidental de datos. Lo correcto es obligar al usuario o administrador a revisar primero los productos asociados.