
import { SiteSettings, BlogPost, SubscriptionPlan } from './types.ts';

export const DEFAULT_SETTINGS: SiteSettings = {
  siteName: 'SwiftLink',
  adsEnabled: true,
  adSlots: {
    top: '<div class="bg-indigo-50/50 p-4 text-center text-[10px] font-black text-indigo-400 border-b border-indigo-100 uppercase tracking-[0.4em]">Global Top Advertisement Area</div>',
    middle: '<div class="my-10 p-10 bg-slate-50 border border-slate-200 rounded-[2rem] text-center text-slate-400 font-black uppercase text-xs tracking-widest">Global Middle Native Ad Content</div>',
    bottom: '<div class="bg-slate-800 p-12 text-center text-[10px] font-black text-slate-500 border-t border-slate-700 uppercase tracking-[0.4em]">Global Footer Advertisement Area</div>'
  },
  stepAds: [
    '<div class="p-8 bg-indigo-600 rounded-3xl text-center text-white font-black">INTERSTITIAL PROMO 1</div>',
    '<div class="p-8 bg-indigo-600 rounded-3xl text-center text-white font-black">INTERSTITIAL PROMO 2</div>',
    '<div class="p-8 bg-indigo-600 rounded-3xl text-center text-white font-black">INTERSTITIAL PROMO 3</div>'
  ],
  redirectDelay: 10,
  totalSteps: 3
};

export const DEMO_POSTS: BlogPost[] = [
  {
    id: '1',
    title: 'The Ultimate Guide to URL Monetization in 2026',
    excerpt: 'Discover how top digital creators are leveraging advanced link infrastructure to generate passive income at scale.',
    content: `URL shortening has evolved significantly over the last decade. What started as a simple tool for fitting long links into character-limited social media posts has transformed into a sophisticated ecosystem for digital monetization. In this comprehensive guide, we explore the mechanics of high-conversion link redirects. 

The first pillar of link monetization is "dwell time." Advertisers value users who stay on the verification page long enough to digest content or interact with native ads. This is why multi-stage verification is essential. By providing value—such as the lengthy, high-quality blog content you are reading now—creators can maintain a high CPM (Cost Per Mille) while ensuring that the traffic is high-intent. 

Furthermore, link security is a growing concern. In 2026, bot traffic accounts for nearly 40% of all internet activity. A professional URL shortener like ours uses behavioral analysis during the redirection phase to distinguish between real human users and automated scripts. This protects the integrity of your links and the revenue generated from them. When you share a shortened link, you aren't just sharing a destination; you're providing a secure gateway.

To maximize your earnings, focus on your niche. Whether you're sharing software tools, premium articles, or creative assets, your audience's trust is your most valuable currency. By using a platform that prioritizes professional aesthetics and clear communication, you reduce bounce rates and increase the likelihood of recurring traffic. In the following sections, we will deep-dive into advanced SEO tactics for short links and how to optimize your dashboard for better performance.`,
    author: 'Admin',
    date: 'Jan 15, 2026',
    imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: '2',
    title: 'Link Analytics: Data-Driven Decision Making',
    excerpt: 'Understanding your audience is the first step to growth. Learn how to interpret link metrics to boost your ROI.',
    content: `In the modern digital economy, data is more valuable than gold. Every click on your shortened URL represents a data point that can be used to refine your marketing strategy. Professional link analytics go far beyond simple click counts; they provide insights into geographic distribution, device types, and referral sources.

Why does this matter? Imagine you're running a campaign across Twitter, Telegram, and a personal blog. Without detailed analytics, you're flying blind. Our enterprise dashboard allows you to see exactly which platform is driving the highest-quality traffic. If you notice that users from mobile devices are bouncing more frequently, you can optimize your destination page or adjust your ad placements for a better mobile experience.

A key metric to watch is the "Conversion Rate" of your redirection steps. If users are dropping off at Step 2 of 3, it might be time to reduce the timer or improve the content on that specific interstitial page. This is why we've integrated lengthy, engaging blog posts into our redirection flow. It keeps the user engaged with interesting information while the verification background processes are running. 

Ultimately, link tracking is about ROI. By knowing which content pieces are your "heavy hitters," you can focus your creative energy where it pays off most. In this article, we'll look at the specific KPIs you should be tracking and how our real-time activity feed gives you an edge over the competition. We'll also cover advanced techniques like A/B testing your aliases to see which wording attracts more clicks.`,
    author: 'Tech Lead',
    date: 'Feb 02, 2026',
    imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: '3',
    title: 'The Role of SEO in Short Link Management',
    excerpt: 'Can short links actually improve your search engine rankings? The answer might surprise you.',
    content: `SEO is often thought of as something that only applies to full-length articles and landing pages, but the way you manage your short links can have a ripple effect on your entire digital footprint. Search engines like Google value authority and speed, and a professional redirection service provides both.

One common myth is that short links "hide" your SEO value from the destination site. In reality, a properly implemented 301 or 302 redirect—like the ones used in our platform—passes through the majority of the original link's juice. However, the real SEO power of short links lies in "branded aliases." Instead of a random string of characters, using a catchy, descriptive alias can increase your click-through rate (CTR) by up to 34%. Higher CTR is a strong signal to search engines that your content is relevant and valuable.

Moreover, our redirection pages are optimized for speed and structure. By serving high-quality content during the verification phase, we ensure that users aren't met with a blank page or a broken layout. This reduces negative user signals that could impact your brand's overall search ranking. 

We also prioritize "Link Longevity." Many free services delete your links after a few months of inactivity, resulting in thousands of "404 Not Found" errors across the web. This is catastrophic for SEO. Our enterprise infrastructure guarantees that your links remain active as long as you need them, maintaining your backlink profile for years to come. In the rest of this post, we'll talk about how to structure your link campaigns for maximum search visibility and the technical nuances of redirect status codes.`,
    author: 'SEO Expert',
    date: 'Feb 10, 2026',
    imageUrl: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&q=80&w=800'
  }
];
