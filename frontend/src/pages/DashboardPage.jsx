import KPICard from "../components/dashboard/KPICard";
import SectorChart from "../components/dashboard/SectorChart";
import BenchmarkStatusChart from "../components/dashboard/BenchmarkChart";
import RecentSolutionsTable from "../components/dashboard/RecentSolutionsTable";
import Loading from "../components/common/Loading";
import ErrorMessage from "../components/common/ErrorMessage";
import { useDashboard } from "../hooks/useDashboard";
import { formatDate } from "../utils/formatDate";

const FILTERS = ["Sector", "Value Chain", "Year", "Status"];

function DashboardPage() {
  const { summary, sectors, benchmarkStatus, longList, lastUpdated, loading, error } =
    useDashboard();

  if (loading) return <Loading />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <main className="dashboard-content">
      <div className="page-title-row">
        <div>
          <h2>Overall Dashboard</h2>
          <p>High-level overview of benchmarking progress and solution distribution.</p>
        </div>
        <span className="last-synced">
          <i className="ti ti-refresh" aria-hidden="true"></i>
          Last sync &middot; {formatDate(lastUpdated)}
        </span>
      </div>

      <div className="filter-row">
        <span className="filter-label">Filters</span>
        {FILTERS.map((label) => (
          <span className="chip" key={label}>
            {label} <i className="ti ti-chevron-down" style={{ fontSize: 11 }} aria-hidden="true"></i>
          </span>
        ))}
        <span className="chip active">
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
          sub="Of total solutions"
        />
        <KPICard
          icon="ti-clock"
          tone="warning"
          label="Pending"
          value={summary.pendingSolutions}
          sub="Awaiting benchmarking"
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
