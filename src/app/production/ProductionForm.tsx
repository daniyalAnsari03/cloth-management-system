"use client";

import { useState } from "react";
import { createProduction } from "@/lib/actions/production";
import { Plus, X } from "lucide-react";
import { todayString } from "@/lib/utils";

interface FabricType {
  id: number;
  name: string;
}

export function ProductionForm({
  fabricTypes,
}: {
  fabricTypes: FabricType[];
}) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    setError("");
    const form = e.currentTarget;
    const data = new FormData(form);
    const result = await createProduction(data);
    if (result.error) {
      setError(result.error);
      setPending(false);
    } else {
      form.reset();
      setOpen(false);
      setPending(false);
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="btn btn-primary"
      >
        <Plus className="h-4 w-4" />
        Add Production
      </button>

      {open && (
        <div className="modal-overlay" onClick={() => setOpen(false)}>
          <div className="modal-panel-lg" onClick={(e) => e.stopPropagation()}>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="heading-section text-text-primary">
                New Production Entry
              </h2>
              <button
                onClick={() => setOpen(false)}
                className="icon-btn text-text-muted hover:text-text-secondary"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-text-secondary">
                  Date
                </label>
                <input
                  type="date"
                  name="date"
                  defaultValue={todayString()}
                  max={todayString()}
                  required
                  className="input-field"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-text-secondary">
                  Fabric Type
                </label>
                <select
                  name="fabricTypeId"
                  required
                  className="input-field"
                >
                  <option value="">Select fabric type</option>
                  {fabricTypes.map((ft) => (
                    <option key={ft.id} value={ft.id}>
                      {ft.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-text-secondary">
                    Gaz (yards)
                  </label>
                  <input
                    type="number"
                    name="gaz"
                    step="0.1"
                    min="0.1"
                    required
                    placeholder="e.g. 50"
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-text-secondary">
                    Cost per Gaz (₹)
                  </label>
                  <input
                    type="number"
                    name="costPerGaz"
                    step="0.01"
                    min="0"
                    required
                    placeholder="e.g. 450"
                    className="input-field"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-text-secondary">
                  Notes
                </label>
                <input
                  type="text"
                  name="notes"
                  placeholder="Optional notes..."
                  className="input-field"
                />
              </div>

              {error && (
                <p className="rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-400">
                  {error}
                </p>
              )}

              <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="btn btn-secondary w-full sm:w-auto"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={pending}
                  className="btn btn-primary w-full sm:w-auto"
                >
                  {pending ? <span className="spinner" /> : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
