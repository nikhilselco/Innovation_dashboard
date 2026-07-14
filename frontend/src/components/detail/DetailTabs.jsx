import { useState } from "react";
import { FIELDS, isBenchmarked, getImplementationsCount, hasContent } from "../../utils/helpers";
import DocumentationPanel from "./DocumentationPanel";

const TABS = [
  { key: "overview", label: "Overview" },
  { key: "techspecs", label: "Tech Specs" },
  { key: "solar", label: "Solar Design" },
  { key: "om", label: "O&M" },
  { key: "documentation", label: "Documentation" },
  { key: "compare", label: "Compare" },
  { key: "casestudy", label: "Case Study" },
];

function ParamBlock({ icon, title, value, full }) {
  if (!hasContent(value)) return null;

  return (
    <div className={`param-block${full ? " full" : ""}`}>
      <p className="param-title">
        <i className={`ti ${icon}`} aria-hidden="true"></i>
        {title}
      </p>
      <p className="param-value">{value}</p>
    </div>
  );
}

function EmptyTab({ message }) {
  return (
    <div className="tab-empty-state">
      <i className="ti ti-file-off" aria-hidden="true"></i>
      <p>{message}</p>
    </div>
  );
}

function OverviewTab({ solution }) {
  const hasAny =
    hasContent(solution[FIELDS.suitability]) ||
    hasContent(solution[FIELDS.packageOfPractice]) ||
    hasContent(solution[FIELDS.innovationType]) ||
    hasContent(solution[FIELDS.comments]);

  if (!hasAny) return <EmptyTab message="No overview details recorded for this solution yet." />;

  return (
    <div className="param-grid">
      <ParamBlock
        icon="ti-users"
        title="Suitable for"
        value={solution[FIELDS.suitability]}
        full
      />
      <ParamBlock
        icon="ti-package"
        title="Package of practice"
        value={solution[FIELDS.packageOfPractice]}
      />
      <ParamBlock
        icon="ti-bolt"
        title="Innovation type"
        value={solution[FIELDS.innovationType]}
      />
      <ParamBlock icon="ti-note" title="Comments" value={solution[FIELDS.comments]} full />
    </div>
  );
}

function TechSpecsTab({ solution }) {
  const hasAny =
    hasContent(solution[FIELDS.techSpecs]) ||
    hasContent(solution[FIELDS.techExperts]) ||
    hasContent(solution[FIELDS.builtEnv]);

  if (!hasAny) return <EmptyTab message="No technical specifications recorded yet." />;

  return (
    <div className="param-grid">
      <ParamBlock icon="ti-settings" title="Tech specs" value={solution[FIELDS.techSpecs]} full />
      <ParamBlock
        icon="ti-users"
        title="Tech specific experts"
        value={solution[FIELDS.techExperts]}
      />
      <ParamBlock
        icon="ti-building"
        title="Built environment designs"
        value={solution[FIELDS.builtEnv]}
      />
    </div>
  );
}

function SolarTab({ solution }) {
  if (!hasContent(solution[FIELDS.solarSpecs])) {
    return <EmptyTab message="No solar design details recorded yet." />;
  }

  return (
    <div className="param-grid">
      <ParamBlock
        icon="ti-sun"
        title="Solar specifications"
        value={solution[FIELDS.solarSpecs]}
        full
      />
    </div>
  );
}

function OmTab({ solution }) {
  if (!hasContent(solution[FIELDS.omDetails])) {
    return <EmptyTab message="No O&M details recorded yet." />;
  }

  return (
    <div className="param-grid">
      <ParamBlock icon="ti-tool" title="O&M details" value={solution[FIELDS.omDetails]} full />
    </div>
  );
}

function CaseStudyTab({ solution }) {
  const value = solution[FIELDS.caseStudy];

  if (!hasContent(value)) {
    return (
      <div className="tab-empty-state">
        <i className="ti ti-bookmark-off" aria-hidden="true"></i>
        <p>Case study not yet available for this solution.</p>
        <p className="tab-empty-sub">Will be added once benchmarking is complete.</p>
      </div>
    );
  }

  return (
    <div className="param-grid">
      <ParamBlock icon="ti-bookmark" title="Case study" value={value} full />
    </div>
  );
}

function CompareTab({ solution, allSolutions }) {
  const peers = allSolutions.filter(
    (row) => row[FIELDS.sector] === solution[FIELDS.sector] && row !== solution
  );
  const all = [solution, ...peers].slice(0, 6);

  if (peers.length === 0) {
    return <EmptyTab message="No other solutions in this sector to compare against yet." />;
  }

  return (
    <div style={{ overflowX: "auto" }}>
      <table className="solutions-table">
        <thead>
          <tr>
            <th>Parameter</th>
            {all.map((row) => (
              <th key={row[FIELDS.srNo]} style={{ color: row === solution ? "var(--brand-700)" : undefined }}>
                {row[FIELDS.name]}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {[
            ["Segment", (r) => r[FIELDS.segment]],
            ["Value chain", (r) => r[FIELDS.valueChain]],
            ["Status", (r) => (isBenchmarked(r) ? "Benchmarked" : "Pending")],
            ["Implementations", (r) => getImplementationsCount(r)],
            ["Updated", (r) => r[FIELDS.updateYear]],
          ].map(([label, fn]) => (
            <tr key={label}>
              <td style={{ color: "var(--color-text-tertiary)", fontWeight: 600 }}>{label}</td>
              {all.map((row) => (
                <td key={row[FIELDS.srNo]}>{fn(row) || "—"}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function DetailTabs({ solution, allSolutions }) {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div>
      <div className="tabs-bar">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            type="button"
            className={`tab-item${activeTab === tab.key ? " active" : ""}`}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="tab-body">
        {activeTab === "overview" && <OverviewTab solution={solution} />}
        {activeTab === "techspecs" && <TechSpecsTab solution={solution} />}
        {activeTab === "solar" && <SolarTab solution={solution} />}
        {activeTab === "om" && <OmTab solution={solution} />}
        {activeTab === "documentation" && <DocumentationPanel solution={solution} />}
        {activeTab === "compare" && <CompareTab solution={solution} allSolutions={allSolutions} />}
        {activeTab === "casestudy" && <CaseStudyTab solution={solution} />}
      </div>
    </div>
  );
}

export default DetailTabs;
