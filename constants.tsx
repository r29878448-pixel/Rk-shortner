
import { SiteSettings, BlogPost } from './types.ts';

export const DEFAULT_SETTINGS: SiteSettings = {
  siteName: 'SwiftLink',
  adsEnabled: true,
  adSlots: {
    top: '<div style="background: #eff6ff; padding: 25px; text-align: center; border-bottom: 3px solid #dbeafe; color: #1e40af; font-weight: 900; font-size: 14px; letter-spacing: 0.1em; margin-bottom: 30px;">[TOP HEADER AD SLOT]</div>',
    middle: '<div style="background: #f8fafc; padding: 80px; margin: 50px 0; border: 4px dashed #e2e8f0; border-radius: 40px; text-align: center; color: #64748b; font-weight: 800; font-size: 18px;">[MAIN CONTENT AD SLOT]</div>',
    bottom: '<div style="background: #0f172a; padding: 50px; text-align: center; color: #94a3b8; font-weight: 800; border-top: 1px solid #1e293b; letter-spacing: 0.2em; margin-top: 50px;">[FOOTER BOTTOM AD SLOT]</div>',
    contentAds: [
      '<div style="background: #f1f5f9; padding: 40px; margin: 30px 0; border-left: 10px solid #4f46e5; color: #475569; font-weight: 700;">ARTICLE AD #1: SPONSORED ANALYSIS</div>',
      '<div style="background: #f1f5f9; padding: 40px; margin: 30px 0; border-left: 10px solid #7c3aed; color: #475569; font-weight: 700;">ARTICLE AD #2: DATA PARTNER BLOCK</div>'
    ]
  },
  stepAds: [
    '<div style="padding: 50px; background: #4f46e5; border-radius: 30px; color: white; text-align: center; font-weight: 900; margin: 40px 0;">STAGE 1 INTERSTITIAL AD</div>',
    '<div style="padding: 50px; background: #7c3aed; border-radius: 30px; color: white; text-align: center; font-weight: 900; margin: 40px 0;">STAGE 2 INTERSTITIAL AD</div>',
    '<div style="padding: 50px; background: #db2777; border-radius: 30px; color: white; text-align: center; font-weight: 900; margin: 40px 0;">STAGE 3 INTERSTITIAL AD</div>'
  ],
  redirectDelay: 10,
  totalSteps: 3
};

const generateEndlessContent = (topic: string) => {
  const segment = `
Digital infrastructure and the architecture of link management are evolving at a breakneck pace in 2026. When we analyze the telemetry of modern ${topic}, we see a clear distinction between legacy systems and high-performance verification relays. This deep-dive analysis serves to educate the user on the complexities of secure data transmission and why multi-step protocols are the new gold standard for enterprise security.

In a global economy driven by clicks, the integrity of a redirect is as important as the content itself. Our behavioral engine counteracts this by measuring scroll velocity, interaction patterns, and mouse movement. By providing this high-quality, long-form content, we create a human-centric environment that filters out 99.9% automated traffic.
  `;
  return segment.repeat(40);
};

export const DEMO_POSTS: BlogPost[] = [
  {
    id: '1',
    title: 'Modern Link Monetization Strategies',
    excerpt: 'Detailed analysis of high-performance redirection networks and their security protocols.',
    content: generateEndlessContent('Monetization Frameworks'),
    author: 'Admin',
    date: 'Oct 24, 2025',
    imageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800'
  }
];
