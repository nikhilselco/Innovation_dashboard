import { useMemo, useState } from "react";
import { useLongList } from "../hooks/useLongList";
import SolutionSidebar from "../components/explorer/SolutionSidebar";
import FilterPanel from "../components/explorer/FilterPanel";
import SolutionCard from "../components/explorer/SolutionCard";
import ErrorMessage from "../components/common/ErrorMessage";
import { isBenchmarked } from "../utils/helpers";

function SolutionExplorerPage() {
  const { solutions, loading, error } = useLongList();
  const [search, setSearch] = useState("");
  const [activeSector, setActiveSector] = useState(null);
  const [status, setStatus] = useState("all");
  const [sortBy, setSortBy] = useState("year-desc");

  const sectors = useMemo(() => {
    if (!solutions) return [];
    const counts = {};
    solutions.forEach((row) => {
      const sector = row["Sector"] || "Unknown";
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
      const matchesSector = !activeSector || row["Sector"] === activeSector;
      const matchesSearch =
        !searchLower ||
        (row["Solution Package Name"] || "").toLowerCase().includes(searchLower);
      const benchmarked = isBenchmarked(row);
      const matchesStatus =
        status === "all" ||
        (status === "benchmarked" && benchmarked) ||
        (status === "pending" && !benchmarked);

      return matchesSector && matchesSearch && matchesStatus;
    });

    rows = [...rows].sort((a, b) => {
      if (sortBy === "name-asc") {
        return (a["Solution Package Name"] || "").localeCompare(
          b["Solution Package Name"] || ""
        );
      }
      return (Number(b["Update Year"]) || 0) - (Number(a["Update Year"]) || 0);
    });

    return rows;
  }, [solutions, search, activeSector, status, sortBy]);

  if (error) return <ErrorMessage message={error} />;

  return (
    <main className="dashboard-content">
      <div className="page-title-row">
        <div>
          <h2>Solution Explorer</h2>
          <p>Browse, search and filter every tracked solution package.</p>
        </div>
      </div>

      {loading ? (
        <div className="solution-grid">
          {Array.from({ length: 6 }).map((_, i) => (
            <div className="solution-card skeleton" style={{ height: 150 }} key={i}></div>
          ))}
        </div>
      ) : (
        <div className="explorer-layout">
          <SolutionSidebar
            sectors={sectors}
            activeSector={activeSector}
            onSelectSector={setActiveSector}
            totalCount={solutions.length}
          />

          <div className="explorer-main">
            <FilterPanel
              search={search}
              onSearchChange={setSearch}
              status={status}
              onStatusChange={setStatus}
              sortBy={sortBy}
              onSortChange={setSortBy}
              resultCount={filtered.length}
            />

            {filtered.length === 0 ? (
              <div className="coming-soon">
                <div className="coming-soon-icon">
                  <i className="ti ti-search-off" aria-hidden="true"></i>
                </div>
                <h3>No solutions match your filters</h3>
                <p>Try clearing the search or selecting a different sector.</p>
              </div>
            ) : (
              <div className="solution-grid">
                {filtered.map((row) => (
                  <SolutionCard key={row["Sr No."]} solution={row} />
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
}

export default SolutionExplorerPage;
