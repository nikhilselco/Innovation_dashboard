import { memo } from "react";
import { FIELDS, isBenchmarked, getImplementationsCount } from "../../utils/helpers";
import SolutionResourceIcons from "../common/SolutionResourceIcons";

function SolutionCard({ solution, active, onSelect }) {
  const benchmarked = isBenchmarked(solution);
  const impl = getImplementationsCount(solution);
  const handleSelect = () => onSelect(solution.__uid);
  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleSelect();
    }
  };

  return (
    <div
      className={`solution-row${active ? " active" : ""}`}
      role="button"
      tabIndex={0}
      aria-current={active ? "true" : undefined}
      onClick={handleSelect}
      onKeyDown={handleKeyDown}
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
      <SolutionResourceIcons solution={solution} className="solution-row-actions" />
    </div>
  );
}

export default memo(SolutionCard);