export const shorthands = undefined;

export const up = (pgm) => {
  pgm.createTable('grupos', {
    id: 'id',
    nome: { type: 'varchar(100)', notNull: true },
    descricao: { type: 'text' },
    dia_semana: {
      type: 'smallint',
      notNull: true,
      check: 'dia_semana BETWEEN 0 AND 6',
    },
    horario: { type: 'time', notNull: true },
    local: { type: 'varchar(150)', notNull: true },
    ativo: { type: 'boolean', notNull: true, default: true },
    criado_por: {
      type: 'integer',
      references: 'usuarios',
      onDelete: 'SET NULL',
    },
    criado_em: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
  });
};

export const down = (pgm) => {
  pgm.dropTable('grupos');
};