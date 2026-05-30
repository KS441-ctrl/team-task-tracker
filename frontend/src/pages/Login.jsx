import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../api';

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);

    try {
      const data = await login({ email, password });
      onLogin(data);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Login failed');
    }
  };

  return (
    <div className="page-card">
      <h1>Login</h1>
      <form onSubmit={handleSubmit} className="form-grid">
        <label>
          Email
          <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required />
        </label>
        <label>
          Password
          <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" required />
        </label>
        {error && <div className="error-message">{error}</div>}
        <button type="submit">Sign in</button>
      </form>
    </div>
  );
};

export default Login;
