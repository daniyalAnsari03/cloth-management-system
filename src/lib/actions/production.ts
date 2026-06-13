"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getProductions() {
  return prisma.production.findMany({
    include: { fabricType: true },
    orderBy: { date: "desc" },
  });
}

export async function getFabricTypes() {
  return prisma.fabricType.findMany({ orderBy: { name: "asc" } });
}

export async function createProduction(formData: FormData) {
  const date = new Date(formData.get("date") as string);
  const fabricTypeId = Number(formData.get("fabricTypeId"));
  const gaz = parseFloat(formData.get("gaz") as string);
  const costPerGaz = parseFloat(formData.get("costPerGaz") as string);
  const notes = (formData.get("notes") as string) || null;

  if (!date || !fabricTypeId || !gaz || costPerGaz === undefined) {
    return { error: "All required fields must be filled" };
  }
  if (gaz <= 0) return { error: "Gaz must be greater than 0" };
  if (costPerGaz < 0) return { error: "Cost per gaz cannot be negative" };
  if (date > new Date()) return { error: "Date cannot be in the future" };

  await prisma.production.create({
    data: { date, fabricTypeId, gaz, costPerGaz, notes },
  });

  revalidatePath("/production");
  revalidatePath("/stock");
  return { success: true };
}

export async function deleteProduction(id: number) {
  const production = await prisma.production.findUnique({ where: { id } });
  if (!production) return { error: "Production entry not found" };

  const totalProduced = await prisma.production.aggregate({
    where: { fabricTypeId: production.fabricTypeId },
    _sum: { gaz: true },
  });

  const totalSold = await prisma.sale.aggregate({
    where: { fabricTypeId: production.fabricTypeId },
    _sum: { gaz: true },
  });

  const produced = totalProduced._sum.gaz ?? 0;
  const sold = totalSold._sum.gaz ?? 0;
  const currentStock = produced - sold;

  if (currentStock - production.gaz < 0) {
    return {
      error: `Cannot delete — fabric already sold. Current stock: ${currentStock.toFixed(1)} gaz`,
    };
  }

  await prisma.production.delete({ where: { id } });

  revalidatePath("/production");
  revalidatePath("/stock");
  return { success: true };
}
