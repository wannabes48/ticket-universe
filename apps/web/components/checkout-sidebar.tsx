"use client";

import { useState, useEffect } from "react";
import { CreditCard, User, Mail, ShieldCheck, ArrowRight, ArrowLeft, ShieldAlert, CheckCircle2, Lock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { CustomSpinner } from "./ui/custom-spinner";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/button";
import { CustomSelect } from "@/components/custom-select";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');

function StripePaymentForm({ onSuccess, setIsProcessing }: { onSuccess: () => void, setIsProcessing: (v: boolean) => void }) {
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setIsProcessing(true);
    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/checkout/success`,
      },
      redirect: 'if_required'
    });

    if (error) {
      console.error(error);
      setIsProcessing(false);
    } else {
      setIsProcessing(false);
      onSuccess();
    }
  };

  return (
    <form id="payment-form" onSubmit={handleSubmit} className="p-4 border border-border rounded-xl bg-background space-y-4">
      <PaymentElement options={{ layout: 'tabs' }} />
    </form>
  );
}

export default function CheckoutSidebar({ match, categories }: { match: any, categories: any[] }) {
  const [step, setStep] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(2);
  
  const [buyerDetails, setBuyerDetails] = useState({ firstName: '', lastName: '', email: '', phone: '', country: '', createAccount: false });
  const [ticketHolders, setTicketHolders] = useState<{firstName: string, lastName: string}[]>(Array(10).fill({firstName: '', lastName: ''}));
  
  const [refundProtection, setRefundProtection] = useState(false);
  const [orderRef, setOrderRef] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<'success' | 'processing' | 'failed' | null>(null);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes countdown

  // Math
  const currentCategory = categories.find(c => c.id === selectedCategory);
  const subtotal = currentCategory ? currentCategory.price * quantity : 0;
  const serviceFee = subtotal * 0.03; // 3%
  const protectionFee = refundProtection ? (subtotal + serviceFee) * 0.07 : 0;
  const total = subtotal + serviceFee + protectionFee;

  const nextStep = () => setStep(s => Math.min(s + 1, 5));
  const prevStep = () => setStep(s => Math.max(s - 1, 1));

  useEffect(() => {
    const saved = localStorage.getItem('tuni_checkout_state');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.buyerDetails && !buyerDetails.email) setBuyerDetails(parsed.buyerDetails);
        if (parsed.orderRef && !orderRef) setOrderRef(parsed.orderRef);
      } catch (e) {}
    }

    const clientSecretFromUrl = new URLSearchParams(window.location.search).get('payment_intent_client_secret');
    if (clientSecretFromUrl) {
      setStep(5);
      stripePromise.then(stripe => {
        if (!stripe) return;
        stripe.retrievePaymentIntent(clientSecretFromUrl).then(({ paymentIntent }) => {
          if (!paymentIntent) return;
          if (paymentIntent.status === 'succeeded') {
            setPaymentStatus('success');
          } else if (paymentIntent.status === 'processing') {
            setPaymentStatus('processing');
          } else {
            setPaymentStatus('failed');
          }
        });
      });
    }
  }, []);

  useEffect(() => {
    if (new URLSearchParams(window.location.search).get('payment_intent_client_secret')) return; // skip updating URL if returning from Stripe
    let url = `/matches/${match.id}`;
    if (step === 1) url = `/matches/${match.id}/checkout`;
    if (step === 2) url = `/checkout/details`;
    if (step === 3) url = `/checkout/protection`;
    if (step === 4) url = `/checkout/payment`;
    if (step === 5) url = `/checkout/confirmation`;
    
    window.history.pushState({}, '', url);
  }, [step, match.id]);

  useEffect(() => {
    if (step === 5 || timeLeft <= 0) return;
    const timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
    return () => clearInterval(timer);
  }, [step, timeLeft]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const preparePayment = async () => {
    setIsProcessing(true);
    try {
      const newOrderRef = `TUNI-2026-${Math.floor(1000000 + Math.random() * 9000000)}`;
      setOrderRef(newOrderRef);
      localStorage.setItem('tuni_checkout_state', JSON.stringify({ buyerDetails, orderRef: newOrderRef }));

      const res = await fetch('/api/checkout/payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          amount: total, 
          listingId: currentCategory?.lowestPriceListingId,
          buyerDetails,
          ticketHolders,
          quantity,
          subtotal,
          serviceFee,
          refundProtection,
          orderRef: newOrderRef
        })
      });
      const data = await res.json();
      setClientSecret(data.clientSecret);
      nextStep();
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  const updateHolder = (index: number, field: 'firstName'|'lastName', value: string) => {
    const newHolders = [...ticketHolders];
    newHolders[index] = { ...newHolders[index], [field]: value };
    setTicketHolders(newHolders);
  };

  const useBuyerDetails = () => {
    updateHolder(0, 'firstName', buyerDetails.firstName);
    updateHolder(0, 'lastName', buyerDetails.lastName);
  };

  if (step === 5) {
    return (
      <div className="bg-card border border-border rounded-2xl shadow-xl overflow-hidden flex flex-col h-[650px] items-center justify-center p-8 text-center relative">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary to-blue-500" />
        
        {paymentStatus === 'processing' ? (
          <>
            <div className="w-24 h-24 bg-blue-500/10 text-blue-500 rounded-full flex items-center justify-center mb-6">
              <CustomSpinner className="w-12 h-12" />
            </div>
            <h2 className="text-3xl font-black mb-2">Processing Payment</h2>
            <p className="text-muted-foreground mb-6">We are waiting for confirmation from your bank or payment provider. You'll receive an email as soon as it's confirmed!</p>
          </>
        ) : paymentStatus === 'failed' ? (
          <>
            <div className="w-24 h-24 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mb-6">
              <ShieldAlert className="w-12 h-12" />
            </div>
            <h2 className="text-3xl font-black mb-2 text-red-500">Payment Failed</h2>
            <p className="text-muted-foreground mb-6">Your payment was declined or canceled. Please try a different payment method.</p>
            <Button onClick={() => setStep(4)} className="w-full max-w-xs">Try Again</Button>
          </>
        ) : (
          <>
            <div className="w-24 h-24 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mb-6">
              <CheckCircle2 className="w-12 h-12" />
            </div>
            
            <h2 className="text-3xl font-black mb-2">Tickets Secured!</h2>
            <p className="text-muted-foreground mb-6">Your digital tickets have been securely sent to <strong>{buyerDetails.email || 'your email'}</strong>.</p>
            
            <div className="bg-muted p-4 rounded-xl border border-border w-full mb-8">
              <p className="text-sm text-muted-foreground uppercase tracking-wider mb-1">Order Reference</p>
              <p className="font-mono text-xl font-bold text-foreground">{orderRef}</p>
            </div>

            {!buyerDetails.createAccount && (
              <div className="bg-primary/5 border border-primary/20 rounded-xl p-6 w-full text-left mb-6">
                <h4 className="font-bold mb-2 flex items-center gap-2"><User className="w-4 h-4 text-primary"/> Track Your Order</h4>
                <p className="text-sm text-muted-foreground mb-4">Set a password to easily access and download your tickets at any time.</p>
                <div className="flex gap-2">
                  <input type="password" placeholder="Create password" className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
                  <button className="bg-primary text-primary-foreground px-4 py-2 rounded-lg font-bold text-sm whitespace-nowrap">Save</button>
                </div>
              </div>
            )}

            <button onClick={() => { setStep(1); window.history.pushState({}, '', `/matches/${match.id}`); }} className="font-bold text-primary hover:underline">
              Return to Match
            </button>
          </>
        )}
      </div>
    );
  }

  if (timeLeft === 0 && step !== 5) {
    return (
      <div className="bg-card border border-border rounded-2xl shadow-xl overflow-hidden flex flex-col h-[650px] items-center justify-center p-8 text-center relative">
        <div className="w-24 h-24 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mb-6">
          <ShieldAlert className="w-12 h-12" />
        </div>
        <h2 className="text-3xl font-black mb-2 text-red-500">Session Expired</h2>
        <p className="text-muted-foreground mb-6">You took longer than 10 minutes to complete the checkout. For fairness to other fans, your tickets have been released.</p>
        <button onClick={() => window.location.reload()} className="w-full max-w-xs bg-primary text-primary-foreground py-3 rounded-xl font-bold hover:bg-primary/90 transition-colors">
          Start Over
        </button>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-2xl shadow-xl overflow-hidden flex flex-col h-[650px]">
      <div className="bg-muted p-6 border-b border-border flex-shrink-0">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Image src="/custom-ticket.png" alt="Ticket" width={24} height={24} className="shrink-0" /> {step === 4 ? "Secure Checkout" : "Buy Tickets"}
          </h2>
          <div className="flex items-center gap-1.5 text-sm font-bold bg-background px-3 py-1.5 rounded-lg border border-border text-foreground shadow-sm">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            {formatTime(timeLeft)}
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="flex items-center justify-between relative">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-border rounded-full -z-10" />
          <div className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-primary rounded-full -z-10 transition-all duration-300" style={{ width: `${((step - 1) / 3) * 100}%` }} />
          
          {[1, 2, 3, 4].map(i => (
            <div key={i} className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${step >= i ? 'bg-primary text-primary-foreground shadow-md' : 'bg-background border border-border text-muted-foreground'}`}>
              {i}
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 relative hide-scrollbar">
        <AnimatePresence mode="wait">
          
          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6 pb-6">
              <div>
                <h3 className="font-semibold text-lg mb-4">Select Category</h3>
                <div className="space-y-3">
                  {categories.map(cat => (
                    <div 
                      key={cat.id} 
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${selectedCategory === cat.id ? 'border-primary bg-primary/5 shadow-sm' : 'border-border hover:border-primary/50 bg-background'}`}
                    >
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-bold text-foreground">{cat.name}</span>
                        <span className="font-bold text-primary">${cat.price}</span>
                      </div>
                      <div className="text-sm text-muted-foreground">{cat.description}</div>
                    </div>
                  ))}
                </div>
              </div>
              
              {selectedCategory && (
                <div className="pt-4 border-t border-border">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-lg">Quantity</h3>
                    <div className="flex items-center gap-4 bg-muted p-1 rounded-full border border-border">
                      <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-8 h-8 rounded-full bg-background flex items-center justify-center text-lg shadow-sm hover:text-primary transition-colors">-</button>
                      <span className="font-bold w-6 text-center">{quantity}</span>
                      <button onClick={() => setQuantity(Math.min(10, quantity + 1))} className="w-8 h-8 rounded-full bg-background flex items-center justify-center text-lg shadow-sm hover:text-primary transition-colors">+</button>
                    </div>
                  </div>

                  <div className="bg-muted rounded-xl p-4 space-y-2 text-sm border border-border">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{quantity} × {currentCategory?.name}</span>
                      <span className="font-medium">${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Service Fee</span>
                      <span className="font-medium">${serviceFee.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between border-t border-border pt-2 mt-2 font-bold text-base">
                      <span>Total</span>
                      <span className="text-primary">${total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6 pb-6">
              <div>
                <h3 className="font-semibold text-lg mb-1">Buyer Details</h3>
                <p className="text-sm text-muted-foreground mb-4">No account required. We need this to send your tickets.</p>
                
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-bold text-muted-foreground uppercase mb-1 block">First Name</label>
                      <input type="text" className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary" value={buyerDetails.firstName} onChange={e => setBuyerDetails({...buyerDetails, firstName: e.target.value})} />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-muted-foreground uppercase mb-1 block">Last Name</label>
                      <input type="text" className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary" value={buyerDetails.lastName} onChange={e => setBuyerDetails({...buyerDetails, lastName: e.target.value})} />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-muted-foreground uppercase mb-1 block">Email Address</label>
                    <input type="email" className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary" value={buyerDetails.email} onChange={e => setBuyerDetails({...buyerDetails, email: e.target.value})} />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-bold text-muted-foreground uppercase mb-1 block">Phone</label>
                      <input type="tel" className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary" value={buyerDetails.phone} onChange={e => setBuyerDetails({...buyerDetails, phone: e.target.value})} />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-muted-foreground uppercase mb-1 block">Country</label>
                      <CustomSelect 
                        options={[
                          { value: "US", label: "United States" },
                          { value: "GB", label: "United Kingdom" },
                          { value: "CA", label: "Canada" },
                          { value: "MX", label: "Mexico" },
                          { value: "FR", label: "France" },
                          { value: "DE", label: "Germany" },
                          { value: "BR", label: "Brazil" },
                          { value: "AR", label: "Argentina" },
                          { value: "ES", label: "Spain" },
                          { value: "IT", label: "Italy" },
                          { value: "AU", label: "Australia" },
                          { value: "JP", label: "Japan" },
                          { value: "KR", label: "South Korea" },
                          { value: "NG", label: "Nigeria" },
                          { value: "ZA", label: "South Africa" },
                          { value: "CO", label: "Colombia" },
                          { value: "CL", label: "Chile" },
                          { value: "PT", label: "Portugal" },
                          { value: "NL", label: "Netherlands" },
                          { value: "SA", label: "Saudi Arabia" },
                        ]}
                        value={buyerDetails.country}
                        onChange={(val) => setBuyerDetails({...buyerDetails, country: val})}
                        placeholder="Select Country..."
                      />
                    </div>
                  </div>
                  <label className="flex items-center gap-2 mt-4 cursor-pointer">
                    <input type="checkbox" className="w-4 h-4 accent-primary rounded border-border" checked={buyerDetails.createAccount} onChange={e => setBuyerDetails({...buyerDetails, createAccount: e.target.checked})} />
                    <span className="text-sm font-medium">Create a Ticket Universe account (optional)</span>
                  </label>
                </div>
              </div>

              <div className="pt-6 border-t border-border">
                <h3 className="font-semibold text-lg mb-1">Ticket Holders</h3>
                <p className="text-sm text-muted-foreground mb-4">Tickets must be personalized for stadium entry.</p>

                <div className="space-y-4">
                  {Array.from({ length: quantity }).map((_, i) => (
                    <div key={i} className="bg-muted/50 border border-border rounded-xl p-4">
                      <div className="flex items-center justify-between mb-3">
                        <span className="font-bold text-sm">Ticket {i + 1}</span>
                        {i === 0 && (
                          <button onClick={useBuyerDetails} className="text-xs font-semibold text-primary hover:underline">Use my details</button>
                        )}
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <input type="text" placeholder="First Name" className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary" value={ticketHolders[i].firstName} onChange={e => updateHolder(i, 'firstName', e.target.value)} />
                        <input type="text" placeholder="Last Name" className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary" value={ticketHolders[i].lastName} onChange={e => updateHolder(i, 'lastName', e.target.value)} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6 pb-6">
              <div className="bg-blue-500/5 border border-blue-500/20 rounded-2xl p-6 text-center">
                <div className="w-16 h-16 bg-blue-500/10 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ShieldAlert className="w-8 h-8" />
                </div>
                <h3 className="font-bold text-xl mb-2 text-blue-600 dark:text-blue-400">Protect Your Purchase</h3>
                <p className="text-sm text-muted-foreground mb-6">
                  Add Ticket Universe Refund Protection and get a 100% refund if you cannot attend due to illness, travel disruption, or other covered emergencies.
                </p>
                
                <div className="bg-background rounded-xl border border-border p-4 flex justify-between items-center mb-6">
                  <div className="text-left">
                    <p className="font-bold">Refund Protection</p>
                    <p className="text-sm text-muted-foreground">7% of cart total</p>
                  </div>
                  <div className="font-black text-xl text-primary">
                    +${((subtotal + serviceFee) * 0.07).toFixed(2)}
                  </div>
                </div>

                <div className="space-y-3">
                  <button 
                    onClick={() => setRefundProtection(true)}
                    className={`w-full py-3 rounded-xl font-bold border-2 transition-all ${refundProtection ? 'bg-blue-500 text-white border-blue-500 shadow-md' : 'bg-background border-border text-foreground hover:border-blue-500/50'}`}
                  >
                    Yes, protect my tickets
                  </button>
                  <button 
                    onClick={() => setRefundProtection(false)}
                    className={`w-full py-3 rounded-xl font-bold border-2 transition-all ${!refundProtection ? 'bg-muted border-border text-foreground shadow-inner' : 'bg-background border-border text-muted-foreground hover:border-border/80'}`}
                  >
                    No thanks, I'll take the risk
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div key="step4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6 pb-6">
              
              {/* Order Summary */}
              <div>
                <h3 className="font-semibold text-lg mb-3">Order Summary</h3>
                <div className="bg-muted rounded-xl p-5 space-y-3 text-sm border border-border">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-foreground">{quantity} × {currentCategory?.name}</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center text-muted-foreground">
                    <span>Service Fee</span>
                    <span>${serviceFee.toFixed(2)}</span>
                  </div>
                  {refundProtection && (
                    <div className="flex justify-between items-center text-blue-600 dark:text-blue-400">
                      <span className="flex items-center gap-1"><ShieldCheck className="w-3 h-3"/> Refund Protection</span>
                      <span>${protectionFee.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center border-t border-border pt-3 mt-1">
                    <span className="font-bold text-base">Total to Pay</span>
                    <span className="font-black text-2xl text-primary">${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Payment Details */}
              <div>
                <h3 className="font-semibold text-lg mb-3 flex items-center justify-between">
                  Payment Details
                  <div className="flex gap-1">
                    <div className="w-8 h-5 bg-background border border-border rounded text-[8px] font-bold flex items-center justify-center">VISA</div>
                    <div className="w-8 h-5 bg-background border border-border rounded text-[8px] font-bold flex items-center justify-center">MC</div>
                  </div>
                </h3>
                {clientSecret ? (
                  <Elements stripe={stripePromise} options={{ clientSecret, appearance: { theme: 'stripe' } }}>
                    <StripePaymentForm 
                      onSuccess={() => {
                        setPaymentStatus('success');
                        nextStep();
                      }} 
                      setIsProcessing={setIsProcessing} 
                    />
                  </Elements>
                ) : (
                  <div className="flex items-center justify-center p-8 bg-background border border-border rounded-xl">
                    <span className="text-muted-foreground font-medium animate-pulse">Loading secure payment portal...</span>
                  </div>
                )}
                <div className="mt-4 flex items-center justify-center gap-2 text-xs text-muted-foreground">
                  <Lock className="w-3 h-3" /> Payments are secure and encrypted via Stripe
                </div>
              </div>

            </motion.div>
          )}

        </AnimatePresence>
      </div>

      <div className="bg-muted p-6 border-t border-border flex gap-4 flex-shrink-0 z-10">
        {step > 1 && (
          <button onClick={prevStep} disabled={isProcessing} className="px-6 py-3 rounded-xl border border-border bg-background font-medium hover:bg-muted/80 transition-colors flex items-center gap-2 disabled:opacity-50">
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
        )}
        
        {step < 4 ? (
          <button 
            onClick={step === 3 ? preparePayment : nextStep} 
            disabled={(step === 1 && !selectedCategory) || isProcessing}
            className="flex-1 bg-primary text-primary-foreground py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
          >
            {isProcessing ? 'Processing...' : (step === 1 ? 'Continue to Checkout' : 'Continue')} {!isProcessing && <ArrowRight className="w-4 h-4" />}
          </button>
        ) : (
          <Button 
            type="submit"
            form="payment-form"
            disabled={isProcessing || !clientSecret}
            isLoading={isProcessing}
            className="flex-1 w-full"
          >
            Pay ${total.toFixed(2)} Securely <ShieldCheck className="w-4 h-4 ml-2" />
          </Button>
        )}
      </div>
    </div>
  );
}
