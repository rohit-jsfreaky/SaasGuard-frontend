import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";
import { Skeleton } from "@/components/ui/skeleton";
import type { PlanDistribution } from "@/services/dashboard.service";

interface PlanDistributionChartProps {
  data: PlanDistribution[];
  isLoading?: boolean;
}

// Vibrant colors for chart segments
const COLORS = [
  "#3b82f6", // blue
  "#22c55e", // green
  "#f59e0b", // amber
  "#a855f7", // purple
  "#ef4444", // red
  "#06b6d4", // cyan
  "#ec4899", // pink
];

export function PlanDistributionChart({
  data,
  isLoading,
}: PlanDistributionChartProps) {
  if (isLoading) {
    return (
      <div className="h-[300px] flex items-center justify-center">
        <Skeleton className="h-48 w-48 rounded-full" />
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="h-[300px] flex items-center justify-center text-muted-foreground">
        <p>No plan distribution data available</p>
      </div>
    );
  }

  const chartData = data.map((plan) => ({
    name: plan.planName,
    value: plan.userCount,
  }));

  const totalUsers = chartData.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={90}
            paddingAngle={2}
            dataKey="value"
            label={{
              fill: "#e5e7eb",
              fontSize: 12,
              formatter: (entry: any) => `${entry.name}: ${((entry.percent || 0) * 100).toFixed(0)}%`,
            }}
            labelLine={{
              stroke: "#9ca3af",
              strokeWidth: 1,
            }}
          >
            {chartData.map((_, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
                className="hover:opacity-80 transition-opacity cursor-pointer"
              />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: "#1f2937",
              borderColor: "#374151",
              borderRadius: "8px",
              color: "#f9fafb",
            }}
            labelStyle={{ color: "#f9fafb" }}
            itemStyle={{ color: "#f9fafb" }}
            formatter={(value: any) => [
              `${value} users (${((value / totalUsers) * 100).toFixed(1)}%)`,
              "Users",
            ]}
          />
          <Legend
            verticalAlign="bottom"
            height={36}
            formatter={(value) => (
              <span className="text-sm text-foreground">{value}</span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
