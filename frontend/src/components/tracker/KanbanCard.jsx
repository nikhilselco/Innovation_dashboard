import { memo } from "react";
import { useNavigate } from "react-router-dom";
import { FIELDS, VALUE_CHAIN_FIELD, getDocStatus } from "../../utils/helpers";
import SolutionResourceIcons from "../common/SolutionResourceIcons";

function KanbanCard({ solution }) {
  const navigate = useNavigate();
  const { filled, total, percent, status } = getDocStatus(solution);
  const goToSolution = () => navigate(`/explorer/${solution.__uid}`);
  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      goToSolution();
    }
  };

  const barColor =
    status === "done" ? "var(--color-success)" : status === "in-progress" ? "var(--color-warning)" : "var(--color-danger)";

  return (
    <div
      className="kanban-card"
      role="button"
      tabIndex={0}
      onClick={goToSolution}
      onKeyDown={handleKeyDown}
    >
      <p className="kanban-card-title">{solution[FIELDS.name]}</p>
      <p className="kanban-card-meta">
        {solution[FIELDS.sector]} · {solution[VALUE_CHAIN_FIELD]}
      </p>
      <div className="progress">
        <div className="progress-fill" style={{ width: `${percent}%`, background: barColor }}></div>
      </div>
      <p className="kanban-card-progress">
        {filled}/{total} docs ({percent}%)
      </p>
      <SolutionResourceIcons solution={solution} className="kanban-actions" />
    </div>
  );
}

export default memo(KanbanCard);
