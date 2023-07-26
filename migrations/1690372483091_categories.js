/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.sql(`
    CREATE TABLE IF NOT EXISTS categories (
        id uuid DEFAULT uuid_generate_v4() NOT NULL,
        
        name VARCHAR(100) NOT NULL UNIQUE,
        image_url VARCHAR,
        description_url VARCHAR(500),

        is_enabled BOOLEAN NOT NULL DEFAULT TRUE,

        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

        PRIMARY KEY(id)
    );
  `);
};

exports.down = (pgm) => {
  pgm.dropTable("categories");
};
