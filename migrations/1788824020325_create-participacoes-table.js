export const shorthands = undefined;

export const up = (pgm) => {
  pgm.createTable(
    "participacoes",
    {
      partida_id: {
        type: "integer",
        notNull: true,
        references: "partidas",
        onDelete: "CASCADE",
      },
      usuario_id: {
        type: "integer",
        notNull: true,
        references: "usuarios",
        onDelete: "CASCADE",
      },
      time_id: {
        type: "integer",
        references: "times",
        onDelete: "SET NULL",
      },
      status: {
        type: "varchar(20)",
        notNull: true,
        default: "confirmado",
        check: "status IN ('confirmado', 'cancelado')",
      },
      confirmado_em: {
        type: "timestamp",
        notNull: true,
        default: pgm.func("current_timestamp"),
      },
    },
    {
      constraints: { primaryKey: ["partida_id", "usuario_id"] },
    },
  );
};

export const down = (pgm) => {
  pgm.dropTable("participacoes");
};
