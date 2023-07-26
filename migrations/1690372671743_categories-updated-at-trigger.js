/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.sql(`

      DROP TRIGGER IF EXISTS set_category_updated_at_trigger ON categories;

      CREATE OR REPLACE FUNCTION UPDATE_CATEGORY_UPDATED_AT()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW.updated_at := NOW(); 
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;
    

      CREATE TRIGGER set_category_updated_at_trigger
      BEFORE UPDATE ON categories
      FOR EACH ROW
      WHEN (OLD IS DISTINCT FROM NEW) -- Only execute the trigger when the row is changed
      EXECUTE FUNCTION UPDATE_CATEGORY_UPDATED_AT();

  `);
};

exports.down = (pgm) => {
  pgm.sql(`
    DROP TRIGGER IF EXISTS set_category_updated_at_trigger ON categories;
    DROP FUNCTION IF EXISTS  UPDATE_CATEGORY_UPDATED_AT();
  `);
};
