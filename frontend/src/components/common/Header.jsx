function Header() {
  return (
    <div className="app-header">
      <div className="header-actions">
        <div className="search-box">
          <i className="ti ti-search" aria-hidden="true"></i>
          <input type="text" placeholder="Search solutions" />
        </div>
        <button className="export-btn primary" type="button">
          <i className="ti ti-download" aria-hidden="true"></i> Export
        </button>
        <div className="avatar-chip" title="SELCO Foundation">
          SF
        </div>
      </div>
    </div>
  );
}

export default Header;
