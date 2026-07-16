import { FIELDS, isBenchmarked, getImplementationsCount } from "../../utils/helpers";

function SolutionCard({ solution, active, onClick }) {
  const benchmarked = isBenchmarked(solution);
  const impl = getImplementationsCount(solution);

  return (
    <div
      className={`solution-row${active ? " active" : ""}`}
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => e.key === "Enter" && onClick()}
    >
      <div className="solution-row-name" title={solution[FIELDS.name]}>
        {solution[FIELDS.name]}
      </div>
      <div className="solution-row-meta">
        <span className="row-sector">{solution[FIELDS.sector] || "-"}</span>
        <span className={`row-status ${benchmarked ? "done" : "pending"}`}>
          <span className="status-dot"></span>
          {benchmarked ? "Benchmarked" : "Pending"}
        </span>
        {impl > 0 && <span className="solution-row-impl">{impl} impl.</span>}
      </div>
    </div>
  );
}

export default SolutionCard;
