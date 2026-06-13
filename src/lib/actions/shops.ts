"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getShopsWithBalance() {
  const shops = await prisma.shop.findMany({ orderBy: { name: "asc" } });

  return Promise.all(
    shops.map(async (shop) => {
      const lastEntry = await prisma.ledgerEntry.findFirst({
        where: { shopId: shop.id },
        orderBy: [{ date: "desc" }, { id: "desc" }],
      });
      return {
        ...shop,
        balance: lastEntry?.balanceAfter ?? 0,
      };
    })
  );
}

export async function getShop(id: number) {
  return prisma.shop.findUnique({ where: { id } });
}

export async function getShopLedger(shopId: number) {
  return prisma.ledgerEntry.findMany({
    where: { shopId },
    orderBy: [{ date: "desc" }, { id: "desc" }],
  });
}

export async function createShop(formData: FormData) {
  const name = formData.get("name") as string;
  const phone = (formData.get("phone") as string) || null;
  const address = (formData.get("address") as string) || null;

  if (!name?.trim()) return { error: "Shop name is required" };

  const existing = await prisma.shop.findUnique({ where: { name: name.trim() } });
  if (existing) return { error: "A shop with this name already exists" };

  if (phone && !/^\d{10}$/.test(phone)) {
    return { error: "Enter a valid 10-digit phone number" };
  }

  await prisma.shop.create({
    data: { name: name.trim(), phone, address },
  });

  revalidatePath("/shops");
  return { success: true };
}

export async function updateShop(formData: FormData) {
  const id = Number(formData.get("id"));
  const name = (formData.get("name") as string)?.trim();
  const phone = (formData.get("phone") as string)?.trim() || null;
  const address = (formData.get("address") as string)?.trim() || null;

  if (!id || !name) return { error: "Shop name is required" };

  const existing = await prisma.shop.findFirst({
    where: { name, NOT: { id } },
  });
  if (existing) return { error: "Another shop with this name already exists" };

  if (phone && !/^\d{10}$/.test(phone)) {
    return { error: "Enter a valid 10-digit phone number" };
  }

  await prisma.shop.update({
    where: { id },
    data: { name, phone, address },
  });

  revalidatePath("/shops");
  return { success: true };
}

export async function deleteShop(id: number) {
  const shop = await prisma.shop.findUnique({
    where: { id },
    include: {
      _count: { select: { sales: true, payments: true, ledgerEntries: true } },
    },
  });

  if (!shop) return { error: "Shop not found" };

  if (shop._count.sales > 0 || shop._count.payments > 0 || shop._count.ledgerEntries > 0) {
    return {
      error: `Cannot delete — shop has ${shop._count.sales} sale(s), ${shop._count.payments} payment(s), and ${shop._count.ledgerEntries} ledger entr(ies)`,
    };
  }

  await prisma.shop.delete({ where: { id } });

  revalidatePath("/shops");
  return { success: true };
}
