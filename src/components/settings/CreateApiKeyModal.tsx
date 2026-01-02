import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { Copy, Check, AlertTriangle, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  createApiKey,
  getAvailableScopes,
  DEFAULT_SCOPES,
  type ApiKeyScope,
  type CreateApiKeyResponse,
} from "@/services/api-keys.service";

interface CreateApiKeyModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  organizationId: number;
  onSuccess: () => void;
}

export function CreateApiKeyModal({
  open,
  onOpenChange,
  organizationId,
  onSuccess,
}: CreateApiKeyModalProps) {
  const [step, setStep] = useState<"form" | "result">("form");
  const [name, setName] = useState("");
  const [selectedScopes, setSelectedScopes] = useState<string[]>([]);
  const [expiresAt, setExpiresAt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [scopes, setScopes] = useState<ApiKeyScope[]>(DEFAULT_SCOPES);
  const [createdKey, setCreatedKey] = useState<CreateApiKeyResponse | null>(
    null
  );
  const [copied, setCopied] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [showKey, setShowKey] = useState(false);

  // Ref to track if we just created a key (to prevent reset during result view)
  const justCreatedRef = useRef(false);

  useEffect(() => {
    if (open && !justCreatedRef.current) {
      // Reset state when opening (but not when transitioning to result)
      setStep("form");
      setName("");
      setSelectedScopes([]);
      setExpiresAt("");
      setCreatedKey(null);
      setCopied(false);
      setConfirmed(false);
      setShowKey(false);
      setScopes(DEFAULT_SCOPES);

      // Fetch available scopes
      getAvailableScopes(organizationId)
        .then((result) => {
          if (result && Array.isArray(result) && result.length > 0) {
            setScopes(result);
          }
        })
        .catch(() => {
          // Keep default scopes on error
        });
    }
    // Reset the ref when modal closes
    if (!open) {
      justCreatedRef.current = false;
    }
  }, [open, organizationId]);

  const handleScopeChange = (scope: string, checked: boolean) => {
    if (checked) {
      setSelectedScopes((prev) => [...prev, scope]);
    } else {
      setSelectedScopes((prev) => prev.filter((s) => s !== scope));
    }
  };

  const handleSubmit = async () => {
    if (!name.trim()) {
      toast.error("Please enter a name for the API key");
      return;
    }

    try {
      setIsLoading(true);
      const result = await createApiKey(organizationId, {
        name: name.trim(),
        scopes: selectedScopes.length > 0 ? selectedScopes : undefined,
        expiresAt: expiresAt || undefined,
      });

      console.log("Create API Key result:", result);

      if (result && result.key) {
        justCreatedRef.current = true; // Prevent useEffect from resetting
        setCreatedKey(result);
        setStep("result");
        toast.success("API key created successfully!");
      } else {
        toast.error("API key was created but no key data returned");
      }
    } catch (err) {
      console.error("Create API Key error:", err);
      toast.error("Failed to create API key");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async () => {
    if (createdKey) {
      await navigator.clipboard.writeText(createdKey.key);
      setCopied(true);
      toast.success("API key copied to clipboard");
    }
  };

  const handleClose = () => {
    if (step === "result" && !confirmed) {
      toast.error("Please confirm you have copied the API key");
      return;
    }
    // Call onSuccess if we created a key (refresh the list)
    if (justCreatedRef.current) {
      onSuccess();
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg">
        {step === "form" ? (
          <>
            <DialogHeader>
              <DialogTitle>Create API Key</DialogTitle>
              <DialogDescription>
                Generate a new API key for integrating your application with
                SaaS Guard.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  placeholder="e.g., Production API Key"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  A descriptive name to identify this key
                </p>
              </div>

              <div className="space-y-3">
                <Label>Scopes</Label>
                <div className="space-y-3 rounded-lg border p-4">
                  {(scopes || DEFAULT_SCOPES).map((scope) => (
                    <div key={scope.value} className="flex items-start gap-3">
                      <Checkbox
                        id={scope.value}
                        checked={selectedScopes.includes(scope.value)}
                        onCheckedChange={(checked) =>
                          handleScopeChange(scope.value, checked === true)
                        }
                      />
                      <div className="grid gap-0.5">
                        <Label
                          htmlFor={scope.value}
                          className="font-medium cursor-pointer"
                        >
                          {scope.name}
                        </Label>
                        <p className="text-xs text-muted-foreground">
                          {scope.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                {selectedScopes.length === 0 && (
                  <p className="text-xs text-muted-foreground">
                    No scopes selected. Key will have access to all available
                    scopes.
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="expiresAt">Expiration (optional)</Label>
                <Input
                  id="expiresAt"
                  type="date"
                  value={expiresAt}
                  onChange={(e) => setExpiresAt(e.target.value)}
                  min={new Date().toISOString().split("T")[0]}
                />
                <p className="text-xs text-muted-foreground">
                  Leave empty for no expiration
                </p>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={isLoading || !name.trim()}
              >
                {isLoading ? "Creating..." : "Create API Key"}
              </Button>
            </DialogFooter>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-emerald-500">
                <Check className="h-5 w-5" />
                API Key Created
              </DialogTitle>
              <DialogDescription>
                Your API key has been generated. Copy it now - it will not be
                shown again!
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="rounded-lg border bg-amber-500/10 border-amber-500/20 p-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-amber-500">
                      Save this key securely
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      This is the only time you will see this key. Store it in a
                      secure location.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Your API Key</Label>
                <div className="relative">
                  <div className="flex items-center gap-2 rounded-lg border bg-muted p-3">
                    <code className="flex-1 text-sm font-mono break-all select-all">
                      {showKey
                        ? createdKey?.key
                        : createdKey?.key.replace(/./g, "•")}
                    </code>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 shrink-0"
                      onClick={() => setShowKey(!showKey)}
                    >
                      {showKey ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 shrink-0"
                      onClick={handleCopy}
                    >
                      {copied ? (
                        <Check className="h-4 w-4 text-emerald-500" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </div>

              <Button variant="outline" className="w-full" onClick={handleCopy}>
                <Copy className="mr-2 h-4 w-4" />
                {copied ? "Copied!" : "Copy to Clipboard"}
              </Button>

              <div className="flex items-center gap-3 pt-4 border-t">
                <Checkbox
                  id="confirm"
                  checked={confirmed}
                  onCheckedChange={(checked) => setConfirmed(checked === true)}
                />
                <Label
                  htmlFor="confirm"
                  className="text-sm cursor-pointer leading-relaxed"
                >
                  I have copied the API key and stored it securely
                </Label>
              </div>
            </div>

            <DialogFooter>
              <Button onClick={handleClose} disabled={!confirmed}>
                Done
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
