const fs = require('fs');
const path = require('path');

const pages = [
  { route: 'schedule', title: 'Schedule', desc: 'Full 104-match calendar.' },
  { route: 'standings', title: 'Standings', desc: 'Live/static group standings table.' },
  { route: 'how-it-works', title: 'How It Works', desc: 'Buyer and seller journeys explained.' },
  { route: 'buyer-protection', title: 'Buyer Protection', desc: 'Ticket Universe Protect-style guarantee.' },
  { route: 'faq', title: 'FAQ', desc: 'Frequently Asked Questions.' },
  { route: 'about', title: 'About Us', desc: 'About Ticket Universe, mission, and trust signals.' },
  { route: 'contact', title: 'Contact Us', desc: 'Contact form and live chat.' },
  { route: 'terms', title: 'Terms and Conditions', desc: 'Platform terms of service.' },
  { route: 'privacy', title: 'Privacy Policy', desc: 'How we handle your data.' },
  { route: 'sell', title: 'Sell Tickets', desc: 'Landing page for sellers.' },
  { route: 'sell/list', title: 'List a Ticket', desc: 'Ticket listing form for verified sellers.' },
  { route: 'account', title: 'My Account', desc: 'Order history, saved listings, settings.' },
  { route: 'admin', title: 'Admin Dashboard', desc: 'Orders, listings, users, payouts, disputes.' },
];

const baseDir = path.join(__dirname, '..', 'apps', 'web', 'app');

pages.forEach(p => {
  const dirPath = path.join(baseDir, p.route);
  fs.mkdirSync(dirPath, { recursive: true });
  
  const content = `export default function Page() {
  return (
    <div className="min-h-screen pt-24 pb-20 bg-background text-foreground flex flex-col items-center justify-center px-6 text-center">
      <h1 className="text-4xl font-bold mb-4">${p.title}</h1>
      <p className="text-xl text-muted-foreground mb-8 max-w-2xl">${p.desc}</p>
      <div className="bg-card border border-border rounded-xl p-12 shadow-sm">
        <p className="text-muted-foreground italic">This page is currently under construction. Please check back later.</p>
      </div>
    </div>
  );
}`;

  fs.writeFileSync(path.join(dirPath, 'page.tsx'), content);
});

console.log('Successfully scaffolded static and placeholder pages!');
