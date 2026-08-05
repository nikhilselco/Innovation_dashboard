import { useMemo, useState } from "react";
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

// Broad queries (e.g. a sector name) can match a large slice of the dataset -
// render results in batches instead of all at once.
const PAGE_SIZE = 20;

function SearchResultsPage() {
  const { solutions, loading, error, retry } = useLongList();
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const trimmedQuery = query.trim();
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const handleQueryChange = (value) => {
    setSearchParams(value.trim() ? { q: value } : {}, { replace: true });
  };

  const results = useMemo(() => {
    if (!solutions) return [];
    const q = trimmedQuery.toLowerCase();
    if (!q) return [];
    return solutions.filter((row) =>
      SEARCHABLE_FIELDS.some((field) => (row[field] || "").toLowerCase().includes(q))
    );
  }, [solutions, trimmedQuery]);

  // Every new search starts back at the first batch of results - reset
  // during render (not an effect) to avoid an extra render pass.
  const [prevQuery, setPrevQuery] = useState(trimmedQuery);
  if (trimmedQuery !== prevQuery) {
    setPrevQuery(trimmedQuery);
    setVisibleCount(PAGE_SIZE);
  }

  if (loading) return <Loading />;
  if (error) return <ErrorMessage message={error} onRetry={retry} />;

  const visibleResults = results.slice(0, visibleCount);
  const hasMore = visibleCount < results.length;

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
            <>
              <div className="search-results-list">
                {visibleResults.map((row) => (
                  <SearchResultCard key={row.__uid} solution={row} query={trimmedQuery} />
                ))}
              </div>

              {hasMore && (
                <button
                  type="button"
                  className="load-more-btn"
                  onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
                >
                  Load more ({results.length - visibleCount} remaining)
                </button>
              )}
            </>
          )}
        </>
      )}
    </main>
  );
}

export default SearchResultsPage;
