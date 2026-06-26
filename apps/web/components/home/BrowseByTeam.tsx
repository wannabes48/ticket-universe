import Link from "next/link";
import Image from "next/image";

interface TeamWithCount {
  id: string;
  name: string;
  slug: string;
  countryCode: string;
  flagUrl: string | null;
  confederation: string | null;
  matchCount: number;
}

export default function BrowseByTeam({ teams }: { teams: TeamWithCount[] }) {
  // Hardcode missing confederations based on geography for the MVP grid grouping
  const enrichConfederation = (teamName: string) => {
    const name = teamName.toLowerCase();
    if (['usa', 'united states', 'mexico', 'canada', 'haiti', 'curaçao'].includes(name)) return 'CONCACAF';
    if (['brazil', 'argentina', 'paraguay', 'ecuador'].includes(name)) return 'CONMEBOL';
    if (['germany', 'netherlands', 'spain', 'sweden', 'belgium', 'switzerland', 'scotland', 'czechia', 'bosnia'].some(x => name.includes(x))) return 'UEFA';
    if (['morocco', 'south africa', "côte d'ivoire", 'tunisia'].includes(name)) return 'CAF';
    if (['japan', 'south korea', 'qatar', 'australia', 'türkiye', 'saudi arabia', 'ir iran'].some(x => name.includes(x))) return 'AFC';
    return 'UEFA'; // fallback
  };

  const enrichedTeams = teams.map(t => ({
    ...t,
    confederation: t.confederation || enrichConfederation(t.name)
  }));

  const grouped = enrichedTeams.reduce((acc, team) => {
    const conf = team.confederation || 'Other';
    if (!acc[conf]) acc[conf] = [];
    acc[conf].push(team);
    return acc;
  }, {} as Record<string, typeof enrichedTeams>);

  const confederations = ['UEFA', 'CONMEBOL', 'CONCACAF', 'CAF', 'AFC', 'OFC'];

  return (
    <div className="w-full py-20 bg-muted/30">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-12 text-center max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold text-foreground mb-4">Browse by Team</h2>
          <p className="text-muted-foreground">Follow your nation. 48 teams divided by their global confederation. Find tickets for all group stage and knockout matches.</p>
        </div>

        <div className="space-y-12">
          {confederations.map(conf => {
            const confTeams = grouped[conf];
            if (!confTeams || confTeams.length === 0) return null;

            return (
              <div key={conf}>
                <h3 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
                  <span className="w-8 h-1 bg-primary rounded-full"></span>
                  {conf}
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {confTeams.map(team => (
                    <Link href={`/teams/${team.slug}`} key={team.id} className="group">
                      <div className="bg-card border border-border rounded-xl p-4 flex flex-col items-center text-center hover:shadow-md transition-all hover:-translate-y-1 hover:border-primary/50">
                        <div className="w-12 h-8 relative bg-muted mb-3 border border-border shadow-sm flex items-center justify-center overflow-hidden rounded-sm">
                          {team.flagUrl ? (
                            <Image src={team.flagUrl} alt={team.name} fill className="object-cover" />
                          ) : (
                            <span className="text-xs font-bold text-muted-foreground">{team.countryCode}</span>
                          )}
                        </div>
                        <span className="font-semibold text-sm mb-2 line-clamp-1 group-hover:text-primary transition-colors">{team.name}</span>
                        <span className="text-xs font-medium bg-muted px-2 py-1 rounded text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                          {team.matchCount} Matches
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  );
}
