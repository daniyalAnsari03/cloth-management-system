"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getSales() {
  return prisma.sale.findMany({
    include: { shop: true, fabricType: true },
    orderBy: { date: "desc" },
  });
}

export async function getShops() {
  return prisma.shop.findMany({ orderBy: { name: "asc" } });
}

export async function createSale(formData: FormData) {
  const date = new Date(formData.get("date") as string);
  const shopId = Number(formData.get("shopId"));
  const fabricTypeId = Number(formData.get("fabricTypeId"));
  const gaz = parseFloat(formData.get("gaz") as string);
  const salePricePerGaz = parseFloat(
    formData.get("salePricePerGaz") as string
  );
  const costPerGaz = parseFloat(formData.get("costPerGaz") as string);
  const notes = (formData.get("notes") as string) || null;

  if (!date || !shopId || !fabricTypeId || !gaz || !salePricePerGaz || costPerGaz === undefined) {
    return { error: "All required fields must be filled" };
  }
  if (gaz <= 0) return { error: "Gaz must be greater than 0" };
  if (salePricePerGaz <= 0) return { error: "Sale price must be greater than 0" };
  if (costPerGaz < 0) return { error: "Cost per gaz cannot be negative" };
  if (date > new Date()) return { error: "Date cannot be in the future" };

  const productions = await prisma.production.findMany({
    where: { fabricTypeId },
  });
  const totalProduced = productions.reduce((s, p) => s + p.gaz, 0);
  const existingSales = await prisma.sale.findMany({
    where: { fabricTypeId },
  });
  const totalSold = existingSales.reduce((s, sale) => s + sale.gaz, 0);
  const currentStock = totalProduced - totalSold;

  if (gaz > currentStock) {
    return {
      error: `Insufficient stock. Available: ${currentStock.toFixed(1)} gaz`,
    };
  }

  const totalAmount = gaz * salePricePerGaz;

  const result = await prisma.$transaction(async (tx) => {
    const sale = await tx.sale.create({
      data: { date, shopId, fabricTypeId, gaz, salePricePerGaz, costPerGaz, notes },
    });

    const lastEntry = await tx.ledgerEntry.findFirst({
      where: { shopId },
      orderBy: [{ date: "desc" }, { id: "desc" }],
    });
    const prevBalance = lastEntry?.balanceAfter ?? 0;

    await tx.ledgerEntry.create({
      data: {
        date,
        shopId,
        type: "debit",
        amount: totalAmount,
        balanceAfter: prevBalance + totalAmount,
        referenceType: "sale",
        referenceId: sale.id,
        description: `Sale: ${gaz} gaz @ ₹${salePricePerGaz}/gaz`,
      },
    });

    return sale;
  });

  revalidatePath("/sales");
  revalidatePath("/stock");
  revalidatePath(`/shops/${result.shopId}/ledger`);
  revalidatePath("/shops");
  return { success: true };
}

export async function deleteSale(id: number) {
  const sale = await prisma.sale.findUnique({ where: { id } });
  if (!sale) return { error: "Sale not found" };

  await prisma.$transaction(async (tx) => {
    await tx.ledgerEntry.deleteMany({
      where: { referenceType: "sale", referenceId: id },
    });

    await tx.sale.delete({ where: { id } });

    const entries = await tx.ledgerEntry.findMany({
      where: { shopId: sale.shopId },
      orderBy: [{ date: "asc" }, { id: "asc" }],
    });

    let balance = 0;
    for (const entry of entries) {
      balance += entry.type === "debit" ? entry.amount : -entry.amount;
      await tx.ledgerEntry.update({
        where: { id: entry.id },
        data: { balanceAfter: balance },
      });
    }
  });

  revalidatePath("/sales");
  revalidatePath("/stock");
  revalidatePath("/shops");
  return { success: true };
}
