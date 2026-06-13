import { getShopsWithBalance } from "@/lib/actions/shops";
import { Card } from "@/components/Card";
import { ScrollReveal } from "@/components/ScrollReveal";
import { formatCurrency } from "@/lib/utils";
import { ShopForm } from "./ShopForm";
import { ShopList } from "./ShopList";

export default async function ShopsPage() {
  const shops = await getShopsWithBalance();
  const totalOutstanding = shops.reduce((s, shop) => s + shop.balance, 0);

  return (
    <div>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between animate-fade-in-down">
        <div>
          <h1 className="heading-page text-text-primary">
            Shops / Customers
          </h1>
          <p className="mt-1 text-sm text-text-muted">
            Manage shops and view ledger balances
          </p>
        </div>
        <ShopForm />
      </div>

      <ScrollReveal animation="reveal-up" delay={100}>
        <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Card>
            <p className="text-sm text-text-muted">Total Shops</p>
            <p className="stat-value text-text-primary">
              {shops.length}
            </p>
          </Card>
          <Card>
            <p className="text-sm text-text-muted">Total Outstanding</p>
            <p className="stat-value text-maroon-500">
              {formatCurrency(totalOutstanding)}
            </p>
          </Card>
        </div>
      </ScrollReveal>

      <ScrollReveal animation="reveal-up" delay={200}>
        <div className="grid gap-4 md:grid-cols-2">
          <ShopList shops={shops} />
        </div>
      </ScrollReveal>
    </div>
  );
}
