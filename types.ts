
export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN'
}

export enum SubscriptionPlan {
  FREE = 'FREE',
  PRO = 'PRO',
  BUSINESS = 'BUSINESS'
}

export interface User {
  id: string;
  email: string;
  role: UserRole;
  plan: SubscriptionPlan;
  apiKey: string;
  createdAt: Date;
  isSuspended: boolean;
  pendingUpgrade?: SubscriptionPlan;
  balance?: number; // Total earnings in currency
}

export interface Link {
  id: string;
  userId: string;
  originalUrl: string;
  shortCode: string;
  customAlias?: string;
  expiryDate?: Date;
  clicks: number;
  createdAt: Date;
  earnings?: number; // Earnings specific to this link
}

export interface ClickEvent {
  id: string;
  linkId: string;
  userId: string; // Track who the link belongs to
  shortCode: string;
  timestamp: string;
  referrer: string;
  userAgent: string;
  ip?: string; // For fraud detection (simulated)
}

export interface PlanConfig {
  freeLimit: number;
  proLimit: number;
  businessLimit: number;
  proPrice: number;
  businessPrice: number;
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
  planConfig: PlanConfig;
  telegramBotUrl: string;
  cpmRate: number; // Payment per 1000 clicks
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
