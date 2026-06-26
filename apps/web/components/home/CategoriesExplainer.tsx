import Image from "next/image";

export default function CategoriesExplainer() {
  const categories = [
    {
      id: "Category 1",
      icon: "/icons/movie-ticket.png",
      desc: "Premium central seating along the touchlines. The best views in the stadium.",
      color: "border-yellow-500"
    },
    {
      id: "Category 2",
      icon: "/icons/icon-seats.png",
      desc: "Excellent views located in the corners or adjacent to the central areas.",
      color: "border-blue-500"
    },
    {
      id: "Category 3",
      icon: "/icons/people.png",
      desc: "Standard seating located behind the goals in the lower and upper tiers.",
      color: "border-green-500"
    },
    {
      id: "Category 4",
      icon: "/icons/icon-ticket.png",
      desc: "Outermost seating areas offering budget-friendly access to the match.",
      color: "border-muted-foreground"
    }
  ];

  const accessibility = [
    "Wheelchair User", "Easy Access Standard", "Easy Access Amenity", "Companion Ticket"
  ];

  return (
    <div className="w-full py-20 bg-muted/30">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-foreground mb-4">Ticket Categories Explained</h2>
          <p className="text-muted-foreground">World Cup 2026 tickets are divided into four main categories based on location and view quality.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {categories.map(cat => (
            <div key={cat.id} className={`bg-card border-t-4 ${cat.color} rounded-b-xl border-x border-b p-6 shadow-sm`}>
              <div className="flex items-center gap-3 mb-4">
                <Image src={cat.icon} alt={cat.id} width={36} height={36} className="object-contain" />
                <h3 className="font-bold text-lg">{cat.id}</h3>
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed">{cat.desc}</p>
            </div>
          ))}
        </div>

        <div className="bg-primary/5 border border-primary/20 rounded-xl p-8 flex flex-col md:flex-row items-center gap-8">
          <div className="flex-shrink-0 bg-primary/10 p-4 rounded-full">
            <Image src="/icons/wheelchair-access.png" alt="Accessibility" width={40} height={40} className="object-contain" />
          </div>
          <div>
            <h3 className="text-xl font-bold mb-2">Accessibility Tickets</h3>
            <p className="text-muted-foreground mb-4">Dedicated ticketing options are available for disabled people and people with limited mobility.</p>
            <div className="flex flex-wrap gap-2">
              {accessibility.map(type => (
                <span key={type} className="bg-background border border-border px-3 py-1 rounded-full text-sm font-medium text-foreground">
                  {type}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
