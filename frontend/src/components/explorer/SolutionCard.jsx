import { useNavigate } from "react-router-dom";
import { extractUrl, isBenchmarked, VALUE_CHAIN_FIELD } from "../../utils/helpers";

const VIDEO_FIELD = "Video of the solution package";
const DOCS_FIELD = "Tech specs";
const CASE_STUDY_FIELD =
  "Case studies with champions and with enabling conditions";

function SolutionCard({ solution }) {
  const navigate = useNavigate();
  const benchmarked = isBenchmarked(solution);

  return (
    <div
      className="solution-card"
      role="button"
      tabIndex={0}
      onClick={() => navigate(`/solutions/${solution["Sr No."]}`)}
      onKeyDown={(e) => e.key === "Enter" && navigate(`/solutions/${solution["Sr No."]}`)}
    >
      <div className="solution-card-top">
        <span className="solution-card-sector">{solution["Sector"] || "—"}</span>
        <span className={`status-pill ${benchmarked ? "done" : "pending"}`}>
          {benchmarked ? "Benchmarked" : "Pending"}
        </span>
      </div>

      <h4 className="solution-card-title">{solution["Solution Package Name"]}</h4>

      <p className="solution-card-subtitle">
        {solution[VALUE_CHAIN_FIELD] || "—"}
        {solution["Value chain segment"] ? ` · ${solution["Value chain segment"]}` : ""}
      </p>

      <div className="solution-card-footer">
        <span className="solution-card-year">
          <i className="ti ti-calendar" aria-hidden="true"></i>
          {solution["Update Year"] || "—"}
        </span>
        <div className="action-icons">
          <ResourceIcon
            icon="ti-player-play"
            title="Watch Video"
            url={extractUrl(solution[VIDEO_FIELD])}
          />
          <ResourceIcon
            icon="ti-file-text"
            title="Open Documents"
            url={extractUrl(solution[DOCS_FIELD])}
          />
          <ResourceIcon
            icon="ti-bookmark"
            title="View Case Study"
            url={extractUrl(solution[CASE_STUDY_FIELD])}
          />
        </div>
      </div>
    </div>
  );
}

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

export default SolutionCard;
