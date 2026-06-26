"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function FaqAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: "Do I need to create an account to buy tickets?",
      answer: "No! Ticket Universe is designed for frictionless access. You can browse, select seats, and purchase tickets as a guest. Your tickets will be sent directly to your email address."
    },
    {
      question: "Are the tickets guaranteed to be authentic?",
      answer: "Yes. Every ticket sold on Ticket Universe is covered by our 100% Buyer Guarantee. We vet sellers and monitor transactions to ensure you receive valid entry to the match."
    },
    {
      question: "When will I receive my tickets?",
      answer: "Ticket delivery times vary by match and seller. Most mobile E-Tickets are transferred instantly or within a few hours of purchase. We guarantee delivery in time for the event."
    },
    {
      question: "Can I sell my own tickets on this platform?",
      answer: "Yes, you can register as a verified seller to list your tickets. Click the 'Sell Tickets' button in the navigation bar to begin the quick verification process."
    },
    {
      question: "What happens if a match is postponed or cancelled?",
      answer: "If a match is cancelled, you will receive a full refund automatically. If it is postponed, your tickets will remain valid for the rescheduled date."
    },
    {
      question: "What payment methods are accepted?",
      answer: "We accept all major credit/debit cards (Visa, Mastercard, Amex), Apple Pay, Google Pay, and PayPal through our secure Stripe payment gateway."
    }
  ];

  return (
    <div className="w-full py-24 bg-transparent">
      <div className="max-w-3xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">Frequently Asked Questions</h2>
          <p className="text-muted-foreground">Everything you need to know about buying and selling World Cup 2026 tickets.</p>
        </div>

        <div className="space-y-4 mb-10">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div key={index} className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="w-full flex items-center justify-between p-6 text-left focus:outline-none hover:bg-muted/30 transition-colors"
                >
                  <span className="font-bold text-foreground pr-8">{faq.question}</span>
                  <ChevronDown className={`w-5 h-5 text-muted-foreground transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
                </button>
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="p-6 pt-0 text-muted-foreground leading-relaxed border-t border-border">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        <div className="text-center">
          <Link href="/faq" className="text-primary font-bold hover:underline">
            See all FAQs &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
}
