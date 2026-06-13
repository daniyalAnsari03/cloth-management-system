"use client";

import { useState } from "react";
import { createPayment } from "@/lib/actions/payments";
import { Plus, X } from "lucide-react";
import { todayString } from "@/lib/utils";

const PAYMENT_MODES = ["cash", "UPI", "cheque", "bank_transfer", "other"];

interface Shop {
  id: number;
  name: string;
}

export function PaymentsForm({ shops }: { shops: Shop[] }) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    setError("");
    const form = e.currentTarget;
    const data = new FormData(form);
    const result = await createPayment(data);
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
        Record Payment
      </button>

      {open && (
        <div className="modal-overlay" onClick={() => setOpen(false)}>
          <div className="modal-panel" onClick={(e) => e.stopPropagation()}>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="heading-section text-text-primary">Record Payment</h2>
              <button
                onClick={() => setOpen(false)}
                className="icon-btn text-text-muted hover:text-text-secondary"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                    Shop
                  </label>
                  <select
                    name="shopId"
                    required
                    className="input-field"
                  >
                    <option value="">Select shop</option>
                    {shops.map((shop) => (
                      <option key={shop.id} value={shop.id}>
                        {shop.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-text-secondary">
                  Amount (₹)
                </label>
                <input
                  type="number"
                  name="amount"
                  step="0.01"
                  min="0.01"
                  required
                  placeholder="e.g. 5000"
                  className="input-field"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-text-secondary">
                    Payment Mode
                  </label>
                  <select
                    name="mode"
                    required
                    className="input-field"
                  >
                    <option value="">Select mode</option>
                    {PAYMENT_MODES.map((mode) => (
                      <option key={mode} value={mode}>
                        {mode.replace("_", " ")}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-text-secondary">
                    Reference
                  </label>
                  <input
                    type="text"
                    name="reference"
                    placeholder="Cheque/UPI ref"
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
                  placeholder="Optional"
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
