import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getLastUpdated } from "../../api/dashboardApi";
import { subscribeToConnectionStatus } from "../../api/realtime";
import { formatDate, formatRelativeTime } from "../../utils/formatDate";

function Header({ onMenuClick, onMenuHover }) {
  const [lastUpdated, setLastUpdated] = useState(null);
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "light");
  const [connected, setConnected] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  // Forces the "Synced X ago" label to re-render periodically so it stays
  // accurate without needing a page reload - the value itself isn't stored,
  // it just triggers formatRelativeTime() to recompute on each tick.
  const [, setTick] = useState(0);

  useEffect(() => {
    getLastUpdated()
      .then((data) => setLastUpdated(data.lastUpdated))
      .catch(() => {});
  }, []);

  useEffect(() => subscribeToConnectionStatus(setConnected), []);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    const handleFullscreenChange = () => setIsFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => setTick((t) => t + 1), 60000);
    return () => clearInterval(interval);
  }, []);

  const toggleFullscreen = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      document.documentElement.requestFullscreen().catch(() => {});
    }
  };

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
          onClick={toggleFullscreen}
          aria-label="Toggle fullscreen"
          aria-pressed={isFullscreen}
          title="Toggle fullscreen"
        >
          <i className={`ti ${isFullscreen ? "ti-minimize" : "ti-maximize"}`} aria-hidden="true"></i>
        </button>

        <button
          type="button"
          className="icon-btn"
          onClick={() => setTheme((t) => (t === "light" ? "dark" : "light"))}
          aria-label="Toggle theme"
          aria-pressed={theme === "dark"}
          title="Toggle light/dark theme"
        >
          <i className={`ti ${theme === "light" ? "ti-moon" : "ti-sun"}`} aria-hidden="true"></i>
        </button>

        {!connected && (
          <span
            className="connection-status"
            role="status"
            aria-live="polite"
            title="Live updates are paused - reconnecting..."
          >
            <span className="status-dot"></span>
            Reconnecting...
          </span>
        )}

        <span className="last-synced" title={`Last synced ${formatDate(lastUpdated)}`}>
          <i className="ti ti-refresh" aria-hidden="true"></i>
          Synced {formatRelativeTime(lastUpdated)}
        </span>
      </div>
    </div>
  );
}

export default Header;
