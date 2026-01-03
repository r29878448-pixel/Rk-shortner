
import React from 'react';
import { Check, Zap, Rocket, Building } from 'lucide-react';
import { SubscriptionPlan } from '../types';

const PricingPage: React.FC = () => {
  const plans = [
    {
      name: SubscriptionPlan.FREE,
      icon: <Zap className="text-slate-400" />,
      price: "0",
      description: "Perfect for testing the platform.",
      features: ["5 links / month", "100 API calls", "Basic Analytics", "Public Support"]
    },
    {
      name: SubscriptionPlan.PRO,
      icon: <Rocket className="text-indigo-600" />,
      price: "19",
      description: "Best for creators and professionals.",
      features: ["50 links / month", "5,000 API calls", "Custom Aliases", "Advanced Analytics", "Step Reduction", "Priority Email Support"],
      highlight: true
    },
    {
      name: SubscriptionPlan.BUSINESS,
      icon: <Building className="text-purple-600" />,
      price: "49",
      description: "Scale your organization with ease.",
      features: ["Unlimited Links", "100,000 API calls", "White-label URLs", "Team Management", "0-Step Direct Redirects", "24/7 Phone Support"]
    }
  ];

  return (
    <div className="py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4">Simple, transparent pricing</h1>
          <p className="text-slate-600 text-lg max-w-2xl mx-auto">Choose the plan that's right for your needs. Scale as you grow.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map(plan => (
            <div 
              key={plan.name}
              className={`bg-white rounded-[2rem] p-10 flex flex-col h-full border ${plan.highlight ? 'border-indigo-500 shadow-2xl shadow-indigo-100 scale-105' : 'border-slate-100 shadow-sm'} relative overflow-hidden transition hover:shadow-xl`}
            >
              {plan.highlight && (
                <div className="absolute top-0 right-0 px-4 py-1 bg-indigo-500 text-white text-xs font-bold rounded-bl-xl">POPULAR</div>
              )}
              <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center mb-6">
                {plan.icon}
              </div>
              <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
              <p className="text-slate-500 text-sm mb-6">{plan.description}</p>
              <div className="mb-8">
                <span className="text-4xl font-black text-slate-900">${plan.price}</span>
                <span className="text-slate-400">/month</span>
              </div>
              <ul className="space-y-4 mb-10 flex-grow">
                {plan.features.map(f => (
                  <li key={f} className="flex items-center text-sm text-slate-600">
                    <Check className="w-5 h-5 text-indigo-500 mr-3 shrink-0" /> {f}
                  </li>
                ))}
              </ul>
              <button className={`w-full py-4 rounded-xl font-bold transition ${plan.highlight ? 'gradient-bg text-white shadow-lg' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}>
                {plan.name === SubscriptionPlan.FREE ? 'Get Started' : `Buy ${plan.name} Plan`}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PricingPage;
