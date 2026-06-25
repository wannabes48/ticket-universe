export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background py-20">
      <div className="max-w-4xl mx-auto px-6 prose prose-lg dark:prose-invert">
        <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-8 text-center not-prose">About Ticket Universe</h1>
        
        <p className="lead text-xl text-muted-foreground text-center mb-12 not-prose">
          We believe the world's biggest tournament deserves the world's best ticket marketplace.
        </p>

        <h2>Our Mission</h2>
        <p>
          Ticket Universe was founded with a singular goal: to eliminate the friction from secondary ticketing. For decades, fans have been subjected to forced account creations, hidden fees, and rampant fraud when trying to buy tickets to their favorite matches. We built Ticket Universe to fix that.
        </p>

        <h2>The 2026 Vision</h2>
        <p>
          The 2026 FIFA World Cup is the largest sporting event in history, spanning three countries, 16 cities, and 104 matches. The logistical challenge for fans is immense. We provide a clean, blazing-fast platform where you can search by team, city, or date, and checkout as a guest in under 60 seconds.
        </p>

        <h2>Trust & Security</h2>
        <p>
          As a secondary marketplace, trust is our most valuable asset. We employ state-of-the-art fraud detection, cryptographic ticket verification, and the robust Stripe payment infrastructure. Our TixProtect Guarantee ensures that if you buy a ticket on our platform, you <em>will</em> get into the stadium, or you will be fully compensated.
        </p>
      </div>
    </div>
  );
}