const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const result = await prisma.ticketListing.deleteMany({
    where: {
      match: {
        kickoffUtc: {
          lt: new Date()
        }
      }
    }
  });
  console.log(`Deleted ${result.count} past listings.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
