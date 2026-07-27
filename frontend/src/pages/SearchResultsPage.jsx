import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { useLongList } from "../hooks/useLongList";
import SearchResultCard from "../components/search/SearchResultCard";
import Loading from "../components/common/Loading";
import ErrorMessage from "../components/common/ErrorMessage";
import { FIELDS } from "../utils/helpers";

// Every field a global search should match against - broader than the
// name-only search on the Dashboard/Explorer pages, since this is meant to
// surface a solution from any of its key attributes in one place.
const SEARCHABLE_FIELDS = [
  FIELDS.name,
  FIELDS.sector,
  FIELDS.valueChain,
  FIELDS.segment,
  FIELDS.activity,
  FIELDS.innovationType,
];

function SearchResultsPage() {
  const { solutions, loading, error, retry } = useLongList();
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("q") || "";

  const handleQueryChange = (value) => {
    setSearchParams(value.trim() ? { q: value } : {}, { replace: true });
  };

  const results = useMemo(() => {
    if (!solutions) return [];
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return solutions.filter((row) =>
      SEARCHABLE_FIELDS.some((field) => (row[field] || "").toLowerCase().includes(q))
    );
  }, [solutions, query]);

  if (loading) return <Loading />;
  if (error) return <ErrorMessage message={error} onRetry={retry} />;

  const trimmedQuery = query.trim();

  return (
    <main className="dashboard-content" id="main-content" tabIndex={-1}>
      <div className="page-title-row">
        <div>
          <h2>Search</h2>
          <p>Every matching solution&apos;s details, all in one place.</p>
        </div>
      </div>

      <div className="search-box search-results-box">
        <i className="ti ti-search" aria-hidden="true"></i>
        <input
          type="text"
          placeholder="Search everything..."
          aria-label="Search all solutions, sectors and value chains"
          value={query}
          onChange={(e) => handleQueryChange(e.target.value)}
          autoFocus
        />
        {query && (
          <button
            type="button"
            className="search-box-clear"
            aria-label="Clear search"
            onClick={() => handleQueryChange("")}
          >
            <i className="ti ti-x" aria-hidden="true"></i>
          </button>
        )}
      </div>

      {!trimmedQuery ? (
        <p className="search-results-hint" role="status">
          Start typing to search across every solution&apos;s sector, value chain, segment and
          activity.
        </p>
      ) : (
        <>
          <p className="search-results-count" role="status">
            {results.length} result{results.length === 1 ? "" : "s"} for &quot;{trimmedQuery}
            &quot;
          </p>

          {results.length === 0 ? (
            <p className="search-results-empty" role="status">
              No solutions match &quot;{trimmedQuery}&quot;. Try a different sector, value chain
              or name.
            </p>
          ) : (
            <div className="search-results-list">
              {results.map((row) => (
                <SearchResultCard key={row.__uid} solution={row} query={trimmedQuery} />
              ))}
            </div>
          )}
        </>
      )}
    </main>
  );
}

export default SearchResultsPage;
