import { PrismaClient, MatchRound, TicketCategory, DeliveryMethod, ListingStatus } from '@prisma/client'
import fs from 'fs'
import path from 'path'

const prisma = new PrismaClient()

// 16 Official FIFA 2026 Stadiums mapped to the exact names in the JSON
const stadiumsData = [
  { name: "Estadio Azteca", city: "Mexico City", countryCode: "MX", capacity: 83264, latitude: 19.3029, longitude: -99.1505 },
  { name: "Estadio Akron", city: "Guadalajara", countryCode: "MX", capacity: 49850, latitude: 20.6817, longitude: -103.4627 },
  { name: "BMO Field", city: "Toronto", countryCode: "CA", capacity: 45000, latitude: 43.6332, longitude: -79.4186 },
  { name: "SoFi Stadium", city: "Los Angeles", countryCode: "US", capacity: 70240, latitude: 33.9535, longitude: -118.3390 },
  { name: "Gillette Stadium", city: "Boston", countryCode: "US", capacity: 65878, latitude: 42.0909, longitude: -71.2643 },
  { name: "BC Place", city: "Vancouver", countryCode: "CA", capacity: 54500, latitude: 49.2767, longitude: -123.1118 },
  { name: "MetLife Stadium", city: "New York", countryCode: "US", capacity: 82500, latitude: 40.8128, longitude: -74.0745 },
  { name: "Levi's Stadium", city: "San Francisco", countryCode: "US", capacity: 68500, latitude: 37.4032, longitude: -121.9698 },
  { name: "Lincoln Financial Field", city: "Philadelphia", countryCode: "US", capacity: 69796, latitude: 39.9008, longitude: -75.1675 },
  { name: "NRG Stadium", city: "Houston", countryCode: "US", capacity: 72220, latitude: 29.6847, longitude: -95.4107 },
  { name: "AT&T Stadium", city: "Dallas", countryCode: "US", capacity: 80000, latitude: 32.7473, longitude: -97.0945 },
  { name: "Estadio BBVA", city: "Monterrey", countryCode: "MX", capacity: 53500, latitude: 25.6698, longitude: -100.2443 },
  { name: "Hard Rock Stadium", city: "Miami", countryCode: "US", capacity: 64767, latitude: 25.9580, longitude: -80.2389 },
  { name: "Mercedes-Benz Stadium", city: "Atlanta", countryCode: "US", capacity: 71000, latitude: 33.7554, longitude: -84.4008 },
  { name: "Lumen Field", city: "Seattle", countryCode: "US", capacity: 69000, latitude: 47.5952, longitude: -122.3316 },
  { name: "Arrowhead Stadium", city: "Kansas City", countryCode: "US", capacity: 76416, latitude: 39.0489, longitude: -94.4839 },
];

const teamsMap: Record<string, string> = {
  "Mexico": "mx", "South Africa": "za", "Korea Republic": "kr", "Czechia": "cz",
  "Canada": "ca", "Bosnia and Herzegovina": "ba", "United States": "us", "Paraguay": "py",
  "Haiti": "ht", "Scotland": "gb-sct", "Australia": "au", "Turkiye": "tr",
  "Brazil": "br", "Morocco": "ma", "Qatar": "qa", "Switzerland": "ch",
  "Cote d'Ivoire": "ci", "Ecuador": "ec", "Germany": "de", "Curacao": "cw",
  "Netherlands": "nl", "Japan": "jp", "Sweden": "se", "Tunisia": "tn",
  "Saudi Arabia": "sa", "Uruguay": "uy", "Spain": "es", "Cabo Verde": "cv",
  "IR Iran": "ir", "New Zealand": "nz", "Belgium": "be", "Egypt": "eg",
  "France": "fr", "Senegal": "sn", "Iraq": "iq", "Norway": "no",
  "Argentina": "ar", "Algeria": "dz", "Austria": "at", "Jordan": "jo",
  "Ghana": "gh", "Panama": "pa", "England": "gb-eng", "Croatia": "hr",
  "Portugal": "pt", "Congo DR": "cd", "Uzbekistan": "uz", "Colombia": "co"
};

async function main() {
  console.log('Clearing old data...')
  await prisma.ticketListing.deleteMany({})
  await prisma.match.deleteMany({})
  await prisma.team.deleteMany({})
  await prisma.stadium.deleteMany({})

  console.log('Seeding stadiums...')
  const dbStadiums = [];
  for (const s of stadiumsData) {
    const created = await prisma.stadium.create({
      data: {
        slug: s.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        name: s.name,
        city: s.city,
        countryCode: s.countryCode,
        capacity: s.capacity,
        latitude: s.latitude,
        longitude: s.longitude
      }
    });
    dbStadiums.push(created);
  }

  console.log('Seeding 48 teams...')
  const dbTeams = [];
  for (const [teamName, isoCode] of Object.entries(teamsMap)) {
    const created = await prisma.team.create({
      data: {
        name: teamName,
        slug: teamName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        countryCode: isoCode.toUpperCase(),
        flagUrl: `https://flagcdn.com/w160/${isoCode}.png`
      }
    });
    dbTeams.push(created);
  }

  const tbdTeam = await prisma.team.create({
    data: {
      name: "TBD",
      slug: "tbd",
      countryCode: "TBD",
      flagUrl: "https://flagcdn.com/w160/un.png"
    }
  });

  console.log('Reading full JSON fixtures data...')
  const fixturesDataPath = path.join(__dirname, 'world-cup-2026.json');
  const fixturesContent = fs.readFileSync(fixturesDataPath, 'utf-8');
  const tournamentData = JSON.parse(fixturesContent);
  const fixtures = tournamentData.fixtures;

  const getOrCreateTeam = async (name: string) => {
    // If it's a real team
    const team = dbTeams.find(t => t.name.toLowerCase() === name.toLowerCase());
    if (team) return team.id;
    // Otherwise it's a knockout placeholder team (e.g. Winner Match 74, Group A runners-up)
    return tbdTeam.id;
  };

  for (const fixture of fixtures) {
    const homeId = await getOrCreateTeam(fixture.homeTeam);
    const awayId = await getOrCreateTeam(fixture.awayTeam);
    
    // Find the matching stadium
    const stadium = dbStadiums.find(s => s.name.toLowerCase() === fixture.stadium.toLowerCase());
    if (!stadium) {
      console.warn(`Stadium not found for: ${fixture.stadium}`);
      continue;
    }

    const kickoffUtc = new Date(fixture.kickoffUtc);
    const month = kickoffUtc.toLocaleString('en-US', { month: 'short' }).toLowerCase();
    const day = kickoffUtc.getDate();
    
    // Formulate a slug: team-a-vs-team-b-jun-11
    const teamASlug = fixture.homeTeam.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const teamBSlug = fixture.awayTeam.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const matchSlug = `${teamASlug}-vs-${teamBSlug}-${month}-${day}`;

    // Map stage strings to the Enum
    let roundEnum: MatchRound = MatchRound.GROUP_STAGE;
    if (fixture.stage === "round-of-32") roundEnum = MatchRound.R32;
    else if (fixture.stage === "round-of-16") roundEnum = MatchRound.R16;
    else if (fixture.stage === "quarter-finals") roundEnum = MatchRound.QF;
    else if (fixture.stage === "semi-finals") roundEnum = MatchRound.SF;
    else if (fixture.stage === "third-place") roundEnum = MatchRound.THIRD_PLACE;
    else if (fixture.stage === "final") roundEnum = MatchRound.FINAL;

    const match = await prisma.match.create({
      data: {
        slug: matchSlug,
        matchNumber: fixture.matchNumber,
        round: roundEnum,
        group: fixture.group,
        kickoffUtc: kickoffUtc,
        homeTeamId: homeId,
        awayTeamId: awayId,
        stadiumId: stadium.id,
      }
    });

    let minPrice = 60, maxPrice = 620;
    if (roundEnum === MatchRound.GROUP_STAGE) { minPrice = 75; maxPrice = 2735; }
    else if (roundEnum === MatchRound.R32) { minPrice = 105; maxPrice = 750; }
    else if (roundEnum === MatchRound.R16) { minPrice = 170; maxPrice = 980; }
    else if (roundEnum === MatchRound.QF) { minPrice = 275; maxPrice = 1775; }
    else if (roundEnum === MatchRound.SF) { minPrice = 420; maxPrice = 3295; }
    else if (roundEnum === MatchRound.FINAL) { minPrice = 2030; maxPrice = 7875; }

    for (let j = 0; j < 5; j++) {
      const price = Math.floor(Math.random() * (maxPrice - minPrice + 1)) + minPrice;
      const block = Math.floor(Math.random() * 300) + 100;
      const rowNum = Math.floor(Math.random() * 26);
      const row = String.fromCharCode(65 + rowNum);

      const catNum = Math.floor(Math.random() * 4) + 1;
      let catEnum: TicketCategory = TicketCategory.CAT1;
      if (catNum === 2) catEnum = TicketCategory.CAT2;
      else if (catNum === 3) catEnum = TicketCategory.CAT3;
      else if (catNum === 4) catEnum = TicketCategory.CAT4;

      await prisma.ticketListing.create({
        data: {
          matchId: match.id,
          category: catEnum,
          section: `Block ${block}`,
          row: `Row ${row}`,
          quantity: Math.floor(Math.random() * 4) + 1,
          pricePerTicket: price,
          currency: 'USD',
          deliveryMethod: DeliveryMethod.FIFA_APP_TRANSFER,
          status: ListingStatus.ACTIVE
        }
      });
    }
  }

  console.log('Database seeded with JSON fixtures successfully.')
}

main()
  .then(async () => { await prisma.$disconnect() })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
