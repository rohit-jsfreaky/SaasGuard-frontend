import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Plus,
  Trash2,
  ToggleLeft,
  ToggleRight,
  Settings,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { plansService } from "@/services/plans.service";
import type { Plan, PlanFeature, PlanLimit } from "@/types/entities";
import { toast } from "sonner";
import { AddFeatureToPlanModal } from "@/components/plans/AddFeatureToPlanModal";
import { SetLimitModal } from "@/components/plans/SetLimitModal";

export default function PlanDetail() {
  const { planId } = useParams<{ planId: string }>();
  const navigate = useNavigate();

  const [plan, setPlan] = useState<Plan | null>(null);
  const [features, setFeatures] = useState<PlanFeature[]>([]);
  const [limits, setLimits] = useState<PlanLimit[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddFeatureOpen, setIsAddFeatureOpen] = useState(false);
  const [isSetLimitOpen, setIsSetLimitOpen] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState<PlanFeature | null>(
    null
  );

  // Confirmation dialogs state
  const [featureToRemove, setFeatureToRemove] = useState<PlanFeature | null>(
    null
  );
  const [limitToRemove, setLimitToRemove] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchPlanData = async () => {
    if (!planId) return;

    setIsLoading(true);
    try {
      const [planRes, featuresRes, limitsRes] = await Promise.all([
        plansService.getById(Number(planId)),
        plansService.getFeatures(Number(planId)),
        plansService.getLimits(Number(planId)),
      ]);

      setPlan(planRes.data);
      setFeatures(featuresRes.data);
      setLimits(limitsRes.data);
    } catch (err: any) {
      toast.error("Failed to load plan details");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPlanData();
  }, [planId]);

  const handleToggleFeature = async (feature: PlanFeature) => {
    if (!planId) return;

    try {
      await plansService.toggleFeature(
        Number(planId),
        feature.id,
        !feature.enabled
      );
      toast.success(`Feature ${feature.enabled ? "disabled" : "enabled"}`);
      fetchPlanData();
    } catch (err: any) {
      toast.error("Failed to toggle feature");
    }
  };

  const confirmRemoveFeature = async () => {
    if (!planId || !featureToRemove) return;

    setIsDeleting(true);
    try {
      await plansService.removeFeature(Number(planId), featureToRemove.id);
      toast.success("Feature removed from plan");
      fetchPlanData();
    } catch (err: any) {
      toast.error("Failed to remove feature");
    } finally {
      setIsDeleting(false);
      setFeatureToRemove(null);
    }
  };

  const confirmRemoveLimit = async () => {
    if (!planId || !limitToRemove) return;

    setIsDeleting(true);
    try {
      await plansService.removeLimit(Number(planId), limitToRemove);
      toast.success("Limit removed (now unlimited)");
      fetchPlanData();
    } catch (err: any) {
      toast.error("Failed to remove limit");
    } finally {
      setIsDeleting(false);
      setLimitToRemove(null);
    }
  };

  const getFeatureLimit = (featureSlug: string) => {
    return limits.find((l) => l.featureSlug === featureSlug);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-10" />
          <Skeleton className="h-8 w-48" />
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <Skeleton className="h-[400px]" />
          <Skeleton className="h-[400px]" />
        </div>
      </div>
    );
  }

  if (!plan) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center">
        <h3 className="text-lg font-semibold">Plan not found</h3>
        <Button variant="link" onClick={() => navigate("/plans")}>
          Go back to plans
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard/plans")}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{plan.name}</h1>
          <p className="text-muted-foreground">
            {plan.description || `Manage features and limits for ${plan.name}`}
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Features Section */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle>Features</CardTitle>
              <CardDescription>Features included in this plan</CardDescription>
            </div>
            <Button size="sm" onClick={() => setIsAddFeatureOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Feature
            </Button>
          </CardHeader>
          <CardContent>
            {features.length === 0 ? (
              <div className="flex min-h-[200px] flex-col items-center justify-center rounded-md border border-dashed p-4 text-center">
                <p className="text-sm text-muted-foreground">
                  No features added yet
                </p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Limit</TableHead>
                    <TableHead className="w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {features.map((feature) => {
                    const limit = getFeatureLimit(feature.slug);
                    return (
                      <TableRow key={feature.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{feature.name}</p>
                            <p className="text-xs text-muted-foreground font-mono">
                              {feature.slug}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={feature.enabled ? "default" : "secondary"}
                          >
                            {feature.enabled ? "Enabled" : "Disabled"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {limit ? (
                            <Badge variant="outline">{limit.maxLimit}</Badge>
                          ) : (
                            <span className="text-muted-foreground text-sm">
                              Unlimited
                            </span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleToggleFeature(feature)}
                              title={feature.enabled ? "Disable" : "Enable"}
                            >
                              {feature.enabled ? (
                                <ToggleRight className="h-4 w-4 text-green-600" />
                              ) : (
                                <ToggleLeft className="h-4 w-4" />
                              )}
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                setSelectedFeature(feature);
                                setIsSetLimitOpen(true);
                              }}
                              title="Set Limit"
                            >
                              <Settings className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-destructive hover:text-destructive"
                              onClick={() => setFeatureToRemove(feature)}
                              title="Remove Feature"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Limits Section */}
        <Card>
          <CardHeader>
            <CardTitle>Limits</CardTitle>
            <CardDescription>
              Usage limits for features in this plan
            </CardDescription>
          </CardHeader>
          <CardContent>
            {limits.length === 0 ? (
              <div className="flex min-h-[200px] flex-col items-center justify-center rounded-md border border-dashed p-4 text-center">
                <p className="text-sm text-muted-foreground">
                  No limits set. All features are unlimited.
                </p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Feature</TableHead>
                    <TableHead>Limit</TableHead>
                    <TableHead className="w-[80px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {limits.map((limit) => (
                    <TableRow key={limit.featureSlug}>
                      <TableCell className="font-mono text-sm">
                        {limit.featureSlug}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{limit.maxLimit}</Badge>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:text-destructive"
                          onClick={() => setLimitToRemove(limit.featureSlug)}
                          title="Remove Limit"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>

      <AddFeatureToPlanModal
        isOpen={isAddFeatureOpen}
        onClose={() => setIsAddFeatureOpen(false)}
        planId={Number(planId)}
        existingFeatureIds={features.map((f) => f.id)}
        onSuccess={fetchPlanData}
      />

      <SetLimitModal
        isOpen={isSetLimitOpen}
        onClose={() => {
          setIsSetLimitOpen(false);
          setSelectedFeature(null);
        }}
        planId={Number(planId)}
        feature={selectedFeature}
        currentLimit={
          selectedFeature ? getFeatureLimit(selectedFeature.slug) : undefined
        }
        onSuccess={fetchPlanData}
      />

      {/* Remove Feature Confirmation */}
      <AlertDialog
        open={!!featureToRemove}
        onOpenChange={() => setFeatureToRemove(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Feature</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove
              <span className="font-semibold text-foreground">
                {" "}
                "{featureToRemove?.name}"{" "}
              </span>
              from this plan? This will also remove any associated limits.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                confirmRemoveFeature();
              }}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? "Removing..." : "Remove"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Remove Limit Confirmation */}
      <AlertDialog
        open={!!limitToRemove}
        onOpenChange={() => setLimitToRemove(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Limit</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove the limit for
              <span className="font-semibold text-foreground font-mono">
                {" "}
                "{limitToRemove}"{" "}
              </span>
              ? This feature will become unlimited.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                confirmRemoveLimit();
              }}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? "Removing..." : "Remove Limit"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
