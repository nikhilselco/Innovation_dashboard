import { FIELDS, isBenchmarked, getImplementationsCount, hasContent } from "../../utils/helpers";

function DetailHeader({ solution }) {
  const benchmarked = isBenchmarked(solution);
  const impl = getImplementationsCount(solution);
  const innovationType = solution[FIELDS.innovationType];
  const isPriority =
    typeof solution[FIELDS.priority] === "string" &&
    solution[FIELDS.priority].trim().toLowerCase() === "yes";

  const metaParts = [
    solution[FIELDS.segment],
    solution[FIELDS.activity],
    solution[FIELDS.valueChain] && `${solution[FIELDS.valueChain].trim()} value chain`,
  ].filter(Boolean);

  return (
    <div className="detail-hero">
      <div className="detail-hero-left">
        <h2>{solution[FIELDS.name]}</h2>
        {metaParts.length > 0 && <p className="detail-hero-meta">{metaParts.join(" · ")}</p>}

        <div className="detail-hero-badges">
          <span className="row-badge sector">{solution[FIELDS.sector] || "-"}</span>
          <span className={`row-badge ${benchmarked ? "done" : "pending"}`}>
            {benchmarked ? "Benchmarked" : "Pending"}
          </span>
          {isPriority && (
            <span className="hero-badge-muted">
              <i className="ti ti-star" aria-hidden="true"></i> Priority
            </span>
          )}
          {hasContent(innovationType) && (
            <span className="hero-badge-muted">
              <i className="ti ti-bolt" aria-hidden="true"></i> {innovationType.split("\n")[0]}
            </span>
          )}
          {solution[FIELDS.updateYear] && (
            <span className="hero-badge-muted">
              <i className="ti ti-calendar" aria-hidden="true"></i> Updated{" "}
              {solution[FIELDS.updateYear]}
            </span>
          )}
        </div>
      </div>

      <div className="detail-hero-right">
        <div className="impl-big">{impl}</div>
        <div className="impl-label">Implementations</div>
        {hasContent(solution[FIELDS.investment]) && (
          <div className="impl-sub">{solution[FIELDS.investment]} SELCO investment</div>
        )}
      </div>
    </div>
  );
}

export default DetailHeader;
