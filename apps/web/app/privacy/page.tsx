export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background py-20">
      <div className="max-w-3xl mx-auto px-6 prose prose-lg dark:prose-invert">
        <h1 className="text-4xl md:text-5xl font-black tracking-tighter mb-4 not-prose">Privacy Policy</h1>
        <p className="text-muted-foreground mb-8 not-prose">Last updated: June 25, 2026</p>

        <p>Your privacy is important to us. It is Ticket Universe's policy to respect your privacy regarding any information we may collect from you across our website, http://www.ticketuniverse.com, and other sites we own and operate.</p>

        <h2>1. Information We Collect</h2>
        <p>We only ask for personal information when we truly need it to provide a service to you. We collect it by fair and lawful means, with your knowledge and consent. We also let you know why we're collecting it and how it will be used.</p>
        <p>When you checkout as a guest, we only retain your email address and name for the purpose of ticket delivery and fraud prevention.</p>

        <h2>2. Data Retention & Security</h2>
        <p>We only retain collected information for as long as necessary to provide you with your requested service. What data we store, we'll protect within commercially acceptable means to prevent loss and theft, as well as unauthorized access, disclosure, copying, use or modification.</p>

        <h2>3. Third-Party Sharing</h2>
        <p>We don't share any personally identifying information publicly or with third-parties, except when required to by law, or with our payment processor Stripe to facilitate secure transactions.</p>
      </div>
    </div>
  );
}