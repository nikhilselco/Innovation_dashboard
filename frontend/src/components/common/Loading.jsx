function Loading() {
  return (
    <div className="dashboard-content">
      <div className="page-title-row">
        <div>
          <div className="skeleton" style={{ width: 220, height: 24, marginBottom: 8 }}></div>
          <div className="skeleton" style={{ width: 340, height: 14 }}></div>
        </div>
      </div>

      <div className="kpi-grid">
        {[0, 1, 2, 3].map((i) => (
          <div className="kpi" key={i}>
            <div className="skeleton" style={{ width: 80, height: 12, marginBottom: 12 }}></div>
            <div className="skeleton" style={{ width: 60, height: 28 }}></div>
          </div>
        ))}
      </div>

      <div className="dashboard-grid">
        <div className="card">
          <div className="skeleton" style={{ width: 140, height: 14, marginBottom: 18 }}></div>
          <div className="skeleton" style={{ width: "100%", height: 160 }}></div>
        </div>
        <div className="card">
          <div className="skeleton" style={{ width: 140, height: 14, marginBottom: 18 }}></div>
          <div className="skeleton" style={{ width: "100%", height: 160 }}></div>
        </div>
      </div>

      <div className="card">
        <div className="skeleton" style={{ width: 200, height: 14, marginBottom: 18 }}></div>
        <div className="skeleton" style={{ width: "100%", height: 180 }}></div>
      </div>
    </div>
  );
}

export default Loading;
