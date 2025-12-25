import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { ArrowLeft, Plus, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { usePlanDetail } from "@/hooks/usePlanDetail";
import { useFeatures } from "@/hooks/useFeatures";
import { AddFeatureToPlanModal, SetLimitModal } from "@/components/plans";

export default function PlanDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const planId = id ? parseInt(id, 10) : null;

  const {
    plan,
    users,
    isLoading,
    error,
    activeTab,
    setActiveTab,
    updateFeature,
    removeFeature,
    addFeature,
  } = usePlanDetail(planId);

  // We need all features to map names
  const { features: allFeatures, fetchFeatures } = useFeatures();

  // Ensure features are loaded to map names
  useState(() => {
    fetchFeatures();
  });

  const [isAddFeatureOpen, setIsAddFeatureOpen] = useState(false);
  const [editingLimitFeature, setEditingLimitFeature] = useState<{
    name: string;
    slug: string;
    currentLimit: number | null;
  } | null>(null);

  if (isLoading && !plan) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-8 w-8 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-24" />
          </div>
        </div>
        <Skeleton className="h-[400px] w-full" />
      </div>
    );
  }

  if (error || !plan) {
    return (
      <div className="flex h-[50vh] flex-col items-center justify-center gap-4">
        <div className="text-lg font-medium text-destructive">
          {error || "Plan not found"}
        </div>
        <Button variant="outline" onClick={() => navigate("/plans")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Plans
        </Button>
      </div>
    );
  }

  const handleToggleFeature = async (
    featureId: number,
    currentEnabled: boolean,
    limit?: number
  ) => {
    await updateFeature(featureId, !currentEnabled, limit);
  };

  const getFeatureName = (slug: string, id: number) => {
    const f = allFeatures.find((f) => f.slug === slug || f.id === id);
    return f ? f.name : slug;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/plans")}
            className="rounded-full"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight">{plan.name}</h1>
              <Badge variant="outline" className="font-mono text-xs">
                {plan.slug}
              </Badge>
            </div>
            <p className="text-muted-foreground">
              {plan.description || "No description provided."}
            </p>
          </div>
        </div>
        {activeTab === "features" && (
          <Button onClick={() => setIsAddFeatureOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Feature
          </Button>
        )}
      </div>

      {/* Content */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
        <TabsList>
          <TabsTrigger value="features">Features</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
        </TabsList>

        <TabsContent value="features" className="space-y-4">
          <div className="rounded-md border bg-card">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Feature Name</TableHead>
                  <TableHead>Enabled</TableHead>
                  <TableHead>Limit</TableHead>
                  <TableHead className="w-[100px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {plan.features.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center">
                      No features configured for this plan.
                    </TableCell>
                  </TableRow>
                ) : (
                  plan.features.map((pf) => {
                    const featureName = getFeatureName(
                      pf.featureSlug,
                      pf.featureId
                    );
                    return (
                      <TableRow key={pf.featureId}>
                        <TableCell className="font-medium">
                          {featureName}
                        </TableCell>
                        <TableCell>
                          <Switch
                            checked={pf.enabled}
                            onCheckedChange={() =>
                              handleToggleFeature(
                                pf.featureId,
                                pf.enabled,
                                pf.limitValue
                              )
                            }
                          />
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span className="text-sm">
                              {pf.limitValue === null ||
                              pf.limitValue === undefined
                                ? "Unlimited"
                                : pf.limitValue}
                            </span>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6"
                              onClick={() =>
                                setEditingLimitFeature({
                                  name: featureName,
                                  slug: pf.featureSlug,
                                  currentLimit: pf.limitValue ?? null, // Fix nullability
                                })
                              }
                            >
                              <Settings className="h-3 w-3" />
                            </Button>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-destructive hover:text-destructive"
                            onClick={() => removeFeature(pf.featureId)}
                          >
                            Remove
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="users" className="space-y-4">
          <div className="rounded-md border bg-card">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Joined</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} className="h-24 text-center">
                      No users on this plan.
                    </TableCell>
                  </TableRow>
                ) : (
                  users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">
                        {user.email.split("@")[0]}
                      </TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell className="text-muted-foreground">-</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>

      <AddFeatureToPlanModal
        open={isAddFeatureOpen}
        onOpenChange={setIsAddFeatureOpen}
        existingFeatureIds={plan.features.map((f) => f.featureId)}
        onSubmit={addFeature}
      />

      {editingLimitFeature && (
        <SetLimitModal
          open={!!editingLimitFeature}
          onOpenChange={(open) => !open && setEditingLimitFeature(null)}
          featureName={editingLimitFeature.name}
          currentLimit={editingLimitFeature.currentLimit}
          onSubmit={async (limit) => {
            const feature = plan.features.find(
              (f) => f.featureSlug === editingLimitFeature.slug
            );
            if (feature) {
              try {
                const success = await updateFeature(
                  feature.featureId,
                  feature.enabled,
                  limit
                );
                return success;
              } catch (e) {
                return false;
              }
            }
            return false;
          }}
        />
      )}
    </div>
  );
}
