// admin dashboard page : main control panel
import "../styles/admin.css";
function Dashboard() {
  return (
    <div className="app-container">

      {/* sidebar : admin menu */}
      <div className="sidebar">
        <h2>Admin Panel</h2>

        <ul>
          <li>Dashboard</li>
          <li>Users</li>
          <li>Reports</li>
          <li>Settings</li>
        </ul>
      </div>

      {/* main content */}
      <div className="main-content">
        <h1>Admin Dashboard</h1>

        {/* overview cards */}
        <div className="card">
          <h3>Total Users</h3>
          <p>View all registered users</p>
        </div>

        <div className="card">
          <h3>System Reports</h3>
          <p>Check system analytics and logs</p>
        </div>

        <div className="card">
          <h3>Manage Platform</h3>
          <p>Control roles, permissions and data</p>
        </div>
      </div>

    </div>
  );
}

export default Dashboard;