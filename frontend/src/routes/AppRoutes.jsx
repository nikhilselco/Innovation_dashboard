import { Routes, Route } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import DashboardPage from "../pages/DashboardPage";
import SolutionExplorerPage from "../pages/SolutionExplorerPage";
import SolutionDetailPage from "../pages/SolutionDetailPage";
import BenchmarkTrackerPage from "../pages/BenchmarkTrackerPage";

function AppRoutes() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/explorer" element={<SolutionExplorerPage />} />
        <Route path="/solutions/:id" element={<SolutionDetailPage />} />
        <Route path="/tracker" element={<BenchmarkTrackerPage />} />
      </Route>
    </Routes>
  );
}

export default AppRoutes;
