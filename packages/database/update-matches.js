const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const updates = [
  { matchNum: 74, home: "Germany", away: "Paraguay", stadiumCity: "Boston" },
  { matchNum: 77, home: "France", away: "Sweden", stadiumCity: "New York" },
  { matchNum: 78, home: "Cote d'Ivoire", away: "Norway", stadiumCity: "Dallas" },
  { matchNum: 86, home: "Argentina", away: "Cabo Verde", stadiumCity: "Miami" },
  { matchNum: 88, home: "Australia", away: "Egypt", stadiumCity: "Dallas" },
  { matchNum: 73, home: "South Africa", away: "Canada", stadiumCity: "Los Angeles" },
  { matchNum: 75, home: "Netherlands", away: "Morocco", stadiumCity: "Monterrey" },
  { matchNum: 76, home: "Brazil", away: "Japan", stadiumCity: "Houston" },
  { matchNum: 79, home: "Mexico", away: "Group C/E/F/H/I third place", stadiumCity: "Mexico City" },
  { matchNum: 81, home: "United States", away: "Bosnia and Herzegovina", stadiumCity: "San Francisco" },
  { matchNum: 82, home: "Belgium", away: "Group A/E/H/I/J third place", stadiumCity: "Seattle" },
  { matchNum: 84, home: "Spain", away: "Group J runners-up", stadiumCity: "Los Angeles" },
  { matchNum: 85, home: "Switzerland", away: "Group E/F/G/I/J third place", stadiumCity: "Vancouver" }
];

async function main() {
  const allTeams = await prisma.team.findMany();
  const allStadiums = await prisma.stadium.findMany();

  for (const matchReq of updates) {
    let homeTeam = allTeams.find(t => t.name.toLowerCase() === matchReq.home.toLowerCase() || (matchReq.home === 'United States' && t.name === 'USA'));
    if (!homeTeam) {
      console.log(`Creating missing team: ${matchReq.home}`);
      homeTeam = await prisma.team.create({
        data: {
          name: matchReq.home,
          slug: matchReq.home.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          countryCode: "TBD",
          flagUrl: "https://flagcdn.com/w160/un.png"
        }
      });
      allTeams.push(homeTeam);
    }

    let awayTeam = allTeams.find(t => t.name.toLowerCase() === matchReq.away.toLowerCase());
    if (!awayTeam) {
      console.log(`Creating missing team: ${matchReq.away}`);
      awayTeam = await prisma.team.create({
        data: {
          name: matchReq.away,
          slug: matchReq.away.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          countryCode: "TBD",
          flagUrl: "https://flagcdn.com/w160/un.png"
        }
      });
      allTeams.push(awayTeam);
    }

    let stadium = allStadiums.find(s => s.city.toLowerCase().includes(matchReq.stadiumCity.toLowerCase()) || s.name.toLowerCase().includes(matchReq.stadiumCity.toLowerCase()));
    
    if (!stadium) {
      console.log(`Could not find stadium for ${matchReq.stadiumCity}, falling back to any.`);
      stadium = allStadiums[0];
    }

    const match = await prisma.match.findFirst({
      where: { matchNumber: matchReq.matchNum }
    });

    if (match) {
      // Formulate a slug: team-a-vs-team-b-jun-11
      const month = match.kickoffUtc.toLocaleString('en-US', { month: 'short' }).toLowerCase();
      const day = match.kickoffUtc.getDate();
      const matchSlug = `${homeTeam.slug}-vs-${awayTeam.slug}-${month}-${day}`;

      await prisma.match.update({
        where: { id: match.id },
        data: {
          homeTeamId: homeTeam.id,
          awayTeamId: awayTeam.id,
          stadiumId: stadium.id,
          slug: matchSlug
        }
      });
      console.log(`Updated Match ${matchReq.matchNum} -> ${homeTeam.name} vs ${awayTeam.name} at ${stadium.name}`);

      // Ensure there are listings
      const existingListingsCount = await prisma.ticketListing.count({
        where: { matchId: match.id }
      });

      if (existingListingsCount < 5) {
        console.log(`Generating tickets for Match ${matchReq.matchNum}...`);
        for (let j = 0; j < 8; j++) {
          const price = Math.floor(Math.random() * (980 - 170 + 1)) + 170;
          await prisma.ticketListing.create({
            data: {
              matchId: match.id,
              category: 'CAT2',
              section: `Block ${Math.floor(Math.random() * 300) + 100}`,
              row: `Row A`,
              quantity: Math.floor(Math.random() * 4) + 1,
              pricePerTicket: price,
              currency: 'USD',
              deliveryMethod: 'FIFA_APP_TRANSFER',
              status: 'ACTIVE'
            }
          });
        }
      }
    } else {
      console.log(`Warning: Match ${matchReq.matchNum} not found in DB!`);
    }
  }
}

main().catch(e => console.error(e)).finally(() => prisma.$disconnect());
