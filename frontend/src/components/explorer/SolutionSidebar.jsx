import SolutionCard from "./SolutionCard";

const STATUS_OPTIONS = [
  { value: "all", label: "All status" },
  { value: "benchmarked", label: "Benchmarked" },
  { value: "pending", label: "Pending" },
];

function SolutionSidebar({
  sectors,
  totalCount,
  filteredCount,
  search,
  onSearchChange,
  sortBy,
  onSortChange,
  activeSector,
  onSelectSector,
  status,
  onStatusChange,
  items,
  selectedId,
  onSelectSolution,
}) {
  return (
    <aside className="browse-panel">
      <div className="browse-panel-filters">
        <p className="browse-panel-heading">Browse solutions</p>

        <div className="search-box browse-search">
          <i className="ti ti-search" aria-hidden="true"></i>
          <input
            type="text"
            placeholder="Search by name..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>

        <div className="select-wrapper browse-sort">
          <select
            className="sort-select"
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
          >
            <option value="year-desc">Recently updated</option>
            <option value="name-asc">Name A-Z</option>
            <option value="impl-desc">Implementations: high → low</option>
          </select>
          <i className="ti ti-chevron-down select-wrapper-icon" aria-hidden="true"></i>
        </div>

        <div className="chip-row">
          <button
            type="button"
            className={`chip-sm${activeSector === null ? " active" : ""}`}
            onClick={() => onSelectSector(null)}
          >
            All
          </button>
          {sectors.map((s) => (
            <button
              type="button"
              key={s.sector}
              className={`chip-sm${activeSector === s.sector ? " active" : ""}`}
              onClick={() => onSelectSector(s.sector)}
            >
              {s.sector}
            </button>
          ))}
        </div>

        <div className="chip-row" style={{ marginTop: 8 }}>
          {STATUS_OPTIONS.map((opt) => (
            <button
              type="button"
              key={opt.value}
              className={`chip-sm${status === opt.value ? " active" : ""}`}
              onClick={() => onStatusChange(opt.value)}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div className="solution-list">
        <p className="solution-list-header">
          Showing {filteredCount} of {totalCount} solutions
        </p>

        {items.length === 0 ? (
          <p className="solution-list-empty">No solutions match your filters.</p>
        ) : (
          items.map((row) => (
            <SolutionCard
              key={row["Sr No."]}
              solution={row}
              active={String(row["Sr No."]) === String(selectedId)}
              onClick={() => onSelectSolution(row["Sr No."])}
            />
          ))
        )}
      </div>
    </aside>
  );
}

export default SolutionSidebar;
