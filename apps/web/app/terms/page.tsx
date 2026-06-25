export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background py-20">
      <div className="max-w-3xl mx-auto px-6 prose prose-lg dark:prose-invert">
        <h1 className="text-4xl md:text-5xl font-black tracking-tighter mb-4 not-prose">Terms of Service</h1>
        <p className="text-muted-foreground mb-8 not-prose">Last updated: June 25, 2026</p>

        <p>Please read these Terms of Service ("Terms", "Terms of Service") carefully before using the Ticket Universe website (the "Service") operated by Ticket Universe Inc.</p>

        <h2>1. Ticket Marketplace</h2>
        <p>Ticket Universe acts as an intermediary between buyers and sellers. We do not own the tickets sold on the platform. All ticket prices are set by the sellers and may be above or below face value.</p>

        <h2>2. TixProtect Guarantee</h2>
        <p>All purchases are covered by our TixProtect Guarantee. If you receive invalid tickets, or if the seller fails to deliver the tickets in time for the event, we will refund you 120% of your purchase price or find replacement tickets of equal or greater value.</p>

        <h2>3. Seller Obligations</h2>
        <p>Sellers must possess the tickets they list. Failure to deliver tickets sold on our platform will result in account termination and potential legal action to recover the costs of replacing the buyer's tickets.</p>

        <h2>4. Refunds & Cancellations</h2>
        <p>All sales are final. Refunds are only issued if an event is permanently cancelled and not rescheduled, or if the seller defaults on their delivery obligations under the TixProtect Guarantee.</p>
      </div>
    </div>
  );
}