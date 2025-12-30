import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlanTable } from "@/components/plans/PlanTable";
import { CreatePlanModal } from "@/components/plans/CreatePlanModal";
import { EditPlanModal } from "@/components/plans/EditPlanModal";
import { DeletePlanConfirm } from "@/components/plans/DeletePlanConfirm";
import { usePlans } from "@/hooks/usePlans";
import { usePlansModalStore } from "@/store/plans-modal.store";
import { useDebounce } from "@/hooks/useDebounce";
import { useEffect, useState } from "react";

export default function Plans() {
  const {
    plans,
    isLoading,
    page,
    totalPages,
    setPage,
    setSearch,
    organizationId,
  } = usePlans();

  const { openModal } = usePlansModalStore();
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebounce(searchTerm, 500);

  useEffect(() => {
    setSearch(debouncedSearch);
  }, [debouncedSearch, setSearch]);

  if (!organizationId) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center rounded-md border border-dashed p-8 text-center animate-in fade-in-50">
        <h3 className="mt-4 text-lg font-semibold">No Organization</h3>
        <p className="mb-4 mt-2 text-sm text-muted-foreground">
          Please ensure you are part of an organization to manage plans.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Plans</h1>
          <p className="text-muted-foreground">
            Manage subscription plans for your organization.
          </p>
        </div>
        <Button onClick={() => openModal("create")}>
          <Plus className="mr-2 h-4 w-4" />
          Add Plan
        </Button>
      </div>

      <div className="flex items-center py-4">
        <Input
          placeholder="Filter plans..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <PlanTable
        plans={plans}
        isLoading={isLoading}
        onEdit={(plan) => openModal("edit", plan)}
        onDelete={(plan) => openModal("delete", plan)}
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />

      <CreatePlanModal />
      <EditPlanModal />
      <DeletePlanConfirm />
    </div>
  );
}
