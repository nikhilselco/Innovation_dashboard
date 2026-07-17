import { FIELDS, extractUrl, hasContent, getLinkLabel } from "../../utils/helpers";

const DOC_FIELDS = [
  { key: FIELDS.businessModel, label: "Business Model", icon: "ti-briefcase" },
  { key: FIELDS.championSites, label: "Champion Sites", icon: "ti-map-pin" },
  { key: FIELDS.benchmarkDoc, label: "Benchmark Document", icon: "ti-file-text" },
  { key: FIELDS.video, label: "Video", icon: "ti-player-play" },
  { key: FIELDS.otherDocs, label: "Other Documents", icon: "ti-files" },
  { key: FIELDS.marketResearch, label: "Market Research", icon: "ti-chart-bar" },
  { key: FIELDS.vendors, label: "Vendors", icon: "ti-building-store" },
];

function DocumentationPanel({ solution }) {
  const rows = DOC_FIELDS.map((f) => ({ ...f, value: solution[f.key] })).filter((f) =>
    hasContent(f.value)
  );

  if (rows.length === 0) {
    return (
      <div className="tab-empty-state">
        <i className="ti ti-folder-off" aria-hidden="true"></i>
        <p>No documentation linked yet for this solution.</p>
      </div>
    );
  }

  return (
    <div className="param-grid">
      {rows.map((row) => {
        const url = extractUrl(row.value);
        return (
          <div className="param-block" key={row.key}>
            <p className="param-title">
              <i className={`ti ${row.icon}`} aria-hidden="true"></i>
              {row.label}
            </p>
            <p className="param-value">{getLinkLabel(row.value)}</p>
            {url && (
              <a href={url} target="_blank" rel="noreferrer" className="param-link">
                Open link <i className="ti ti-external-link" aria-hidden="true"></i>
              </a>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default DocumentationPanel;