const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const highDemandTeams = ["Argentina", "United States", "USA", "Brazil"];
const midDemandTeams = ["Netherlands", "France", "Spain", "Germany", "Belgium", "Mexico"];

function getTier(home, away) {
  if (highDemandTeams.includes(home) || highDemandTeams.includes(away)) return 'HIGH';
  if (midDemandTeams.includes(home) || midDemandTeams.includes(away)) return 'MID';
  return 'LOW';
}

function generatePrice(tier) {
  if (tier === 'HIGH') {
    // 80% chance between 1700 and 3500, 20% chance between 3500 and 20000
    if (Math.random() < 0.8) {
      return Math.floor(Math.random() * (3500 - 1700 + 1)) + 1700;
    } else {
      return Math.floor(Math.random() * (20000 - 3500 + 1)) + 3500;
    }
  } else if (tier === 'MID') {
    // start 1000 to 1300, up to maybe 2500
    return Math.floor(Math.random() * (2500 - 1000 + 1)) + 1000;
  } else {
    // Low: 500 to 600, up to maybe 1000
    return Math.floor(Math.random() * (1000 - 500 + 1)) + 500;
  }
}

async function main() {
  const matches = await prisma.match.findMany({
    where: {
      matchNumber: { in: [73, 74, 75, 76, 77, 78, 79, 81, 82, 84, 85, 86, 88] }
    },
    include: { homeTeam: true, awayTeam: true }
  });

  for (const match of matches) {
    const tier = getTier(match.homeTeam.name, match.awayTeam.name);
    console.log(`Processing Match ${match.matchNumber}: ${match.homeTeam.name} vs ${match.awayTeam.name} [Tier: ${tier}]`);

    // Delete existing tickets
    await prisma.ticketListing.deleteMany({
      where: { matchId: match.id }
    });

    // Generate 12 to 25 new tickets
    const numTickets = Math.floor(Math.random() * 14) + 12;
    const newTickets = [];

    for (let i = 0; i < numTickets; i++) {
      // Determine category based on price logic or random
      const randCat = Math.random();
      let category = 'CAT3';
      if (randCat > 0.8) category = 'CAT1';
      else if (randCat > 0.4) category = 'CAT2';

      newTickets.push({
        matchId: match.id,
        category: category,
        section: `Block ${Math.floor(Math.random() * 300) + 100}`,
        row: `Row ${String.fromCharCode(65 + Math.floor(Math.random() * 10))}`,
        quantity: Math.floor(Math.random() * 4) + 1,
        pricePerTicket: generatePrice(tier),
        currency: 'USD',
        deliveryMethod: 'FIFA_APP_TRANSFER',
        status: 'ACTIVE'
      });
    }

    await prisma.ticketListing.createMany({
      data: newTickets
    });
    console.log(`  -> Created ${numTickets} listings.`);
  }
}

main().catch(e => console.error(e)).finally(() => prisma.$disconnect());
