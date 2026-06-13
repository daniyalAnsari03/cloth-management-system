export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

export function formatGaz(value: number): string {
  return `${value.toFixed(1)} gaz`;
}

export function todayString(): string {
  return new Date().toISOString().split("T")[0];
}

export function toDateInputValue(date: Date | string): string {
  return new Date(date).toISOString().split("T")[0];
}
