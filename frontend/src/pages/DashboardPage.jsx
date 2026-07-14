import KPICard from "../components/dashboard/KPICard";
import SectorChart from "../components/dashboard/SectorChart";
import BenchmarkStatusChart from "../components/dashboard/BenchmarkChart";
import RecentSolutionsTable from "../components/dashboard/RecentSolutionsTable";
import Loading from "../components/common/Loading";
import ErrorMessage from "../components/common/ErrorMessage";
import { useDashboard } from "../hooks/useDashboard";

const FILTERS = ["Sector", "Value Chain", "Year", "Status"];

function DashboardPage() {
  const { summary, sectors, benchmarkStatus, longList, loading, error } = useDashboard();

  if (loading) return <Loading />;
  if (error) return <ErrorMessage message={error} />;

  const percentBenchmarked = summary.totalSolutions
    ? ((summary.benchmarkedSolutions / summary.totalSolutions) * 100).toFixed(1)
    : "0.0";
  const percentPending = summary.totalSolutions
    ? ((summary.pendingSolutions / summary.totalSolutions) * 100).toFixed(1)
    : "0.0";

  return (
    <main className="dashboard-content">
      <div className="page-title-row">
        <div>
          <h2>Overall Dashboard</h2>
          <p>High-level overview of benchmarking progress and solution distribution.</p>
        </div>
      </div>

      <div className="filter-row">
        <span className="filter-label">Filters</span>
        <span className="soon-badge">Coming soon</span>
        {FILTERS.map((label) => (
          <span className="chip disabled" key={label} title="Filtering is coming soon">
            {label} <i className="ti ti-chevron-down" style={{ fontSize: 11 }} aria-hidden="true"></i>
          </span>
        ))}
        <span className="chip disabled" title="Filtering is coming soon">
          <i className="ti ti-star" style={{ fontSize: 11 }} aria-hidden="true"></i> Priority only
        </span>
      </div>

      <div className="kpi-grid">
        <KPICard
          icon="ti-package"
          tone="brand"
          label="Total Solutions"
          value={summary.totalSolutions}
          sub={`Across ${sectors.length} sectors`}
        />
        <KPICard
          icon="ti-circle-check"
          tone="success"
          label="Benchmarked"
          value={summary.benchmarkedSolutions}
          valueSuffix={`/ ${summary.totalSolutions}`}
          sub={`${percentBenchmarked}% benchmarked`}
        />
        <KPICard
          icon="ti-clock"
          tone="warning"
          label="Pending"
          value={summary.pendingSolutions}
          sub={`${percentPending}% awaiting benchmarking`}
        />
        <KPICard
          icon="ti-sitemap"
          tone="info"
          label="Value Chains"
          value={summary.totalValueChains}
          sub="Total value chains tracked"
        />
      </div>

      <div className="dashboard-grid">
        <SectorChart data={sectors} />
        <BenchmarkStatusChart
          benchmarked={benchmarkStatus.benchmarked}
          pending={benchmarkStatus.pending}
        />
      </div>

      <RecentSolutionsTable solutions={longList} />
    </main>
  );
}

export default DashboardPage;
