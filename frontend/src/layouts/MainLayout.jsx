import { useState } from "react";
import { NavLink, Outlet, Link } from "react-router-dom";
import Header from "../components/common/Header";

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

  const closeOnMobile = () => {
    if (window.innerWidth <= MOBILE_BREAKPOINT) setCollapsed(true);
  };

  return (
    <div className="app-shell">
      <aside className={`sidebar${collapsed ? " collapsed" : ""}`}>
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
              className={`ti ${collapsed ? "ti-layout-sidebar-left-expand" : "ti-layout-sidebar-left-collapse"}`}
              aria-hidden="true"
            ></i>
          </button>
        </div>

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
        <Header onMenuClick={() => setCollapsed((c) => !c)} />
        <Outlet />
      </div>
    </div>
  );
}

export default MainLayout;
