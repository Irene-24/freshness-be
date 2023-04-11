/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.sql(`
    ALTER TABLE users 
        RENAME isVerified TO is_verified;
        
    ALTER TABLE users 
        RENAME isEnabled TO is_enabled;
       
        
        `);
};

exports.down = (pgm) => {
  pgm.sql(` ALTER TABLE users 
        RENAME is_verified TO isVerified;
        
    ALTER TABLE users 
        RENAME is_enabled TO isEnabled;`);
};
