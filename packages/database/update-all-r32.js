const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const updates = [
  { matchNum: 73, home: "South Africa", away: "Canada", stadiumCity: "Los Angeles" },
  { matchNum: 74, home: "Germany", away: "Paraguay", stadiumCity: "Boston" },
  { matchNum: 75, home: "Netherlands", away: "Morocco", stadiumCity: "Monterrey" },
  { matchNum: 76, home: "Brazil", away: "Japan", stadiumCity: "Houston" },
  { matchNum: 77, home: "France", away: "Sweden", stadiumCity: "New York" },
  { matchNum: 78, home: "Cote d'Ivoire", away: "Norway", stadiumCity: "Dallas" },
  { matchNum: 79, home: "Mexico", away: "Ecuador", stadiumCity: "Mexico City" },
  { matchNum: 80, home: "England", away: "Congo DR", stadiumCity: "Atlanta" },
  { matchNum: 81, home: "United States", away: "Bosnia and Herzegovina", stadiumCity: "San Francisco" },
  { matchNum: 82, home: "Belgium", away: "Senegal", stadiumCity: "Seattle" },
  { matchNum: 83, home: "Portugal", away: "Croatia", stadiumCity: "Toronto" },
  { matchNum: 84, home: "Spain", away: "Austria", stadiumCity: "Los Angeles" },
  { matchNum: 85, home: "Switzerland", away: "Algeria", stadiumCity: "Vancouver" },
  { matchNum: 86, home: "Argentina", away: "Cabo Verde", stadiumCity: "Miami" },
  { matchNum: 87, home: "Colombia", away: "Ghana", stadiumCity: "Kansas City" },
  { matchNum: 88, home: "Australia", away: "Egypt", stadiumCity: "Dallas" }
];

const highDemandTeams = ["Argentina", "United States", "USA", "Brazil", "England", "Portugal"];
const midDemandTeams = ["Netherlands", "France", "Spain", "Germany", "Belgium", "Mexico", "Colombia"];

function getTier(home, away) {
  if (highDemandTeams.includes(home) || highDemandTeams.includes(away)) return 'HIGH';
  if (midDemandTeams.includes(home) || midDemandTeams.includes(away)) return 'MID';
  return 'LOW';
}

function generatePrice(tier) {
  if (tier === 'HIGH') {
    if (Math.random() < 0.8) {
      return Math.floor(Math.random() * (3500 - 1700 + 1)) + 1700;
    } else {
      return Math.floor(Math.random() * (20000 - 3500 + 1)) + 3500;
    }
  } else if (tier === 'MID') {
    return Math.floor(Math.random() * (2500 - 1000 + 1)) + 1000;
  } else {
    return Math.floor(Math.random() * (1000 - 500 + 1)) + 500;
  }
}

async function main() {
  const allTeams = await prisma.team.findMany();
  const allStadiums = await prisma.stadium.findMany();

  for (const matchReq of updates) {
    let homeTeam = allTeams.find(t => t.name.toLowerCase() === matchReq.home.toLowerCase() || (matchReq.home === 'United States' && t.name === 'USA') || (matchReq.home === 'Cote d\'Ivoire' && t.name.includes('Ivoire')));
    if (!homeTeam) {
      console.log(`Creating missing team: ${matchReq.home}`);
      homeTeam = await prisma.team.create({
        data: {
          name: matchReq.home,
          slug: matchReq.home.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          countryCode: matchReq.home.substring(0, 3).toUpperCase(),
          flagUrl: "https://flagcdn.com/w160/un.png"
        }
      });
      allTeams.push(homeTeam);
    }

    let awayTeam = allTeams.find(t => t.name.toLowerCase() === matchReq.away.toLowerCase() || (matchReq.away === 'Cote d\'Ivoire' && t.name.includes('Ivoire')));
    if (!awayTeam) {
      console.log(`Creating missing team: ${matchReq.away}`);
      awayTeam = await prisma.team.create({
        data: {
          name: matchReq.away,
          slug: matchReq.away.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          countryCode: matchReq.away.substring(0, 3).toUpperCase(),
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

      // Delete old placeholder tickets if this match had a name change (like Ecuador instead of Group C/E/F/H/I)
      // Actually, let's just regenerate all tickets for matches 79, 80, 82, 83, 84, 85, 87 to be safe and accurate with the new tiers.
      const matchesToRegenerate = [79, 80, 82, 83, 84, 85, 87];
      
      let existingListingsCount = await prisma.ticketListing.count({
        where: { matchId: match.id }
      });

      if (matchesToRegenerate.includes(matchReq.matchNum)) {
        await prisma.ticketListing.deleteMany({ where: { matchId: match.id } });
        existingListingsCount = 0;
      }

      if (existingListingsCount < 5) {
        console.log(`Generating tickets for Match ${matchReq.matchNum}...`);
        const tier = getTier(homeTeam.name, awayTeam.name);
        const numTickets = Math.floor(Math.random() * 14) + 12;
        const newTickets = [];

        for (let j = 0; j < numTickets; j++) {
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
        await prisma.ticketListing.createMany({ data: newTickets });
      }
    } else {
      console.log(`Warning: Match ${matchReq.matchNum} not found in DB!`);
    }
  }
}

main().catch(e => console.error(e)).finally(() => prisma.$disconnect());
