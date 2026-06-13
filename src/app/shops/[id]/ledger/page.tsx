import { getShop, getShopLedger } from "@/lib/actions/shops";
import { Card } from "@/components/Card";
import { formatCurrency, formatDate } from "@/lib/utils";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function ShopLedgerPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const shopId = Number(id);
  const [shop, entries] = await Promise.all([
    getShop(shopId),
    getShopLedger(shopId),
  ]);

  if (!shop) notFound();

  const currentBalance = entries[0]?.balanceAfter ?? 0;

  return (
    <div>
      <div className="mb-6 animate-fade-in-down">
        <Link
          href="/shops"
          className="mb-3 flex items-center gap-1 text-sm text-text-muted hover:text-text-secondary"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Shops
        </Link>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="heading-page text-text-primary">
              {shop.name}
            </h1>
            <p className="mt-1 text-sm text-text-muted">
              {shop.phone && `${shop.phone} • `}Ledger
            </p>
          </div>
          <div className="sm:text-right">
            <p className="text-sm text-text-muted">Current Balance</p>
            <p
              className={`font-display text-2xl font-bold ${
                currentBalance > 0 ? "text-maroon-500" : "text-green-400"
              }`}
            >
              {currentBalance > 0
                ? formatCurrency(currentBalance)
                : "₹0"}
            </p>
            <p className="text-xs text-text-muted">
              {currentBalance > 0 ? "Shop owes you" : "Settled"}
            </p>
          </div>
        </div>
      </div>

      <Card className="!p-0">
        <div className="table-wrapper">
          <table className="w-full text-left text-sm min-w-[650px]">
            <thead>
              <tr className="border-b border-border-light text-xs uppercase text-text-muted">
                <th className="table-header">Date</th>
                <th className="table-header">Type</th>
                <th className="table-header">Description</th>
                <th className="table-header">Amount</th>
                <th className="table-header">Balance</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((e, i) => (
                <tr
                  key={e.id}
                  className="border-b border-border last:border-0 row-enter"
                  style={{ animationDelay: `${i * 80}ms` }}
                >
                  <td className="table-cell text-text-secondary">
                    {formatDate(e.date)}
                  </td>
                  <td className="table-cell">
                    <span
                      className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
                        e.type === "debit"
                          ? "bg-red-500/10 text-red-400"
                          : "bg-green-500/10 text-green-400"
                      }`}
                    >
                      {e.type === "debit" ? "Sale" : "Payment"}
                    </span>
                  </td>
                  <td className="table-cell text-text-secondary">
                    {e.description ?? "—"}
                  </td>
                  <td className="table-cell font-medium text-text-primary">
                    {formatCurrency(e.amount)}
                  </td>
                  <td className="py-3 font-medium text-text-primary">
                    {formatCurrency(e.balanceAfter)}
                  </td>
                </tr>
              ))}
              {entries.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-text-muted">
                    No transactions yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
