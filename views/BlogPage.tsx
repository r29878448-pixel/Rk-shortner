
import React, { useMemo } from 'react';
import { BlogPost, SiteSettings } from '../types.ts';
import { Calendar, ArrowRight, Clock, ShieldCheck, TrendingUp } from 'lucide-react';
import AdSlot from '../components/AdSlot.tsx';
import { DEFAULT_SETTINGS } from '../constants.tsx';

const DEMO_POSTS: BlogPost[] = [
  {
    id: '1',
    title: 'The Future of Link Security in 2026',
    excerpt: 'Multi-stage verification is no longer optional. Learn how SwiftLink protects your assets and monetization flow.',
    content: '',
    author: 'SwiftLink Team',
    date: 'Oct 12, 2025',
    imageUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: '2',
    title: 'Maximizing CTR with Native Content',
    excerpt: 'How long-form educational content keeps users engaged during the redirection process.',
    content: '',
    author: 'SwiftLink Marketing',
    date: 'Sep 28, 2025',
    imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800'
  }
];

const BlogPage: React.FC = () => {
  const settings: SiteSettings = useMemo(() => {
    const saved = localStorage.getItem('swiftlink_settings');
    return saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
  }, []);

  return (
    <div className="bg-slate-50 py-12 md:py-20 min-h-screen font-sans">
      <div className="max-w-7xl mx-auto px-6">
        
        <AdSlot html={settings.adSlots.top} className="mb-12" />

        <div className="max-w-3xl mb-12 md:mb-20">
          <div className="inline-flex items-center space-x-2 text-indigo-600 bg-indigo-50 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest mb-6 border border-indigo-100">
            <TrendingUp className="w-4 h-4" /> <span>Network Intelligence</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter mb-6 uppercase leading-tight">{settings.siteName} Insights</h1>
          <p className="text-base md:text-lg text-slate-500 font-medium leading-relaxed">Official network briefings and monetization strategies for platform publishers.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {DEMO_POSTS.map(post => (
            <article key={post.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-2xl transition-all duration-300 flex flex-col group">
              <div className="h-72 relative overflow-hidden">
                <img src={post.imageUrl} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" alt={post.title} />
                <div className="absolute inset-0 bg-indigo-600/10 group-hover:bg-transparent transition-colors"></div>
              </div>
              <div className="p-10 flex flex-col flex-grow">
                <div className="flex items-center space-x-4 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">
                  <span className="flex items-center"><Calendar className="w-4 h-4 mr-2" /> {post.date}</span>
                  <span className="flex items-center text-indigo-600"><ShieldCheck className="w-4 h-4 mr-2" /> Verified Briefing</span>
                </div>
                <h3 className="text-2xl font-black mb-4 text-slate-900 group-hover:text-indigo-600 transition tracking-tight leading-tight uppercase">{post.title}</h3>
                <p className="text-slate-500 text-sm mb-10 leading-relaxed line-clamp-2">{post.excerpt}</p>
                <div className="mt-auto pt-6 border-t border-slate-100">
                  <button className="text-[11px] font-black text-slate-900 flex items-center hover:text-indigo-600 transition-all uppercase tracking-[0.2em]">
                    Access Full Report <ArrowRight className="ml-3 w-4 h-4 group-hover:translate-x-2 transition-transform" />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>

        <AdSlot html={settings.adSlots.bottom} className="mt-24" />
      </div>
    </div>
  );
};

export default BlogPage;
