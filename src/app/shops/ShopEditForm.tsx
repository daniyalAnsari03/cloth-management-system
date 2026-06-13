"use client";

import { useState } from "react";
import { updateShop } from "@/lib/actions/shops";
import { X } from "lucide-react";

interface Shop { id: number; name: string; phone: string | null; address: string | null }

export function ShopEditForm({ shop, onClose }: { shop: Shop; onClose: () => void }) {
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    setError("");
    const form = e.currentTarget;
    const data = new FormData(form);
    const result = await updateShop(data);
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
          <h2 className="heading-section text-text-primary">Edit Shop</h2>
          <button onClick={onClose} className="icon-btn text-text-muted hover:text-text-secondary">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="hidden" name="id" value={shop.id} />
          <div>
            <label className="mb-1 block text-sm font-medium text-text-secondary">Shop Name</label>
            <input type="text" name="name" required defaultValue={shop.name} className="input-field" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-text-secondary">Phone</label>
            <input type="tel" name="phone" defaultValue={shop.phone ?? ""} placeholder="10-digit number" className="input-field" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-text-secondary">Address</label>
            <input type="text" name="address" defaultValue={shop.address ?? ""} placeholder="Optional" className="input-field" />
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
