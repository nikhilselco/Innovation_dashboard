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
import { DOC_FIELDS, hasContent } from "../../utils/helpers";

function ChartTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;

  const { label, pending } = payload[0].payload;

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
      <strong>{label}</strong>
      <div style={{ color: "var(--color-text-secondary)" }}>{pending} solutions missing this</div>
    </div>
  );
}

function PendingByFieldChart({ solutions }) {
  const data = DOC_FIELDS.map((f) => ({
    label: f.label,
    pending: solutions.filter((row) => !hasContent(row[f.key])).length,
  })).sort((a, b) => b.pending - a.pending);

  return (
    <div className="card">
      <p className="card-title">Pending by Document Type</p>
      <ResponsiveContainer width="100%" height={data.length * 30 + 10}>
        <BarChart data={data} layout="vertical" margin={{ top: 0, right: 32, bottom: 0, left: 0 }} barCategoryGap={12}>
          <XAxis type="number" hide domain={[0, (max) => Math.ceil(max * 1.15) || 1]} />
          <YAxis
            type="category"
            dataKey="label"
            width={110}
            tick={{ fontSize: 12, fill: "var(--color-text-secondary)", fontWeight: 500 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<ChartTooltip />} cursor={{ fill: "var(--color-background-secondary)" }} />
          <Bar dataKey="pending" radius={[6, 6, 6, 6]} barSize={10}>
            {data.map((entry) => (
              <Cell key={entry.label} fill="var(--color-danger)" />
            ))}
            <LabelList
              dataKey="pending"
              position="right"
              style={{ fontSize: 12, fontWeight: 600, fill: "var(--color-text-primary)" }}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default PendingByFieldChart;
