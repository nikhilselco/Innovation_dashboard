import { useNavigate } from "react-router-dom";
import { FIELDS, VALUE_CHAIN_FIELD, extractUrl, getDocStatus } from "../../utils/helpers";

function ResourceIcon({ icon, title, url }) {
  const disabled = !url;

  return (
    <a
      href={disabled ? undefined : url}
      target="_blank"
      rel="noreferrer"
      className={`action-icon${disabled ? " disabled" : ""}`}
      title={title}
      onClick={(e) => e.stopPropagation()}
    >
      <i className={`ti ${icon}`} aria-hidden="true"></i>
    </a>
  );
}

function KanbanCard({ solution }) {
  const navigate = useNavigate();
  const { filled, total, percent, status } = getDocStatus(solution);

  const barColor =
    status === "done" ? "var(--color-success)" : status === "in-progress" ? "var(--color-warning)" : "var(--color-danger)";

  return (
    <div
      className="kanban-card"
      role="button"
      tabIndex={0}
      onClick={() => navigate(`/explorer/${solution.__uid}`)}
      onKeyDown={(e) => e.key === "Enter" && navigate(`/explorer/${solution.__uid}`)}
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
      <div className="kanban-actions">
        <ResourceIcon
          icon="ti-file-text"
          title="Open Documents"
          url={extractUrl(solution[FIELDS.techSpecs]) || extractUrl(solution[FIELDS.benchmarkDoc])}
        />
        <ResourceIcon icon="ti-player-play" title="Watch Video" url={extractUrl(solution[FIELDS.video])} />
        <ResourceIcon icon="ti-bookmark" title="View Case Study" url={extractUrl(solution[FIELDS.caseStudy])} />
      </div>
    </div>
  );
}

export default KanbanCard;