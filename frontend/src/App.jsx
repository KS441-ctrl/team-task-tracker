import { useState } from 'react';
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Projects from './pages/Projects';
import Tasks from './pages/Tasks';
import Navbar from './components/Navbar';

const getStoredAuth = () => {
  const user = localStorage.getItem('user');
  return {
    accessToken: localStorage.getItem('accessToken'),
    refreshToken: localStorage.getItem('refreshToken'),
    user: user ? JSON.parse(user) : null
  };
};

const App = () => {
  const [auth, setAuth] = useState(getStoredAuth());
  const navigate = useNavigate();
  const isAuthenticated = Boolean(auth.accessToken);

  const handleLogin = ({ accessToken, refreshToken, user }) => {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('user', JSON.stringify(user));
    setAuth({ accessToken, refreshToken, user });
    navigate('/dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    setAuth({ accessToken: null, refreshToken: null, user: null });
    navigate('/login');
  };

  return (
    <div className="app-shell">
      {isAuthenticated && <Navbar user={auth.user} onLogout={handleLogout} />}
      <main className="page-container">
        <Routes>
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="/dashboard" element={isAuthenticated ? <Dashboard user={auth.user} /> : <Navigate to="/login" />} />
          <Route path="/projects" element={isAuthenticated ? <Projects token={auth.accessToken} /> : <Navigate to="/login" />} />
          <Route path="/tasks" element={isAuthenticated ? <Tasks token={auth.accessToken} /> : <Navigate to="/login" />} />
          <Route path="/*" element={<Navigate to={isAuthenticated ? '/dashboard' : '/login'} />} />
        </Routes>
      </main>
    </div>
  );
};

export default App;
