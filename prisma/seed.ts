import { prisma } from "@/lib/db/prisma";

async function main() {
  console.log("Seeding...");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
