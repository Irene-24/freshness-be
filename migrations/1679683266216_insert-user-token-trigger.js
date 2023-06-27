exports.up = (pgm) => {
  pgm.sql(`
    DROP TRIGGER IF EXISTS insert_user_token ON users;

    CREATE OR REPLACE FUNCTION INSERT_USER_TOKEN_FUNCTION() RETURNS TRIGGER AS $$
    BEGIN
      INSERT INTO user_tokens (user_id) VALUES (NEW.id);
      RETURN NEW;
    END;
    $$ LANGUAGE PLPGSQL;

    CREATE TRIGGER insert_user_token
    AFTER INSERT ON users
    FOR EACH ROW EXECUTE FUNCTION INSERT_USER_TOKEN_FUNCTION();
  `);
};

exports.down = (pgm) => {
  pgm.sql(`
    DROP TRIGGER IF EXISTS insert_user_token ON users;
    DROP FUNCTION IF EXISTS INSERT_USER_TOKEN_FUNCTION();
  `);
};
