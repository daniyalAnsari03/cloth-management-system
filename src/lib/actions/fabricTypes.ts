"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getFabricTypes() {
  return prisma.fabricType.findMany({
    orderBy: { name: "asc" },
  });
}

export async function getFabricTypesWithUsage() {
  const types = await prisma.fabricType.findMany({
    orderBy: { name: "asc" },
    include: {
      _count: { select: { production: true, sales: true } },
    },
  });
  return types;
}

export async function createFabricType(formData: FormData) {
  const name = (formData.get("name") as string)?.trim();
  const description = (formData.get("description") as string)?.trim() || null;

  if (!name) return { error: "Fabric type name is required" };

  const existing = await prisma.fabricType.findUnique({ where: { name } });
  if (existing) return { error: "A fabric type with this name already exists" };

  await prisma.fabricType.create({ data: { name, description } });

  revalidatePath("/fabric-types");
  revalidatePath("/production");
  revalidatePath("/sales");
  revalidatePath("/stock");
  return { success: true };
}

export async function updateFabricType(formData: FormData) {
  const id = Number(formData.get("id"));
  const name = (formData.get("name") as string)?.trim();
  const description = (formData.get("description") as string)?.trim() || null;

  if (!id || !name) return { error: "Fabric type name is required" };

  const existing = await prisma.fabricType.findFirst({
    where: { name, NOT: { id } },
  });
  if (existing) return { error: "Another fabric type with this name already exists" };

  await prisma.fabricType.update({
    where: { id },
    data: { name, description },
  });

  revalidatePath("/fabric-types");
  revalidatePath("/production");
  revalidatePath("/sales");
  revalidatePath("/stock");
  return { success: true };
}

export async function deleteFabricType(id: number) {
  const type = await prisma.fabricType.findUnique({
    where: { id },
    include: { _count: { select: { production: true, sales: true } } },
  });

  if (!type) return { error: "Fabric type not found" };

  if (type._count.production > 0 || type._count.sales > 0) {
    return {
      error: `Cannot delete — used in ${type._count.production} production batch(es) and ${type._count.sales} sale(s)`,
    };
  }

  await prisma.fabricType.delete({ where: { id } });

  revalidatePath("/fabric-types");
  revalidatePath("/production");
  revalidatePath("/sales");
  revalidatePath("/stock");
  return { success: true };
}
