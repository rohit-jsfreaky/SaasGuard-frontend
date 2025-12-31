import { Building2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { UserTable } from "@/components/users/UserTable";
import { useUsers } from "@/hooks/useUsers";
import { useDebounce } from "@/hooks/useDebounce";
import { useEffect, useState } from "react";

export default function Users() {
  const { users, isLoading, organizationId, setSearch } = useUsers();

  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebounce(searchTerm, 500);

  useEffect(() => {
    setSearch(debouncedSearch);
  }, [debouncedSearch, setSearch]);

  if (!organizationId) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center rounded-md border border-dashed p-8 text-center animate-in fade-in-50">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-accent">
          <Building2 className="h-6 w-6 text-muted-foreground" />
        </div>
        <h3 className="mt-4 text-lg font-semibold">No Organization Selected</h3>
        <p className="mb-4 mt-2 text-sm text-muted-foreground max-w-md">
          To manage users, you need to select or create an organization. Use the
          organization dropdown in the header.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Users</h1>
          <p className="text-muted-foreground">
            Manage users in your organization.
          </p>
        </div>
      </div>

      <div className="flex items-center py-4">
        <Input
          placeholder="Search by email or name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <UserTable users={users} isLoading={isLoading} />
    </div>
  );
}
