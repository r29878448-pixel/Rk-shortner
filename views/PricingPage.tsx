
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, Zap, Rocket, Building, X, CreditCard, ShieldCheck, MessageCircle, ArrowRight } from 'lucide-react';
// Fix: Removed non-existent PaymentRequest import which caused a 1-based line 5 error
import { SubscriptionPlan, SiteSettings } from '../types.ts';
import { DEFAULT_SETTINGS } from '../constants.tsx';

const PricingPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);

  // Load latest settings for Pricing and Telegram link
  const settings: SiteSettings = JSON.parse(localStorage.getItem('swiftlink_settings') || JSON.stringify(DEFAULT_SETTINGS));

  const plans = [
    {
      name: SubscriptionPlan.FREE,
      icon: <Zap className="text-slate-400" />,
      price: "0",
      description: "Perfect for testing the platform.",
      features: [`${settings.planConfig.freeLimit} links / month`, "100 API calls", "Basic Analytics", "Public Support"]
    },
    {
      name: SubscriptionPlan.PRO,
      icon: <Rocket className="text-indigo-600" />,
      price: settings.planConfig.proPrice.toString(),
      description: "Best for creators and professionals.",
      features: [`${settings.planConfig.proLimit} links / month`, "5,000 API calls", "Custom Aliases", "Advanced Analytics", "Step Reduction", "Priority Support"],
      highlight: true
    },
    {
      name: SubscriptionPlan.BUSINESS,
      icon: <Building className="text-purple-600" />,
      price: settings.planConfig.businessPrice.toString(),
      description: "Scale your organization with ease.",
      features: ["Unlimited Links", "100,000 API calls", "White-label URLs", "Team Management", "0-Step Direct Redirects", "24/7 Priority Support"]
    }
  ];

  const handleSelectPlan = (plan: any) => {
    const user = JSON.parse(localStorage.getItem('swiftlink_user') || 'null');
    if (!user) {
      navigate('/login');
      return;
    }
    if (plan.name === SubscriptionPlan.FREE) {
      alert("You are already on the FREE plan.");
      return;
    }
    setSelectedPlan(plan);
    setShowModal(true);
  };

  const notifyPendingUpgrade = () => {
    const user = JSON.parse(localStorage.getItem('swiftlink_user') || '{}');
    const updatedUser = { ...user, pendingUpgrade: selectedPlan.name };
    localStorage.setItem('swiftlink_user', JSON.stringify(updatedUser));
    
    // Update registered users list too
    const users = JSON.parse(localStorage.getItem('swiftlink_registered_users') || '[]');
    const updatedUsers = users.map((u: any) => u.profile.id === user.id ? { ...u, profile: updatedUser } : u);
    localStorage.setItem('swiftlink_registered_users', JSON.stringify(updatedUsers));
    
    window.open(`${settings.telegramBotUrl}?text=I%20want%20to%20buy%20${selectedPlan.name}%20for%20User%20ID:%20${user.id}`, '_blank');
    setShowModal(false);
    navigate('/dashboard');
  };

  return (
    <div className="py-24 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4 tracking-tighter uppercase">Power Up Your Links</h1>
          <p className="text-slate-600 text-lg max-w-2xl mx-auto">Subscription activation via Telegram support. Quick & Manual Verification.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {plans.map(plan => (
            <div 
              key={plan.name}
              className={`bg-white rounded-[2rem] p-10 flex flex-col h-full border ${plan.highlight ? 'border-indigo-500 shadow-2xl scale-105' : 'border-slate-100 shadow-sm'} relative overflow-hidden transition hover:shadow-xl`}
            >
              {plan.highlight && (
                <div className="absolute top-0 right-0 px-6 py-2 bg-indigo-500 text-white text-[10px] font-black uppercase tracking-widest rounded-bl-xl">POPULAR</div>
              )}
              <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center mb-8">
                {plan.icon}
              </div>
              <h3 className="text-2xl font-black mb-2 uppercase tracking-tight">{plan.name}</h3>
              <p className="text-slate-500 text-sm mb-6 font-medium">{plan.description}</p>
              <div className="mb-10">
                <span className="text-5xl font-black text-slate-900">₹{plan.price}</span>
                <span className="text-slate-400 font-bold ml-2">/mo</span>
              </div>
              <ul className="space-y-4 mb-10 flex-grow">
                {plan.features.map(f => (
                  <li key={f} className="flex items-center text-sm font-semibold text-slate-600">
                    <Check className="w-5 h-5 text-indigo-500 mr-3 shrink-0" /> {f}
                  </li>
                ))}
              </ul>
              <button 
                onClick={() => handleSelectPlan(plan)}
                className={`w-full py-5 rounded-2xl font-black uppercase text-xs tracking-widest transition-all ${
                  plan.highlight ? 'bg-indigo-600 text-white shadow-xl hover:bg-indigo-700' : 'bg-slate-900 text-white hover:bg-black'
                }`}
              >
                {plan.name === SubscriptionPlan.FREE ? 'Current Plan' : `Get ${plan.name}`}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Payment Instructions Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-[3rem] w-full max-w-md p-10 relative shadow-2xl overflow-hidden">
            <button onClick={() => setShowModal(false)} className="absolute top-8 right-8 p-2 bg-slate-100 rounded-full text-slate-400 hover:text-red-500 transition">
              <X className="w-6 h-6" />
            </button>

            <div className="text-center mb-10">
               <div className="inline-flex items-center space-x-2 text-blue-600 font-black uppercase tracking-widest text-[10px] mb-2">
                  <MessageCircle className="w-4 h-4" /> <span>Telegram Checkout</span>
               </div>
               <h2 className="text-3xl font-black uppercase tracking-tighter text-slate-900">Final Step</h2>
               <p className="text-slate-400 text-xs mt-2 font-bold leading-relaxed">
                 To activate your <span className="text-indigo-600">{selectedPlan?.name}</span> plan for ₹{selectedPlan?.price}, please contact our Telegram Bot.
               </p>
            </div>

            <div className="bg-blue-50 p-8 rounded-[2rem] border-2 border-dashed border-blue-200 text-center mb-8">
               <p className="text-xs font-bold text-blue-800 mb-6">
                 Send your User ID and Plan Name to the support bot for manual activation.
               </p>
               <button 
                 onClick={notifyPendingUpgrade}
                 className="w-full py-5 bg-blue-600 text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl hover:bg-blue-700 transition flex items-center justify-center"
               >
                 Go to Telegram <ArrowRight className="ml-2 w-4 h-4" />
               </button>
            </div>

            <div className="text-center">
              <p className="text-[9px] font-black uppercase tracking-widest text-slate-300">
                Activation Time: 5-30 Minutes
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PricingPage;
