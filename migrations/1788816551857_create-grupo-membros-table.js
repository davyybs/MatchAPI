export const shorthands = undefined;

export const up = (pgm) => {
  pgm.createTable(
    'grupo_membros',
    {
      grupo_id: {
        type: 'integer',
        notNull: true,
        references: 'grupos',
        onDelete: 'CASCADE',
      },
      usuario_id: {
        type: 'integer',
        notNull: true,
        references: 'usuarios',
        onDelete: 'CASCADE',
      },
      papel: {
        type: 'varchar(20)',
        notNull: true,
        default: 'membro',
        check: "papel IN ('admin', 'membro')",
      },
      entrou_em: {
        type: 'timestamp',
        notNull: true,
        default: pgm.func('current_timestamp'),
      },
    },
    {
      constraints: {
        primaryKey: ['grupo_id', 'usuario_id'],
      },
    }
  );
};

export const down = (pgm) => {
  pgm.dropTable('grupo_membros');
};