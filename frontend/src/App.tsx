import { useEffect, useState } from "react";
import "./App.css";

type Product = {
  id: string;
  name: string;
  price: string;
  stock: number;
  category_name: string;
};

function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const apiUrl = import.meta.env.VITE_API_URL;

    fetch(`${apiUrl}/api/products`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("No se pudo conectar con la API");
        }

        return response.json();
      })
      .then((data) => {
        setProducts(data);
      })
      .catch((error) => {
        console.error("Error cargando productos:", error);
        setError("No se pudieron cargar los productos.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <main className="page">
      <section className="card">
        <div className="header">
          <div>
            <p className="eyebrow">PostgreSQL + Neon</p>
            <h1>Learning Inventory</h1>
            <p className="description">
              Inventario conectado a una base de datos relacional serverless.
            </p>
          </div>

          <span className="badge">{products.length} productos</span>
        </div>

        {loading && <p className="status">Cargando productos...</p>}

        {error && <p className="error">{error}</p>}

        {!loading && !error && (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>Categoría</th>
                  <th>Precio</th>
                  <th>Stock</th>
                </tr>
              </thead>

              <tbody>
                {products.map((product) => (
                  <tr key={product.id}>
                    <td>{product.name}</td>
                    <td>{product.category_name}</td>
                    <td>{Number(product.price).toFixed(2)} €</td>
                    <td>{product.stock}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}

export default App;