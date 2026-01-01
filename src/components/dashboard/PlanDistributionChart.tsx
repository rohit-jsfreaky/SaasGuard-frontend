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

// Fallback colors if CSS vars not available
const FALLBACK_COLORS = ["#3b82f6", "#22c55e", "#f59e0b", "#ef4444", "#8b5cf6"];

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
            label={({ name, percent }) =>
              `${name}: ${((percent || 0) * 100).toFixed(0)}%`
            }
            labelLine={{
              stroke: "hsl(var(--muted-foreground))",
              strokeWidth: 1,
            }}
          >
            {chartData.map((_, index) => (
              <Cell
                key={`cell-${index}`}
                fill={FALLBACK_COLORS[index % FALLBACK_COLORS.length]}
                className="hover:opacity-80 transition-opacity cursor-pointer"
              />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(var(--popover))",
              borderColor: "hsl(var(--border))",
              borderRadius: "8px",
            }}
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
