import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  MoreHorizontal,
  Pencil,
  Trash2,
  Search,
  ArrowUpDown,
} from "lucide-react";
import type { Override } from "@/types";
import { format, isPast, formatDistanceToNow } from "date-fns";

interface OverrideTableProps {
  overrides: Override[];
  isLoading: boolean;
  onEdit: (override: Override) => void;
  onDelete: (override: Override) => void;
  type: "user" | "org";
}

export function OverrideTable({
  overrides,
  isLoading,
  onEdit,
  onDelete,
  type,
}: OverrideTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Override;
    direction: "asc" | "desc";
  } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filter
  const filteredOverrides = overrides.filter((override) => {
    // Only show relevant overrides for the type
    if (type === "user" && !override.userId) return false;
    if (type === "org" && !override.organizationId) return false;

    const matchesSearch =
      override.featureSlug.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (override.reason?.toLowerCase() || "").includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  // Sort
  const sortedOverrides = [...filteredOverrides].sort((a, b) => {
    if (!sortConfig) return 0;
    const { key, direction } = sortConfig;

    if (a[key] === undefined || b[key] === undefined) return 0;

    if (a[key]! < b[key]!) return direction === "asc" ? -1 : 1;
    if (a[key]! > b[key]!) return direction === "asc" ? 1 : -1;
    return 0;
  });

  // Pagination
  const totalPages = Math.ceil(sortedOverrides.length / itemsPerPage);
  const paginatedOverrides = sortedOverrides.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const requestSort = (key: keyof Override) => {
    let direction: "asc" | "desc" = "asc";
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === "asc"
    ) {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const getStatus = (override: Override) => {
    if (override.expiresAt && isPast(new Date(override.expiresAt))) {
      return <Badge variant="secondary">Expired</Badge>;
    }
    return <Badge className="bg-green-500 hover:bg-green-600">Active</Badge>;
  };

  if (isLoading && overrides.length === 0) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        Loading overrides...
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="relative w-72">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Filter by feature or reason..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="pl-8"
          />
        </div>
        <div className="text-sm text-muted-foreground">
          {filteredOverrides.length} overrides found
        </div>
      </div>

      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => requestSort("featureSlug")}
                >
                  Feature <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Value</TableHead>
              {type === "user" && <TableHead>User ID</TableHead>}
              {type === "org" && <TableHead>Org ID</TableHead>}
              <TableHead>Expires</TableHead>
              <TableHead>Reason</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[70px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedOverrides.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center">
                  No overrides found.
                </TableCell>
              </TableRow>
            ) : (
              paginatedOverrides.map((override) => (
                <TableRow key={override.id}>
                  <TableCell className="font-medium font-mono">
                    {override.featureSlug}
                  </TableCell>
                  <TableCell>
                    {override.overrideType.replace("_", " ")}
                  </TableCell>
                  <TableCell>{override.value || "-"}</TableCell>
                  {type === "user" && <TableCell>{override.userId}</TableCell>}
                  {type === "org" && (
                    <TableCell>{override.organizationId}</TableCell>
                  )}
                  <TableCell>
                    {override.expiresAt ? (
                      <div className="flex flex-col">
                        <span>
                          {format(new Date(override.expiresAt), "MMM d, yyyy")}
                        </span>
                        {!isPast(new Date(override.expiresAt)) && (
                          <span className="text-[10px] text-muted-foreground">
                            {formatDistanceToNow(new Date(override.expiresAt))}{" "}
                            left
                          </span>
                        )}
                      </div>
                    ) : (
                      "Never"
                    )}
                  </TableCell>
                  <TableCell className="max-w-[150px] truncate">
                    {override.reason || "-"}
                  </TableCell>
                  <TableCell>{getStatus(override)}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onEdit(override)}>
                          <Pencil className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => onDelete(override)}
                          className="text-destructive focus:text-destructive"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-end space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <div className="text-sm text-muted-foreground">
            Page {currentPage} of {totalPages}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === itemsPerPage}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
