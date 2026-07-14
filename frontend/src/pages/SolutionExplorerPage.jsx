import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useLongList } from "../hooks/useLongList";
import SolutionSidebar from "../components/explorer/SolutionSidebar";
import DetailHeader from "../components/detail/DetailHeader";
import DetailTabs from "../components/detail/DetailTabs";
import KPICard from "../components/dashboard/KPICard";
import ErrorMessage from "../components/common/ErrorMessage";
import { FIELDS, isBenchmarked, getImplementationsCount } from "../utils/helpers";

function SolutionExplorerPage() {
  const { solutions, loading, error } = useLongList();
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

  const selected = useMemo(() => {
    if (!solutions || !id) return null;
    return solutions.find((row) => String(row[FIELDS.srNo]) === String(id)) || null;
  }, [solutions, id]);

  useEffect(() => {
    if (!loading && !id && filtered.length > 0) {
      navigate(`/explorer/${filtered[0][FIELDS.srNo]}`, { replace: true });
    }
  }, [loading, id, filtered, navigate]);

  if (error) return <ErrorMessage message={error} />;

  const statsSource = filtered;
  const statBenchmarked = statsSource.filter(isBenchmarked).length;
  const statSectors = new Set(statsSource.map((r) => r[FIELDS.sector])).size;
  const statImpl = statsSource.reduce((sum, r) => sum + getImplementationsCount(r), 0);

  return (
    <main className="dashboard-content">
      <div className="page-title-row">
        <div>
          <h2>Solution Explorer</h2>
          <p>Browse, search and filter every tracked solution package.</p>
        </div>
      </div>

      {loading ? (
        <div className="kpi-grid">
          {[0, 1, 2, 3].map((i) => (
            <div className="kpi skeleton" style={{ height: 90 }} key={i}></div>
          ))}
        </div>
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
              onSelectSolution={(srNo) => navigate(`/explorer/${srNo}`)}
            />

            <div className="explorer-main">
              {selected ? (
                <div className="detail-panel">
                  <DetailHeader solution={selected} />
                  <DetailTabs
                    key={selected[FIELDS.srNo]}
                    solution={selected}
                    allSolutions={solutions}
                  />
                </div>
              ) : (
                <div className="detail-panel-empty">
                  <p>No solutions match your filters. Try clearing the search or sector.</p>
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
