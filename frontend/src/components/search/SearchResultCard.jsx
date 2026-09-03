import { memo } from "react";
import { useNavigate } from "react-router-dom";
import {
  FIELDS,
  isBenchmarked,
  isPriority,
  getImplementationsCount,
  getDocStatus,
  hasContent,
  getExpectedDate,
} from "../../utils/helpers";
import SolutionResourceIcons from "../common/SolutionResourceIcons";

// Wraps the first case-insensitive occurrence of `query` in a <mark>, so a
// result card shows at a glance which field actually matched the search.
function Highlight({ text, query }) {
  if (!query || !text) return text;

  const index = text.toLowerCase().indexOf(query.toLowerCase());
  if (index === -1) return text;

  return (
    <>
      {text.slice(0, index)}
      <mark className="search-highlight">{text.slice(index, index + query.length)}</mark>
      {text.slice(index + query.length)}
    </>
  );
}

function SearchResultCard({ solution, query, calendarLookup }) {
  const navigate = useNavigate();
  const benchmarked = isBenchmarked(solution);
  const priority = isPriority(solution);
  const impl = getImplementationsCount(solution);
  const docStatus = getDocStatus(solution);
  const innovationType = solution[FIELDS.innovationType];
  const valueChain = solution[FIELDS.valueChain]?.trim();
  const expectedDate = !benchmarked ? getExpectedDate(solution, calendarLookup) : null;

  const goToDetail = () =>
    navigate(`/search/${solution.__uid}?q=${encodeURIComponent(query || "")}`);
  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      goToDetail();
    }
  };

  return (
    <div
      className="search-result-card"
      role="button"
      tabIndex={0}
      onClick={goToDetail}
      onKeyDown={handleKeyDown}
    >
      <div className="search-result-card-header">
        <h3>
          <Highlight text={solution[FIELDS.name]} query={query} />
        </h3>
        <div className="detail-hero-badges">
          <span className="row-badge sector">
            <Highlight text={solution[FIELDS.sector] || "-"} query={query} />
          </span>
          <span className={`row-badge ${benchmarked ? "done" : "pending"}`}>
            {benchmarked ? "Benchmarked" : "Pending"}
          </span>
          {priority && (
            <span className="hero-badge-muted">
              <i className="ti ti-star" aria-hidden="true"></i> Priority
            </span>
          )}
        </div>
      </div>

      <div className="search-result-meta-grid">
        {valueChain && (
          <div className="search-result-meta-item">
            <span className="search-result-meta-label">Value Chain</span>
            <span>
              <Highlight text={valueChain} query={query} />
            </span>
          </div>
        )}
        {hasContent(solution[FIELDS.segment]) && (
          <div className="search-result-meta-item">
            <span className="search-result-meta-label">Segment</span>
            <span>
              <Highlight text={solution[FIELDS.segment]} query={query} />
            </span>
          </div>
        )}
        {hasContent(solution[FIELDS.activity]) && (
          <div className="search-result-meta-item">
            <span className="search-result-meta-label">Nodal Point</span>
            <span>
              <Highlight text={solution[FIELDS.activity]} query={query} />
            </span>
          </div>
        )}
        {hasContent(innovationType) && (
          <div className="search-result-meta-item">
            <span className="search-result-meta-label">Innovation Type</span>
            <span>
              <Highlight text={innovationType.split("\n")[0]} query={query} />
            </span>
          </div>
        )}
        {expectedDate && (
          <div className="search-result-meta-item">
            <span className="search-result-meta-label">
              {expectedDate.overdue ? "Expected (Overdue)" : "Expected"}
            </span>
            <span className={expectedDate.overdue ? "text-overdue" : undefined}>
              {expectedDate.label}
            </span>
          </div>
        )}
        <div className="search-result-meta-item">
          <span className="search-result-meta-label">Implementations</span>
          <span>{impl}</span>
        </div>
        <div className="search-result-meta-item">
          <span className="search-result-meta-label">Documentation</span>
          <span>
            {docStatus.filled}/{docStatus.total} docs ({docStatus.percent}%)
          </span>
        </div>
      </div>

      <SolutionResourceIcons solution={solution} className="search-result-actions" />
    </div>
  );
}

export default memo(SearchResultCard);
