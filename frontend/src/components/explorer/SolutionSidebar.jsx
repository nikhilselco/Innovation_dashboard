function SolutionSidebar({ sectors, activeSector, onSelectSector, totalCount }) {
  return (
    <aside className="facet-panel">
      <p className="facet-heading">Sector</p>
      <div className="facet-list">
        <button
          type="button"
          className={`facet-item${activeSector === null ? " active" : ""}`}
          onClick={() => onSelectSector(null)}
        >
          <span>All Sectors</span>
          <span className="facet-count">{totalCount}</span>
        </button>
        {sectors.map((s) => (
          <button
            key={s.sector}
            type="button"
            className={`facet-item${activeSector === s.sector ? " active" : ""}`}
            onClick={() => onSelectSector(s.sector)}
          >
            <span>{s.sector}</span>
            <span className="facet-count">{s.count}</span>
          </button>
        ))}
      </div>
    </aside>
  );
}

export default SolutionSidebar;
