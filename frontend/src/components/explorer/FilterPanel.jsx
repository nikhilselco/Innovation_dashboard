const STATUS_OPTIONS = [
  { value: "all", label: "All" },
  { value: "benchmarked", label: "Benchmarked" },
  { value: "pending", label: "Pending" },
];

function FilterPanel({
  search,
  onSearchChange,
  status,
  onStatusChange,
  sortBy,
  onSortChange,
  resultCount,
}) {
  return (
    <div className="explorer-toolbar">
      <div className="search-box explorer-search">
        <i className="ti ti-search" aria-hidden="true"></i>
        <input
          type="text"
          placeholder="Search solutions by name..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      <div className="status-toggle">
        {STATUS_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            type="button"
            className={`status-toggle-btn${status === opt.value ? " active" : ""}`}
            onClick={() => onStatusChange(opt.value)}
          >
            {opt.label}
          </button>
        ))}
      </div>

      <select
        className="sort-select"
        value={sortBy}
        onChange={(e) => onSortChange(e.target.value)}
      >
        <option value="year-desc">Newest first</option>
        <option value="name-asc">Name A–Z</option>
      </select>

      <span className="result-count">{resultCount} results</span>
    </div>
  );
}

export default FilterPanel;
