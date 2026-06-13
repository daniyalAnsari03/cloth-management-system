"use client";

import { useState } from "react";
import { deleteFabricType } from "@/lib/actions/fabricTypes";
import { EditFabricTypeForm, FabricTypeRow } from "./FabricTypeForm";

interface FabricType {
  id: number;
  name: string;
  description: string | null;
  _count: { production: number; sales: number };
}

export function FabricTypeManager({ fabricTypes }: { fabricTypes: FabricType[] }) {
  const [editing, setEditing] = useState<FabricType | null>(null);
  const [deleting, setDeleting] = useState<FabricType | null>(null);
  const [deleteError, setDeleteError] = useState("");
  const [deletePending, setDeletePending] = useState(false);

  async function handleDelete() {
    if (!deleting) return;
    setDeletePending(true);
    setDeleteError("");
    const result = await deleteFabricType(deleting.id);
    if (result.error) {
      setDeleteError(result.error);
      setDeletePending(false);
    } else {
      setDeleting(null);
      setDeleteError("");
    }
  }

  if (fabricTypes.length === 0) {
    return (
      <tr>
        <td colSpan={5} className="py-12 text-center text-sm text-text-muted">
          No fabric types yet. Add your first one.
        </td>
      </tr>
    );
  }

  return (
    <>
      {fabricTypes.map((ft) => (
        <FabricTypeRow
          key={ft.id}
          fabricType={ft}
          onEdit={() => setEditing(ft)}
          onDelete={() => { setDeleting(ft); setDeleteError(""); }}
        />
      ))}

      {editing && <EditFabricTypeForm fabricType={editing} onClose={() => setEditing(null)} />}

      {deleting && (
        <div className="modal-overlay" onClick={() => { setDeleting(null); setDeleteError(""); }}>
          <div className="modal-panel !max-w-sm" onClick={(e) => e.stopPropagation()}>
            <h2 className="heading-section mb-2 text-text-primary">Delete Fabric Type</h2>
            <p className="mb-4 text-sm text-text-secondary">
              Are you sure you want to delete <strong className="text-text-primary">{deleting.name}</strong>?
            </p>

            {deleteError && (
              <p className="mb-4 rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-400">{deleteError}</p>
            )}

            <div className="flex flex-col-reverse sm:flex-row justify-end gap-3">
              <button onClick={() => { setDeleting(null); setDeleteError(""); }} className="btn btn-secondary w-full sm:w-auto">Cancel</button>
              <button onClick={handleDelete} disabled={deletePending} className="btn btn-danger w-full sm:w-auto">
                {deletePending ? <span className="spinner" /> : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
