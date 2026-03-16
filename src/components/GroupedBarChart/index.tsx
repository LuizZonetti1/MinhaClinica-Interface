import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { GroupedBarChartProps } from "../../types/components";

const CustomTooltip = ({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ name: string; value: number; color: string }>;
  label?: string;
}) => {
  if (active && payload && payload.length) {
    return (
      <div
        style={{
          background: "#fff",
          border: "1px solid #e5e7eb",
          borderRadius: 8,
          padding: "10px 14px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
        }}
      >
        <p
          style={{
            margin: "0 0 6px",
            fontFamily: "Roboto",
            fontSize: 13,
            fontWeight: 600,
            color: "#111827",
          }}
        >
          {label}
        </p>
        {payload.map((entry) => (
          <p
            key={entry.name}
            style={{
              margin: "2px 0",
              fontFamily: "Inter",
              fontSize: 12,
              color: entry.color,
            }}
          >
            {entry.name}: <strong>{entry.value}</strong>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export const GroupedBarChart = ({
  data,
  series,
  leftFormatter = (v) => String(v),
  rightFormatter = (v) => String(v),
  height = 280,
}: GroupedBarChartProps) => {
  const hasDualAxis = series.some((s) => s.yAxisId === "right");

  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 8, right: hasDualAxis ? 60 : 24, left: 8, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
        <XAxis
          dataKey="month"
          tick={{ fontFamily: "Inter", fontSize: 12, fill: "#6b7280" }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          yAxisId="left"
          tickFormatter={leftFormatter}
          tick={{ fontFamily: "Inter", fontSize: 12, fill: "#6b7280" }}
          axisLine={false}
          tickLine={false}
        />
        {hasDualAxis && (
          <YAxis
            yAxisId="right"
            orientation="right"
            tickFormatter={rightFormatter}
            tick={{ fontFamily: "Inter", fontSize: 12, fill: "#6b7280" }}
            axisLine={false}
            tickLine={false}
          />
        )}
        <Tooltip content={<CustomTooltip />} />
        <Legend
          iconType="circle"
          iconSize={10}
          wrapperStyle={{ fontFamily: "Inter", fontSize: 13, paddingTop: 12 }}
        />
        {series.map((s) => (
          <Bar
            key={s.dataKey}
            dataKey={s.dataKey}
            name={s.name}
            fill={s.color}
            yAxisId={s.yAxisId ?? "left"}
            radius={[3, 3, 0, 0]}
          />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
};
