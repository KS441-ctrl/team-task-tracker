import { useEffect, useState } from 'react';
import { createTask, getProjects, getTasks } from '../api';

const Tasks = ({ token }) => {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('LOW');
  const [projectId, setProjectId] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const loadData = async () => {
    try {
      const [tasksResponse, projectsResponse] = await Promise.all([getTasks(token), getProjects(token)]);
      setTasks(tasksResponse);
      setProjects(projectsResponse);
      setError(null);
    } catch (err) {
      setError(err.message || 'Unable to fetch tasks and projects');
    }
  };

  useEffect(() => {
    if (!token) return;
    loadData();
  }, [token]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      const task = await createTask(token, {
        title,
        description,
        priority,
        project_id: projectId || null,
        due_date: dueDate || null
      });
      setTasks((prev) => [task, ...prev]);
      setTitle('');
      setDescription('');
      setPriority('LOW');
      setProjectId('');
      setDueDate('');
      setSuccess('Task created successfully.');
    } catch (err) {
      setError(err.message || 'Unable to create task');
    }
  };

  return (
    <div className="page-card">
      <h1>Tasks</h1>
      <p>Create tasks and review your team’s task status.</p>

      <form onSubmit={handleSubmit} className="form-grid task-form">
        <label>
          Title
          <input value={title} onChange={(e) => setTitle(e.target.value)} type="text" required />
        </label>
        <label>
          Description
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows="3" />
        </label>
        <label>
          Priority
          <select value={priority} onChange={(e) => setPriority(e.target.value)}>
            <option value="LOW">LOW</option>
            <option value="MEDIUM">MEDIUM</option>
            <option value="HIGH">HIGH</option>
          </select>
        </label>
        <label>
          Project
          <select value={projectId} onChange={(e) => setProjectId(e.target.value)}>
            <option value="">No project</option>
            {projects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          Due date
          <input value={dueDate} onChange={(e) => setDueDate(e.target.value)} type="datetime-local" />
        </label>
        <button type="submit">Create task</button>
      </form>

      {success && <div className="success-message">{success}</div>}
      {error && <div className="error-message">{error}</div>}

      {tasks.length === 0 ? (
        <p>No tasks found for your organization.</p>
      ) : (
        <div className="list-grid">
          {tasks.map((task) => (
            <div key={task.id} className="list-card">
              <div className="task-row">
                <h3>{task.title}</h3>
                <span className="task-status">{task.status}</span>
              </div>
              <p>{task.description || 'No description available.'}</p>
              <p>
                <strong>Priority:</strong> {task.priority || 'N/A'}
              </p>
              {task.project_id && <p><strong>Project:</strong> {task.project_id}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Tasks;
