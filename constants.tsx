
import { SiteSettings, BlogPost, SubscriptionPlan } from './types.ts';

export const DEFAULT_SETTINGS: SiteSettings = {
  siteName: 'SwiftLink',
  adsEnabled: true,
  adSlots: {
    top: '<div style="background: #eff6ff; padding: 20px; text-align: center; border-bottom: 2px solid #dbeafe; color: #1e40af; font-weight: 900; font-size: 14px; letter-spacing: 0.1em;">TOP ADVERTISEMENT SLOT - PASTE SCRIPT HERE</div>',
    middle: '<div style="background: #f8fafc; padding: 60px; margin: 40px 0; border: 3px dashed #e2e8f0; border-radius: 30px; text-align: center; color: #64748b; font-weight: 800; font-size: 16px;">MIDDLE ADVERTISEMENT SLOT - PASTE SCRIPT HERE</div>',
    bottom: '<div style="background: #0f172a; padding: 40px; text-align: center; color: #94a3b8; font-weight: 800; border-top: 1px solid #1e293b; letter-spacing: 0.2em;">BOTTOM ADVERTISEMENT SLOT - PASTE SCRIPT HERE</div>'
  },
  stepAds: [
    '<div style="padding: 40px; background: #4f46e5; border-radius: 24px; color: white; text-align: center; font-weight: 900; box-shadow: 0 20px 25px -5px rgba(79, 70, 229, 0.2);">STEP 1 UNIQUE PROMO</div>',
    '<div style="padding: 40px; background: #7c3aed; border-radius: 24px; color: white; text-align: center; font-weight: 900; box-shadow: 0 20px 25px -5px rgba(124, 58, 237, 0.2);">STEP 2 UNIQUE PROMO</div>',
    '<div style="padding: 40px; background: #db2777; border-radius: 24px; color: white; text-align: center; font-weight: 900; box-shadow: 0 20px 25px -5px rgba(219, 39, 119, 0.2);">STEP 3 UNIQUE PROMO</div>'
  ],
  redirectDelay: 12,
  totalSteps: 3
};

/**
 * Creates a massive block of text (~12,000 words) to ensure the user has to scroll 
 * multiple times to reach the bottom of the page.
 */
const generateMassiveContent = (topic: string) => {
  const base = `
The landscape of ${topic} is undergoing a monumental shift in the current digital era. As we look at the historical data points from the last decade, we see a clear convergence between user intent and security architecture. In this professional analysis, we will explore the deep mechanics of high-performance redirection systems and why they are vital for the modern enterprise.

Firstly, let's examine the latency factors. In a traditional link shortener, the redirect is nearly instantaneous, which often fails to capture the necessary security metadata to protect against automated bots. By implementing a multi-step verification protocol, we are creating a "buffer zone" that allows our behavioral analysis engine to distinguish between genuine human engagement and malicious scripts. This is not just about protection; it's about optimizing the conversion funnel for high-yield digital assets.

When we talk about monetization, the concept of "dwell time" becomes paramount. Advertisers value impressions that are backed by real engagement. By providing lengthy, high-quality blog content—such as the one you are currently reading—we ensure that the user remains on the page long enough for the back-end verification systems to complete their task. This creates a win-win scenario: the user is educated and informed, while the publisher ensures a clean, verified click-through to the destination URL.

The technical specifications of our API are also worth noting. Designed for universal compatibility, our Sk_Live keys work across all platforms, from simple WordPress blogs to complex custom-built SaaS applications. We utilize a RESTful architecture that prioritizes response speed and data integrity. Every link generated is stored in an encrypted database vault, ensuring that your digital footprint remains secure for as long as the link is active.

Furthermore, the role of SEO in this process cannot be overstated. A shortened link should act as a bridge, not a barrier. Our platform utilizes 301 and 302 redirection patterns that are optimized for search engine crawlers, ensuring that the destination site receives the full benefit of the link's authority. This is part of our commitment to providing professional-grade tools for digital marketers and content creators.

As you scroll further into this deep dive, we will discuss the implications of data sovereignty and user privacy. In 2026, the user is more aware than ever of their digital rights. Our platform respects these boundaries by providing transparent verification processes and granular privacy controls. We believe that security and transparency are the twin pillars of a successful digital ecosystem.
  `;
  return base.repeat(25); // Repeated many times to force extreme scrolling length
};

export const DEMO_POSTS: BlogPost[] = [
  {
    id: '1',
    title: 'Future-Proofing Your Digital Assets',
    excerpt: 'Detailed analysis of long-term link integrity and security infrastructure.',
    content: generateMassiveContent('Digital Infrastructure'),
    author: 'Admin',
    date: 'Jan 15, 2026',
    imageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: '2',
    title: 'Monetization through Engagement',
    excerpt: 'How to leverage high-quality content to boost your link earnings.',
    content: generateMassiveContent('Revenue Optimization'),
    author: 'Tech Lead',
    date: 'Feb 02, 2026',
    imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: '3',
    title: 'Advanced SEO Patterns for 2026',
    excerpt: 'Why link redirection structure matters more than ever for rankings.',
    content: generateMassiveContent('Search Engine Optimization'),
    author: 'SEO Expert',
    date: 'Feb 10, 2026',
    imageUrl: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&q=80&w=800'
  }
];
