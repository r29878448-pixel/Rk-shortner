
import { SiteSettings, BlogPost, SubscriptionPlan } from './types.ts';

export const DEFAULT_SETTINGS: SiteSettings = {
  siteName: 'SwiftLink',
  adsEnabled: true,
  adSlots: {
    top: '<div class="bg-indigo-50/50 p-4 text-center text-[10px] font-black text-indigo-400 border-b border-indigo-100 uppercase tracking-[0.4em]">Global Top Banner Advertisement</div>',
    middle: '<div class="my-12 p-12 bg-slate-50 border border-slate-200 rounded-[2rem] text-center text-slate-400 font-black uppercase text-xs tracking-widest">Global Middle Native Ad Placement</div>',
    bottom: '<div class="bg-slate-800 p-12 text-center text-[10px] font-black text-slate-500 border-t border-slate-700 uppercase tracking-[0.4em]">Global Footer Advertisement Area</div>'
  },
  stepAds: [
    '<div class="p-8 bg-indigo-600 rounded-3xl text-center text-white font-black">INTERSTITIAL PROMO 1</div>',
    '<div class="p-8 bg-indigo-600 rounded-3xl text-center text-white font-black">INTERSTITIAL PROMO 2</div>',
    '<div class="p-8 bg-indigo-600 rounded-3xl text-center text-white font-black">INTERSTITIAL PROMO 3</div>'
  ],
  redirectDelay: 15,
  totalSteps: 3
};

const LOREM_EXTENDER = `
The landscape of digital infrastructure is rapidly shifting towards a more integrated and secure model. As we look at the trajectory of link management, it's clear that simple redirects are no longer sufficient for the professional creator. In the modern era, every click carries a weight of data and potential revenue that must be managed with precision.

Consider the implications of latency on user retention. Statistics show that for every additional second a page takes to load, the bounce rate increases by approximately 20%. Our platform addresses this by utilizing edge-compute redirects that process verification logic closer to the user. This ensures that while the user is engaged with high-quality content, the technical verification is happening in the background at light speed.

Furthermore, the integration of native advertising within lengthy content blocks has proven to be 3x more effective than traditional banner ads. By providing real value—articles that educate, inform, and entertain—you build a bridge of trust with the user. This trust is the currency of the internet. When a user feels they are gaining knowledge, they are far more likely to complete the multi-stage verification process without friction.

Security, of course, remains the bedrock of our service. With the rise of sophisticated scraping bots, protecting your destination URL is paramount. Our behavioral analysis engine monitors mouse movements, scroll depth, and interaction patterns to ensure that only real humans reach the final stage. This level of protection is standard across all SwiftLink enterprise accounts.

As you navigate through these verification steps, remember that this system is designed for your protection. We filter out malicious actors, identify fraudulent traffic patterns, and provide you with a clean, high-intent audience. This is the difference between a simple link shortener and a professional monetization engine.

Let us delve deeper into the mechanics of SEO. Short links are often misunderstood as "SEO-neutral." In reality, when managed through a high-authority domain with consistent 301 redirection patterns, short links can actually contribute to your brand's overall search footprint. Branded aliases act as micro-keywords that search engines can index, creating a network of high-quality backlinks to your primary content.

The future of the creator economy is built on these small but vital interactions. Every link shared is a vote of confidence in your content. By using a platform that respects the user's intelligence and provides a professional aesthetic, you are positioning yourself at the forefront of the digital marketing revolution.

Our analytics suite provides a granular look at this journey. From the moment a user clicks, to the time they spend on each verification step, to the final successful redirect—every data point is captured and visualized for your review. This feedback loop allows you to optimize your campaigns in real-time, focusing your energy on the platforms and content types that drive the most growth.

In conclusion, the path to successful monetization is paved with quality content and robust security. We are proud to provide the tools that enable thousands of creators to build sustainable businesses online. Thank you for being a part of the SwiftLink ecosystem. Continue your journey below to access your requested destination.
`.repeat(5); // Repeat to make it very long

export const DEMO_POSTS: BlogPost[] = [
  {
    id: '1',
    title: 'Advanced Strategies for Digital Asset Monetization',
    excerpt: 'Deep dive into the architecture of high-yield link infrastructure and audience retention.',
    content: LOREM_EXTENDER,
    author: 'Admin',
    date: 'Jan 15, 2026',
    imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: '2',
    title: 'The Psychology of the Modern Click-Through Rate',
    excerpt: 'Why users click and how to keep them engaged during complex verification flows.',
    content: LOREM_EXTENDER,
    author: 'Tech Lead',
    date: 'Feb 02, 2026',
    imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: '3',
    title: 'Cybersecurity and Link Integrity in the AI Era',
    excerpt: 'How to protect your digital footprint against automated scraping and fraud.',
    content: LOREM_EXTENDER,
    author: 'SEO Expert',
    date: 'Feb 10, 2026',
    imageUrl: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: '4',
    title: 'The Evolution of SEO: Beyond Keywords and Backlinks',
    excerpt: 'How metadata and link redirection structures influence modern search rankings.',
    content: LOREM_EXTENDER,
    author: 'Marketing Pro',
    date: 'Feb 15, 2026',
    imageUrl: 'https://images.unsplash.com/photo-1557833161-0b91d49e367c?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: '5',
    title: 'Data Sovereignty and the Future of the Open Web',
    excerpt: 'Exploring the balance between monetization and user privacy in 2026.',
    content: LOREM_EXTENDER,
    author: 'Policy Analyst',
    date: 'Feb 20, 2026',
    imageUrl: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80&w=800'
  }
];
