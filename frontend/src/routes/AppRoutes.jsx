import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import Loading from "../components/common/Loading";

const DashboardPage = lazy(() => import("../pages/DashboardPage"));
const SolutionExplorerPage = lazy(() => import("../pages/SolutionExplorerPage"));
const BenchmarkTrackerPage = lazy(() => import("../pages/BenchmarkTrackerPage"));

function AppRoutes() {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/explorer" element={<SolutionExplorerPage />} />
          <Route path="/explorer/:id" element={<SolutionExplorerPage />} />
          <Route path="/tracker" element={<BenchmarkTrackerPage />} />
        </Route>
      </Routes>
    </Suspense>
  );
}

export default AppRoutes;
