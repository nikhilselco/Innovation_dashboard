import { useState } from "react";
import { NavLink, Outlet, Link, useNavigate } from "react-router-dom";
import Header from "../components/common/Header";
import Footer from "../components/common/Footer";

const NAV_ITEMS = [
  { to: "/", label: "Overall Dashboard", icon: "ti-layout-dashboard", end: true },
  { to: "/explorer", label: "Solution Explorer", icon: "ti-list-search" },
  { to: "/tracker", label: "Benchmark Tracker", icon: "ti-calendar-stats" },
];

const MOBILE_BREAKPOINT = 768;

function MainLayout() {
  const [collapsed, setCollapsed] = useState(
    () => typeof window !== "undefined" && window.innerWidth <= MOBILE_BREAKPOINT
  );
  // Lets the sidebar temporarily expand on hover without changing the
  // underlying `collapsed` preference - it snaps back once the cursor
  // leaves, unlike a click which pins it open/closed.
  const [hoverOpen, setHoverOpen] = useState(false);
  const expanded = !collapsed || hoverOpen;
  const [globalQuery, setGlobalQuery] = useState("");
  const navigate = useNavigate();

  const closeOnMobile = () => {
    if (window.innerWidth <= MOBILE_BREAKPOINT) {
      setCollapsed(true);
      setHoverOpen(false);
    }
  };

  const handleGlobalSearch = (e) => {
    e.preventDefault();
    const q = globalQuery.trim();
    if (!q) return;
    navigate(`/search?q=${encodeURIComponent(q)}`);
    setGlobalQuery("");
    closeOnMobile();
  };

  return (
    <div className="app-shell">
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      <aside
        className={`sidebar${expanded ? "" : " collapsed"}`}
        onMouseEnter={() => setHoverOpen(true)}
        onMouseLeave={() => setHoverOpen(false)}
      >
        <div className="sidebar-brand">
          <Link
            to="/"
            className="sidebar-brand-link"
            title="Go to Overall Dashboard"
            onClick={closeOnMobile}
          >
            <img src="/selco-foundation.png" alt="SELCO Foundation" />
            <div className="sidebar-brand-text">
              <strong>SELCO</strong>
              <span>Innovation Hub</span>
            </div>
          </Link>
          <button
            type="button"
            className="icon-btn sidebar-toggle"
            onClick={() => setCollapsed((c) => !c)}
            aria-label="Toggle sidebar"
            title="Toggle sidebar"
          >
            <i
              className={`ti ${expanded ? "ti-layout-sidebar-left-collapse" : "ti-layout-sidebar-left-expand"}`}
              aria-hidden="true"
            ></i>
          </button>
        </div>

        <form className="sidebar-search" role="search" onSubmit={handleGlobalSearch}>
          <div className="search-box sidebar-search-box">
            <i className="ti ti-search" aria-hidden="true"></i>
            <input
              type="text"
              placeholder="Search everything..."
              aria-label="Search all solutions, sectors and value chains"
              value={globalQuery}
              onChange={(e) => setGlobalQuery(e.target.value)}
            />
            {globalQuery && (
              <button
                type="button"
                className="search-box-clear"
                aria-label="Clear search"
                onClick={() => setGlobalQuery("")}
              >
                <i className="ti ti-x" aria-hidden="true"></i>
              </button>
            )}
          </div>
        </form>

        <nav className="sidebar-nav">
          <span className="sidebar-nav-label">Menu</span>
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              title={item.label}
              onClick={closeOnMobile}
              className={({ isActive }) =>
                `sidebar-link${isActive ? " active" : ""}`
              }
            >
              <i className={`ti ${item.icon}`} aria-hidden="true"></i>
              <span className="link-label">{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </aside>

      {!collapsed && <div className="sidebar-backdrop" onClick={() => setCollapsed(true)}></div>}

      <div className="app-main">
        <Header
          onMenuClick={() => setCollapsed((c) => !c)}
          onMenuHover={() => setHoverOpen(true)}
        />
        <Outlet />
        <Footer />
      </div>
    </div>
  );
}

export default MainLayout;