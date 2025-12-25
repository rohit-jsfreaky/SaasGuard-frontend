import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  FeatureTable,
  CreateFeatureModal,
  EditFeatureModal,
  DeleteFeatureConfirm,
} from "@/components/features";
import { useFeatures } from "@/hooks/useFeatures";
import { useOrganization } from "@/hooks/useOrganization";
import type { Feature } from "@/types";

export default function Features() {
  const { orgId } = useOrganization();
  const { features, isLoading, fetchFeatures } = useFeatures();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState<Feature | null>(null);

  useEffect(() => {
    if (orgId) {
      fetchFeatures();
    }
  }, [orgId, fetchFeatures]);

  const handleEdit = (feature: Feature) => {
    setSelectedFeature(feature);
    setIsEditOpen(true);
  };

  const handleDelete = (feature: Feature) => {
    setSelectedFeature(feature);
    setIsDeleteOpen(true);
  };

  // If no org, we rely on App/Dashboard prompting or ProtectedRoute logic
  // But generally pages should handle empty state too
  if (!orgId) {
    return (
      <div className="flex items-center justify-center h-full">
        Please select an organization.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Features</h2>
          <p className="text-muted-foreground">
            Manage system features and their default configurations.
          </p>
        </div>
        <Button onClick={() => setIsCreateOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Feature
        </Button>
      </div>

      <FeatureTable
        features={features}
        isLoading={isLoading}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <CreateFeatureModal open={isCreateOpen} onOpenChange={setIsCreateOpen} />

      <EditFeatureModal
        feature={selectedFeature}
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
      />

      <DeleteFeatureConfirm
        feature={selectedFeature}
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
      />
    </div>
  );
}
