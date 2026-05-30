import { useEffect, useState } from 'react';
import { createProject, getProjects } from '../api';

const Projects = ({ token }) => {
  const [projects, setProjects] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const loadProjects = async () => {
    try {
      const data = await getProjects(token);
      setProjects(data);
      setError(null);
    } catch (err) {
      setError(err.message || 'Unable to load projects');
    }
  };

  useEffect(() => {
    if (!token) return;
    loadProjects();
  }, [token]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      const project = await createProject(token, { name, description });
      setProjects((prev) => [project, ...prev]);
      setName('');
      setDescription('');
      setSuccess('Project created successfully.');
    } catch (err) {
      setError(err.message || 'Unable to create project');
    }
  };

  return (
    <div className="page-card">
      <h1>Projects</h1>
      <p>Create and manage projects for your organization.</p>

      <form onSubmit={handleSubmit} className="form-grid project-form">
        <label>
          Project name
          <input value={name} onChange={(e) => setName(e.target.value)} type="text" required />
        </label>
        <label>
          Description
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows="3" />
        </label>
        <button type="submit">Create project</button>
      </form>

      {success && <div className="success-message">{success}</div>}
      {error && <div className="error-message">{error}</div>}

      {projects.length === 0 ? (
        <p>No projects found for your organization.</p>
      ) : (
        <div className="list-grid">
          {projects.map((project) => (
            <div key={project.id} className="list-card">
              <h3>{project.name}</h3>
              <p>{project.description || 'No description available.'}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Projects;
