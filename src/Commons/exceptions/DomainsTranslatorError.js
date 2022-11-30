const InvariantError = require('./InvariantError');

const DomainsTranslatorError = {
  /**
   * @param {Error} error
   * @returns {(InvariantError|Error)}
   */
  translate: (error) => DomainsTranslatorError.dictionaries[error.message] || error,
};

DomainsTranslatorError.dictionaries = {
  'REGISTER_USER.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError('tidak dapat membuat user baru karena properti yang dibutuhkan tidak ada'),
  'REGISTER_USER.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('tidak dapat membuat user baru karena tipe data tidak sesuai'),
  'REGISTER_USER.USERNAME_LIMIT_CHAR': new InvariantError('tidak dapat membuat user baru karena karakter username melebihi batas limit'),
  'REGISTER_USER.USERNAME_CONTAIN_RESTRICTED_CHARACTER': new InvariantError('tidak dapat membuat user baru karena username mengandung karakter terlarang'),
};

module.exports = DomainsTranslatorError;
