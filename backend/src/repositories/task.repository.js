const db = require('../config/db');

const create = async (task) => {
  await db.execute(
    'INSERT INTO tasks (id, title, description, priority, status, assignee_id, project_id, organization_id, due_date, created_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [task.id, task.title, task.description, task.priority, task.status, task.assignee_id, task.project_id, task.organization_id, task.due_date, task.created_by]
  );
  return findById(task.id);
};

const findById = async (id) => {
  const [rows] = await db.execute('SELECT * FROM tasks WHERE id = ?', [id]);
  return rows[0];
};

const update = async (id, patch) => {
  await db.execute(
    'UPDATE tasks SET title = ?, description = ?, priority = ?, assignee_id = ?, project_id = ?, due_date = ? WHERE id = ?',
    [patch.title, patch.description, patch.priority, patch.assignee_id, patch.project_id, patch.due_date, id]
  );
  return findById(id);
};

const updateStatus = async (id, status) => {
  await db.execute('UPDATE tasks SET status = ? WHERE id = ?', [status, id]);
  return findById(id);
};

const remove = async (id) => {
  await db.execute('DELETE FROM tasks WHERE id = ?', [id]);
};

const paginationQuery = async ({ organization_id, assignee_id, status, priority, page, limit, currentUser }) => {
  const offset = (page - 1) * limit;
  const values = [organization_id];
  let sql = 'SELECT * FROM tasks WHERE organization_id = ?';

  if (assignee_id) {
    sql += ' AND assignee_id = ?';
    values.push(assignee_id);
  }
  if (status) {
    sql += ' AND status = ?';
    values.push(status);
  }
  if (priority) {
    sql += ' AND priority = ?';
    values.push(priority);
  }
  if (currentUser.role === 'MEMBER') {
    sql += ' AND assignee_id = ?';
    values.push(currentUser.id);
  }

  sql += ' ORDER BY due_date IS NULL, due_date ASC LIMIT ? OFFSET ?';
  values.push(limit, offset);

  const [rows] = await db.execute(sql, values);
  return rows;
};

module.exports = { create, findById, update, updateStatus, remove, paginationQuery };
