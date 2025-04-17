import { useNavigate } from 'react-router-dom';
import './LandingPage.css'; // Create this CSS file for styling

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-container">
      <h1>My Calc</h1>
      <p className="subtitle">Make Calculations Faster</p>
      
      <div className="auth-options">
        <button 
          className="auth-button login-btn"
          onClick={() => navigate('/login')}
        >
          Login
        </button>
        <button 
          className="auth-button register-btn"
          onClick={() => navigate('/register')}
        >
          Register
        </button>
      </div>
    </div>
  );
};

export default LandingPage;