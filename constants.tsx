
import { SiteSettings, SubscriptionPlan } from './types.ts';

export const DEFAULT_SETTINGS: SiteSettings = {
  siteName: 'SwiftLink',
  adsEnabled: true,
  captchaEnabled: true,
  captchaSiteKey: '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI', 
  captchaSecretKey: 'demo-secret',
  adSlots: {
    top: '<div class="bg-indigo-50 h-24 flex flex-col items-center justify-center border border-dashed border-indigo-200 text-indigo-400 text-xs font-black rounded-xl"><span>728x90 Leaderboard Ad</span></div>',
    middle: '<div class="bg-indigo-50 h-64 flex flex-col items-center justify-center border border-dashed border-indigo-200 text-indigo-400 text-xs font-black rounded-xl"><span>300x600 Display Ad</span></div>',
    bottom: '<div class="bg-indigo-50 h-24 flex flex-col items-center justify-center border border-dashed border-indigo-200 text-indigo-400 text-xs font-black rounded-xl"><span>Sticky Footer Ad</span></div>'
  },
  stepAds: [
    '<div class="p-4 bg-slate-100 rounded-xl text-center font-bold text-slate-400">ADS SLOT 1</div>',
    '<div class="p-4 bg-slate-100 rounded-xl text-center font-bold text-slate-400">ADS SLOT 2</div>',
    '<div class="p-4 bg-slate-100 rounded-xl text-center font-bold text-slate-400">ADS SLOT 3</div>',
    '<div class="p-4 bg-slate-100 rounded-xl text-center font-bold text-slate-400">ADS SLOT 4</div>',
    '<div class="p-4 bg-slate-100 rounded-xl text-center font-bold text-slate-400">ADS SLOT 5</div>'
  ],
  redirectDelay: 15,
  totalSteps: 3
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
    linksPerMonth: -1, 
    apiRequestsPerMonth: 100000,
    customAlias: true,
    stepsCount: 1,
    price: 49
  }
};
