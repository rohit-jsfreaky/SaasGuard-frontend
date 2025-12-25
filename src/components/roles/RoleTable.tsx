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
  Eye,
} from "lucide-react";
import type { Role } from "@/types";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";

interface RoleTableProps {
  roles: Role[];
  isLoading: boolean;
  onEdit: (role: Role) => void;
  onDelete: (role: Role) => void;
}

export function RoleTable({
  roles,
  isLoading,
  onEdit,
  onDelete,
}: RoleTableProps) {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Role;
    direction: "asc" | "desc";
  } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filter
  const filteredRoles = roles.filter(
    (role) =>
      role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      role.slug.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sort
  const sortedRoles = [...filteredRoles].sort((a, b) => {
    if (!sortConfig) return 0;
    const { key, direction } = sortConfig;

    if (a[key] === undefined || b[key] === undefined) return 0;

    if (a[key]! < b[key]!) return direction === "asc" ? -1 : 1;
    if (a[key]! > b[key]!) return direction === "asc" ? 1 : -1;
    return 0;
  });

  // Pagination
  const totalPages = Math.ceil(sortedRoles.length / itemsPerPage);
  const paginatedRoles = sortedRoles.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const requestSort = (key: keyof Role) => {
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

  if (isLoading && roles.length === 0) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        Loading roles...
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="relative w-72">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Filter roles..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="pl-8"
          />
        </div>
        <div className="text-sm text-muted-foreground">
          {filteredRoles.length} roles found
        </div>
      </div>

      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <Button variant="ghost" onClick={() => requestSort("name")}>
                  Name <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Description</TableHead>
              {/* Add permission/user counts if available in type later */}
              <TableHead>Created</TableHead>
              <TableHead className="w-[70px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedRoles.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  No roles found.
                </TableCell>
              </TableRow>
            ) : (
              paginatedRoles.map((role) => (
                <TableRow
                  key={role.id}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => navigate(`/roles/${role.id}`)}
                >
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      {role.name}
                      {role.isSystemRole && (
                        <span className="text-[10px] bg-muted text-muted-foreground px-1.5 py-0.5 rounded">
                          System
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="font-mono text-xs">
                    {role.slug}
                  </TableCell>
                  <TableCell className="max-w-[200px] truncate">
                    {role.description || "-"}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {role.createdAt
                      ? format(new Date(role.createdAt), "MMM d, yyyy")
                      : "-"}
                  </TableCell>
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => navigate(`/roles/${role.id}`)}
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        {/* Prevent editing system roles if required, but let's allow description edits for now */}
                        <DropdownMenuItem onClick={() => onEdit(role)}>
                          <Pencil className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        {!role.isSystemRole && (
                          <DropdownMenuItem
                            onClick={() => onDelete(role)}
                            className="text-destructive focus:text-destructive"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        )}
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
