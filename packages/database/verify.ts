import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function verify() {
  const matchesCount = await prisma.match.count();
  console.log(`Matches: ${matchesCount} (Expected: 104)`);

  const teamsCount = await prisma.team.count();
  console.log(`Teams: ${teamsCount} (Expected: 49)`); // 48 real + 1 TBD

  const stadiumsCount = await prisma.stadium.count();
  console.log(`Stadiums: ${stadiumsCount} (Expected: 16)`);

  const stadiums = await prisma.stadium.findMany({ select: { city: true } });
  const uniqueCities = new Set(stadiums.map(s => s.city));
  console.log(`Cities: ${uniqueCities.size} (Expected: 16)`);

  const teamsWithoutFlags = await prisma.team.count({ where: { flagUrl: null } });
  console.log(`Teams missing flags: ${teamsWithoutFlags}`);
  
  // Verify stadiums have capacity and coordinates
  const stadiumsMissingDetails = await prisma.stadium.count({
    where: {
      OR: [
        { capacity: 0 },
        { latitude: null },
        { longitude: null }
      ]
    }
  });
  console.log(`Stadiums missing capacity/coordinates: ${stadiumsMissingDetails}`);

  console.log("=== Verification Complete ===");
}

verify().catch(console.error).finally(() => prisma.$disconnect());
