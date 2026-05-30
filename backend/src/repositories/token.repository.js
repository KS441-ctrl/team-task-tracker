const db = require('../config/db');

const create = async (tokenRecord) => {
  await db.execute(
    'INSERT INTO refresh_tokens (id, token_hash, user_id, expires_at, revoked) VALUES (?, ?, ?, ?, ?)',
    [tokenRecord.id, tokenRecord.token_hash, tokenRecord.user_id, tokenRecord.expires_at, tokenRecord.revoked]
  );
};

const revokeByUser = async (userId) => {
  await db.execute('UPDATE refresh_tokens SET revoked = TRUE WHERE user_id = ?', [userId]);
};

const findActiveByUserId = async (userId) => {
  const [rows] = await db.execute(
    'SELECT * FROM refresh_tokens WHERE user_id = ? AND revoked = FALSE AND expires_at > NOW()',
    [userId]
  );
  return rows;
};

const revokeById = async (id) => {
  await db.execute('UPDATE refresh_tokens SET revoked = TRUE WHERE id = ?', [id]);
};

module.exports = { create, revokeByUser, findActiveByUserId, revokeById };
