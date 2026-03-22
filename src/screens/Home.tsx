import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, Star, Clock, PlusCircle, Lock, Pin, Flame } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import { motion } from 'motion/react';
import Header from '../components/Header';
import { novelService, Novel } from '../services/novel';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

export default function Home() {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [trendingNovels, setTrendingNovels] = useState<Novel[]>([]);
  const [recentNovels, setRecentNovels] = useState<Novel[]>([]);
  const [latestUpdates, setLatestUpdates] = useState<Novel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // جلب الروايات الرائجة (أكثر قراءة)
        const trendingRes = await novelService.getNovels({
          filter: 'trending',
          timeRange: 'week',
          limit: 12,
        });
        setTrendingNovels(trendingRes.novels);

        // جلب الروايات المضافة حديثاً
        const recentRes = await novelService.getNovels({
          filter: 'latest_added',
          limit: 12,
        });
        setRecentNovels(recentRes.novels);

        // جلب آخر التحديثات (أحدث الفصول)
        const updatesRes = await novelService.getNovels({
          filter: 'latest_updates',
          limit: 8,
        });
        setLatestUpdates(updatesRes.novels);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-foreground" dir="rtl">
        <Header isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
        <div className="flex items-center justify-center h-64">
          <div className="text-white">جاري التحميل...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background text-foreground" dir="rtl">
        <Header isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
        <div className="flex items-center justify-center h-64">
          <div className="text-red-500">خطأ: {error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-500" dir="rtl" style={{ fontFamily: "'Cairo', sans-serif" }}>
      <Header isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />

      <main className="pb-12 bg-[#050505]">
        {/* Hero Slider – لم نغيره لأنه يعتمد على بيانات ثابتة، يمكن لاحقاً جلبها من API */}
        <section className="h-[430px] w-full overflow-hidden">
          <Swiper
            modules={[Autoplay, Pagination, Navigation]}
            autoplay={{ delay: 5000 }}
            pagination={{ clickable: true }}
            loop={true}
            className="h-full w-full"
          >
            {/* هنا يمكن جلب السلايدر من API، لكن نكتفي بالثابت حالياً */}
          </Swiper>
        </section>

        {/* Most Read Section */}
        <section className="px-4 md:px-8 mt-12">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-2 mb-6 text-white">
              <TrendingUp size={24} className="text-orange-500" />
              <h2 className="text-xl font-bold">الأكثر قراءة</h2>
            </div>

            <Swiper
              modules={[Navigation]}
              spaceBetween={16}
              slidesPerView={2}
              navigation
              breakpoints={{
                640: { slidesPerView: 3 },
                768: { slidesPerView: 4 },
                1024: { slidesPerView: 6 },
              }}
              className="popular-swiper py-8"
            >
              {trendingNovels.map((novel) => (
                <SwiperSlide key={novel._id} className="pb-6 px-1">
                  <Link to={`/novel/${novel._id}`} className="block relative w-full aspect-[2/3] group perspective-[1000px] cursor-pointer">
                    <div className="w-full h-full relative transition-all duration-500 ease-out transform-style-3d group-hover:[transform:rotateX(15deg)_translateY(-8px)] origin-bottom shadow-md group-hover:shadow-2xl rounded-xl overflow-hidden border border-white/5">
                      <img 
                        src={novel.cover} 
                        alt={novel.title} 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-4 translate-y-4 group-hover:translate-y-0">
                        <h3 className="text-white font-bold text-sm line-clamp-2 mb-3 text-center drop-shadow-md">
                          {novel.title}
                        </h3>
                        <div className="flex justify-center items-center gap-1 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full text-xs text-white mx-auto w-fit">
                          <Star size={12} className="fill-orange-400 text-orange-400" />
                          {novel.rating}
                        </div>
                      </div>
                    </div>
                  </Link>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </section>

        {/* Recently Added Section */}
        <section className="px-4 md:px-8 mt-16">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-2 mb-6 text-white">
              <PlusCircle size={24} className="text-green-500" />
              <h2 className="text-xl font-bold">أضيف حديثاً</h2>
            </div>

            <Swiper
              modules={[Navigation]}
              spaceBetween={16}
              slidesPerView={2}
              navigation
              breakpoints={{
                640: { slidesPerView: 3 },
                768: { slidesPerView: 4 },
                1024: { slidesPerView: 6 },
              }}
              className="popular-swiper py-8"
            >
              {recentNovels.map((novel) => (
                <SwiperSlide key={novel._id} className="pb-6 px-1">
                  <Link to={`/novel/${novel._id}`} className="block relative w-full aspect-[2/3] group perspective-[1000px] cursor-pointer">
                    <div className="w-full h-full relative transition-all duration-500 ease-out transform-style-3d group-hover:[transform:rotateX(15deg)_translateY(-8px)] origin-bottom shadow-md group-hover:shadow-2xl rounded-xl overflow-hidden border border-white/5">
                      <img 
                        src={novel.cover} 
                        alt={novel.title} 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-4 translate-y-4 group-hover:translate-y-0">
                        <h3 className="text-white font-bold text-sm line-clamp-2 mb-3 text-center drop-shadow-md">
                          {novel.title}
                        </h3>
                        <div className="flex justify-center items-center gap-1 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full text-xs text-white mx-auto w-fit">
                          <Star size={12} className="fill-orange-400 text-orange-400" />
                          {novel.rating}
                        </div>
                      </div>
                    </div>
                  </Link>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </section>

        {/* Latest Updates Section */}
        <section className="px-4 md:px-8 mt-16">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl md:text-[26px] font-bold text-white tracking-wide">آخر التحديثات</h2>
              
              <div className="flex items-center bg-[#111111] rounded-full p-1 border border-white/5">
                <button className="flex items-center gap-2 text-gray-500 hover:text-gray-300 px-4 md:px-5 py-2 rounded-full transition-colors text-sm font-bold">
                  <Clock size={16} />
                  جديد
                </button>
                <button className="flex items-center gap-2 bg-[#ff3b8d]/10 text-[#ff3b8d] border border-[#ff3b8d]/30 px-4 md:px-5 py-2 rounded-full text-sm font-bold shadow-[0_0_10px_rgba(255,59,141,0.1)] transition-all">
                  <Flame size={16} className="fill-[#ff3b8d]" />
                  رائج
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
              {latestUpdates.map((novel) => (
                <div key={novel._id} className="bg-[#0c0c0c] rounded-xl border border-white/5 overflow-hidden flex h-[300px] hover:border-white/10 transition-colors">
                  <Link to={`/novel/${novel._id}`} className="w-[42%] relative shrink-0 h-full block">
                    <img 
                      src={novel.cover} 
                      alt={novel.title} 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-l from-transparent to-[#0c0c0c]/80" /> 
                    
                    <div className="absolute top-0 right-0 bg-[#ff3b8d] text-white text-[12px] px-3 py-1.5 font-bold rounded-bl-xl shadow-md">
                      مانها
                    </div>
                    
                    {novel.status === 'مستمرة' && (
                      <div className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-md text-white text-[11px] px-2 py-1.5 rounded-md flex items-center gap-1.5 shadow-lg border border-white/10">
                        مستمر <Pin size={12} className="rotate-45" />
                      </div>
                    )}
                    
                    {/* hot icon placeholder */}
                  </Link>

                  <div className="flex-1 p-4 flex flex-col relative z-10 w-[58%]" dir="ltr">
                    <Link to={`/novel/${novel._id}`} className="block">
                      <h3 className="text-white font-bold text-[17px] leading-snug line-clamp-2 mb-2 text-left hover:text-[#ff3b8d] transition-colors" dir="ltr">
                        {novel.title}
                      </h3>
                    </Link>
                    
                    <div className="flex justify-between items-center mb-4 flex-row-reverse" dir="ltr">
                      <div className="flex items-center gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-[#00e676] shadow-[0_0_8px_rgba(0,230,118,0.5)]"></div>
                        <span className="text-gray-300 text-[13px] font-medium">{novel.status}</span>
                      </div>
                      <div className="flex items-center gap-1 text-[13px] font-bold text-white">
                        <Star size={14} className="fill-[#ff9900] text-[#ff9900]" />
                        {novel.rating}
                      </div>
                    </div>
                    
                    {/* Chapters List – نعرض أول 5 فصول */}
                    <div className="flex flex-col gap-2 flex-1 overflow-hidden" dir="rtl">
                      {novel.chapters && novel.chapters.slice(0, 5).map((chapter) => (
                        <div key={chapter._id} className="flex justify-between items-center bg-[#151515] hover:bg-[#1a1a1a] transition-colors rounded-lg px-3 py-2.5 border border-transparent hover:border-white/5 cursor-pointer">
                          <div className="flex items-center gap-2">
                            <span className="text-[13px] font-bold text-gray-200">
                              الفصل {chapter.number}
                            </span>
                            {/* lock icon if needed */}
                          </div>
                          <span className="text-[11px] font-bold text-gray-500">
                            {new Date(chapter.createdAt).toLocaleDateString('ar-EG')}
                          </span>
                        </div>
                      ))}
                      {(!novel.chapters || novel.chapters.length === 0) && (
                        <div className="text-center text-gray-500 text-sm py-4">لا توجد فصول بعد</div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}