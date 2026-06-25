export function getPricingForRound(round: string) {
  switch (round) {
    case 'Group Stage':
      return { min: 100, mid: 300, max: 575 };
    case 'Round of 32':
      return { min: 190, mid: 400, max: 790 };
    case 'Round of 16':
      return { min: 220, mid: 500, max: 980 };
    case 'Quarter Finals':
      return { min: 410, mid: 900, max: 1775 };
    case 'Semi Finals':
      return { min: 455, mid: 1500, max: 3295 };
    case 'Third Place Play-off':
      return { min: 165, mid: 500, max: 1000 };
    case 'Final':
      return { min: 2030, mid: 6000, max: 10990 };
    default:
      return { min: 100, mid: 300, max: 575 };
  }
}

export function getTicketCategories(round: string) {
  const prices = getPricingForRound(round);
  return [
    { id: 'cat-1', name: 'Category 1', price: prices.max, available: 120, description: 'Prime seating along the touchline & VIP Hospitality' },
    { id: 'cat-2', name: 'Category 2', price: prices.mid, available: 340, description: 'Corners and lower behind goals' },
    { id: 'cat-3', name: 'Category 3', price: prices.min, available: 850, description: 'Upper tiers behind goals' },
  ];
}
