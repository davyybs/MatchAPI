import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import { pool } from "../db.js";

dotenv.config();

export const login = async (req, res) => {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({ erro: "email e senha são obrigatórios" });
  }

  try {
    const resultado = await pool.query(
      "SELECT id, senha_hash FROM usuarios WHERE email = $1",
      [email],
    );

    if (resultado.rows.length === 0) {
      return res
        .status(401)
        .json({ erro: "Usuário não existe ou senha inválida" });
    }

    if (await bcrypt.compare(senha, resultado.rows[0].senha_hash)) {
      const token = jwt.sign({ id: resultado.rows[0].id }, process.env.JWT_SECRET, {
        expiresIn: "1d",
      });
      res.status(200).json({ token });
    } else {
      return res
        .status(401)
        .json({ erro: "Usuário não existe ou senha inválida" });
    }
  } catch (error) {
    console.error("Erro ao fazer login", error.message);
    res.status(500).json({ erro: "erro interno ao fazer login" });
  }
};
