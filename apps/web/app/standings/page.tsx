import { prisma } from "@ticketuniverse/database";
import Image from "next/image";
import Link from "next/link";

export default async function StandingsPage() {
  const teams = await prisma.team.findMany({
    orderBy: { name: 'asc' },
  });

  // Mock standings logic
  const groups = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'];
  
  // Assign teams randomly to groups just for the mock table (since our seed doesn't strictly track groups in the Team model)
  const groupedTeams = groups.map((g, idx) => {
    // Pick 4 teams for each group
    const slice = teams.slice(idx * 4, (idx * 4) + 4);
    
    // Generate mock stats
    const stats = slice.map((t, i) => ({
      ...t,
      played: 3,
      won: i === 0 ? 3 : i === 1 ? 1 : i === 2 ? 1 : 0,
      drawn: i === 1 || i === 2 ? 1 : 0,
      lost: i === 0 ? 0 : i === 1 ? 1 : i === 2 ? 1 : 3,
      gf: Math.floor(Math.random() * 5) + 2,
      ga: Math.floor(Math.random() * 5),
      pts: i === 0 ? 9 : i === 1 ? 4 : i === 2 ? 4 : 0,
    })).sort((a, b) => b.pts - a.pts);

    return { name: g, teams: stats };
  });

  return (
    <div className="min-h-screen bg-transparent">
      <div className="bg-primary text-primary-foreground py-16">
        <div className="max-w-7xl mx-auto px-6">
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter mb-4">Group Standings</h1>
          <p className="text-lg opacity-90 max-w-2xl">
            Live tables for all 12 groups of the 2026 FIFA World Cup. Top 2 from each group plus the 8 best 3rd-place teams advance to the Round of 32.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {groupedTeams.map(group => {
            if (group.teams.length === 0) return null;
            return (
              <div key={group.name} className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
                <div className="bg-muted px-4 py-3 border-b border-border font-black text-lg">
                  Group {group.name}
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="text-xs text-muted-foreground bg-muted/30">
                      <tr>
                        <th className="px-4 py-2 font-semibold">Team</th>
                        <th className="px-2 py-2 font-semibold text-center">MP</th>
                        <th className="px-2 py-2 font-semibold text-center">W</th>
                        <th className="px-2 py-2 font-semibold text-center">D</th>
                        <th className="px-2 py-2 font-semibold text-center">L</th>
                        <th className="px-2 py-2 font-semibold text-center">GD</th>
                        <th className="px-4 py-2 font-semibold text-center">Pts</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {group.teams.map((team, idx) => (
                        <tr key={team.id} className={idx < 2 ? 'bg-primary/5' : ''}>
                          <td className="px-4 py-3 font-bold flex items-center gap-2">
                            <span className="text-xs text-muted-foreground w-3">{idx + 1}</span>
                            {team.flagUrl ? (
                              <Image src={team.flagUrl} alt="flag" width={20} height={15} className="rounded-sm" />
                            ) : (
                              <div className="w-5 h-3 bg-muted rounded-sm" />
                            )}
                            <Link href={`/teams/${team.slug}`} className="hover:text-primary hover:underline">{team.name}</Link>
                          </td>
                          <td className="px-2 py-3 text-center">{team.played}</td>
                          <td className="px-2 py-3 text-center">{team.won}</td>
                          <td className="px-2 py-3 text-center">{team.drawn}</td>
                          <td className="px-2 py-3 text-center">{team.lost}</td>
                          <td className="px-2 py-3 text-center">{team.gf - team.ga > 0 ? `+${team.gf - team.ga}` : team.gf - team.ga}</td>
                          <td className="px-4 py-3 text-center font-black">{team.pts}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  );
}
