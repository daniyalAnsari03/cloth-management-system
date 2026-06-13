import { getFabricTypesWithUsage, deleteFabricType } from "@/lib/actions/fabricTypes";
import { Card } from "@/components/Card";
import { ScrollReveal } from "@/components/ScrollReveal";
import { AddFabricTypeForm } from "./FabricTypeForm";
import { FabricTypeManager } from "./FabricTypeManager";

export default async function FabricTypesPage() {
  const fabricTypes = await getFabricTypesWithUsage();

  const totalTypes = fabricTypes.length;
  const usedInProduction = fabricTypes.reduce(
    (s, ft) => s + ft._count.production,
    0
  );

  return (
    <div>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="heading-page text-text-primary">
            Fabric Types
          </h1>
          <p className="mt-1 text-sm text-text-muted">
            Manage fabric categories across the system
          </p>
        </div>
        <div className="shrink-0">
          <AddFabricTypeForm />
        </div>
      </div>

      <ScrollReveal animation="reveal-up" delay={100}>
        <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Card>
            <p className="text-sm text-text-muted">Total Fabric Types</p>
            <p className="stat-value text-text-primary">
              {totalTypes}
            </p>
          </Card>
          <Card>
            <p className="text-sm text-text-muted">Total Production Batches</p>
            <p className="stat-value text-text-primary">
              {usedInProduction}
            </p>
          </Card>
        </div>
      </ScrollReveal>

      <ScrollReveal animation="reveal-up" delay={200}>
        <Card className="!p-0">
          <div className="table-wrapper">
            <table className="w-full text-left text-sm min-w-[650px]">
              <thead>
                <tr className="border-b border-border-light text-xs uppercase text-text-muted">
                  <th className="table-header">Fabric Name</th>
                  <th className="table-header">Description</th>
                  <th className="table-header">Production</th>
                  <th className="table-header">Sales</th>
                  <th className="table-header">Actions</th>
                </tr>
              </thead>
              <tbody>
                <FabricTypeManager fabricTypes={fabricTypes} />
              </tbody>
            </table>
          </div>
        </Card>
      </ScrollReveal>
    </div>
  );
}
