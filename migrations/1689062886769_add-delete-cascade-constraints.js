/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.dropConstraint("user_tokens", "fk_user_id");

  pgm.addConstraint("user_tokens", "fk_user_id", {
    foreignKeys: {
      columns: "user_id",
      references: "users(id)",
      onDelete: "CASCADE",
    },
  });
};

exports.down = (pgm) => {
  pgm.dropConstraint("user_tokens", "fk_user_id");

  pgm.addConstraint("user_tokens", "fk_user_id", {
    foreignKeys: {
      columns: "user_id",
      references: "users(id)",
    },
  });
};

// CREATE TABLE IF NOT EXISTS user_tokens(
//     user_id uuid NOT NULL UNIQUE,
//     refresh_token VARCHAR(255),
//     verify_token VARCHAR(255),
//     CONSTRAINT fk_user_id FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
// );
