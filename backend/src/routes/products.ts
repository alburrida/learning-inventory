import { Router } from "express";
import { sql } from "../lib/db";

export const productsRouter = Router();

productsRouter.get("/", async (_req, res) => {
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

    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error obteniendo productos" });
  }
});

productsRouter.post("/", async (req, res) => {
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

    res.status(201).json(createdProduct[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creando producto" });
  }
});