
import { SiteSettings, BlogPost } from './types.ts';

const USER_AD_CODE_1 = `
<script async="async" data-cfasync="false" src="https://pl28393495.effectivegatecpm.com/6825e17601f8cf0d3f85f53185a1ba61/invoke.js"></script>
<div id="container-6825e17601f8cf0d3f85f53185a1ba61"></div>
`;

const USER_AD_CODE_2 = `
<div style="display:flex; justify-content:center;">
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
  siteName: 'SwiftLink',
  adsEnabled: true,
  adSlots: {
    top: USER_AD_CODE_1,
    middle: USER_AD_CODE_2,
    bottom: USER_AD_CODE_1,
    contentAds: [USER_AD_CODE_2, USER_AD_CODE_1]
  },
  stepAds: [],
  redirectDelay: 15,
  totalSteps: 2, // Default to 2 pages as requested
  planConfig: {
    freeLimit: 1000000,
    proLimit: 1000000,
    businessLimit: 1000000,
    proPrice: 0,
    businessPrice: 0
  },
  telegramBotUrl: 'https://t.me/SwiftLinkSupportBot',
  cpmRate: 150 
};

const generateEndlessContent = (topic: string, count: number = 20) => {
  const segment = `
Digital infrastructure and the architecture of link management are evolving at a breakneck pace in 2026. When we analyze the telemetry of modern ${topic}, we see a clear distinction between legacy systems and high-performance verification relays. This deep-dive analysis serves to educate the user on the complexities of secure data transmission and why multi-step protocols are the new gold standard for enterprise security.

In a global economy driven by clicks, the integrity of a redirect is as important as the content itself. Our behavioral engine counteracts this by measuring scroll velocity, interaction patterns, and mouse movement. By providing this high-quality, long-form content, we create a human-centric environment that filters out automated traffic. 
  `;
  return segment.repeat(count);
};

export const DEMO_POSTS: BlogPost[] = [
  {
    id: '1',
    title: 'The Evolution of Secure Data Relays',
    excerpt: 'Detailed analysis of high-performance redirection networks and their security protocols.',
    content: generateEndlessContent('Monetization Frameworks'),
    author: 'Security Node',
    date: 'Oct 24, 2025',
    imageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: '2',
    title: 'Global Traffic Filtering Strategies',
    excerpt: 'How multi-stage verification preserves advertiser value and publisher integrity.',
    content: generateEndlessContent('Traffic Verification'),
    author: 'Network Admin',
    date: 'Nov 02, 2025',
    imageUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: '3',
    title: 'Behavioral Heuristics in 2026',
    excerpt: 'Using mouse movement and scroll depth to authenticate user sessions in real-time.',
    content: generateEndlessContent('Heuristic Analysis'),
    author: 'System Architect',
    date: 'Dec 15, 2025',
    imageUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc51?auto=format&fit=crop&q=80&w=800'
  }
];
