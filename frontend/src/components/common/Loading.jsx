// Small top-to-bottom stagger on the skeleton reveal so it feels like a
// single cascading wave rather than every block flashing in sync. Purely
// visual - has no bearing on how long data actually takes to load.
function delay(ms) {
  return { animationDelay: `${ms}ms` };
}

function Loading() {
  return (
    <div className="dashboard-content">
      <div className="page-title-row">
        <div>
          <div className="skeleton" style={{ width: 220, height: 24, marginBottom: 8, ...delay(0) }}></div>
          <div className="skeleton" style={{ width: 340, height: 14, ...delay(40) }}></div>
        </div>
      </div>

      <div className="kpi-grid">
        {[0, 1, 2, 3].map((i) => (
          <div className="kpi" key={i}>
            <div className="skeleton" style={{ width: 80, height: 12, marginBottom: 12, ...delay(80 + i * 60) }}></div>
            <div className="skeleton" style={{ width: 60, height: 28, ...delay(110 + i * 60) }}></div>
          </div>
        ))}
      </div>

      <div className="dashboard-grid">
        <div className="card">
          <div className="skeleton" style={{ width: 140, height: 14, marginBottom: 18, ...delay(340) }}></div>
          <div className="skeleton" style={{ width: "100%", height: 160, ...delay(370) }}></div>
        </div>
        <div className="card">
          <div className="skeleton" style={{ width: 140, height: 14, marginBottom: 18, ...delay(400) }}></div>
          <div className="skeleton" style={{ width: "100%", height: 160, ...delay(430) }}></div>
        </div>
      </div>

      <div className="card">
        <div className="skeleton" style={{ width: 200, height: 14, marginBottom: 18, ...delay(460) }}></div>
        <div className="skeleton" style={{ width: "100%", height: 180, ...delay(490) }}></div>
      </div>
    </div>
  );
}

export default Loading;
