import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Cell,
  Tooltip,
  LabelList,
  ResponsiveContainer,
} from "recharts";

const COLORS = ["#14a577", "#7c6ff0", "#e8a13d", "#e0678f", "#2563eb", "#0e8a63"];

function ChartTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;

  const { sector, count } = payload[0].payload;

  return (
    <div
      style={{
        background: "var(--color-background-primary)",
        border: "1px solid var(--color-border-secondary)",
        borderRadius: "var(--border-radius-sm)",
        boxShadow: "var(--shadow-md)",
        padding: "8px 12px",
        fontSize: 12,
      }}
    >
      <strong>{sector}</strong>
      <div style={{ color: "var(--color-text-secondary)" }}>{count} solutions</div>
    </div>
  );
}

function SectorChart({ data }) {
  const sorted = [...data].sort((a, b) => b.count - a.count);

  return (
    <div className="card">
      <p className="card-title">Solutions by Sector</p>
      <ResponsiveContainer width="100%" height={sorted.length * 30 + 10}>
        <BarChart
          data={sorted}
          layout="vertical"
          margin={{ top: 0, right: 32, bottom: 0, left: 0 }}
          barCategoryGap={12}
        >
          <XAxis type="number" hide domain={[0, (max) => Math.ceil(max * 1.15)]} />
          <YAxis
            type="category"
            dataKey="sector"
            width={110}
            tick={{ fontSize: 12, fill: "var(--color-text-secondary)", fontWeight: 500 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<ChartTooltip />} cursor={{ fill: "var(--color-background-secondary)" }} />
          <Bar dataKey="count" radius={[6, 6, 6, 6]} barSize={10}>
            {sorted.map((entry, index) => (
              <Cell key={entry.sector} fill={COLORS[index % COLORS.length]} />
            ))}
            <LabelList
              dataKey="count"
              position="right"
              style={{ fontSize: 12, fontWeight: 600, fill: "var(--color-text-primary)" }}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default SectorChart;