import { FIELDS, DOC_FIELDS, hasContent } from "../../utils/helpers";

function DocHeatmap({ solutions }) {
  return (
    <div className="card">
      <div className="heatmap-header-row">
        <p className="card-title" style={{ margin: 0 }}>
          Documentation Completeness
        </p>
        <span className="heatmap-caption">
          {DOC_FIELDS.length} fields tracked · {solutions.length} solutions shown
        </span>
      </div>

      <div className="heatmap-scroll">
        <div className="hm-row hm-head-row">
          <div></div>
          {DOC_FIELDS.map((f) => (
            <div className="hm-head" key={f.key} title={f.label}>
              {f.short}
            </div>
          ))}
        </div>

        {solutions.length === 0 ? (
          <p className="heatmap-empty">No solutions match the current filters.</p>
        ) : (
          solutions.map((row) => (
            <div className="hm-row" key={row[FIELDS.srNo]}>
              <div className="hm-name" title={row[FIELDS.name]}>
                {row[FIELDS.name]}
              </div>
              {DOC_FIELDS.map((f) => (
                <div
                  key={f.key}
                  className={`hm-c ${hasContent(row[f.key]) ? "hm-on" : "hm-off"}`}
                  title={`${f.label}: ${hasContent(row[f.key]) ? "Filled" : "Missing"}`}
                ></div>
              ))}
            </div>
          ))
        )}
      </div>

      <div className="heatmap-legend">
        <span>
          <span className="legend-dot hm-on"></span> Filled
        </span>
        <span>
          <span className="legend-dot hm-off"></span> Missing
        </span>
      </div>
    </div>
  );
}

export default DocHeatmap;
