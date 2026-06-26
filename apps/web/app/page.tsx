import DemoOne from "@/components/ui/demo";
import { prisma } from "@ticketuniverse/database";

import TrustBar from "@/components/home/TrustBar";
import UpcomingMatchesCarousel from "@/components/home/UpcomingMatchesCarousel";
import BrowseByTeam from "@/components/home/BrowseByTeam";
import BrowseByCity from "@/components/home/BrowseByCity";
import CategoriesExplainer from "@/components/home/CategoriesExplainer";
import HowItWorks from "@/components/home/HowItWorks";
import BuyerProtection from "@/components/home/BuyerProtection";
import TournamentInfo from "@/components/home/TournamentInfo";
import FaqAccordion from "@/components/home/FaqAccordion";

export default async function Home() {
  const upcomingMatches = await prisma.match.findMany({
    where: {
      kickoffUtc: {
        gt: new Date()
      }
    },
    include: {
      homeTeam: true,
      awayTeam: true,
      stadium: true,
    },
    take: 12,
    orderBy: { kickoffUtc: 'asc' }
  });

  const dbTeams = await prisma.team.findMany({
    include: {
      _count: {
        select: { homeMatches: true, awayMatches: true }
      }
    }
  });

  const teamsWithCount = dbTeams.map(t => ({
    id: t.id,
    name: t.name,
    slug: t.slug,
    countryCode: t.countryCode,
    flagUrl: t.flagUrl,
    confederation: t.confederation,
    matchCount: t._count.homeMatches + t._count.awayMatches
  }));

  const dbStadiums = await prisma.stadium.findMany({
    include: {
      _count: {
        select: { matches: true }
      }
    }
  });

  const stadiumsWithCount = dbStadiums.map(s => ({
    id: s.id,
    name: s.name,
    slug: s.slug,
    city: s.city,
    countryCode: s.countryCode,
    imageUrl: s.imageUrl,
    matchCount: s._count.matches
  }));

  return (
    <main className="flex min-h-screen flex-col items-center justify-start w-full bg-transparent overflow-hidden">
      <div className="w-full relative h-[100vh] bg-background z-10">
        <DemoOne />
      </div>
      
      <TrustBar />
      <UpcomingMatchesCarousel matches={upcomingMatches} />
      <BrowseByTeam teams={teamsWithCount} />
      <BrowseByCity stadiums={stadiumsWithCount} />
      <CategoriesExplainer />
      <HowItWorks />
      <BuyerProtection />
      <TournamentInfo />
      <FaqAccordion />
    </main>
  );
}
