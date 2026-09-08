export const shorthands = undefined;

export const up = (pgm) => {
  pgm.createTable("partidas", {
    id: "id",
    grupo_id: { type: "integer", notNull: true, references: "grupos", onDelete: "CASCADE" },
    data: {
      type: "date",
      notNull: true,
    },
    status: {
      type: "varchar(20)",
      notNull: true,
      default: "agendada",
      check: "status IN ('agendada','realizada','cancelada')",
    },
    criado_em: {
      type: "timestamp",
      notNull: true,
      default: pgm.func("current_timestamp"),
    },
  });
};

export const down = (pgm) => {
  pgm.dropTable("partidas");
};
