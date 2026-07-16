import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { getSector, getDocStatus } from "../../utils/helpers";

const STATUS_COLORS = {
  done: "#14a577",
  "in-progress": "#e8a13d",
  "not-started": "#c0392b",
};

function SectorStatusChart({ solutions }) {
  const bySector = {};

  solutions.forEach((row) => {
    const sector = getSector(row);
    if (!bySector[sector]) {
      bySector[sector] = { sector, done: 0, "in-progress": 0, "not-started": 0 };
    }
    bySector[sector][getDocStatus(row).status]++;
  });

  const data = Object.values(bySector).sort(
    (a, b) => b.done + b["in-progress"] + b["not-started"] - (a.done + a["in-progress"] + a["not-started"])
  );

  return (
    <div className="card">
      <p className="card-title">Status by Sector</p>
      <ResponsiveContainer width="100%" height={data.length * 34 + 40}>
        <BarChart data={data} layout="vertical" margin={{ top: 0, right: 16, bottom: 0, left: 0 }}>
          <XAxis type="number" hide />
          <YAxis
            type="category"
            dataKey="sector"
            width={110}
            tick={{ fontSize: 12, fill: "var(--color-text-secondary)", fontWeight: 500 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip cursor={{ fill: "var(--color-background-secondary)" }} />
          <Legend
            wrapperStyle={{ fontSize: 11 }}
            formatter={(value) => (value === "in-progress" ? "In Progress" : value === "not-started" ? "Not Started" : "Done")}
          />
          <Bar dataKey="done" stackId="status" fill={STATUS_COLORS.done} radius={[4, 0, 0, 4]} barSize={16} />
          <Bar dataKey="in-progress" stackId="status" fill={STATUS_COLORS["in-progress"]} barSize={16} />
          <Bar
            dataKey="not-started"
            stackId="status"
            fill={STATUS_COLORS["not-started"]}
            radius={[0, 4, 4, 0]}
            barSize={16}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default SectorStatusChart;
