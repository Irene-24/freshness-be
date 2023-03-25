exports.up = async (pgm) => {
  pgm.sql(`
    
    
        CREATE TABLE IF NOT EXISTS user_tokens(

        user_id uuid NOT NULL UNIQUE,
        refreshToken VARCHAR(255),

        -- for things like verify email, or validate reset password, etc
        verifyToken  VARCHAR(255),
        
        
        CONSTRAINT fk_user_id
        FOREIGN KEY(user_id)
            REFERENCES users(id) 
        );

    
    `);
};

exports.down = async (pgm) => {
  pgm.dropTable("user_tokens");
};
