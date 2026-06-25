import Link from "next/link";
import Image from "next/image";

interface TeamFlagCardProps {
  team: {
    name: string;
    slug: string;
    countryCode: string;
    flagUrl: string | null;
  };
  matchCount: number;
}

export function TeamFlagCard({ team, matchCount }: TeamFlagCardProps) {
  return (
    <Link href={`/teams/${team.slug}`} className="group block">
      <div className="bg-card border border-border rounded-2xl p-6 flex flex-col items-center text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1 relative overflow-hidden">
        
        {/* Animated background glow */}
        <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/5 transition-colors duration-500" />
        
        <div className="w-24 h-24 relative bg-white rounded-full p-2 shadow-sm border-2 border-border mb-4 flex items-center justify-center overflow-hidden group-hover:border-primary/50 transition-colors z-10">
          {team.flagUrl ? (
            <Image src={team.flagUrl} alt={team.name} fill className="object-cover" />
          ) : (
            <div className="text-muted-foreground font-black text-2xl">{team.countryCode}</div>
          )}
        </div>
        
        <h3 className="font-black text-xl mb-1 text-foreground group-hover:text-primary transition-colors z-10">{team.name}</h3>
        <p className="text-sm font-semibold text-muted-foreground z-10">{matchCount} {matchCount === 1 ? 'Match' : 'Matches'}</p>
      </div>
    </Link>
  );
}
