import { useEffect, useState } from "react";
import { getLastUpdated } from "../../api/dashboardApi";
import { formatDate } from "../../utils/formatDate";

function Header() {
  const [lastUpdated, setLastUpdated] = useState(null);

  useEffect(() => {
    getLastUpdated()
      .then((data) => setLastUpdated(data.lastUpdated))
      .catch(() => {});
  }, []);

  return (
    <div className="app-header">
      <div className="search-box">
        <i className="ti ti-search" aria-hidden="true"></i>
        <input type="text" placeholder="Search solutions" />
      </div>

      <span className="last-synced">
        <i className="ti ti-refresh" aria-hidden="true"></i>
        Synced {formatDate(lastUpdated)}
      </span>
    </div>
  );
}

export default Header;
