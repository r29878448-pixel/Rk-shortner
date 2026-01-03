
import { SiteSettings, BlogPost } from './types.ts';

export const DEFAULT_SETTINGS: SiteSettings = {
  siteName: 'SwiftLink',
  adsEnabled: true,
  adSlots: {
    top: '<div style="background: #eff6ff; padding: 25px; text-align: center; border-bottom: 3px solid #dbeafe; color: #1e40af; font-weight: 900; font-size: 14px; letter-spacing: 0.1em; margin-bottom: 30px;">[TOP HEADER AD SLOT]</div>',
    middle: '<div style="background: #f8fafc; padding: 80px; margin: 50px 0; border: 4px dashed #e2e8f0; border-radius: 40px; text-align: center; color: #64748b; font-weight: 800; font-size: 18px;">[MIDDLE CONTENT AD SLOT]</div>',
    bottom: '<div style="background: #0f172a; padding: 50px; text-align: center; color: #94a3b8; font-weight: 800; border-top: 1px solid #1e293b; letter-spacing: 0.2em; margin-top: 50px;">[FOOTER BOTTOM AD SLOT]</div>'
  },
  stepAds: [
    '<div style="padding: 50px; background: #4f46e5; border-radius: 30px; color: white; text-align: center; font-weight: 900; margin: 40px 0;">STAGE 1 INTERSTITIAL AD</div>',
    '<div style="padding: 50px; background: #7c3aed; border-radius: 30px; color: white; text-align: center; font-weight: 900; margin: 40px 0;">STAGE 2 INTERSTITIAL AD</div>',
    '<div style="padding: 50px; background: #db2777; border-radius: 30px; color: white; text-align: center; font-weight: 900; margin: 40px 0;">STAGE 3 INTERSTITIAL AD</div>'
  ],
  redirectDelay: 10,
  totalSteps: 3
};

/**
 * Generates an extremely long block of professional text (~12,000 words)
 * to ensure users must scroll multiple times to reach the bottom.
 */
const generateEndlessContent = (topic: string) => {
  const segment = `
Digital infrastructure and the architecture of link management are evolving at a breakneck pace in 2026. When we analyze the telemetry of modern ${topic}, we see a clear distinction between legacy systems and high-performance verification relays. This deep-dive analysis serves to educate the user on the complexities of secure data transmission and why multi-step protocols are the new gold standard for enterprise security.

In a global economy driven by clicks, the integrity of a redirect is as important as the content itself. Malicious actors utilize sophisticated scraping scripts to bypass traditional shorteners. Our behavioral engine counteracts this by measuring scroll velocity, interaction patterns, and mouse movement. By providing this high-quality, long-form content, we create a human-centric environment that filters out 99.9% of automated traffic.

Furthermore, the SEO implications of this strategy are significant. Longer "dwell time" on a page informs search engine algorithms that the content is valuable and relevant. This creates a halo effect for the destination URL, preserving link juice while adding a layer of authoritative verification. Whether you are a marketer, a developer, or a business owner, understanding this synergy is key to long-term success.

Our API, powered by sk_live security keys, allows for stable, cross-platform generation of these secure assets. We have prioritized uptime and response latency to ensure that your workflows remain uninterrupted, regardless of the scale of your traffic. This is the professional promise of the SwiftLink ecosystem.
  `;
  return segment.repeat(35); // 35 repetitions ensures ~12,000+ words
};

export const DEMO_POSTS: BlogPost[] = [
  {
    id: '1',
    title: 'The Blueprint for Secure Redirection',
    excerpt: 'Detailed analysis of long-term link integrity and security infrastructure.',
    content: generateEndlessContent('Redirection Security'),
    author: 'Admin',
    date: 'Jan 15, 2026',
    imageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: '2',
    title: 'Maximizing CTR Through Engagement',
    excerpt: 'How to leverage high-quality content to boost your link earnings.',
    content: generateEndlessContent('User Engagement'),
    author: 'Tech Lead',
    date: 'Feb 02, 2026',
    imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800'
  }
];
