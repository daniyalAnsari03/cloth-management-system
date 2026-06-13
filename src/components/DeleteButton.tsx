"use client";

import { useState } from "react";
import { Trash2, X } from "lucide-react";

interface DeleteButtonProps {
  id: number;
  action: (id: number) => Promise<{ success?: boolean; error?: string }>;
  message?: string;
}

export function DeleteButton({
  id,
  action,
  message = "Delete this entry?",
}: DeleteButtonProps) {
  const [confirm, setConfirm] = useState(false);
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function handleDelete() {
    setPending(true);
    setError("");
    const result = await action(id);
    if (result.error) {
      setError(result.error);
      setPending(false);
    }
  }

  if (!confirm) {
    return (
      <button
        onClick={() => setConfirm(true)}
        className="icon-btn text-text-muted hover:text-red-400"
        title="Delete"
        aria-label="Delete"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    );
  }

  return (
    <div className="animate-fade-in-up flex items-center gap-2 max-sm:flex-col max-sm:items-start">
      <span className={`text-xs text-red-400 ${error ? "animate-shake" : ""}`}>{error || message}</span>
      <div className="flex items-center gap-2">
        <button
          onClick={handleDelete}
          disabled={pending}
          className="btn btn-danger !px-2 !py-1 !text-xs"
        >
          {pending ? <span className="spinner" /> : "Delete"}
        </button>
        <button
          onClick={() => {
            setConfirm(false);
            setError("");
          }}
          className="icon-btn text-text-muted hover:text-text-secondary"
          aria-label="Cancel delete"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
