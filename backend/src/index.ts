import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { productsRouter } from "./routes/products";

dotenv.config({ path: ".env.local" });

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (_req, res) => {
  res.json({
    message: "Learning Inventory API funcionando"
  });
});

app.use("/api/products", productsRouter);

const port = Number(process.env.PORT) || 3001;

app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});