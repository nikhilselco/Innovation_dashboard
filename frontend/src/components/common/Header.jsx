import { useEffect, useState } from "react";
import { getLastUpdated } from "../../api/dashboardApi";
import { formatDate } from "../../utils/formatDate";

function Header({ onMenuClick }) {
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
      <button
        type="button"
        className="icon-btn mobile-menu-btn"
        onClick={onMenuClick}
        aria-label="Open menu"
      >
        <i className="ti ti-menu-2" aria-hidden="true"></i>
      </button>

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
