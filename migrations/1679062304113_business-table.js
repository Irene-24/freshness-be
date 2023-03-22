exports.up = async (pgm) => {
  pgm.sql(`
    
    CREATE TABLE IF NOT EXISTS business (
        business_id uuid DEFAULT uuid_generate_v4() NOT NULL,
        
        business_email VARCHAR(50) NOT NULL UNIQUE,
        business_phone_number VARCHAR(20),
        logo_url VARCHAR,

        business_name VARCHAR(100) NOT NULL UNIQUE,

        merchant_id uuid NOT NULL,

        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

        PRIMARY KEY(business_id),
        CONSTRAINT fk_merchant
            FOREIGN KEY(merchant_id)
            REFERENCES users(id) 
        );
    
    `);
};

exports.down = async (pgm) => {
  pgm.dropTable("business");
};
