import { sql } from "../src/lib/db";

export default async function handler(req: any, res: any) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method === "GET") {
    try {
      const products = await sql`
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
        ORDER BY products.created_at DESC
      `;

      return res.status(200).json(products);
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        message: "Error obteniendo productos"
      });
    }
  }

  if (req.method === "POST") {
    try {
      const { name, price, stock, category_id } = req.body;

      if (!name || !price || !category_id) {
        return res.status(400).json({
          message: "name, price y category_id son obligatorios"
        });
      }

      const createdProduct = await sql`
        INSERT INTO products (name, price, stock, category_id)
        VALUES (${name}, ${price}, ${stock ?? 0}, ${category_id})
        RETURNING *
      `;

      return res.status(201).json(createdProduct[0]);
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        message: "Error creando producto"
      });
    }
  }

  return res.status(405).json({
    message: "Método no permitido"
  });
}