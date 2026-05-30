const db = require('../config/db');

const create = async (organization) => {
  await db.execute('INSERT INTO organizations (id, name) VALUES (?, ?)', [organization.id, organization.name]);
  return organization;
};

const findByName = async (name) => {
  const [rows] = await db.execute('SELECT * FROM organizations WHERE name = ?', [name]);
  return rows[0];
};

module.exports = { create, findByName };
