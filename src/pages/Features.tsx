import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FeatureTable } from "@/components/features/FeatureTable";
import { CreateFeatureModal } from "@/components/features/CreateFeatureModal";
import { EditFeatureModal } from "@/components/features/EditFeatureModal";
import { DeleteFeatureConfirm } from "@/components/features/DeleteFeatureConfirm";
import { useFeatures } from "@/hooks/useFeatures";
import { useFeaturesModalStore } from "@/store/features-modal.store";
import { useDebounce } from "@/hooks/useDebounce";
import { useEffect, useState } from "react";

export default function Features() {
  const {
    features,
    isLoading,
    page,
    totalPages,
    setPage,
    setSearch,
  } = useFeatures();
  
  const { openModal } = useFeaturesModalStore();
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebounce(searchTerm, 500);

  useEffect(() => {
    setSearch(debouncedSearch);
  }, [debouncedSearch, setSearch]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Features</h1>
          <p className="text-muted-foreground">
            Manage the features available in your application.
          </p>
        </div>
        <Button onClick={() => openModal("create")}>
          <Plus className="mr-2 h-4 w-4" />
          Add Feature
        </Button>
      </div>

      <div className="flex items-center py-4">
        <Input
          placeholder="Filter features..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <FeatureTable
        features={features}
        isLoading={isLoading}
        onEdit={(feature) => openModal("edit", feature)}
        onDelete={(feature) => openModal("delete", feature)}
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />

      <CreateFeatureModal />
      <EditFeatureModal />
      <DeleteFeatureConfirm />
    </div>
  );
}
