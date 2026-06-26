import Link from "next/link";
import { ShieldCheck, Cookie, Settings, Eye } from "lucide-react";

export const metadata = {
  title: "Cookie Policy | Ticket Universe",
  description: "Learn about how we use cookies and similar technologies.",
};

export default function CookiePolicyPage() {
  return (
    <div className="min-h-screen bg-transparent pt-24 pb-20">
      <div className="max-w-3xl mx-auto px-6">
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-black text-foreground mb-6">Cookie Policy</h1>
          <p className="text-xl text-muted-foreground">
            Last updated: June 26, 2026
          </p>
        </div>

        <div className="prose prose-lg dark:prose-invert max-w-none space-y-10">
          <section className="bg-card border border-border rounded-2xl p-8 shadow-sm">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary shrink-0">
                <Cookie className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-bold m-0">What are cookies?</h2>
            </div>
            <p className="text-muted-foreground">
              Cookies are small text files that are stored on your computer or mobile device when you visit a website. They are widely used to make websites work or work more efficiently, as well as to provide reporting information and personalize your experience.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">How we use cookies</h2>
            <p className="text-muted-foreground mb-6">
              Ticket Universe uses cookies and similar technologies for several purposes, including:
            </p>
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="bg-background border border-border rounded-xl p-6">
                <ShieldCheck className="w-8 h-8 text-primary mb-4" />
                <h3 className="font-bold text-lg mb-2">Essential Cookies</h3>
                <p className="text-muted-foreground text-sm">
                  Required for the website to function properly. These include cookies that enable you to log into secure areas of our website, use a shopping cart, or make use of e-billing services.
                </p>
              </div>
              <div className="bg-background border border-border rounded-xl p-6">
                <Settings className="w-8 h-8 text-primary mb-4" />
                <h3 className="font-bold text-lg mb-2">Functional Cookies</h3>
                <p className="text-muted-foreground text-sm">
                  Used to recognize you when you return to our website. This enables us to personalize our content for you, greet you by name, and remember your preferences.
                </p>
              </div>
              <div className="bg-background border border-border rounded-xl p-6">
                <Eye className="w-8 h-8 text-primary mb-4" />
                <h3 className="font-bold text-lg mb-2">Analytical Cookies</h3>
                <p className="text-muted-foreground text-sm">
                  Allow us to recognize and count the number of visitors and to see how visitors move around our website when they are using it. This helps us to improve the way our website works.
                </p>
              </div>
            </div>
          </section>

          <section className="bg-muted/50 rounded-2xl p-8">
            <h2 className="text-2xl font-bold mb-4">Managing your cookie preferences</h2>
            <p className="text-muted-foreground mb-4">
              Most web browsers allow you to manage your cookie preferences. You can set your browser to refuse cookies, or delete certain cookies. Generally, you should also be able to manage similar technologies in the same way that you manage cookies—using your browser's preferences.
            </p>
            <p className="text-muted-foreground">
              Please note that if you choose to block cookies, doing so may impair the Ticket Universe website or prevent certain elements of it from functioning.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Contact Us</h2>
            <p className="text-muted-foreground">
              If you have any questions about our use of cookies, please contact us at <a href="mailto:privacy@ticketuniverse.com" className="text-primary hover:underline">privacy@ticketuniverse.com</a>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
