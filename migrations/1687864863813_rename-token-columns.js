exports.up = async (pgm) => {
  // Check if the column isVerified exists
  const isVerifiedExists = await pgm.db.query(`
    SELECT EXISTS (
      SELECT 1
      FROM information_schema.columns
      WHERE table_name = 'users'
      AND column_name = 'isVerified'
    );
  `);

  if (isVerifiedExists.rows[0].exists) {
    pgm.sql(`ALTER TABLE users RENAME COLUMN isVerified TO is_verified;`);
  }

  // Check if the column isEnabled exists
  const isEnabledExists = await pgm.db.query(`
    SELECT EXISTS (
      SELECT 1
      FROM information_schema.columns
      WHERE table_name = 'users'
      AND column_name = 'isEnabled'
    );
  `);

  if (isEnabledExists.rows[0].exists) {
    pgm.sql(`ALTER TABLE users RENAME COLUMN isEnabled TO is_enabled;`);
  }
};

exports.down = async (pgm) => {
  // Check if the column is_verified exists
  const isVerifiedExists = await pgm.db.query(`
    SELECT EXISTS (
      SELECT 1
      FROM information_schema.columns
      WHERE table_name = 'users'
      AND column_name = 'is_verified'
    );
  `);

  if (isVerifiedExists.rows[0].exists) {
    pgm.sql(`ALTER TABLE users RENAME COLUMN is_verified TO isVerified;`);
  }

  // Check if the column is_enabled exists
  const isEnabledExists = await pgm.db.query(`
    SELECT EXISTS (
      SELECT 1
      FROM information_schema.columns
      WHERE table_name = 'users'
      AND column_name = 'is_enabled'
    );
  `);

  if (isEnabledExists.rows[0].exists) {
    pgm.sql(`ALTER TABLE users RENAME COLUMN is_enabled TO isEnabled;`);
  }
};
