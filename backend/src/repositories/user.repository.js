const db = require('../config/db');

const findByEmail = async (email) => {
  const [rows] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
  return rows[0];
};

const findById = async (id) => {
  const [rows] = await db.execute('SELECT * FROM users WHERE id = ?', [id]);
  return rows[0];
};

const create = async (user) => {
  await db.execute(
    'INSERT INTO users (id, name, email, password, role, organization_id) VALUES (?, ?, ?, ?, ?, ?)',
    [user.id, user.name, user.email, user.password, user.role, user.organization_id]
  );
  return findById(user.id);
};

const listByOrganization = async (organizationId) => {
  const [rows] = await db.execute('SELECT id, name, email, role FROM users WHERE organization_id = ?', [organizationId]);
  return rows;
};

module.exports = { findByEmail, findById, create, listByOrganization };
