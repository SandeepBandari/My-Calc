import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "../Lr.css";

function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    setError('');
    const loginData = {
      username: username.trim(),
      password: password.trim(),
    };
  
    try {
      const response = await fetch('http://localhost:8080/calc/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginData)
      });
  
      const responseData = await response.json();
  
      if (response.ok) {
        sessionStorage.setItem("token", responseData.token);
        sessionStorage.setItem("userRole", responseData.role || "USER");
        sessionStorage.setItem("username", username); // Store username
        navigate('/calculator');
      } else {
        console.log(responseData.message);
        setError(responseData.message || "Login failed");
      }
    } catch (error) {
      setError("Cannot connect to server");
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={(e) => {
        e.preventDefault();
        handleLogin();
      }}>
        <h2>Login</h2>
        {error && <div className="error-message">{error}</div>}
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" className="lgnbtn">Login</button>
        <p>Don't have an account? <a href="/register">Register</a></p>
      </form>
    </div>
  );
}

export default Login;