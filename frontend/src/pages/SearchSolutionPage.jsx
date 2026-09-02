import { useMemo } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { useLongList } from "../hooks/useLongList";
import { useCalendarLookup } from "../hooks/useCalendarLookup";
import DetailHeader from "../components/detail/DetailHeader";
import DetailTabs from "../components/detail/DetailTabs";
import Loading from "../components/common/Loading";
import ErrorMessage from "../components/common/ErrorMessage";
import { FIELDS, isBenchmarked, getExpectedDate } from "../utils/helpers";

function SearchSolutionPage() {
  const { solutions, loading, error, retry } = useLongList();
  const calendarLookup = useCalendarLookup();
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";

  const solution = useMemo(() => {
    if (!solutions) return null;
    return solutions.find((row) => String(row.__uid) === String(id)) || null;
  }, [solutions, id]);

  if (loading) return <Loading />;
  if (error) return <ErrorMessage message={error} onRetry={retry} />;

  const expectedDate =
    solution && !isBenchmarked(solution) ? getExpectedDate(solution, calendarLookup) : null;

  return (
    <main className="dashboard-content" id="main-content" tabIndex={-1}>
      <div className="page-title-row">
        <div>
          <Link to={`/search?q=${encodeURIComponent(query)}`} className="view-all-link search-back-link">
            <i className="ti ti-arrow-left" aria-hidden="true"></i> Back to search results
          </Link>
          <h2>{solution ? solution[FIELDS.name] : "Search"}</h2>
          <p>Full details for this solution, without leaving Search.</p>
          {expectedDate && (
            <p className="hero-badge-muted" style={{ display: "inline-flex", marginTop: 8 }}>
              <i className="ti ti-calendar-event" aria-hidden="true"></i>&nbsp;Expected completion:{" "}
              <strong>&nbsp;{expectedDate}</strong>
            </p>
          )}
        </div>
      </div>

      {solution ? (
        <div className="detail-panel">
          <DetailHeader solution={solution} />
          <DetailTabs key={solution.__uid} solution={solution} allSolutions={solutions} />
        </div>
      ) : (
        <div className="detail-panel-empty">
          <p role="status">Couldn&apos;t find that solution.</p>
        </div>
      )}
    </main>
  );
}

export default SearchSolutionPage;
