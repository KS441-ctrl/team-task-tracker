const Dashboard = () => {
  return (
    <div className="page-card">
      <h1>Dashboard</h1>
      <p>Welcome to the Team Task Tracker. Use the navigation to browse projects and tasks.</p>
      <div className="info-grid">
        <div className="info-box">
          <h2>Project management</h2>
          <p>Create and maintain projects with role-based access.</p>
        </div>
        <div className="info-box">
          <h2>Task workflow</h2>
          <p>Track task status from TODO through IN_REVIEW to DONE.</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
