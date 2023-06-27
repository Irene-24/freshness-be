/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.sql(`
    ALTER TABLE user_tokens 
        RENAME refreshToken TO refresh_token;
        
    ALTER TABLE user_tokens 
        RENAME verifyToken TO verify_token;
       
        
        `);
};

exports.down = (pgm) => {
  pgm.sql(` ALTER TABLE user_tokens 
        RENAME refresh_token TO refreshToken;
        
    ALTER TABLE user_tokens 
        RENAME verify_token TO verifyToken;`);
};
