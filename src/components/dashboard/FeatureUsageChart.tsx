import { useMemo } from "react";
import { Bar, BarChart as RechartsBarChart, XAxis, YAxis } from "recharts";
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

interface FeatureUsageChartProps {
  data?: { feature: string; usageCount: number; usagePercent: number }[];
}

export function FeatureUsageChart({ data }: FeatureUsageChartProps) {
  const chartData = useMemo(() => {
    if (!data) return [];
    return data
      .map((item) => ({
        name: item.feature,
        value: item.usageCount,
        fill: "hsl(var(--primary))",
      }))
      .slice(0, 5); // Top 5
  }, [data]);

  const config = {
    value: {
      label: "Usage Count",
      color: "hsl(var(--primary))",
    },
  };

  if (chartData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Top Feature Usage</CardTitle>
          <CardDescription>No data available</CardDescription>
        </CardHeader>
        <CardContent className="h-[300px] flex items-center justify-center text-muted-foreground">
          No usage data
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Feature Usage</CardTitle>
        <CardDescription>
          Most frequently used features this month
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ChartContainer config={config} className="h-full w-full">
            <RechartsBarChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 50 }}
            >
              <XAxis
                dataKey="name"
                tickLine={false}
                axisLine={false}
                angle={-45}
                textAnchor="end"
                height={60}
                fontSize={12}
              />
              <YAxis tickLine={false} axisLine={false} fontSize={12} />
              <Bar
                dataKey="value"
                radius={[4, 4, 0, 0]}
                fill="var(--color-value)"
              />
              <ChartTooltip content={<ChartTooltipContent />} />
            </RechartsBarChart>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
}
