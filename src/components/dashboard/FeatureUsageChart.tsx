import { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Skeleton } from "@/components/ui/skeleton";
import type { TopFeature } from "@/services/dashboard.service";

interface FeatureUsageChartProps {
  data: TopFeature[];
  isLoading?: boolean;
}

export function FeatureUsageChart({ data, isLoading }: FeatureUsageChartProps) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  if (isLoading) {
    return (
      <div className="h-[250px] sm:h-[300px] space-y-4 p-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4">
            <Skeleton className="h-4 w-16 sm:w-24" />
            <Skeleton className="h-6 flex-1" />
          </div>
        ))}
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="h-[250px] sm:h-[300px] flex items-center justify-center text-muted-foreground">
        <p>No usage data available</p>
      </div>
    );
  }

  const maxNameLength = isMobile ? 8 : 12;
  const chartData = data.map((feature) => ({
    name:
      feature.featureName.length > maxNameLength
        ? feature.featureName.substring(0, maxNameLength) + "..."
        : feature.featureName,
    fullName: feature.featureName,
    usage: feature.usage,
    users: feature.usersUsingIt,
  }));

  return (
    <div className="h-[250px] sm:h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          layout="vertical"
          margin={{
            top: 5,
            right: isMobile ? 10 : 30,
            left: isMobile ? 0 : 20,
            bottom: 5,
          }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#4b5563"
            horizontal={true}
            vertical={false}
          />
          <XAxis
            type="number"
            tickFormatter={(value) => value.toLocaleString()}
            tick={{ fill: "#9ca3af", fontSize: isMobile ? 10 : 12 }}
            axisLine={{ stroke: "#4b5563" }}
            tickLine={{ stroke: "#4b5563" }}
          />
          <YAxis
            type="category"
            dataKey="name"
            width={isMobile ? 60 : 80}
            tick={{ fill: "#9ca3af", fontSize: isMobile ? 10 : 12 }}
            axisLine={{ stroke: "#4b5563" }}
            tickLine={{ stroke: "#4b5563" }}
          />
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
              typeof value === "number" ? value.toLocaleString() : value,
              "Usage",
            ]}
            labelFormatter={(_, payload) => {
              if (payload && payload[0]) {
                return payload[0].payload.fullName;
              }
              return "";
            }}
          />
          <Bar
            dataKey="usage"
            fill="#3b82f6"
            radius={[0, 4, 4, 0]}
            name="usage"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
