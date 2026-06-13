"use server";

import { prisma } from "@/lib/prisma";

export async function getStockData() {
  const fabricTypes = await prisma.fabricType.findMany({
    orderBy: { name: "asc" },
  });

  const stockData = await Promise.all(
    fabricTypes.map(async (ft) => {
      const productions = await prisma.production.findMany({
        where: { fabricTypeId: ft.id },
      });

      const sales = await prisma.sale.findMany({
        where: { fabricTypeId: ft.id },
      });

      const totalProduced = productions.reduce((s, p) => s + p.gaz, 0);
      const totalCost = productions.reduce(
        (s, p) => s + p.gaz * p.costPerGaz,
        0
      );
      const totalSold = sales.reduce((s, sale) => s + sale.gaz, 0);
      const currentStock = totalProduced - totalSold;
      const avgCost = totalProduced > 0 ? totalCost / totalProduced : 0;

      return {
        id: ft.id,
        name: ft.name,
        totalProduced,
        totalSold,
        currentStock,
        avgCost,
      };
    })
  );

  return stockData;
}
