"use client";

import { useState } from "react";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils";
import { deleteShop } from "@/lib/actions/shops";
import { ShopEditForm } from "./ShopEditForm";
import { ArrowUpRight, Pencil, Trash2 } from "lucide-react";

interface Shop {
  id: number;
  name: string;
  phone: string | null;
  address: string | null;
  balance: number;
}

export function ShopList({ shops }: { shops: Shop[] }) {
  const [editing, setEditing] = useState<Shop | null>(null);
  const [deleting, setDeleting] = useState<Shop | null>(null);
  const [deleteError, setDeleteError] = useState("");
  const [deletePending, setDeletePending] = useState(false);

  async function handleDelete() {
    if (!deleting) return;
    setDeletePending(true);
    setDeleteError("");
    const result = await deleteShop(deleting.id);
    if (result.error) {
      setDeleteError(result.error);
      setDeletePending(false);
    } else {
      setDeleting(null);
      setDeleteError("");
    }
  }

  if (shops.length === 0) {
    return (
      <div className="col-span-2 py-12 text-center text-sm text-text-muted">
        No shops added yet.
      </div>
    );
  }

  return (
    <>
      {shops.map((shop, index) => (
        <div
          key={shop.id}
          className="group relative rounded-xl border border-border bg-surface p-5 shadow-sm card-hover"
          style={{ animation: `card-enter 500ms cubic-bezier(0.16, 1, 0.3, 1) ${index * 80}ms backwards` }}
        >
          <div className="mb-2 flex items-start justify-between gap-2">
            <Link href={`/shops/${shop.id}/ledger`} className="min-w-0 flex-1">
              <h3 className="heading-section truncate text-text-primary">{shop.name}</h3>
              {shop.phone && <p className="mt-0.5 truncate text-sm text-text-muted">{shop.phone}</p>}
            </Link>
            <div className="flex shrink-0 items-center gap-1">
              <button
                onClick={() => setEditing(shop)}
                className="icon-btn text-text-muted hover:text-gold-500"
                title="Edit shop"
                aria-label="Edit shop"
              >
                <Pencil className="h-4 w-4" />
              </button>
              <button
                onClick={() => { setDeleting(shop); setDeleteError(""); }}
                className="icon-btn text-text-muted hover:text-red-400"
                title="Delete shop"
                aria-label="Delete shop"
              >
                <Trash2 className="h-4 w-4" />
              </button>
              <Link href={`/shops/${shop.id}/ledger`} className="icon-btn text-text-muted hover:text-gold-500">
                <ArrowUpRight className="h-5 w-5" />
              </Link>
            </div>
          </div>
          <div className="gold-divider my-3" />
          <div className="flex items-center justify-between">
            <span className="text-sm text-text-muted">Outstanding</span>
            <span className={`font-semibold ${shop.balance > 0 ? "text-maroon-500" : "text-green-400"}`}>
              {shop.balance > 0 ? formatCurrency(shop.balance) : "₹0"}
            </span>
          </div>
        </div>
      ))}

      {editing && <ShopEditForm shop={editing} onClose={() => setEditing(null)} />}

      {deleting && (
        <div className="modal-overlay" onClick={() => { setDeleting(null); setDeleteError(""); }}>
          <div className="modal-panel !max-w-sm" onClick={(e) => e.stopPropagation()}>
            <h2 className="heading-section mb-2 text-text-primary">Delete Shop</h2>
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
