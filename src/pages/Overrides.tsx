import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useOverrides } from "@/hooks/useOverrides";
import { useOrganization } from "@/hooks/useOrganization";
import { useDataStore } from "@/store/data.store";
import {
  OverrideTable,
  CreateUserOverrideModal,
  CreateOrgOverrideModal,
} from "@/components/overrides";
import type { Override } from "@/types";

export default function Overrides() {
  const { orgId } = useOrganization();
  const { overrides, fetchOverrides, removeOverride, isLoading } =
    useOverrides();
  const fetchUsers = useDataStore((state) => state.fetchUsers);

  const [activeTab, setActiveTab] = useState<"user" | "org">("user");
  const [isCreateUserOpen, setIsCreateUserOpen] = useState(false);
  const [isCreateOrgOpen, setIsCreateOrgOpen] = useState(false);
  // We can add edit/delete confirmation logic similarly

  useEffect(() => {
    if (orgId) {
      fetchOverrides();
      // Ensure users are loaded for the dropdown in User Overrides
      fetchUsers(orgId);
    }
  }, [orgId, fetchOverrides, fetchUsers]);

  const handleDelete = async (override: Override) => {
    if (confirm("Are you sure you want to delete this override?")) {
      await removeOverride(override.id);
    }
  };

  const handleEdit = (override: Override) => {
    // Implement edit logic if needed, or just tell user to recreate
    console.log("Edit requested for:", override);
    alert("Editing not yet implemented (Delete and Recreate)");
  };

  if (!orgId) {
    return (
      <div className="flex h-[50vh] flex-col items-center justify-center gap-4">
        <div className="text-lg font-medium text-muted-foreground">
          Please select an organization to manage overrides
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Overrides</h1>
          <p className="text-muted-foreground">
            Manage temporary or permanent exceptions for features and limits.
          </p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="user">User Overrides</TabsTrigger>
            <TabsTrigger value="org">Organization Overrides</TabsTrigger>
          </TabsList>
          <Button
            onClick={() =>
              activeTab === "user"
                ? setIsCreateUserOpen(true)
                : setIsCreateOrgOpen(true)
            }
          >
            <Plus className="mr-2 h-4 w-4" />
            Create {activeTab === "user" ? "User" : "Org"} Override
          </Button>
        </div>

        <TabsContent value="user">
          <OverrideTable
            overrides={overrides}
            isLoading={isLoading}
            onEdit={handleEdit}
            onDelete={handleDelete}
            type="user"
          />
        </TabsContent>

        <TabsContent value="org">
          <OverrideTable
            overrides={overrides}
            isLoading={isLoading}
            onEdit={handleEdit}
            onDelete={handleDelete}
            type="org"
          />
        </TabsContent>
      </Tabs>

      <CreateUserOverrideModal
        open={isCreateUserOpen}
        onOpenChange={setIsCreateUserOpen}
      />

      <CreateOrgOverrideModal
        open={isCreateOrgOpen}
        onOpenChange={setIsCreateOrgOpen}
      />
    </div>
  );
}
