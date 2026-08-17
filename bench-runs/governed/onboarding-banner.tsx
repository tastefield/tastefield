import { useState } from "react";
import { Button } from "@/components/ui/button";

export function AnalyticsBanner() {
  const [dismissed, setDismissed] = useState(false);
  if (dismissed) return null;

  return (
    <div className="flex items-center justify-between rounded-md bg-primary px-4 py-3 text-primary-foreground">
      <p className="text-sm">
        Analytics is now available. Track usage and trends for your account.
      </p>
      <Button variant="ghost" size="sm" onClick={() => setDismissed(true)}>
        Dismiss
      </Button>
    </div>
  );
}
