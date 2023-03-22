exports.up = async (pgm) => {
  pgm.createExtension("uuid-ossp", {
    ifNotExists: true,
  });
};

exports.down = async (pgm) => {
  pgm.dropExtension("uuid-ossp");
};
