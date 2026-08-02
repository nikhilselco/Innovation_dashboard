import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

const COLORS = {
  benchmarked: "#14a577",
  pending: "#e6eaf0",
};

function BenchmarkStatusChart({ benchmarked, pending }) {
  const total = benchmarked + pending;
  const percent = total ? Math.round((benchmarked / total) * 100) : 0;
  const chartData = [
    { name: "Benchmarked", value: benchmarked, color: COLORS.benchmarked },
    { name: "Pending", value: pending, color: COLORS.pending },
  ];

  return (
    <div className="card">
      <p className="card-title">Benchmark Status</p>
      <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
        <div style={{ position: "relative", width: 104, height: 104, flexShrink: 0 }}>
          <div aria-hidden="true" style={{ width: "100%", height: "100%" }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <defs>
                  <linearGradient id="benchmarkedGradient" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#17b884" />
                    <stop offset="100%" stopColor="#0e8a63" />
                  </linearGradient>
                </defs>
                <Pie
                  data={chartData}
                  dataKey="value"
                  innerRadius={34}
                  outerRadius={48}
                  startAngle={90}
                  endAngle={-270}
                  stroke="none"
                  cornerRadius={6}
                  paddingAngle={2}
                >
                  {chartData.map((entry) => (
                    <Cell
                      key={entry.name}
                      fill={entry.name === "Benchmarked" ? "url(#benchmarkedGradient)" : entry.color}
                    />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              pointerEvents: "none",
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-display)",
                fontSize: 22,
                fontWeight: 800,
                color: "var(--color-text-primary)",
                letterSpacing: "-0.4px",
              }}
            >
              {percent}%
            </span>
            <span style={{ fontSize: 9, color: "var(--color-text-tertiary)", fontWeight: 500 }}>
              benchmarked
            </span>
          </div>
        </div>
        <div style={{ fontSize: 13, flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
            <span className="legend-dot" style={{ background: COLORS.benchmarked }}></span>
            <span style={{ color: "var(--color-text-secondary)", flex: 1, fontWeight: 500 }}>
              Benchmarked
            </span>
            <span style={{ fontWeight: 700, fontFamily: "var(--font-display)" }}>{benchmarked}</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span className="legend-dot" style={{ background: COLORS.pending }}></span>
            <span style={{ color: "var(--color-text-secondary)", flex: 1, fontWeight: 500 }}>
              Pending
            </span>
            <span style={{ fontWeight: 700, fontFamily: "var(--font-display)" }}>{pending}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BenchmarkStatusChart;