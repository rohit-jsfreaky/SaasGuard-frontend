import { useState, useEffect } from "react";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import {
  Key,
  Plus,
  Trash2,
  Ban,
  Copy,
  Check,
  RefreshCw,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  getApiKeys,
  revokeApiKey,
  deleteApiKey,
  type ApiKey,
} from "@/services/api-keys.service";
import { CreateApiKeyModal } from "./CreateApiKeyModal";
import { RevokeKeyConfirm } from "./RevokeKeyConfirm";
import { cn } from "@/lib/utils";

interface ApiKeyManagementProps {
  organizationId: number;
}

export function ApiKeyManagement({ organizationId }: ApiKeyManagementProps) {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [revokeKey, setRevokeKey] = useState<ApiKey | null>(null);
  const [deleteKeyConfirm, setDeleteKeyConfirm] = useState<ApiKey | null>(null);
  const [copiedKeyId, setCopiedKeyId] = useState<number | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchApiKeys = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const keys = await getApiKeys(organizationId);
      setApiKeys(keys);
    } catch (err) {
      setError("Failed to load API keys");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchApiKeys();
  }, [organizationId]);

  const handleCopyPrefix = async (keyPrefix: string, keyId: number) => {
    await navigator.clipboard.writeText(keyPrefix);
    setCopiedKeyId(keyId);
    setTimeout(() => setCopiedKeyId(null), 2000);
  };

  const handleRevoke = async (keyId: number) => {
    try {
      setActionLoading(true);
      await revokeApiKey(organizationId, keyId);
      toast.success("API key revoked successfully");
      await fetchApiKeys();
    } catch {
      toast.error("Failed to revoke API key");
    } finally {
      setActionLoading(false);
      setRevokeKey(null);
    }
  };

  const handleDelete = async (keyId: number) => {
    try {
      setActionLoading(true);
      await deleteApiKey(organizationId, keyId);
      toast.success("API key deleted successfully");
      await fetchApiKeys();
    } catch {
      toast.error("Failed to delete API key");
    } finally {
      setActionLoading(false);
      setDeleteKeyConfirm(null);
    }
  };

  const getStatusBadge = (key: ApiKey) => {
    if (!key.isActive) {
      return (
        <Badge variant="secondary" className="bg-zinc-500/10 text-zinc-500">
          Revoked
        </Badge>
      );
    }
    if (key.expiresAt && new Date(key.expiresAt) < new Date()) {
      return (
        <Badge variant="secondary" className="bg-amber-500/10 text-amber-500">
          Expired
        </Badge>
      );
    }
    return (
      <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-500">
        Active
      </Badge>
    );
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-4 w-64" />
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <AlertCircle className="h-10 w-10 text-destructive mb-4" />
          <p className="text-sm text-muted-foreground mb-4">{error}</p>
          <Button variant="outline" size="sm" onClick={fetchApiKeys}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Key className="h-5 w-5" />
                API Keys
              </CardTitle>
              <CardDescription>
                Generate API keys for your SaaS applications to integrate with
                SaaS Guard.
              </CardDescription>
            </div>
            <Button size="sm" onClick={() => setIsCreateModalOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Create Key
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {apiKeys.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                <Key className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="mt-4 text-sm font-semibold">No API keys</h3>
              <p className="mt-1 text-sm text-muted-foreground max-w-sm">
                Create an API key to integrate your applications with SaaS
                Guard.
              </p>
              <Button
                size="sm"
                className="mt-4"
                onClick={() => setIsCreateModalOpen(true)}
              >
                <Plus className="mr-2 h-4 w-4" />
                Create Your First Key
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Key Prefix</TableHead>
                    <TableHead>Scopes</TableHead>
                    <TableHead>Last Used</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {apiKeys.map((key) => (
                    <TableRow
                      key={key.id}
                      className={cn(!key.isActive && "opacity-60")}
                    >
                      <TableCell className="font-medium">{key.name}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <code className="rounded bg-muted px-2 py-1 text-xs font-mono">
                            {key.keyPrefix}...
                          </code>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0"
                            onClick={() =>
                              handleCopyPrefix(key.keyPrefix, key.id)
                            }
                          >
                            {copiedKeyId === key.id ? (
                              <Check className="h-3 w-3 text-emerald-500" />
                            ) : (
                              <Copy className="h-3 w-3" />
                            )}
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell>
                        <TooltipProvider>
                          <div className="flex flex-wrap gap-1">
                            {(key.scopes || []).slice(0, 2).map((scope) => (
                              <Tooltip key={scope}>
                                <TooltipTrigger>
                                  <Badge
                                    variant="outline"
                                    className="text-xs font-normal"
                                  >
                                    {scope.split(":")[0]}
                                  </Badge>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>{scope}</p>
                                </TooltipContent>
                              </Tooltip>
                            ))}
                            {(key.scopes || []).length > 2 && (
                              <Tooltip>
                                <TooltipTrigger>
                                  <Badge
                                    variant="outline"
                                    className="text-xs font-normal"
                                  >
                                    +{key.scopes.length - 2}
                                  </Badge>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>{key.scopes.slice(2).join(", ")}</p>
                                </TooltipContent>
                              </Tooltip>
                            )}
                          </div>
                        </TooltipProvider>
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {key.lastUsedAt
                          ? formatDistanceToNow(new Date(key.lastUsedAt), {
                              addSuffix: true,
                            })
                          : "Never"}
                      </TableCell>
                      <TableCell>{getStatusBadge(key)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          {key.isActive && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 text-amber-500 hover:text-amber-600 hover:bg-amber-500/10"
                              onClick={() => setRevokeKey(key)}
                            >
                              <Ban className="h-4 w-4" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                            onClick={() => setDeleteKeyConfirm(key)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create API Key Modal */}
      <CreateApiKeyModal
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
        organizationId={organizationId}
        onSuccess={fetchApiKeys}
      />

      {/* Revoke Confirmation */}
      {revokeKey && (
        <RevokeKeyConfirm
          open={!!revokeKey}
          onOpenChange={() => !actionLoading && setRevokeKey(null)}
          keyName={revokeKey.name}
          keyPrefix={revokeKey.keyPrefix}
          onConfirm={() => handleRevoke(revokeKey.id)}
          action="revoke"
          isLoading={actionLoading}
        />
      )}

      {/* Delete Confirmation */}
      {deleteKeyConfirm && (
        <RevokeKeyConfirm
          open={!!deleteKeyConfirm}
          onOpenChange={() => !actionLoading && setDeleteKeyConfirm(null)}
          keyName={deleteKeyConfirm.name}
          keyPrefix={deleteKeyConfirm.keyPrefix}
          onConfirm={() => handleDelete(deleteKeyConfirm.id)}
          action="delete"
          isLoading={actionLoading}
        />
      )}
    </>
  );
}
