import { Mail, MessageSquare, Phone } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-transparent py-20">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-4">Contact Support</h1>
          <p className="text-xl text-muted-foreground">We're here 24/7 to help you secure your seats.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="bg-card border border-border p-8 rounded-2xl text-center">
            <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-4"><MessageSquare /></div>
            <h3 className="font-bold mb-2">Live Chat</h3>
            <p className="text-sm text-muted-foreground mb-4">Fastest response time.</p>
            <button className="text-primary font-bold hover:underline">Start Chat</button>
          </div>
          <div className="bg-card border border-border p-8 rounded-2xl text-center">
            <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-4"><Mail /></div>
            <h3 className="font-bold mb-2">Email Support</h3>
            <p className="text-sm text-muted-foreground mb-4">Responses within 2 hours.</p>
            <a href="mailto:support@ticketuniverse.com" className="text-primary font-bold hover:underline">support@ticketuniverse.com</a>
          </div>
          <div className="bg-card border border-border p-8 rounded-2xl text-center">
            <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-4"><Phone /></div>
            <h3 className="font-bold mb-2">Phone</h3>
            <p className="text-sm text-muted-foreground mb-4">For urgent match-day issues.</p>
            <a href="tel:+18005550199" className="text-primary font-bold hover:underline">+1 (800) 555-0199</a>
          </div>
        </div>

        <div className="max-w-2xl mx-auto bg-card border border-border p-8 rounded-3xl shadow-sm">
          <h2 className="text-2xl font-bold mb-6 text-center">Send us a message</h2>
          <form className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-bold mb-1 block">Name</label>
                <input type="text" className="w-full bg-background border border-border rounded-lg px-4 py-3" placeholder="John Doe" />
              </div>
              <div>
                <label className="text-sm font-bold mb-1 block">Email</label>
                <input type="email" className="w-full bg-background border border-border rounded-lg px-4 py-3" placeholder="john@example.com" />
              </div>
            </div>
            <div>
              <label className="text-sm font-bold mb-1 block">Order Reference (Optional)</label>
              <input type="text" className="w-full bg-background border border-border rounded-lg px-4 py-3" placeholder="TUNI-2026-..." />
            </div>
            <div>
              <label className="text-sm font-bold mb-1 block">Message</label>
              <textarea rows={5} className="w-full bg-background border border-border rounded-lg px-4 py-3 resize-none" placeholder="How can we help?"></textarea>
            </div>
            <button type="button" className="w-full bg-primary text-primary-foreground py-4 rounded-xl font-bold text-lg hover:bg-primary/90 transition-colors">Send Message</button>
          </form>
        </div>
      </div>
    </div>
  );
}
