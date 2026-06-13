import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const fabricTypes = [
    { name: "Katan Silk", description: "Pure silk with zari work" },
    { name: "Organza", description: "Sheer fabric with metallic accents" },
    { name: "Georgette", description: "Lightweight flowy fabric" },
    { name: "Satin", description: "Glossy smooth finish" },
    { name: "Cotton Silk", description: "Cotton-silk blend" },
  ];

  for (const ft of fabricTypes) {
    await prisma.fabricType.upsert({
      where: { name: ft.name },
      update: {},
      create: ft,
    });
  }

  const shops = [
    { name: "Mohan Lal & Sons", phone: "9876543210", address: "Chowk, Varanasi" },
    { name: "Shyam Textiles", phone: "9876543211", address: "Gola Dinanath, Varanasi" },
    { name: "Bansal Fabrics", phone: "9876543212", address: "Luxa Road, Varanasi" },
  ];

  for (const shop of shops) {
    await prisma.shop.upsert({
      where: { name: shop.name },
      update: {},
      create: shop,
    });
  }

  console.log("Seed data created.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
