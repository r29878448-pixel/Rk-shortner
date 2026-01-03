
import { SiteSettings, SubscriptionPlan } from './types.ts';

export const DEFAULT_SETTINGS: SiteSettings = {
  siteName: 'SwiftLink',
  adsEnabled: true,
  captchaEnabled: true,
  captchaSiteKey: '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI', 
  captchaSecretKey: 'demo-secret',
  adSlots: {
    globalHeader: '<div class="bg-indigo-50/50 p-2 text-center text-[10px] font-bold text-indigo-400 border-b border-indigo-100">GLOBAL HEADER AD SLOT</div>',
    globalFooter: '<div class="bg-slate-800 p-8 text-center text-[10px] font-bold text-slate-500 border-t border-slate-700">GLOBAL FOOTER AD SLOT</div>',
    globalSidebar: '<div class="bg-slate-50 p-4 h-64 flex items-center justify-center text-[10px] font-bold text-slate-300 border border-dashed rounded-xl">SIDEBAR AD</div>',
    contentTop: '<div class="my-6 p-4 bg-amber-50 border border-amber-100 rounded-xl text-center text-amber-600 font-bold text-xs uppercase">Premium Advertisement Slot</div>',
    contentBottom: '<div class="my-6 p-4 bg-indigo-50 border border-indigo-100 rounded-xl text-center text-indigo-600 font-bold text-xs uppercase">High-Conversion Ad Slot</div>'
  },
  stepAds: [
    '<div class="p-8 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 text-center text-slate-400 font-black">INTERSTITIAL AD SLOT 1</div>',
    '<div class="p-8 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 text-center text-slate-400 font-black">INTERSTITIAL AD SLOT 2</div>',
    '<div class="p-8 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 text-center text-slate-400 font-black">INTERSTITIAL AD SLOT 3</div>',
    '<div class="p-8 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 text-center text-slate-400 font-black">INTERSTITIAL AD SLOT 4</div>',
    '<div class="p-8 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 text-center text-slate-400 font-black">INTERSTITIAL AD SLOT 5</div>'
  ],
  redirectDelay: 10,
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
