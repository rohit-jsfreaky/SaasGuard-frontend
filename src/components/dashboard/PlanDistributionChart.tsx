import { useMemo } from "react";
import { Pie, PieChart as RechartsPieChart } from "recharts";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

interface PlanDistributionChartProps {
  data?: Record<string, number>;
}

export function PlanDistributionChart({ data }: PlanDistributionChartProps) {
  const chartData = useMemo(() => {
    if (!data) return [];
    return Object.entries(data).map(([name, value], index) => ({
      name,
      value,
      fill: [
        "hsl(var(--chart-1))",
        "hsl(var(--chart-2))",
        "hsl(var(--chart-3))",
        "hsl(var(--chart-4))",
        "hsl(var(--chart-5))",
      ][index % 5],
    }));
  }, [data]);

  const totalUsers = useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.value, 0);
  }, [chartData]);

  const config = useMemo(() => {
    return chartData.reduce(
      (acc, curr) => ({
        ...acc,
        [curr.name]: {
          label: curr.name,
          color: curr.fill,
        },
      }),
      {}
    );
  }, [chartData]);

  if (chartData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Plan Distribution</CardTitle>
          <CardDescription>No data available</CardDescription>
        </CardHeader>
        <CardContent className="h-[250px] flex items-center justify-center text-muted-foreground">
          No active plans
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Plan Distribution</CardTitle>
        <CardDescription>User breakdown by subscription plan</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[250px] w-full">
          <ChartContainer config={config} className="h-full w-full">
            <RechartsPieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
              />
              <ChartTooltip content={<ChartTooltipContent />} />
            </RechartsPieChart>
          </ChartContainer>
        </div>
        <div className="mt-4 flex flex-wrap justify-center gap-4 text-xs">
          {chartData.map((entry) => (
            <div key={entry.name} className="flex items-center gap-1.5">
              <div
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: entry.fill }}
              />
              <span className="text-muted-foreground">
                {entry.name} ({Math.round((entry.value / totalUsers) * 100)}%)
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
