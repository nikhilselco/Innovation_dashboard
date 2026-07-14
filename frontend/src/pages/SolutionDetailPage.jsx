import { Link } from "react-router-dom";

function SolutionDetailPage() {
  return (
    <div className="dashboard-content">
      <div className="coming-soon">
        <div className="coming-soon-icon">
          <i className="ti ti-file-description" aria-hidden="true"></i>
        </div>
        <h3>Solution Detail</h3>
        <p>Full documentation and benchmarking history for a single solution. Coming soon.</p>
        <Link to="/explorer" className="view-all-link">
          <i className="ti ti-arrow-left" aria-hidden="true"></i> Back to Explorer
        </Link>
      </div>
    </div>
  );
}

export default SolutionDetailPage;
