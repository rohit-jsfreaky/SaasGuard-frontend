import { useEffect, useState } from "react";
import { Building2, Check, ChevronDown, Plus, Trash2, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useOrganizationStore } from "@/store/organization.store";
import { Skeleton } from "@/components/ui/skeleton";

export function OrganizationSwitcher() {
  const {
    organizations,
    currentOrganization,
    isLoading,
    hasFetched,
    fetchOrganizations,
    setCurrentOrganization,
    createOrganization,
    deleteOrganization,
  } = useOrganizationStore();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newOrgName, setNewOrgName] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!hasFetched && !isLoading) {
      fetchOrganizations();
    }
  }, [hasFetched, isLoading, fetchOrganizations]);

  const handleCreate = async () => {
    if (!newOrgName.trim()) {
      setError("Organization name is required");
      return;
    }

    setIsCreating(true);
    const success = await createOrganization(newOrgName.trim());
    setIsCreating(false);

    if (success) {
      setIsCreateOpen(false);
      setNewOrgName("");
      setError(null);
    }
  };

  if (isLoading) {
    return <Skeleton className="h-9 w-[140px]" />;
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="gap-2 px-3 min-w-[160px] justify-between"
          >
            <div className="flex items-center gap-2">
              <Building2 className="h-4 w-4 shrink-0" />
              <span className="max-w-[100px] truncate font-medium">
                {currentOrganization?.name || "Select Org"}
              </span>
            </div>
            <ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[200px]">
          <DropdownMenuLabel>Organizations</DropdownMenuLabel>
          <DropdownMenuSeparator />

          {organizations.length === 0 ? (
            <DropdownMenuItem disabled>
              <span className="text-muted-foreground">No organizations</span>
            </DropdownMenuItem>
          ) : (
            organizations.map((org) => (
              <DropdownMenuItem
                key={org.id}
                onClick={() => {
                  if (currentOrganization?.id !== org.id) {
                    setCurrentOrganization(org);
                  }
                }}
                className="cursor-pointer"
              >
                <Building2 className="mr-2 h-4 w-4" />
                <span className="flex-1 truncate">{org.name}</span>
                {currentOrganization?.id === org.id && (
                  <Check className="ml-2 h-4 w-4" />
                )}
              </DropdownMenuItem>
            ))
          )}

          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => setIsCreateOpen(true)}
            className="cursor-pointer"
          >
            <Plus className="mr-2 h-4 w-4" />
            Create Organization
          </DropdownMenuItem>

          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="text-destructive focus:text-destructive cursor-pointer"
            onClick={() => setIsDeleteOpen(true)}
            disabled={!currentOrganization}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete Organization
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create Organization</DialogTitle>
            <DialogDescription>
              Enter a name for your new organization.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="org-name">Organization Name</Label>
              <Input
                id="org-name"
                value={newOrgName}
                onChange={(e) => {
                  setNewOrgName(e.target.value);
                  setError(null);
                }}
                placeholder="e.g. My Company"
                className={error ? "border-destructive" : ""}
              />
              {error && <p className="text-sm text-destructive">{error}</p>}
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsCreateOpen(false);
                setNewOrgName("");
                setError(null);
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleCreate} disabled={isCreating}>
              {isCreating ? "Creating..." : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="sm:max-w-[460px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              Delete organization
            </DialogTitle>
            <DialogDescription>
              This action cannot be undone. You must be an admin and the
              organization must have no users.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>Organization: {currentOrganization?.name || ""}</p>
            <p className="text-destructive">This will remove all related data.</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={async () => {
                if (!currentOrganization) return;
                setIsDeleting(true);
                const success = await deleteOrganization(currentOrganization.id);
                setIsDeleting(false);
                if (success) {
                  setIsDeleteOpen(false);
                }
              }}
              disabled={!currentOrganization || isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
