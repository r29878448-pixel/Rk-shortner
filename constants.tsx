
import { SiteSettings, BlogPost } from './types.ts';

const USER_AD_CODE_1 = `
<script async="async" data-cfasync="false" src="https://pl28393495.effectivegatecpm.com/6825e17601f8cf0d3f85f53185a1ba61/invoke.js"></script>
<div id="container-6825e17601f8cf0d3f85f53185a1ba61"></div>
`;

const USER_AD_CODE_2 = `
<div style="display:flex; justify-content:center; margin: 20px 0;">
<script>
  atOptions = {
    'key' : '3980b1017b92901b3bbbb650fbd73b7e',
    'format' : 'iframe',
    'height' : 250,
    'width' : 300,
    'params' : {}
  };
</script>
<script src="https://www.highperformanceformat.com/3980b1017b92901b3bbbb650fbd73b7e/invoke.js"></script>
</div>
`;

export const DEFAULT_SETTINGS: SiteSettings = {
  siteName: 'VP Links',
  adsEnabled: true,
  adSlots: {
    top: USER_AD_CODE_1,
    middle: USER_AD_CODE_2,
    bottom: USER_AD_CODE_1,
    contentAds: [USER_AD_CODE_2, USER_AD_CODE_1]
  },
  stepAds: [],
  redirectDelay: 10,
  totalSteps: 2, 
  planConfig: {
    freeLimit: 1000000,
    proLimit: 1000000,
    businessLimit: 1000000,
    proPrice: 0,
    businessPrice: 0
  },
  telegramBotUrl: 'https://t.me/VPLinksSupportBot',
  cpmRate: 150 
};

const generateContent = (topic: string) => {
  return `
    Security is the core of VP Links. When dealing with ${topic}, verifying user sessions through multi-stage gateways is the most effective way to prevent automated bot traffic. This ensures that our partners receive high-quality traffic that converts.
    
    The redirection landscape in 2026 requires transparency and speed. Even during verification, we aim to provide value. By showing educational snippets during the wait time, we bridge the gap between necessary security and a smooth user experience.
    
    VP Links uses a multi-node relay architecture. Each page performs a unique cryptographic handshake, ensuring the session remains valid and secure from end to end.
  `.repeat(8);
};

export const DEMO_POSTS: BlogPost[] = [
  {
    id: '1',
    title: 'Why VP Links leads in Security',
    excerpt: 'Deep dive into why multi-step gateways are essential for modern link infrastructure.',
    content: generateContent('Network Security'),
    author: 'VPL Admin',
    date: 'Oct 24, 2025',
    imageUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: '2',
    title: 'Monetization for Professionals',
    excerpt: 'Strategies for maximizing your earnings through high-quality traffic redirects with VP Links.',
    content: generateContent('Monetization'),
    author: 'VPL Finance',
    date: 'Nov 02, 2025',
    imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800'
  }
];
