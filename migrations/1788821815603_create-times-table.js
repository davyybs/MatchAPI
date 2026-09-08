export const shorthands = undefined;

export const up = (pgm) => {
  pgm.createTable("times", {
    id: "id",
    partida_id: {
      type: "integer",
      notNull: true,
      references: "partidas",
      onDelete: "CASCADE",
    },
    nome: { type: "varchar(50)", notNull: true },
    criado_em: {
      type: "timestamp",
      notNull: true,
      default: pgm.func("current_timestamp"),
    },
  });
};

export const down = (pgm) => {
  pgm.dropTable("times");
};
