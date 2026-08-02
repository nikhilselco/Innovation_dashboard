import { FIELDS, extractUrl } from "../../utils/helpers";

function ResourceIcon({ icon, title, url }) {
  const disabled = !url;

  return (
    <a
      href={disabled ? undefined : url}
      target="_blank"
      rel="noreferrer"
      className={`action-icon${disabled ? " disabled" : ""}`}
      title={title}
      aria-label={title}
      aria-disabled={disabled ? "true" : undefined}
      onClick={(e) => e.stopPropagation()}
    >
      <i className={`ti ${icon}`} aria-hidden="true"></i>
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
        title="Open Documents"
        url={extractUrl(solution[FIELDS.techSpecs]) || extractUrl(solution[FIELDS.benchmarkDoc])}
      />
      <ResourceIcon icon="ti-player-play" title="Watch Video" url={extractUrl(solution[FIELDS.video])} />
      <ResourceIcon icon="ti-bookmark" title="View Case Study" url={extractUrl(solution[FIELDS.caseStudy])} />
    </div>
  );
}

export default SolutionResourceIcons;
