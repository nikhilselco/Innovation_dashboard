import { extractUrl, isBenchmarked, VALUE_CHAIN_FIELD } from "../../utils/helpers";

const VIDEO_FIELD = "Video of the solution package";
const DOCS_FIELD = "Tech specs";
const CASE_STUDY_FIELD =
  "Case studies with champions and with enabling conditions";

function ResourceIcon({ icon, title, url }) {
  const disabled = !url;

  return (
    <a
      href={disabled ? undefined : url}
      target="_blank"
      rel="noreferrer"
      className={`action-icon${disabled ? " disabled" : ""}`}
      title={title}
    >
      <i className={`ti ${icon}`} aria-hidden="true"></i>
    </a>
  );
}

function RecentSolutionsTable({ solutions }) {
  const rows = [...solutions]
    .sort((a, b) => (Number(b["Update Year"]) || 0) - (Number(a["Update Year"]) || 0))
    .slice(0, 5);

  return (
    <div className="card">
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 10,
        }}
      >
        <p className="card-title" style={{ margin: 0 }}>
          Recently Updated Solutions
        </p>
        <a href="/explorer" className="view-all-link">
          View all in Explorer <i className="ti ti-arrow-right" aria-hidden="true"></i>
        </a>
      </div>
      <div className="table-scroll">
      <table className="solutions-table">
        <thead>
          <tr>
            <th>Solution</th>
            <th>Sector</th>
            <th>Value Chain</th>
            <th style={{ textAlign: "center" }}>Status</th>
            <th style={{ textAlign: "center" }}>Year</th>
            <th style={{ textAlign: "center" }}>Resources</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => {
            const benchmarked = isBenchmarked(row);

            return (
              <tr key={index}>
                <td className="solution-name-cell">{row["Solution Package Name"]}</td>
                <td style={{ color: "var(--color-text-secondary)" }}>
                  {row["Sector"]}
                </td>
                <td style={{ color: "var(--color-text-secondary)" }}>
                  {row[VALUE_CHAIN_FIELD]}
                </td>
                <td style={{ textAlign: "center" }}>
                  <span
                    className={`status-pill ${benchmarked ? "done" : "pending"}`}
                  >
                    {benchmarked ? "Benchmarked" : "Pending"}
                  </span>
                </td>
                <td
                  style={{
                    textAlign: "center",
                    color: "var(--color-text-secondary)",
                  }}
                >
                  {row["Update Year"] || "-"}
                </td>
                <td style={{ textAlign: "center" }}>
                  <div className="action-icons">
                    <ResourceIcon
                      icon="ti-player-play"
                      title="Watch Video"
                      url={extractUrl(row[VIDEO_FIELD])}
                    />
                    <ResourceIcon
                      icon="ti-file-text"
                      title="Open Documents"
                      url={extractUrl(row[DOCS_FIELD])}
                    />
                    <ResourceIcon
                      icon="ti-bookmark"
                      title="View Case Study"
                      url={extractUrl(row[CASE_STUDY_FIELD])}
                    />
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      </div>
    </div>
  );
}

export default RecentSolutionsTable;
