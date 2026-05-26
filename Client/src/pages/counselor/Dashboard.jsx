// counselor dashboard page : main screen after login
import "../styles/counselor.css";
function Dashboard() {
  return (
    <div className="app-container">

      {/* sidebar : left menu */}
      <div className="sidebar">
        <h2>Counselor Panel</h2>

        <ul>
          <li>Dashboard</li>
          <li>Sessions</li>
          <li>Students</li>
        </ul>
      </div>

      {/* main content : right section */}
      <div className="main-content">
        <h1>Counselor Dashboard</h1>

        {/* simple cards */}
        <div className="card">
          <h3>Upcoming Sessions</h3>
          <p>View and manage scheduled sessions</p>
        </div>

        <div className="card">
          <h3>Student Requests</h3>
          <p>Check student booking requests</p>
        </div>

        <div className="card">
          <h3>Reports</h3>
          <p>Analyze counseling performance</p>
        </div>
      </div>

    </div>
  );
}

export default Dashboard;