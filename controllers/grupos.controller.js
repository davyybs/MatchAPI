import { pool } from "../db.js";

export const criarGrupo = async (req, res) => {
  const { nome, descricao, dia_semana, horario, local, usuario_id } = req.body;

  if (!nome || dia_semana === undefined || !horario || !local || !usuario_id) {
    return res.status(400).json({
      erro: "nome, dia_semana, horario, local e usuario_id são obrigatórios",
    });
  }

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const grupoResultado = await client.query(
      `INSERT INTO grupos (nome, descricao, dia_semana, horario, local, criado_por)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, nome, descricao, dia_semana, horario, local, ativo, criado_por, criado_em`,
      [nome, descricao, dia_semana, horario, local, usuario_id],
    );

    const grupo = grupoResultado.rows[0];

    await client.query(
      `INSERT INTO grupo_membros (grupo_id, usuario_id, papel)
       VALUES ($1, $2, 'admin')`,
      [grupo.id, usuario_id],
    );

    await client.query("COMMIT");

    res.status(201).json(grupo);
  } catch (error) {
    await client.query("ROLLBACK");

    if (error.code === "23503") {
      return res.status(400).json({ erro: "usuario_id informado não existe" });
    }
    if (error.code === "23514") {
      return res
        .status(400)
        .json({ erro: "dia_semana deve estar entre 0 e 6" });
    }

    console.error("Erro ao criar grupo:", error.message);
    res.status(500).json({ erro: "erro interno ao criar grupo" });
  } finally {
    client.release();
  }
};

export const listarGrupos = async (req, res) => {
  try {
    const resultado = await pool.query(
      `SELECT id, nome, descricao, dia_semana, horario, local, ativo, criado_por, criado_em
       FROM grupos ORDER BY id`,
    );

    res.status(200).json(resultado.rows);
  } catch (error) {
    console.error("Erro ao listar grupos", error.message);
    res.status(500).json({ erro: "erro interno ao listar grupos" });
  }
};

export const buscarGrupoPorId = async (req, res) => {
  const { id } = req.params;

  try {
    const resultado = await pool.query(
      `SELECT id, nome, descricao, dia_semana, horario, local, ativo, criado_por, criado_em
       FROM grupos WHERE id = $1`,
      [id],
    );
  } catch (error) {
    console.error("Erro ao buscar grupo", error.message);
    res.status(500).json({ erro: "erro interno ao buscar grupo" });
  }
};

export const atualizarGrupo = async (req, res) => {
  const { id } = req.params;
  const { nome, descricao, dia_semana, horario, local, ativo } = req.body;

  if (
    !nome ||
    dia_semana === undefined ||
    !horario ||
    !local ||
    ativo === undefined
  ) {
    return res.status(400).json({
      erro: "nome, dia_semana, horario, local e ativo são obrigatórios",
    });
  }

  try {
    const resultado = await pool.query(
      `UPDATE grupos
       SET nome = $1, descricao = $2, dia_semana = $3, horario = $4, local = $5, ativo = $6
       WHERE id = $7
       RETURNING id, nome, descricao, dia_semana, horario, local, ativo, criado_por, criado_em`,
      [nome, descricao, dia_semana, horario, local, ativo, id],
    );

    if (resultado.rows.length === 0) {
      return res.status(404).json({ erro: "grupo não encontrado" });
    }

    res.status(200).json(resultado.rows[0]);
  } catch (error) {
    if (error.code === "23514") {
      return res
        .status(400)
        .json({ erro: "dia_semana deve estar entre 0 e 6" });
    }
    console.error("Erro ao atualizar grupo:", error.message);
    res.status(500).json({ erro: "erro interno ao atualizar grupo" });
  }
};

export const deletarGrupo = async (req, res) => {
  const { id } = req.params;

  try {
    const resultado = await pool.query(
      "DELETE FROM grupos WHERE id = $1 RETURNING id",
      [id],
    );

    if (resultado.rows.length === 0) {
      return res.status(404).json({ erro: "grupo não encontrado" });
    }

    res.status(204).send();
  } catch (error) {
    console.error("Erro ao deletar grupo:", error.message);
    res.status(500).json({ erro: "erro interno ao deletar grupo" });
  }
};
