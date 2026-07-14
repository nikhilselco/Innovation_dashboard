import { NavLink, Outlet } from "react-router-dom";
import Header from "../components/common/Header";

const NAV_ITEMS = [
  { to: "/", label: "Overall Dashboard", icon: "ti-layout-dashboard", end: true },
  { to: "/explorer", label: "Solution Explorer", icon: "ti-list-search" },
  { to: "/tracker", label: "Benchmark Tracker", icon: "ti-calendar-stats" },
];

function MainLayout() {
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <img src="/selco-foundation.png" alt="SELCO Foundation" />
          <div className="sidebar-brand-text">
            <strong>SELCO</strong>
            <span>Innovation Hub</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          <span className="sidebar-nav-label">Menu</span>
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `sidebar-link${isActive ? " active" : ""}`
              }
            >
              <i className={`ti ${item.icon}`} aria-hidden="true"></i>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="sync-pill">
            <span className="sync-dot"></span>
            Auto-synced every 30s
          </div>
        </div>
      </aside>

      <div className="app-main">
        <Header />
        <Outlet />
      </div>
    </div>
  );
}

export default MainLayout;
