import { useEffect, useState } from "react";
import { getLastUpdated } from "../../api/dashboardApi";
import { formatDate } from "../../utils/formatDate";

function Header() {
  const [lastUpdated, setLastUpdated] = useState(null);
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "light");

  useEffect(() => {
    getLastUpdated()
      .then((data) => setLastUpdated(data.lastUpdated))
      .catch(() => {});
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <div className="app-header">
      <div className="search-box">
        <i className="ti ti-search" aria-hidden="true"></i>
        <input type="text" placeholder="Search solutions" />
      </div>

      <div className="header-right">
        <button
          type="button"
          className="icon-btn"
          onClick={() => setTheme((t) => (t === "light" ? "dark" : "light"))}
          aria-label="Toggle theme"
          title="Toggle light/dark theme"
        >
          <i className={`ti ${theme === "light" ? "ti-moon" : "ti-sun"}`} aria-hidden="true"></i>
        </button>

        <span className="last-synced">
          <i className="ti ti-refresh" aria-hidden="true"></i>
          Synced {formatDate(lastUpdated)}
        </span>
      </div>
    </div>
  );
}

export default Header;