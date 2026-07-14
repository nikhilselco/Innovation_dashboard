import api from "./axios";

export async function getSummary() {
  const res = await api.get("/api/dashboard/summary");
  return res.data;
}

export async function getSectors() {
  const res = await api.get("/api/dashboard/sectors");
  return res.data;
}

export async function getBenchmarkStatus() {
  const res = await api.get("/api/dashboard/benchmark-status");
  return res.data;
}

export async function getLongList() {
  const res = await api.get("/api/dashboard/longlist");
  return res.data;
}

export async function getLastUpdated() {
  const res = await api.get("/api/dashboard/last-updated");
  return res.data;
}
