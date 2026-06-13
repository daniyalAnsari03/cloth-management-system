"use client";

import { useState } from "react";
import { createFabricType, updateFabricType } from "@/lib/actions/fabricTypes";
import { Plus, X, Pencil, Trash2 } from "lucide-react";

interface FabricType { id: number; name: string; description: string | null }

export function AddFabricTypeForm() {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    setError("");
    const form = e.currentTarget;
    const data = new FormData(form);
    const result = await createFabricType(data);
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
      <button onClick={() => setOpen(true)} className="btn btn-primary">
        <Plus className="h-4 w-4" />
        Add Fabric Type
      </button>

      {open && (
        <div className="modal-overlay" onClick={() => setOpen(false)}>
          <div className="modal-panel" onClick={(e) => e.stopPropagation()}>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="heading-section text-text-primary">New Fabric Type</h2>
              <button onClick={() => setOpen(false)} className="icon-btn text-text-muted hover:text-text-secondary">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-text-secondary">Fabric Name</label>
                <input type="text" name="name" required placeholder="e.g. Katan Silk" className="input-field" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-text-secondary">Description</label>
                <textarea name="description" rows={3} placeholder="Optional description..." className="input-field" />
              </div>

              {error && (
                <p className="rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-400">{error}</p>
              )}

              <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-2">
                <button type="button" onClick={() => setOpen(false)} className="btn btn-secondary w-full sm:w-auto">Cancel</button>
                <button type="submit" disabled={pending} className="btn btn-primary w-full sm:w-auto">
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

export function EditFabricTypeForm({ fabricType, onClose }: { fabricType: FabricType; onClose: () => void }) {
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    setError("");
    const form = e.currentTarget;
    const data = new FormData(form);
    const result = await updateFabricType(data);
    if (result.error) {
      setError(result.error);
      setPending(false);
    } else {
      onClose();
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-panel" onClick={(e) => e.stopPropagation()}>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="heading-section text-text-primary">Edit Fabric Type</h2>
          <button onClick={onClose} className="icon-btn text-text-muted hover:text-text-secondary">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="hidden" name="id" value={fabricType.id} />
          <div>
            <label className="mb-1 block text-sm font-medium text-text-secondary">Fabric Name</label>
            <input type="text" name="name" required defaultValue={fabricType.name} className="input-field" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-text-secondary">Description</label>
            <textarea name="description" rows={3} defaultValue={fabricType.description ?? ""} className="input-field" />
          </div>

          {error && (
            <p className="rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-400">{error}</p>
          )}

          <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn btn-secondary w-full sm:w-auto">Cancel</button>
            <button type="submit" disabled={pending} className="btn btn-primary w-full sm:w-auto">
              {pending ? <span className="spinner" /> : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function FabricTypeRow({
  fabricType, onEdit, onDelete,
}: {
  fabricType: FabricType & { _count: { production: number; sales: number } };
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <tr className="border-b border-border last:border-0 transition-colors hover:bg-surface-hover row-enter">
      <td className="table-cell font-medium text-text-primary">{fabricType.name}</td>
      <td className="table-cell text-text-secondary">{fabricType.description ?? "—"}</td>
      <td className="table-cell text-text-secondary">{fabricType._count.production}</td>
      <td className="table-cell text-text-secondary">{fabricType._count.sales}</td>
      <td className="py-3">
        <div className="flex items-center gap-1">
          <button onClick={onEdit} className="icon-btn text-text-muted hover:text-gold-500" title="Edit" aria-label="Edit">
            <Pencil className="h-4 w-4" />
          </button>
          <button onClick={onDelete} className="icon-btn text-text-muted hover:text-red-400" title="Delete" aria-label="Delete">
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </td>
    </tr>
  );
}
