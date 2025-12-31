import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Clock, AlertCircle, Check, X } from "lucide-react";
import type { Override } from "@/types/entities";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow, isPast, differenceInDays } from "date-fns";

interface OverrideTableProps {
  overrides: Override[];
  isLoading: boolean;
  onEdit: (override: Override) => void;
  onDelete: (override: Override) => void;
  type: "user" | "org";
}

const getOverrideTypeBadge = (type: string) => {
  switch (type) {
    case "feature_enable":
      return (
        <Badge className="bg-green-500/20 text-green-600 border-green-500/30">
          <Check className="w-3 h-3 mr-1" />
          Enable
        </Badge>
      );
    case "feature_disable":
      return (
        <Badge className="bg-red-500/20 text-red-600 border-red-500/30">
          <X className="w-3 h-3 mr-1" />
          Disable
        </Badge>
      );
    case "limit_increase":
      return (
        <Badge className="bg-blue-500/20 text-blue-600 border-blue-500/30">
          +Limit
        </Badge>
      );
    default:
      return <Badge variant="outline">{type}</Badge>;
  }
};

const getExpirationInfo = (
  expiresAt: string | null,
  isExpired: boolean,
  isPermanent: boolean
) => {
  if (isPermanent || !expiresAt) {
    return (
      <Badge variant="outline" className="text-muted-foreground">
        Permanent
      </Badge>
    );
  }

  const expirationDate = new Date(expiresAt);

  if (isExpired || isPast(expirationDate)) {
    return (
      <Badge variant="destructive" className="animate-pulse">
        Expired
      </Badge>
    );
  }

  const daysUntilExpiry = differenceInDays(expirationDate, new Date());

  if (daysUntilExpiry <= 7) {
    return (
      <div className="flex items-center gap-1">
        <AlertCircle className="h-3 w-3 text-orange-500" />
        <span className="text-sm text-orange-500">
          {formatDistanceToNow(expirationDate, { addSuffix: true })}
        </span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1">
      <Clock className="h-3 w-3 text-muted-foreground" />
      <span className="text-sm text-muted-foreground">
        {formatDistanceToNow(expirationDate, { addSuffix: true })}
      </span>
    </div>
  );
};

export function OverrideTable({
  overrides,
  isLoading,
  onEdit,
  onDelete,
  type,
}: OverrideTableProps) {
  if (isLoading) {
    return (
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{type === "user" ? "User ID" : "Feature"}</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Value</TableHead>
              <TableHead>Expires</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 3 }).map((_, i) => (
              <TableRow key={i}>
                <TableCell>
                  <Skeleton className="h-4 w-[100px]" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-[80px]" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-[50px]" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-[100px]" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-8 w-20" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  if (!overrides || overrides.length === 0) {
    return (
      <div className="flex min-h-[300px] flex-col items-center justify-center rounded-md border border-dashed p-8 text-center animate-in fade-in-50">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-accent">
          <AlertCircle className="h-6 w-6 text-muted-foreground" />
        </div>
        <h3 className="mt-4 text-lg font-semibold">No overrides found</h3>
        <p className="mb-4 mt-2 text-sm text-muted-foreground">
          {type === "org"
            ? "Create an organization-level override to grant or restrict access."
            : "Create a user-level override to grant or restrict access for specific users."}
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Feature</TableHead>
            {type === "user" && <TableHead>User ID</TableHead>}
            <TableHead>Type</TableHead>
            <TableHead>Value</TableHead>
            <TableHead>Expires</TableHead>
            <TableHead>Reason</TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {overrides.map((override) => (
            <TableRow
              key={override.id}
              className={override.isExpired ? "opacity-50" : ""}
            >
              <TableCell>
                <Badge variant="outline" className="font-mono text-xs">
                  {override.featureSlug}
                </Badge>
              </TableCell>
              {type === "user" && (
                <TableCell className="font-mono text-sm">
                  {override.userId}
                </TableCell>
              )}
              <TableCell>
                {getOverrideTypeBadge(override.overrideType)}
              </TableCell>
              <TableCell>
                {override.overrideType === "limit_increase" &&
                override.value !== null ? (
                  <span className="font-mono font-medium">
                    {override.value.toLocaleString()}
                  </span>
                ) : (
                  <span className="text-muted-foreground">-</span>
                )}
              </TableCell>
              <TableCell>
                {getExpirationInfo(
                  override.expiresAt,
                  override.isExpired,
                  override.isPermanent
                )}
              </TableCell>
              <TableCell className="max-w-[150px] truncate">
                <span
                  className="text-sm text-muted-foreground"
                  title={override.reason || ""}
                >
                  {override.reason || "-"}
                </span>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEdit(override)}
                    title="Edit Override"
                    disabled={override.isExpired}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive hover:text-destructive"
                    onClick={() => onDelete(override)}
                    title="Delete Override"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
