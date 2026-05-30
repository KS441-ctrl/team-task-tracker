import { NavLink } from 'react-router-dom';

const Navbar = ({ user, onLogout }) => {
  return (
    <nav className="navbar">
      <div className="nav-brand">Team Task Tracker</div>
      <div className="nav-links">
        <NavLink to="/dashboard">Dashboard</NavLink>
        <NavLink to="/projects">Projects</NavLink>
        <NavLink to="/tasks">Tasks</NavLink>
        {user && <span className="nav-user">{user.name} ({user.role})</span>}
        <button type="button" onClick={onLogout}>Logout</button>
      </div>
    </nav>
  );
};

export default Navbar;
