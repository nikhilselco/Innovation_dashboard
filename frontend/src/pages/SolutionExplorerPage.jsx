import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useLongList } from "../hooks/useLongList";
import SolutionSidebar from "../components/explorer/SolutionSidebar";
import DetailHeader from "../components/detail/DetailHeader";
import DetailTabs from "../components/detail/DetailTabs";
import KPICard from "../components/dashboard/KPICard";
import ErrorMessage from "../components/common/ErrorMessage";
import { FIELDS, isBenchmarked, getImplementationsCount } from "../utils/helpers";

function SolutionExplorerPage() {
  const { solutions, loading, error, retry } = useLongList();
  const { id } = useParams();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [activeSector, setActiveSector] = useState(null);
  const [status, setStatus] = useState("all");
  const [sortBy, setSortBy] = useState("year-desc");

  const sectors = useMemo(() => {
    if (!solutions) return [];
    const counts = {};
    solutions.forEach((row) => {
      const sector = row[FIELDS.sector] || "Unknown";
      counts[sector] = (counts[sector] || 0) + 1;
    });
    return Object.entries(counts)
      .map(([sector, count]) => ({ sector, count }))
      .sort((a, b) => b.count - a.count);
  }, [solutions]);

  const filtered = useMemo(() => {
    if (!solutions) return [];

    const searchLower = search.trim().toLowerCase();

    let rows = solutions.filter((row) => {
      const matchesSector = !activeSector || row[FIELDS.sector] === activeSector;
      const matchesSearch =
        !searchLower || (row[FIELDS.name] || "").toLowerCase().includes(searchLower);
      const benchmarked = isBenchmarked(row);
      const matchesStatus =
        status === "all" ||
        (status === "benchmarked" && benchmarked) ||
        (status === "pending" && !benchmarked);

      return matchesSector && matchesSearch && matchesStatus;
    });

    rows = [...rows].sort((a, b) => {
      if (sortBy === "name-asc") {
        return (a[FIELDS.name] || "").localeCompare(b[FIELDS.name] || "");
      }
      if (sortBy === "impl-desc") {
        return getImplementationsCount(b) - getImplementationsCount(a);
      }
      return (Number(b[FIELDS.updateYear]) || 0) - (Number(a[FIELDS.updateYear]) || 0);
    });

    return rows;
  }, [solutions, search, activeSector, status, sortBy]);

  const handleSelectSolution = useCallback(
    (uid) => navigate(`/explorer/${uid}`),
    [navigate]
  );

  const selected = useMemo(() => {
    if (!solutions || !id) return null;
    return solutions.find((row) => String(row.__uid) === String(id)) || null;
  }, [solutions, id]);

  useEffect(() => {
    if (!loading && !id && filtered.length > 0) {
      navigate(`/explorer/${filtered[0].__uid}`, { replace: true });
    }
  }, [loading, id, filtered, navigate]);

  if (error) return <ErrorMessage message={error} onRetry={retry} />;

  const statsSource = filtered;
  const statBenchmarked = statsSource.filter(isBenchmarked).length;
  const statSectors = new Set(statsSource.map((r) => r[FIELDS.sector])).size;
  const statImpl = statsSource.reduce((sum, r) => sum + getImplementationsCount(r), 0);

  return (
    <main className="dashboard-content" id="main-content" tabIndex={-1}>
      <div className="page-title-row">
        <div>
          <h2>Solution Explorer</h2>
          <p>Browse, search and filter every tracked solution package.</p>
        </div>
      </div>

      {loading ? (
        <>
          <div className="kpi-grid">
            {[0, 1, 2, 3].map((i) => (
              <div className="kpi skeleton" style={{ height: 90 }} key={i}></div>
            ))}
          </div>

          <div className="explorer-layout">
            <div className="browse-panel">
              <div className="browse-panel-filters">
                <div className="skeleton" style={{ width: 120, height: 12, marginBottom: 12 }}></div>
                <div className="skeleton" style={{ width: "100%", height: 34, marginBottom: 8 }}></div>
                <div className="skeleton" style={{ width: "100%", height: 34, marginBottom: 10 }}></div>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  {[60, 80, 70, 90].map((w, i) => (
                    <div className="skeleton" style={{ width: w, height: 22, borderRadius: 999 }} key={i}></div>
                  ))}
                </div>
              </div>
              <div className="solution-list">
                {[0, 1, 2, 3, 4, 5].map((i) => (
                  <div key={i} style={{ padding: "10px 12px" }}>
                    <div className="skeleton" style={{ width: "80%", height: 14, marginBottom: 8 }}></div>
                    <div className="skeleton" style={{ width: "50%", height: 11 }}></div>
                  </div>
                ))}
              </div>
            </div>

            <div className="explorer-main">
              <div className="detail-panel">
                <div className="detail-hero">
                  <div style={{ flex: 1 }}>
                    <div className="skeleton" style={{ width: 220, height: 20, marginBottom: 10 }}></div>
                    <div className="skeleton" style={{ width: 160, height: 12, marginBottom: 12 }}></div>
                    <div style={{ display: "flex", gap: 6 }}>
                      {[70, 90, 80].map((w, i) => (
                        <div className="skeleton" style={{ width: w, height: 20, borderRadius: 999 }} key={i}></div>
                      ))}
                    </div>
                  </div>
                  <div className="skeleton" style={{ width: 60, height: 32 }}></div>
                </div>
                <div style={{ display: "flex", gap: 20, padding: "0 22px", borderBottom: "1px solid var(--color-border-tertiary)" }}>
                  {[0, 1, 2, 3, 4].map((i) => (
                    <div className="skeleton" style={{ width: 70, height: 14, margin: "14px 0" }} key={i}></div>
                  ))}
                </div>
                <div className="tab-body">
                  <div className="param-grid">
                    <div className="skeleton" style={{ height: 80 }}></div>
                    <div className="skeleton" style={{ height: 80 }}></div>
                    <div className="skeleton" style={{ height: 100, gridColumn: "1 / -1" }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="kpi-grid">
            <KPICard icon="ti-package" tone="brand" label="Solutions" value={statsSource.length} sub="In current filter" />
            <KPICard icon="ti-circle-check" tone="success" label="Benchmarked" value={statBenchmarked} sub="Fully documented" />
            <KPICard icon="ti-sitemap" tone="info" label="Sectors" value={statSectors} sub="Livelihood types" />
            <KPICard icon="ti-map-pin" tone="warning" label="Implementations" value={statImpl} sub="Total deployed sites" />
          </div>

          <div className="explorer-layout">
            <SolutionSidebar
              sectors={sectors}
              totalCount={solutions.length}
              filteredCount={filtered.length}
              search={search}
              onSearchChange={setSearch}
              sortBy={sortBy}
              onSortChange={setSortBy}
              activeSector={activeSector}
              onSelectSector={setActiveSector}
              status={status}
              onStatusChange={setStatus}
              items={filtered}
              selectedId={id}
              onSelectSolution={handleSelectSolution}
            />

            <div className="explorer-main">
              {selected ? (
                <div className="detail-panel">
                  <DetailHeader solution={selected} />
                  <DetailTabs
                    key={selected.__uid}
                    solution={selected}
                    allSolutions={solutions}
                  />
                </div>
              ) : (
                <div className="detail-panel-empty">
                  <p role="status">No solutions match your filters. Try clearing the search or sector.</p>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </main>
  );
}

export default SolutionExplorerPage;