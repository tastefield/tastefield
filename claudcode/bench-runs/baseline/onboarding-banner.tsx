import { useState } from "react";

export function AnalyticsBanner() {
  const [dismissed, setDismissed] = useState(false);
  if (dismissed) return null;

  return (
    <div className="flex items-center justify-between rounded-md bg-blue-500 px-4 py-3 text-white">
      <p className="text-sm">
        Unlock powerful insights! Supercharge your growth with our seamless new analytics.
      </p>
      <button onClick={() => setDismissed(true)} className="ml-4 text-white/80 hover:text-white">
        ✕
      </button>
    </div>
  );
}
