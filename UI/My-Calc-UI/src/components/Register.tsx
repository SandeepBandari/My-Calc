import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "../Lr.css";

const Register = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('USER');
    const [error, setError] = useState('');
    const navigate = useNavigate();
const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
        const response = await fetch('http://localhost:8080/calc/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password, role }),
        });

        const responseData = await response.text(); // First get as text
        
        try {
            const jsonData = JSON.parse(responseData);
            
            if (response.ok) {
                alert('Registration successful!');
                navigate('/login');
            } else {
                // Handle JSON error response
                setError(jsonData.message || jsonData.error || jsonData || 'Registration failed');
            }
        } catch {
            // If not JSON, use the raw text
            if (response.ok) {
                alert('Registration successful!');
                navigate('/login');
            } else {
                setError(responseData || response.statusText || 'Registration failed');
            }
        }
    } catch (err) {
        console.error('Error:', err);
        setError('Error connecting to the server.');
    }
};
    return (
        <div className="auth-container">
            <form className="auth-form" onSubmit={handleSubmit}>
                <h2>Register</h2>
                 {error && <p className="error-message">{error}</p>}
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
                <input
                    type = "password"
                    placeholder = "Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <select 
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    required
                >
                    <option value="USER">User</option>
                    <option value="ADMIN">Admin</option>
                </select>
                <button type="submit">Register</button>
                <p>Already have an account? <a href="/login">Login</a></p>
               
            </form>
        </div>
    );
};

export default Register;