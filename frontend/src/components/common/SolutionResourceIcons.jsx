import { FIELDS, extractUrl } from "../../utils/helpers";

function ResourceIcon({ icon, label, title, url }) {
  const disabled = !url;
  const statusTitle = disabled ? `${title} - not available` : title;

  return (
    <a
      href={disabled ? undefined : url}
      target="_blank"
      rel="noreferrer"
      className={`action-icon${disabled ? " disabled" : ""}`}
      title={statusTitle}
      aria-label={statusTitle}
      aria-disabled={disabled ? "true" : undefined}
      onClick={(e) => e.stopPropagation()}
    >
      <i className={`ti ${icon} action-icon-glyph`} aria-hidden="true"></i>
      {disabled && <i className="ti ti-x action-icon-glyph-disabled" aria-hidden="true"></i>}
      <span>{label}</span>
    </a>
  );
}

// Quick-access row (Documents / Video / Case Study) shown wherever a
// solution appears as a card or row, so its key resources are one click
// away without opening the full detail view.
function SolutionResourceIcons({ solution, className = "action-icons" }) {
  return (
    <div className={className}>
      <ResourceIcon
        icon="ti-file-text"
        label="Docs"
        title="Open Documents"
        url={extractUrl(solution[FIELDS.techSpecs]) || extractUrl(solution[FIELDS.benchmarkDoc])}
      />
      <ResourceIcon
        icon="ti-player-play"
        label="Video"
        title="Watch Video"
        url={extractUrl(solution[FIELDS.video])}
      />
      <ResourceIcon
        icon="ti-bookmark"
        label="Case Study"
        title="View Case Study"
        url={extractUrl(solution[FIELDS.caseStudy])}
      />
    </div>
  );
}

export default SolutionResourceIcons;
