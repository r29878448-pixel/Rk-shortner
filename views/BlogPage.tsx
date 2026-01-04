
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
    author: 'Editorial Team',
    date: 'Oct 12, 2025',
    imageUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: '2',
    title: 'Maximizing CTR with Native Content',
    excerpt: 'How long-form educational content keeps users engaged during the redirection process.',
    content: '',
    author: 'Marketing',
    date: 'Sep 28, 2025',
    imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: '3',
    title: 'Advanced Analytics for Digital Creators',
    excerpt: 'Understand your audience beyond just clicks. Data-driven growth strategies for the modern web.',
    content: '',
    author: 'Admin',
    date: 'Sep 15, 2025',
    imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800'
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
        
        {/* TOP AD */}
        <AdSlot html={settings.adSlots.top} className="mb-12" />

        <div className="max-w-3xl mb-12 md:mb-20">
          <div className="inline-flex items-center space-x-2 text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest mb-4">
            <TrendingUp className="w-3 h-3" /> <span>Platform Insights</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter mb-4 uppercase">News & Insights</h1>
          <p className="text-base md:text-lg text-slate-500 font-medium leading-relaxed">Official updates, security briefings, and marketing strategies for professional link management.</p>
        </div>

        {/* MIDDLE AD */}
        <AdSlot html={settings.adSlots.middle} className="mb-12" />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
          {DEMO_POSTS.map(post => (
            <article key={post.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col group">
              <div className="h-56 relative overflow-hidden">
                <img src={post.imageUrl} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" alt={post.title} />
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-2 py-1 rounded text-[9px] font-black uppercase tracking-widest text-indigo-600 flex items-center">
                  <ShieldCheck className="w-3 h-3 mr-1" /> Briefing
                </div>
              </div>
              <div className="p-8 flex flex-col flex-grow">
                <div className="flex items-center space-x-4 text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-4">
                  <span className="flex items-center"><Calendar className="w-3 h-3 mr-1" /> {post.date}</span>
                  <span className="flex items-center"><Clock className="w-3 h-3 mr-1" /> 4m read</span>
                </div>
                <h3 className="text-xl font-black mb-3 text-slate-900 group-hover:text-indigo-600 transition tracking-tight leading-tight uppercase">{post.title}</h3>
                <p className="text-slate-500 text-xs mb-8 leading-relaxed line-clamp-2">{post.excerpt}</p>
                <div className="mt-auto pt-4 border-t border-slate-100">
                  <button className="text-[10px] font-bold text-slate-900 flex items-center hover:text-indigo-600 transition-all uppercase tracking-widest">
                    Read analysis <ArrowRight className="ml-2 w-3 h-3" />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* BOTTOM AD */}
        <AdSlot html={settings.adSlots.bottom} className="mt-20" />
      </div>
    </div>
  );
};

export default BlogPage;
