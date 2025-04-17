import { NavLink, useNavigate } from "react-router-dom";
import "./Sidebar.css";

interface SidebarProps {
  userRole: string;
  username: string;
}

const Sidebar = ({ userRole, username }: SidebarProps) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    sessionStorage.clear();
    navigate('/login');
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2>My Calc</h2>
        {username && <div className="username">Welcome, {username}</div>}
      </div>
      
      <div className="sidebar-menu">
        <div className="menu-section">
          <h3>General</h3>
          <ul>
            <li>
              <NavLink 
                to="/calculator" 
                className={({ isActive }) => isActive ? "active" : ""}
              >
                Calculator
              </NavLink>
            </li>
            {/* Show DB History only for ADMIN users */}
            {userRole === 'ADMIN' && (
              <li>
                <NavLink 
                  to="/db-history" 
                  className={({ isActive }) => isActive ? "active" : ""}
                >
                  DB History
                </NavLink>
              </li>
            )}
          </ul>
        </div>
      </div>
      
      <div className="sidebar-footer">
        <button onClick={handleLogout} className="logout-btn">
          Logout
        </button>
        <div className="version-info">
          Version 1.0.0
        </div>
      </div>
    </div>
  );
};

export default Sidebar;