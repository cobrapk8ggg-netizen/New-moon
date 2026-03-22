import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import { novelService } from '../services/novel';
import { BookOpen, Star, Heart } from 'lucide-react';

export default function Library() {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [favorites, setFavorites] = useState<any[]>([]);
  const [history, setHistory] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'favorites' | 'history'>('favorites');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLibrary = async () => {
      try {
        setLoading(true);
        const favs = await novelService.getUserLibrary(undefined, 'favorites');
        const hist = await novelService.getUserLibrary(undefined, 'history');
        setFavorites(favs);
        setHistory(hist);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchLibrary();
  }, []);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const items = activeTab === 'favorites' ? favorites : history;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-8">
          <BookOpen size={32} className="text-primary" />
          <h1 className="text-3xl font-bold">المكتبة</h1>
        </div>

        <div className="flex gap-4 mb-6 border-b border-border">
          <button
            onClick={() => setActiveTab('favorites')}
            className={`pb-2 px-4 font-medium ${activeTab === 'favorites' ? 'border-b-2 border-primary text-primary' : 'text-muted-foreground'}`}
          >
            المفضلة ({favorites.length})
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`pb-2 px-4 font-medium ${activeTab === 'history' ? 'border-b-2 border-primary text-primary' : 'text-muted-foreground'}`}
          >
            سجل القراءة ({history.length})
          </button>
        </div>

        {loading ? (
          <div className="text-center py-12">جاري التحميل...</div>
        ) : items.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            {activeTab === 'favorites' ? 'لا توجد روايات في المفضلة' : 'لا يوجد سجل قراءة'}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {items.map((item: any) => (
              <Link key={item.novelId} to={`/novel/${item.novelId}`} className="block bg-[#111111] rounded-xl overflow-hidden border border-white/10 hover:border-white/20 transition-all">
                <div className="aspect-[2/3] relative">
                  <img src={item.cover} alt={item.title} className="w-full h-full object-cover" />
                  {activeTab === 'history' && (
                    <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                      تقدم {item.progress}%
                    </div>
                  )}
                </div>
                <div className="p-3">
                  <h3 className="text-sm font-bold line-clamp-2">{item.title}</h3>
                  <div className="flex items-center gap-1 mt-2 text-yellow-500">
                    <Star size={14} fill="currentColor" />
                    <span className="text-xs">-</span>
                  </div>
                  {activeTab === 'history' && item.lastChapterTitle && (
                    <p className="text-xs text-gray-400 mt-1">آخر فصل: {item.lastChapterTitle}</p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}