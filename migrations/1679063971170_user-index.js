exports.up = async (pgm) => {
  pgm.createIndex("users", "email", {
    name: "idx_user_email",
    ifNotExists: true,
  });

  pgm.createIndex("users", "sso_provider_user_id", {
    name: "idx_sso_id",
    ifNotExists: true,
  });

  pgm.createIndex("user_tokens", "user_id", {
    name: "idx_user_token",
    ifNotExists: true,
  });
};

exports.down = async (pgm) => {
  pgm.dropIndex("users", "email", {
    name: "idx_user_email",
  });

  pgm.dropIndex("users", "sso_provider_user_id", {
    name: "idx_sso_id",
  });

  pgm.dropIndex("user_tokens", "user_id", {
    name: "idx_user_token",
  });
};
