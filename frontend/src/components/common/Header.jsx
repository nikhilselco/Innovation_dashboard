import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getLastUpdated } from "../../api/dashboardApi";
import { formatDate } from "../../utils/formatDate";

function Header({ onMenuClick, onMenuHover }) {
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
      <div className="app-header-left">
        <button
          type="button"
          className="icon-btn mobile-menu-btn"
          onClick={onMenuClick}
          onMouseEnter={onMenuHover}
          aria-label="Open menu"
        >
          <i className="ti ti-menu-2" aria-hidden="true"></i>
        </button>

        <Link to="/" className="app-header-brand" title="Go to Overall Dashboard">
          <img src="/selco-foundation.png" alt="SELCO Foundation" />
        </Link>
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