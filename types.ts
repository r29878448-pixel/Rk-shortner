
export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN'
}

// Fixed: Added SubscriptionPlan enum used in PricingPage.tsx to resolve missing export error
export enum SubscriptionPlan {
  FREE = 'FREE',
  PRO = 'PRO',
  BUSINESS = 'BUSINESS'
}

// Fixed: Added PlanConfig interface to define expected structure for site plans
export interface PlanConfig {
  freeLimit: number;
  proLimit: number;
  businessLimit: number;
  proPrice: number;
  businessPrice: number;
}

export interface User {
  id: string;
  email: string;
  role: UserRole;
  apiKey: string;
  createdAt: Date;
  isSuspended: boolean;
  balance?: number;
}

export interface Link {
  id: string;
  userId: string;
  originalUrl: string;
  shortCode: string;
  customAlias?: string;
  clicks: number;
  createdAt: Date;
  earnings?: number;
}

export interface ClickEvent {
  id: string;
  linkId: string;
  userId: string;
  shortCode: string;
  timestamp: string;
  referrer: string;
  userAgent: string;
  ip?: string;
}

export interface SiteSettings {
  siteName: string;
  adsEnabled: boolean;
  adSlots: {
    top: string;
    middle: string;
    bottom: string;
    contentAds: string[];
  };
  stepAds: string[]; 
  redirectDelay: number; 
  totalSteps: number; 
  telegramBotUrl: string;
  cpmRate: number;
  // Fixed: Added planConfig property to SiteSettings interface to resolve errors in constants.tsx and PricingPage.tsx
  planConfig: PlanConfig;
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  imageUrl: string;
}
