
import React, { useState, useEffect } from 'react';
import { BlogPost } from '../types.ts';
import { Calendar, User, ArrowRight, Clock } from 'lucide-react';

const DEMO_POSTS: BlogPost[] = [
  {
    id: '1',
    title: 'How to Maximize Your Earnings with URL Shorteners',
    excerpt: 'Link monetization is a powerful way to generate passive income. Discover the best strategies for high-conversion traffic.',
    content: 'Long form content about monetization...',
    author: 'Admin',
    date: 'Oct 12, 2025',
    imageUrl: 'https://images.unsplash.com/photo-1553729459-efe14ef6055d?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: '2',
    title: 'The Future of Secure Link Redirection in 2026',
    excerpt: 'Digital security is evolving. Learn how multi-step verification helps protect your users and your revenue.',
    content: 'Content about security...',
    author: 'Tech Team',
    date: 'Sep 28, 2025',
    imageUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: '3',
    title: 'Link Tracking: Why Analytics Matter for Your Business',
    excerpt: 'Data-driven decisions are key to growth. See how our platform provides detailed insights for every click.',
    content: 'Content about analytics...',
    author: 'Admin',
    date: 'Sep 15, 2025',
    imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: '4',
    title: 'SEO Best Practices for Short Link Management',
    excerpt: 'Can short links help your SEO? We explore how to manage your digital footprint effectively.',
    content: 'Content about SEO...',
    author: 'Marketing',
    date: 'Aug 30, 2025',
    imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800'
  }
];

const BlogPage: React.FC = () => {
  return (
    <div className="bg-slate-50 py-24 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-20">
          <h1 className="text-5xl font-black text-slate-900 tracking-tighter mb-6">Platform Insights</h1>
          <p className="text-xl text-slate-500 font-medium leading-relaxed">Everything you need to know about link monetization, security, and digital marketing trends.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {DEMO_POSTS.map(post => (
            <article key={post.id} className="bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden hover:shadow-2xl transition duration-500 group flex flex-col">
              <div className="h-64 relative overflow-hidden">
                <img src={post.imageUrl} className="w-full h-full object-cover group-hover:scale-110 transition duration-700" alt={post.title} />
                <div className="absolute top-6 left-6 bg-white/90 backdrop-blur px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest text-indigo-600 shadow-sm">
                  Strategy
                </div>
              </div>
              <div className="p-10 flex flex-col flex-grow">
                <div className="flex items-center space-x-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-6">
                  <span className="flex items-center"><Calendar className="w-3 h-3 mr-1.5" /> {post.date}</span>
                  <span className="flex items-center"><Clock className="w-3 h-3 mr-1.5" /> 5 min read</span>
                </div>
                <h3 className="text-2xl font-black mb-4 text-slate-900 group-hover:text-indigo-600 transition tracking-tight leading-tight">{post.title}</h3>
                <p className="text-slate-500 text-sm mb-10 leading-relaxed line-clamp-3">{post.excerpt}</p>
                <button className="mt-auto text-sm font-black text-indigo-600 flex items-center group-hover:translate-x-2 transition-transform uppercase tracking-widest">
                  Read Article <ArrowRight className="ml-2 w-4 h-4" />
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BlogPage;
