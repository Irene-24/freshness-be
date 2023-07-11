/* eslint-disable camelcase */

exports.up = async (pgm) => {
  pgm.sql(`
    ALTER TABLE business
    ADD COLUMN is_active BOOLEAN DEFAULT true;
  `);

  pgm.sql(`
    CREATE OR REPLACE FUNCTION UPDATE_BUSINESS_ON_DELETE_MERCHANT()
    RETURNS TRIGGER AS $$
    BEGIN
      UPDATE business SET is_active = false WHERE merchant_id = OLD.id;
      RETURN OLD;
    END;
    $$ LANGUAGE plpgsql;

    CREATE TRIGGER update_business_trigger
    AFTER DELETE ON users
    FOR EACH ROW
    EXECUTE FUNCTION UPDATE_BUSINESS_ON_DELETE_MERCHANT();
  `);
};

exports.down = async (pgm) => {
  pgm.sql(`
    DROP TRIGGER IF EXISTS update_business_trigger ON users;
    DROP FUNCTION IF EXISTS UPDATE_BUSINESS_ON_DELETE_MERCHANT();
  `);

  pgm.sql(`
    ALTER TABLE business
    DROP COLUMN IF EXISTS is_active;
  `);
};
