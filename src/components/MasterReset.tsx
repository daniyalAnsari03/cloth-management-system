"use client";

import { useState } from "react";
import { AlertTriangle, X } from "lucide-react";

export function MasterReset() {
  const [open, setOpen] = useState(false);
  const [typed, setTyped] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  async function handleReset() {
    if (typed !== "RESET") return;
    setPending(true);
    setError("");
    try {
      const res = await fetch("/api/reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ confirm: "RESET" }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Reset failed");
        setPending(false);
        return;
      }
      window.location.reload();
    } catch {
      setError("Network error");
      setPending(false);
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-red-400/60 transition-all duration-200 hover:bg-red-500/8 hover:text-red-400 hover:translate-x-1 min-h-[44px]"
      >
        <AlertTriangle className="h-5 w-5 shrink-0 text-red-400/40" />
        Master Reset
      </button>

      {open && (
        <div className="modal-overlay" onClick={() => !pending && setOpen(false)}>
          <div
            className="modal-panel max-w-md border-red-500/20"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-500/10">
                  <AlertTriangle className="h-5 w-5 text-red-400" />
                </div>
                <h2 className="heading-section text-red-400">Master Reset</h2>
              </div>
              <button
                onClick={() => { setOpen(false); setTyped(""); setError(""); }}
                className="icon-btn text-text-muted hover:text-text-secondary"
                disabled={pending}
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-3">
              <p className="text-sm text-text-secondary leading-relaxed">
                This will permanently <strong className="text-red-400">delete everything</strong>:
              </p>
              <ul className="text-xs text-text-secondary space-y-1 list-disc list-inside">
                <li>All sales, production, payments, expenses</li>
                <li>All ledger entries and shop records</li>
                <li>All fabric types</li>
              </ul>
              <p className="text-xs text-text-muted">
                Stock and balances will be reset to zero. <strong>This cannot be undone.</strong>
              </p>
            </div>

            <div className="mt-4">
              <label className="block text-xs font-medium text-text-secondary mb-1.5">
                Type <span className="font-mono text-red-400 tracking-widest">RESET</span> to confirm
              </label>
              <input
                type="text"
                value={typed}
                onChange={(e) => { setTyped(e.target.value); setError(""); }}
                placeholder="Type RESET here..."
                className="input-field text-sm"
                disabled={pending}
                autoFocus
              />
              {error && (
                <p className="mt-1.5 text-xs text-red-400 animate-shake">{error}</p>
              )}
            </div>

            <div className="mt-5 flex items-center gap-3">
              <button
                onClick={handleReset}
                disabled={typed !== "RESET" || pending}
                className="btn btn-danger flex-1"
              >
                {pending ? <span className="spinner" /> : "Wipe All Data"}
              </button>
              <button
                onClick={() => { setOpen(false); setTyped(""); setError(""); }}
                className="btn btn-secondary"
                disabled={pending}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
