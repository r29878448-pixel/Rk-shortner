
import { SiteSettings, SubscriptionPlan } from './types';

export const DEFAULT_SETTINGS: SiteSettings = {
  adsEnabled: true,
  captchaEnabled: true,
  captchaSiteKey: '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI', // Demo key
  captchaSecretKey: 'demo-secret',
  adSlots: {
    top: '<div class="bg-indigo-50 h-24 flex flex-col items-center justify-center border border-dashed border-indigo-200 text-indigo-400 text-xs font-black rounded-xl"><span>GLOBAL TOP AD UNIT</span></div>',
    middle: '<div class="bg-indigo-50 h-64 flex flex-col items-center justify-center border border-dashed border-indigo-200 text-indigo-400 text-xs font-black rounded-xl"><span>GLOBAL MIDDLE AD UNIT</span></div>',
    bottom: '<div class="bg-indigo-50 h-24 flex flex-col items-center justify-center border border-dashed border-indigo-200 text-indigo-400 text-xs font-black rounded-xl"><span>GLOBAL BOTTOM AD UNIT</span></div>'
  },
  stepAds: [
    '<div class="p-4 bg-slate-100 rounded-xl text-center font-bold text-slate-400">STEP 1: PREMIUM AD CONTENT</div>',
    '<div class="p-4 bg-slate-100 rounded-xl text-center font-bold text-slate-400">STEP 2: PREMIUM AD CONTENT</div>',
    '<div class="p-4 bg-slate-100 rounded-xl text-center font-bold text-slate-400">STEP 3: PREMIUM AD CONTENT</div>',
    '<div class="p-4 bg-slate-100 rounded-xl text-center font-bold text-slate-400">STEP 4: PREMIUM AD CONTENT</div>',
    '<div class="p-4 bg-slate-100 rounded-xl text-center font-bold text-slate-400">STEP 5: PREMIUM AD CONTENT</div>'
  ],
  redirectDelay: 15,
  totalSteps: 5
};

export const PLAN_LIMITS = {
  [SubscriptionPlan.FREE]: {
    linksPerMonth: 5,
    apiRequestsPerMonth: 100,
    customAlias: false,
    stepsCount: 5,
    price: 0
  },
  [SubscriptionPlan.PRO]: {
    linksPerMonth: 50,
    apiRequestsPerMonth: 5000,
    customAlias: true,
    stepsCount: 3,
    price: 19
  },
  [SubscriptionPlan.BUSINESS]: {
    linksPerMonth: -1, // Unlimited
    apiRequestsPerMonth: 100000,
    customAlias: true,
    stepsCount: 1,
    price: 49
  }
};
