import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePlans } from "@/hooks/usePlans";
import { useOrganization } from "@/hooks/useOrganization";
import {
  PlanTable,
  CreatePlanModal,
  EditPlanModal,
  DeletePlanConfirm,
} from "@/components/plans";
import type { Plan } from "@/types";

export default function Plans() {
  const { orgId } = useOrganization();
  const { plans, fetchPlans, isLoading } = usePlans();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);
  const [deletingPlan, setDeletingPlan] = useState<Plan | null>(null);

  useEffect(() => {
    if (orgId) {
      fetchPlans();
    }
  }, [orgId, fetchPlans]);

  if (!orgId) {
    return (
      <div className="flex h-[50vh] flex-col items-center justify-center gap-4">
        <div className="text-lg font-medium text-muted-foreground">
          Please select an organization to manage plans
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Plans</h1>
          <p className="text-muted-foreground">
            Manage your subscription plans and feature limits.
          </p>
        </div>
        <Button onClick={() => setIsCreateOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Create Plan
        </Button>
      </div>

      <PlanTable
        plans={plans}
        isLoading={isLoading}
        onEdit={setEditingPlan}
        onDelete={setDeletingPlan}
      />

      <CreatePlanModal open={isCreateOpen} onOpenChange={setIsCreateOpen} />

      <EditPlanModal
        plan={editingPlan}
        open={!!editingPlan}
        onOpenChange={(open) => !open && setEditingPlan(null)}
      />

      <DeletePlanConfirm
        plan={deletingPlan}
        open={!!deletingPlan}
        onOpenChange={(open) => !open && setDeletingPlan(null)}
      />
    </div>
  );
}
