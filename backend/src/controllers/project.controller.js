const projectService = require('../services/project.service');

const createProject = async (req, res, next) => {
  try {
    const project = await projectService.createProject({ ...req.body, user: req.user });
    return res.status(201).json({ status: 201, code: 'PROJECT_CREATED', data: project });
  } catch (error) {
    next(error);
  }
};

const listProjects = async (req, res, next) => {
  try {
    const projects = await projectService.listProjects(req.user);
    return res.status(200).json({ status: 200, code: 'PROJECTS_LISTED', data: projects });
  } catch (error) {
    next(error);
  }
};

const getProject = async (req, res, next) => {
  try {
    const project = await projectService.getProject(req.params.id);
    return res.status(200).json({ status: 200, code: 'PROJECT_FOUND', data: project });
  } catch (error) {
    next(error);
  }
};

const updateProject = async (req, res, next) => {
  try {
    const project = await projectService.updateProject(req.params.id, req.body);
    return res.status(200).json({ status: 200, code: 'PROJECT_UPDATED', data: project });
  } catch (error) {
    next(error);
  }
};

const deleteProject = async (req, res, next) => {
  try {
    await projectService.deleteProject(req.params.id);
    return res.status(200).json({ status: 200, code: 'PROJECT_DELETED', message: 'Project deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = { createProject, listProjects, getProject, updateProject, deleteProject };
