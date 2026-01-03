
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
}

export interface SiteSettings {
  siteName: string; // New: Customizable branding
  adsEnabled: boolean;
  captchaEnabled: boolean;
  captchaSiteKey: string;
  captchaSecretKey: string;
  adSlots: {
    top: string;
    middle: string;
    bottom: string;
  };
  stepAds: string[]; 
  redirectDelay: number; 
  totalSteps: number; 
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  imageUrl: string; // Added image support
}
