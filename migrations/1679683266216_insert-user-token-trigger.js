exports.up = (pgm) => {
  pgm.sql(`
    
            CREATE TRIGGER insert_user_token    
            AFTER INSERT ON users
            FOR EACH ROW
                INSERT INTO user_token (user_id) VALUES (NEW.id);
        `);
};

exports.down = (pgm) => {
  pgm.sql(`DROP TRIGGER insert_user_token;`);
};
