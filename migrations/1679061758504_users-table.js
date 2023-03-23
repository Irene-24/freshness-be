exports.up = async (pgm) => {
  pgm.sql(`
 
        CREATE TABLE IF NOT EXISTS users (
        id uuid DEFAULT uuid_generate_v4() NOT NULL,
        
        first_name VARCHAR(50) ,
        last_name VARCHAR(50) ,
        email VARCHAR(50) NOT NULL UNIQUE,
        phone_number VARCHAR(20),
        avatar_url VARCHAR,
        user_name VARCHAR(50) ,

        password VARCHAR(255),
        sso_provider VARCHAR(50),
        sso_provider_user_id VARCHAR(255),

        role VARCHAR CHECK (role in ('CUSTOMER', 'MERCHANT','ADMIN')),

        -- When users are deleted set these to false, ie soft delete
        isEnabled BOOLEAN NOT NULL DEFAULT TRUE,

        -- For email sign up, to verify user
        isVerified BOOLEAN NOT NULL DEFAULT FALSE,

        -- To know which admin created another
        created_by uuid,

        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

        PRIMARY KEY(id),

        CONSTRAINT fk_created_by
        FOREIGN KEY(created_by)
            REFERENCES users(id) 
        ON DELETE SET NULL 
        );
 
 `);
};

exports.down = async (pgm) => {
  pgm.dropTable("users");
};
