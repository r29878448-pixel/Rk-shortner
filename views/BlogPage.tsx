
import React, { useState, useEffect } from 'react';
import { geminiService } from '../services/geminiService';
import { BlogPost } from '../types';
import { Calendar, User, ArrowRight } from 'lucide-react';

const BlogPage: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      const data = await geminiService.generateBlogPosts();
      setPosts(data);
      setLoading(false);
    };
    fetchPosts();
  }, []);

  return (
    <div className="bg-white py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-extrabold text-slate-900 mb-4">Latest Insights</h1>
          <p className="text-slate-600 text-lg">Marketing tips, tech news, and platform updates from the SwiftLink team.</p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map(i => (
              <div key={i} className="animate-shimmer h-96 rounded-2xl bg-slate-100"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {posts.map(post => (
              <article key={post.id} className="bg-slate-50 rounded-2xl border border-slate-100 overflow-hidden hover:shadow-lg transition group">
                <div className="h-48 bg-indigo-100 group-hover:bg-indigo-200 transition"></div>
                <div className="p-8">
                  <div className="flex items-center space-x-4 text-xs text-slate-400 mb-4">
                    <span className="flex items-center"><Calendar className="w-3 h-3 mr-1" /> {post.date}</span>
                    <span className="flex items-center"><User className="w-3 h-3 mr-1" /> {post.author}</span>
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-slate-900 group-hover:text-indigo-600 transition">{post.title}</h3>
                  <p className="text-slate-600 text-sm mb-6 line-clamp-3">{post.excerpt}</p>
                  <button className="text-sm font-bold text-indigo-600 flex items-center group-hover:translate-x-1 transition-transform">
                    Read More <ArrowRight className="ml-2 w-4 h-4" />
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogPage;
