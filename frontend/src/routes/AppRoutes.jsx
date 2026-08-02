import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import Loading from "../components/common/Loading";
// Dashboard is the default landing route, so it (and the chart library it
// needs) is bundled eagerly to avoid a fetch waterfall on first load. Only
// Explorer/Tracker - visited after the app is already up - stay code-split.
import DashboardPage from "../pages/DashboardPage";

const SolutionExplorerPage = lazy(() => import("../pages/SolutionExplorerPage"));
const BenchmarkTrackerPage = lazy(() => import("../pages/BenchmarkTrackerPage"));
const SearchResultsPage = lazy(() => import("../pages/SearchResultsPage"));
const SearchSolutionPage = lazy(() => import("../pages/SearchSolutionPage"));

function AppRoutes() {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/explorer" element={<SolutionExplorerPage />} />
          <Route path="/explorer/:id" element={<SolutionExplorerPage />} />
          <Route path="/tracker" element={<BenchmarkTrackerPage />} />
          <Route path="/search" element={<SearchResultsPage />} />
          <Route path="/search/:id" element={<SearchSolutionPage />} />
        </Route>
      </Routes>
    </Suspense>
  );
}

export default AppRoutes;