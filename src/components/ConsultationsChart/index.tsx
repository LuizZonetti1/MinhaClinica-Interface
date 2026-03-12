import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { ConsultationsChartProps } from "../../types/components";

const formatRevenue = (value: number) => `R$ ${(value / 1000).toFixed(0)}k`;
const formatConsultations = (value: number) => `${value}`;

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
            {entry.name}:{" "}
            <strong>{entry.name === "Receita" ? formatRevenue(entry.value) : entry.value}</strong>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export const ConsultationsChart = ({ data }: ConsultationsChartProps) => {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <LineChart data={data} margin={{ top: 8, right: 56, left: 8, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
        <XAxis
          dataKey="month"
          tick={{ fontFamily: "Inter", fontSize: 12, fill: "#6b7280" }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          yAxisId="left"
          domain={[0, "auto"]}
          tick={{ fontFamily: "Inter", fontSize: 12, fill: "#6b7280" }}
          axisLine={false}
          tickLine={false}
          tickFormatter={formatConsultations}
        />
        <YAxis
          yAxisId="right"
          orientation="right"
          domain={[0, "auto"]}
          tick={{ fontFamily: "Inter", fontSize: 12, fill: "#6b7280" }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v: number) => (v === 0 ? "0" : `${v / 1000}k`)}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend wrapperStyle={{ fontFamily: "Inter", fontSize: 12, paddingTop: 12 }} />
        <Line
          yAxisId="left"
          type="monotone"
          dataKey="consultations"
          name="Consultas"
          stroke="#3B82F6"
          strokeWidth={2}
          dot={{ fill: "#3B82F6", r: 4, strokeWidth: 0 }}
          activeDot={{ r: 6, strokeWidth: 2, stroke: "#fff" }}
        />
        <Line
          yAxisId="right"
          type="monotone"
          dataKey="revenue"
          name="Receita"
          stroke="#22C55E"
          strokeWidth={2}
          dot={{ fill: "#22C55E", r: 4, strokeWidth: 0 }}
          activeDot={{ r: 6, strokeWidth: 2, stroke: "#fff" }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};
