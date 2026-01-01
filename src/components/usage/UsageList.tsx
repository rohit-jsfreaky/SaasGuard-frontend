import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { RotateCcw, BarChart3 } from "lucide-react";
import { UsageProgressBar } from "./UsageProgressBar";
import {
  getUsagePercentage,
  getRemainingUsage,
  getUsageColor,
} from "@/utils/usage-helpers";
import { cn } from "@/lib/utils";

export interface UsageItem {
  featureSlug: string;
  featureName?: string;
  currentUsage: number;
  limit: number | null;
}

interface UsageListProps {
  items: UsageItem[];
  isLoading?: boolean;
  onResetUsage?: (featureSlug: string) => void;
  showResetButton?: boolean;
}

export function UsageList({
  items,
  isLoading = false,
  onResetUsage,
  showResetButton = false,
}: UsageListProps) {
  if (isLoading) {
    return (
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Feature</TableHead>
              <TableHead>Usage</TableHead>
              <TableHead>Limit</TableHead>
              <TableHead>Progress</TableHead>
              {showResetButton && (
                <TableHead className="w-[80px]">Actions</TableHead>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 4 }).map((_, i) => (
              <TableRow key={i}>
                <TableCell>
                  <Skeleton className="h-4 w-[120px]" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-[60px]" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-[60px]" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-2 w-full" />
                </TableCell>
                {showResetButton && (
                  <TableCell>
                    <Skeleton className="h-8 w-8" />
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  if (!items || items.length === 0) {
    return (
      <div className="flex min-h-[200px] flex-col items-center justify-center rounded-md border border-dashed p-8 text-center animate-in fade-in-50">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-accent">
          <BarChart3 className="h-6 w-6 text-muted-foreground" />
        </div>
        <h3 className="mt-4 text-lg font-semibold">No usage data</h3>
        <p className="mb-4 mt-2 text-sm text-muted-foreground">
          Usage data will appear here as features are used.
        </p>
      </div>
    );
  }

  // Sort by percentage (highest first)
  const sortedItems = [...items].sort((a, b) => {
    const percentA = getUsagePercentage(a.currentUsage, a.limit);
    const percentB = getUsagePercentage(b.currentUsage, b.limit);
    return percentB - percentA;
  });

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Feature</TableHead>
            <TableHead className="text-right">Used</TableHead>
            <TableHead className="text-right">Limit</TableHead>
            <TableHead className="text-right">Remaining</TableHead>
            <TableHead className="w-[200px]">Progress</TableHead>
            {showResetButton && (
              <TableHead className="w-[80px]">Actions</TableHead>
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedItems.map((item) => {
            const percentage = getUsagePercentage(
              item.currentUsage,
              item.limit
            );
            const remaining = getRemainingUsage(item.currentUsage, item.limit);
            const color = getUsageColor(percentage);

            return (
              <TableRow key={item.featureSlug}>
                <TableCell>
                  <div>
                    <p className="font-medium">
                      {item.featureName || item.featureSlug}
                    </p>
                    <Badge variant="outline" className="font-mono text-xs mt-1">
                      {item.featureSlug}
                    </Badge>
                  </div>
                </TableCell>
                <TableCell className="text-right font-mono">
                  {item.currentUsage.toLocaleString()}
                </TableCell>
                <TableCell className="text-right font-mono text-muted-foreground">
                  {item.limit ? item.limit.toLocaleString() : "∞"}
                </TableCell>
                <TableCell className="text-right">
                  <span
                    className={cn(
                      "font-mono font-medium",
                      color === "green" && "text-green-600",
                      color === "yellow" && "text-yellow-600",
                      color === "red" && "text-red-600"
                    )}
                  >
                    {remaining === Infinity ? "∞" : remaining.toLocaleString()}
                  </span>
                </TableCell>
                <TableCell>
                  <UsageProgressBar
                    current={item.currentUsage}
                    max={item.limit}
                    showLabel={false}
                    size="sm"
                  />
                </TableCell>
                {showResetButton && (
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onResetUsage?.(item.featureSlug)}
                      title="Reset Usage"
                      className="text-destructive hover:text-destructive"
                    >
                      <RotateCcw className="h-4 w-4" />
                    </Button>
                  </TableCell>
                )}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
