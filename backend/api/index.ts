import express from "express";
import cors from "cors";
import { productsRouter } from "../src/routes/products";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (_req, res) => {
  res.json({
    message: "Learning Inventory API funcionando en Vercel"
  });
});

app.use("/api/products", productsRouter);

export default app;