const { v4: uuidv4 } = require('uuid');
const projectRepository = require('../repositories/project.repository');

const createProject = async ({ name, description, user }) => {
  return projectRepository.create({
    id: uuidv4(),
    name,
    description,
    organization_id: user.organization_id,
    created_by: user.id
  });
};

const listProjects = async (user) => {
  return projectRepository.listByOrganization(user.organization_id);
};

const getProject = async (id) => {
  const project = await projectRepository.findById(id);
  if (!project) {
    const error = new Error('Project not found');
    error.status = 404;
    error.code = 'NOT_FOUND';
    throw error;
  }
  return project;
};

const updateProject = async (id, patch) => {
  const project = await projectRepository.findById(id);
  if (!project) {
    const error = new Error('Project not found');
    error.status = 404;
    error.code = 'NOT_FOUND';
    throw error;
  }
  return projectRepository.update(id, patch);
};

const deleteProject = async (id) => {
  const project = await projectRepository.findById(id);
  if (!project) {
    const error = new Error('Project not found');
    error.status = 404;
    error.code = 'NOT_FOUND';
    throw error;
  }
  await projectRepository.remove(id);
};

module.exports = { createProject, listProjects, getProject, updateProject, deleteProject };
