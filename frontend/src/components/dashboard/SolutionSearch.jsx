import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FIELDS, isBenchmarked } from "../../utils/helpers";

function SolutionSearch({ solutions }) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const trimmedQuery = query.trim().toLowerCase();
  const matches = trimmedQuery
    ? solutions.filter((row) => (row[FIELDS.name] || "").toLowerCase().includes(trimmedQuery)).slice(0, 8)
    : [];

  const goToSolution = (row) => {
    navigate(`/explorer/${row.__uid}`);
    setQuery("");
    setOpen(false);
  };

  return (
    <div className="dashboard-search" ref={containerRef}>
      <div className="search-box dashboard-search-box">
        <i className="ti ti-search" aria-hidden="true"></i>
        <input
          type="text"
          placeholder="Search solutions by name..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={(e) => e.key === "Escape" && setOpen(false)}
        />
      </div>

      {open && trimmedQuery && (
        <div className="search-dropdown">
          {matches.length === 0 ? (
            <p className="search-dropdown-empty">No solutions match &quot;{query}&quot;.</p>
          ) : (
            matches.map((row) => {
              const benchmarked = isBenchmarked(row);
              return (
                <button
                  type="button"
                  key={row.__uid}
                  className="search-dropdown-item"
                  onClick={() => goToSolution(row)}
                >
                  <span className="search-dropdown-name">{row[FIELDS.name]}</span>
                  <span className="search-dropdown-meta">
                    <span className="row-sector">{row[FIELDS.sector] || "-"}</span>
                    <span className={`row-status ${benchmarked ? "done" : "pending"}`}>
                      <span className="status-dot"></span>
                      {benchmarked ? "Benchmarked" : "Pending"}
                    </span>
                  </span>
                </button>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}

export default SolutionSearch;