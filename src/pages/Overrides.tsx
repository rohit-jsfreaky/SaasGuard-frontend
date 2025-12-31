import { Plus, Building2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { OverrideTable } from "@/components/overrides/OverrideTable";
import { CreateOrgOverrideModal } from "@/components/overrides/CreateOrgOverrideModal";
import { CreateUserOverrideModal } from "@/components/overrides/CreateUserOverrideModal";
import { EditOverrideModal } from "@/components/overrides/EditOverrideModal";
import { DeleteOverrideConfirm } from "@/components/overrides/DeleteOverrideConfirm";
import { useOverrides } from "@/hooks/useOverrides";
import { useOverridesModalStore } from "@/store/overrides-modal.store";
import { useEffect, useState } from "react";
import { featuresService } from "@/services/features.service";
import { usersService } from "@/services/users.service";
import type { Feature, User } from "@/types/entities";

export default function Overrides() {
  const {
    overrides,
    isLoading,
    organizationId,
    statusFilter,
    tabType,
    setStatusFilter,
    setTabType,
    cleanupExpired,
  } = useOverrides();

  const { openModal } = useOverridesModalStore();
  const [features, setFeatures] = useState<Feature[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [isCleaningUp, setIsCleaningUp] = useState(false);

  useEffect(() => {
    const loadFeatures = async () => {
      try {
        const response = await featuresService.getAll(1, 100);
        setFeatures(response.data);
      } catch (err) {
        console.error("Failed to load features", err);
      }
    };
    loadFeatures();
  }, []);

  useEffect(() => {
    const loadUsers = async () => {
      if (!organizationId) return;
      try {
        const response = await usersService.getByOrganization(
          organizationId,
          100
        );
        setUsers(response.data);
      } catch (err) {
        console.error("Failed to load users", err);
      }
    };
    if (tabType === "user") {
      loadUsers();
    }
  }, [tabType, organizationId]);

  const handleCleanupExpired = async () => {
    setIsCleaningUp(true);
    await cleanupExpired();
    setIsCleaningUp(false);
  };

  if (!organizationId) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center rounded-md border border-dashed p-8 text-center animate-in fade-in-50">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-accent">
          <Building2 className="h-6 w-6 text-muted-foreground" />
        </div>
        <h3 className="mt-4 text-lg font-semibold">No Organization Selected</h3>
        <p className="mb-4 mt-2 text-sm text-muted-foreground max-w-md">
          To manage overrides, you need to select or create an organization. Use
          the organization dropdown in the header.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Overrides</h1>
          <p className="text-muted-foreground">
            Manage feature overrides for users and organizations.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={handleCleanupExpired}
            disabled={isCleaningUp}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            {isCleaningUp ? "Cleaning..." : "Cleanup Expired"}
          </Button>
        </div>
      </div>

      <Tabs
        value={tabType}
        onValueChange={(v) => setTabType(v as "user" | "org")}
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <TabsList>
            <TabsTrigger value="org">Organization Overrides</TabsTrigger>
            <TabsTrigger value="user">User Overrides</TabsTrigger>
          </TabsList>

          <div className="flex items-center gap-2">
            <Select
              value={statusFilter}
              onValueChange={(v) =>
                setStatusFilter(v as "active" | "expired" | "all")
              }
            >
              <SelectTrigger className="w-[130px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="expired">Expired</SelectItem>
                <SelectItem value="all">All</SelectItem>
              </SelectContent>
            </Select>

            <Button
              onClick={() =>
                openModal(tabType === "org" ? "create-org" : "create-user")
              }
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Override
            </Button>
          </div>
        </div>

        <TabsContent value="org" className="mt-6">
          <OverrideTable
            overrides={overrides}
            isLoading={isLoading}
            onEdit={(override) => openModal("edit", override)}
            onDelete={(override) => openModal("delete", override)}
            type="org"
          />
        </TabsContent>

        <TabsContent value="user" className="mt-6">
          <OverrideTable
            overrides={overrides}
            isLoading={isLoading}
            onEdit={(override) => openModal("edit", override)}
            onDelete={(override) => openModal("delete", override)}
            type="user"
          />
        </TabsContent>
      </Tabs>

      <CreateOrgOverrideModal features={features} />
      <CreateUserOverrideModal features={features} users={users} />
      <EditOverrideModal />
      <DeleteOverrideConfirm />
    </div>
  );
}
