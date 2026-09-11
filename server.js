import express from "express";
import { pool } from "./db.js";
import usuarioRoutes from "./routes/usuarios.routes.js";
import gruposRoutes from "./routes/grupos.routes.js";
import authRoutes from "./routes/auth.routes.js";

const app = express();
const PORT = 3000;

app.use(express.json());

app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

app.get("/health/db", async (req, res) => {
  try {
    await pool.query("SELECT 1");
    res.status(200).json({ status: "ok", database: "connected" });
  } catch (error) {
    console.error("Erro ao conectar no banco:", error.message);
    res.status(500).json({ status: "error", database: "disconnected" });
  }
});

app.use("/usuarios", usuarioRoutes);
app.use("/grupos", gruposRoutes);
app.use("/auth", authRoutes);

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
