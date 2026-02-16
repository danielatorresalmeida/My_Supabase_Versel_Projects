"use client";

import { useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function AdminRequiredBanner() {
  const [dismissed, setDismissed] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const isAdminRequired = searchParams.get("error") === "admin_required";

  if (!isAdminRequired || dismissed) {
    return null;
  }

  function onDismiss() {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("error");
    const query = params.toString();
    const target = query ? `${pathname}?${query}` : pathname;

    setDismissed(true);
    router.replace(target, { scroll: false });
  }

  return (
    <div className="flex items-start justify-between gap-3 rounded border border-amber-600/50 bg-amber-500/10 p-3 text-sm text-amber-200">
      <p>Admin access is required to view that page.</p>
      <button
        className="rounded border border-amber-600/70 px-2 py-1 text-xs"
        onClick={onDismiss}
        type="button"
      >
        Dismiss
      </button>
    </div>
  );
}
