export default function FaqPage() {
  const faqs = [
    {
      q: "Do I need an account to buy tickets?",
      a: "No! Ticket Universe is a frictionless marketplace. You can complete your purchase entirely as a guest. We only need your email address to send you the tickets."
    },
    {
      q: "When will I receive my tickets?",
      a: "In most cases, tickets are transferred instantly. The seller has already uploaded the ticket barcodes or PDF to our secure vault, so the moment your payment clears, the tickets are dispatched to your email."
    },
    {
      q: "Are these tickets legitimate?",
      a: "Yes. All tickets sold on Ticket Universe are backed by our TixProtect Guarantee. We verify sellers and hold their funds in escrow until after the event. If there is ever an issue at the gate, we offer a 120% refund."
    },
    {
      q: "Why is there a service fee?",
      a: "The service fee (typically 10%) covers the cost of our secure payment processing, anti-fraud verification, and 24/7 customer support ensuring your tickets arrive safely."
    },
    {
      q: "Can I sell my spare tickets?",
      a: "Absolutely! Simply click 'Sell' in the navigation bar, create an account, and list your tickets. We take care of the transfer and send the payout directly to your bank account via Stripe."
    }
  ];

  return (
    <div className="min-h-screen bg-transparent py-20">
      <div className="max-w-3xl mx-auto px-6">
        <h1 className="text-4xl md:text-5xl font-black tracking-tighter mb-4 text-center">Frequently Asked Questions</h1>
        <p className="text-lg text-muted-foreground text-center mb-16">
          Everything you need to know about buying and selling tickets for the 2026 World Cup.
        </p>

        <div className="space-y-6">
          {faqs.map((faq, idx) => (
            <div key={idx} className="bg-card border border-border p-6 rounded-2xl shadow-sm">
              <h3 className="text-xl font-bold mb-3">{faq.q}</h3>
              <p className="text-muted-foreground leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
