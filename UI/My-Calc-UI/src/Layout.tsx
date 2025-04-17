import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import "./Layout.css";

const Layout = () => {
  // Get user data from session storage
  const userRole = (sessionStorage.getItem('userRole') || 'USER').replace('ROLE_', '');
  const username = sessionStorage.getItem('username') || '';
  
  // Debug log (optional)
  console.log('Layout - sessionStorage:', {
    userRole,
    username,
    allStorage: { ...sessionStorage }
  });

  return (
    <div className="app-layout">
      <Sidebar 
        userRole={userRole} 
        username={username}
      />
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;