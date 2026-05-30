const db = require('../config/db');

const create = async (project) => {
  await db.execute(
    'INSERT INTO projects (id, name, description, organization_id, created_by) VALUES (?, ?, ?, ?, ?)',
    [project.id, project.name, project.description, project.organization_id, project.created_by]
  );
  return findById(project.id);
};

const findById = async (id) => {
  const [rows] = await db.execute('SELECT * FROM projects WHERE id = ?', [id]);
  return rows[0];
};

const listByOrganization = async (organizationId) => {
  const [rows] = await db.execute('SELECT * FROM projects WHERE organization_id = ?', [organizationId]);
  return rows;
};

const update = async (id, patch) => {
  await db.execute(
    'UPDATE projects SET name = ?, description = ? WHERE id = ?',
    [patch.name, patch.description, id]
  );
  return findById(id);
};

const remove = async (id) => {
  await db.execute('DELETE FROM projects WHERE id = ?', [id]);
};

module.exports = { create, findById, listByOrganization, update, remove };
