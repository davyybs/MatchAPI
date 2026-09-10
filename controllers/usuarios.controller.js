import bcrypt from "bcrypt";
import { pool } from "../db.js";

export const criarUsuario = async (req, res) => {
  const { nome, email, senha } = req.body;

  if (!nome || !email || !senha) {
    return res
      .status(400)
      .json({ erro: "nome, email e senha são obrigatórios" });
  }

  try {
    const senha_hash = await bcrypt.hash(senha, 10);

    const resultado = await pool.query(
      `INSERT INTO usuarios (nome, email, senha_hash)
       VALUES ($1, $2, $3)
       RETURNING id, nome, email, criado_em`,
      [nome, email, senha_hash],
    );

    res.status(201).json(resultado.rows[0]);
  } catch (error) {
    if (error.code === "23505") {
      return res.status(409).json({ erro: "email já cadastrado" });
    }
    console.error("Erro ao criar usuário:", error.message);
    res.status(500).json({ erro: "erro interno ao criar usuário" });
  }
};

export const listarUsuarios = async (req, res) => {
  try {
    const resultado = await pool.query(
      "SELECT id, nome, email, criado_em FROM usuarios ORDER BY id",
    );
    res.status(200).json(resultado.rows);
  } catch (error) {
    console.error("Erro ao listar usuários", error.message);
    res.status(500).json({ erro: "erro interno ao listar usuários" });
  }
};

export const listarUsuariosPorID = async (req, res) => {
  const { id } = req.params;

  try {
    const resultado = await pool.query(
      "SELECT id, nome, email, criado_em FROM usuarios WHERE id = $1",
      [id],
    );

    if (resultado.rows.length === 0) {
      res.status(404).json({ erro: "usuário não encontrado" });
    }

    res.status(200).json(resultado.rows[0]);
  } catch (error) {
    console.error("Erro ao buscar usuário", error.message);
    res.status(500).json({ erro: "erro interno ao buscar usuário" });
  }
};

export const atualizarUsuario = async (req, res) => {
  const { id } = req.params;
  const { nome, email } = req.body;

  if (!nome || !email) {
    return res.status(400).json({ erro: "nome e email são obrigatórios" });
  }

  try {
    const resultado = await pool.query(
      `UPDATE usuarios
       SET nome = $1, email = $2
       WHERE id = $3
       RETURNING id, nome, email, criado_em`,
      [nome, email, id],
    );

    if (resultado.rows.length === 0) {
      res.status(404).json({ erro: "usuário não encontrado" });
    }

    res.status(200).json(resultado.rows[0]);
  } catch (error) {
    if (error.code === "32505") {
      return res.status(409).json({ erro: "email já cadastrado" });
    }

    console.error("Erro ao atualizar as informações do usuário", error.message);
    res
      .status(500)
      .json({ erro: "erro interno ao atualizar informações do usuário" });
  }
};

export const deletarUsuario = async (req, res) => {
  const { id } = req.params;

  try {
    const resultado = await pool.query(
      "DELETE FROM usuarios WHERE id = $1 RETURNING id",
      [id],
    );

    if (resultado.rows.length === 0) {
      return res.status(404).json({ erro: "usuário não encontrado" });
    }

    res.status(204).send();
  } catch (error) {
    console.error("Erro ao deletar usuário:", error.message);
    res.status(500).json({ erro: "erro interno ao deletar usuário" });
  }
};
