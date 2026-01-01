import { useState, useEffect } from "react";
import { Building2, RefreshCw, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UsageList, type UsageItem } from "@/components/usage/UsageList";
import { useOrganizationStore } from "@/store/organization.store";
import { usersService } from "@/services/users.service";
import { usageService } from "@/services/usage.service";
import type { User } from "@/types/entities";
import { toast } from "sonner";

export default function Usage() {
  const { currentOrganization } = useOrganizationStore();
  const organizationId = currentOrganization?.id;

  const [users, setUsers] = useState<User[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string>("");
  const [usageItems, setUsageItems] = useState<UsageItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [search, setSearch] = useState("");

  // Load users for organization
  useEffect(() => {
    const loadUsers = async () => {
      if (!organizationId) return;
      setIsLoadingUsers(true);
      try {
        const response = await usersService.getByOrganization(
          organizationId,
          100
        );
        setUsers(response.data);
      } catch (err) {
        console.error("Failed to load users", err);
      } finally {
        setIsLoadingUsers(false);
      }
    };
    loadUsers();
  }, [organizationId]);

  // Load usage for selected user
  const loadUsage = async () => {
    if (!selectedUserId || !organizationId) return;

    setIsLoading(true);
    try {
      // Get user's permissions (has limits info) and usage records
      const [permissionsRes, usageRes] = await Promise.all([
        usersService.getUserPermissions(Number(selectedUserId), organizationId),
        usageService.getUserUsage(Number(selectedUserId)),
      ]);

      const permissions = permissionsRes.data;
      const usageRecords = usageRes.data;

      // Combine limits with usage data
      const items: UsageItem[] = [];

      // Add items from limits
      if (permissions.limits) {
        for (const [featureSlug, limitInfo] of Object.entries(
          permissions.limits
        )) {
          const usageRecord = usageRecords.find(
            (u) => u.featureSlug === featureSlug
          );
          items.push({
            featureSlug,
            currentUsage: usageRecord?.currentUsage || limitInfo.used || 0,
            limit: limitInfo.max,
          });
        }
      }

      // Add usage records that don't have explicit limits
      for (const record of usageRecords) {
        if (!items.find((i) => i.featureSlug === record.featureSlug)) {
          items.push({
            featureSlug: record.featureSlug,
            currentUsage: record.currentUsage,
            limit: null,
          });
        }
      }

      setUsageItems(items);
    } catch (err: any) {
      console.error("Failed to load usage", err);
      toast.error("Failed to load usage data");
      setUsageItems([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (selectedUserId) {
      loadUsage();
    }
  }, [selectedUserId]);

  const handleResetUsage = async (featureSlug: string) => {
    if (!selectedUserId) return;

    try {
      await usageService.resetUsage(Number(selectedUserId), featureSlug);
      toast.success("Usage reset successfully");
      // Update local state
      setUsageItems((prev) =>
        prev.map((item) =>
          item.featureSlug === featureSlug ? { ...item, currentUsage: 0 } : item
        )
      );
    } catch (err: any) {
      toast.error(err.message || "Failed to reset usage");
    }
  };

  const handleResetAllUsage = async () => {
    try {
      const response = await usageService.resetAllUsage();
      toast.success(response.data.message || "All usage reset successfully");
      loadUsage();
    } catch (err: any) {
      toast.error(err.message || "Failed to reset all usage");
    }
  };

  // Filter items by search
  const filteredItems = search
    ? usageItems.filter((item) =>
        item.featureSlug.toLowerCase().includes(search.toLowerCase())
      )
    : usageItems;

  if (!organizationId) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center rounded-md border border-dashed p-8 text-center animate-in fade-in-50">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-accent">
          <Building2 className="h-6 w-6 text-muted-foreground" />
        </div>
        <h3 className="mt-4 text-lg font-semibold">No Organization Selected</h3>
        <p className="mb-4 mt-2 text-sm text-muted-foreground max-w-md">
          To view usage data, you need to select an organization.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Usage Tracking</h1>
          <p className="text-muted-foreground">
            Monitor feature usage across users.
          </p>
        </div>
        <Button variant="outline" onClick={handleResetAllUsage}>
          <RotateCcw className="mr-2 h-4 w-4" />
          Reset All Usage
        </Button>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row">
        <Select
          value={selectedUserId}
          onValueChange={setSelectedUserId}
          disabled={isLoadingUsers}
        >
          <SelectTrigger className="w-full sm:w-[300px]">
            <SelectValue placeholder="Select a user" />
          </SelectTrigger>
          <SelectContent>
            {users.map((user) => (
              <SelectItem key={user.id} value={String(user.id)}>
                {user.firstName && user.lastName
                  ? `${user.firstName} ${user.lastName}`
                  : user.email}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {selectedUserId && (
          <>
            <Input
              placeholder="Search features..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="max-w-sm"
            />
            <Button variant="outline" onClick={loadUsage}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
          </>
        )}
      </div>

      {selectedUserId ? (
        <UsageList
          items={filteredItems}
          isLoading={isLoading}
          onResetUsage={handleResetUsage}
          showResetButton
        />
      ) : (
        <div className="flex min-h-[300px] flex-col items-center justify-center rounded-md border border-dashed p-8 text-center animate-in fade-in-50">
          <p className="text-sm text-muted-foreground">
            Select a user to view their usage data.
          </p>
        </div>
      )}
    </div>
  );
}
