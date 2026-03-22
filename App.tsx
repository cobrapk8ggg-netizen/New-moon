import React, { useState, useEffect } from 'react';
import { 
  Home, 
  Library, 
  User,
  Search, 
  Sun, 
  Moon, 
  Menu, 
  TrendingUp,
  ChevronLeft,
  Clock,
  PlusCircle,
  Star
} from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import { motion, AnimatePresence } from 'motion/react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const HERO_SLIDES = [
  {
    id: 1,
    title: "The Substitute Bride Is Doted on by the Cold-Blooded Emperor",
    image: "https://wsrv.nl/?url=https%3A%2F%2Fstorage.azoramoon.com%2Fpublic%2Fupload%2F2026%2F02%2F21%2F3d193696-84b3-46b8-91d4-a80e698ed920.webp&w=1920&q=85&output=webp",
    tags: ["انتقام", "رومانسي", "خيال"],
    type: "مانهوا",
    status: "جديد",
    statusIcon: "👋"
  },
  {
    id: 2,
    title: "Once an Assassin, Now a Royal Nanny",
    image: "https://wsrv.nl/?url=https%3A%2F%2Fstorage.azoramoon.com%2Fpublic%2Fupload%2F2026%2F03%2F20%2F12c4fba7-71bf-4242-94fc-a8a7ba640189.webp&w=1920&q=85&output=webp",
    tags: ["خيال", "رومانسي", "تناسخ"],
    type: "مانهوا",
    status: "جديد",
    statusIcon: "👋"
  }
];

const MOST_READ = [
  {
    id: 1,
    title: "Sleepless Death",
    image: "https://wsrv.nl/?url=https%3A%2F%2Fstorage.azoramoon.com%2Fpublic%2Fupload%2F2026%2F03%2F05%2F9adb9016-ff81-4ee1-bfd3-bbd07fadcec5.webp&w=400&q=85&output=webp",
    rating: 10
  },
  {
    id: 2,
    title: "Once an Assassin, Now a Royal Nanny",
    image: "https://wsrv.nl/?url=https%3A%2F%2Fstorage.azoramoon.com%2Fpublic%2Fupload%2F2026%2F03%2F20%2F12c4fba7-71bf-4242-94fc-a8a7ba640189.webp&w=400&q=85&output=webp",
    rating: 9.8
  },
  {
    id: 3,
    title: "Classmates",
    image: "https://wsrv.nl/?url=https%3A%2F%2Fstorage.azoramoon.com%2F2025%2F10%2F158_20250906185819.webp&w=400&q=85&output=webp",
    rating: 9.5
  },
  {
    id: 4,
    title: "Vengeance Begins with Marriage",
    image: "https://wsrv.nl/?url=https%3A%2F%2Fstorage.azoramoon.com%2Fpublic%2Fupload%2F2026%2F03%2F19%2F71666fa0-54f3-4b4b-aea5-a5ca55e52fe7.webp&w=400&q=85&output=webp",
    rating: 10
  }
];

const LATEST_UPDATES = [
  {
    id: 1,
    title: "Martial God Asura",
    image: "https://wsrv.nl/?url=https%3A%2F%2Fstorage.azoramoon.com%2Fpublic%2Fupload%2F2026%2F03%2F05%2F9adb9016-ff81-4ee1-bfd3-bbd07fadcec5.webp&w=150&q=85&output=webp",
    type: "مانهوا",
    chapters: [{ number: "الفصل 405", time: "منذ 3 ساعات" }]
  },
  {
    id: 2,
    title: "The Substitute Bride",
    image: "https://wsrv.nl/?url=https%3A%2F%2Fstorage.azoramoon.com%2Fpublic%2Fupload%2F2026%2F02%2F21%2F3d193696-84b3-46b8-91d4-a80e698ed920.webp&w=150&q=85&output=webp",
    type: "مانهوا",
    chapters: [{ number: "الفصل 195", time: "منذ 5 ساعات" }]
  }
];

const NEWLY_ADDED = [
  {
    id: 101,
    title: "The Eternal Supreme",
    image: "https://wsrv.nl/?url=https%3A%2F%2Fstorage.azoramoon.com%2Fpublic%2Fupload%2F2026%2F03%2F20%2F12c4fba7-71bf-4242-94fc-a8a7ba640189.webp&w=400&q=85&output=webp",
    rating: 8.9
  },
  {
    id: 102,
    title: "King of Manifestations",
    image: "https://wsrv.nl/?url=https%3A%2F%2Fstorage.azoramoon.com%2Fpublic%2Fupload%2F2026%2F03%2F19%2F71666fa0-54f3-4b4b-aea5-a5ca55e52fe7.webp&w=400&q=85&output=webp",
    rating: 9.2
  }
];

export default function App() {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    // محاكاة تحميل خطوط أزورا
    const style = document.createElement('style');
    style.innerHTML = `
      @import url('https://fonts.googleapis.com/css2?family=Lato:wght@300;400;700;900&display=swap');
      body {
        font-family: 'Lato', 'Gotham Pro', sans-serif;
      }
    `;
    document.head.appendChild(style);
    
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-500 font-['Lato']" dir="rtl">
      {/* Navbar المعدل بالترتيب الجديد */}
      <nav className="sticky top-0 z-50 w-full h-16 glass flex items-center justify-center px-4 md:px-8">
        <div className="max-w-7xl w-full flex items-center justify-between">
          <div className="flex items-center gap-8">
            <a href="/" className="flex items-center gap-2">
              <img 
                src="https://storage.azoramoon.com/public/upload/2025/12/24/c925c7f3-2310-4e90-9b62-7fae04fe1c36.webp" 
                alt="Azora Logo" 
                className="h-10 w-10 object-contain"
              />
            </a>
            
            <div className="hidden md:flex items-center gap-6">
              <NavLink icon={<Home size={18} />} label="الرئيسية" active />
              <NavLink icon={<Library size={18} />} label="المكتبة" />
              <NavLink icon={<User size={18} />} label="صفحتي" />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-white/10 rounded-full transition-colors"><Search size={20} /></button>
            <button onClick={() => setIsDarkMode(!isDarkMode)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden p-2"><Menu size={20} /></button>
          </div>
        </div>
      </nav>

      <main className="pb-20">
        {/* Hero Slider */}
        <section className="h-[400px] w-full overflow-hidden">
          <Swiper modules={[Autoplay, Pagination]} autoplay={{ delay: 5000 }} pagination={{ clickable: true }} loop className="h-full">
            {HERO_SLIDES.map((slide) => (
              <SwiperSlide key={slide.id}>
                <div className="relative h-full w-full">
                  <img src={slide.image} className="w-full h-full object-cover object-top" alt={slide.title} />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
                  <div className="absolute bottom-10 right-0 left-0 px-8 text-center">
                    <h2 className="text-2xl md:text-4xl font-black text-white drop-shadow-xl mb-2">{slide.title}</h2>
                    <div className="flex gap-2 justify-center">
                       {slide.tags.map(t => <span key={t} className="px-2 py-1 bg-primary/20 backdrop-blur-md text-[10px] rounded text-white border border-white/10">{t}</span>)}
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </section>

        {/* قسم الأكثر قراءة (بديل شائع اليوم) */}
        <section className="px-4 md:px-8 mt-12 max-w-7xl mx-auto">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp size={22} className="text-orange-500" />
            <h2 className="text-xl font-black">الأكثر قراءة</h2>
          </div>

          <Swiper spaceBetween={15} slidesPerView={2.2} breakpoints={{ 768: { slidesPerView: 4.5 }, 1024: { slidesPerView: 6.5 } }}>
            {MOST_READ.map((manga) => (
              <SwiperSlide key={manga.id}>
                <MangaCard manga={manga} />
              </SwiperSlide>
            ))}
          </Swiper>
        </section>

        {/* آخر التحديثات */}
        <section className="px-4 md:px-8 mt-16 max-w-7xl mx-auto">
          <div className="flex items-center gap-2 mb-6">
            <Clock size={22} className="text-blue-500" />
            <h2 className="text-xl font-black">آخر التحديثات</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {LATEST_UPDATES.map(item => (
              <div key={item.id} className="glass p-3 rounded-xl flex gap-4 hover:bg-white/5 transition-all cursor-pointer">
                <img src={item.image} className="w-20 h-28 object-cover rounded-lg shadow-lg" alt={item.title} />
                <div className="flex flex-col justify-between py-1">
                  <h3 className="font-bold text-sm line-clamp-1">{item.title}</h3>
                  <div className="flex flex-col gap-2">
                    {item.chapters.map((ch, i) => (
                      <div key={i} className="flex justify-between items-center bg-white/5 px-2 py-1 rounded text-[11px]">
                        <span className="font-bold text-primary">{ch.number}</span>
                        <span className="text-muted opacity-60">{ch.time}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* قسم أضيف حديثاً (بنفس تصميم الأكثر قراءة) */}
        <section className="px-4 md:px-8 mt-16 max-w-7xl mx-auto">
          <div className="flex items-center gap-2 mb-6">
            <PlusCircle size={22} className="text-green-500" />
            <h2 className="text-xl font-black">أضيف حديثاً</h2>
          </div>

          <Swiper spaceBetween={15} slidesPerView={2.2} breakpoints={{ 768: { slidesPerView: 4.5 }, 1024: { slidesPerView: 6.5 } }}>
            {NEWLY_ADDED.map((manga) => (
              <SwiperSlide key={manga.id}>
                <MangaCard manga={manga} />
              </SwiperSlide>
            ))}
          </Swiper>
        </section>
      </main>

      {/* Mobile Side Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div initial={{ x: 300 }} animate={{ x: 0 }} exit={{ x: 300 }} className="fixed inset-y-0 right-0 z-[100] w-64 bg-background shadow-2xl p-6 flex flex-col gap-8">
            <button onClick={() => setIsMenuOpen(false)} className="self-start p-2"><ChevronLeft size={24}/></button>
            <div className="flex flex-col gap-6">
              <MobileNavLink icon={<Home />} label="الرئيسية" />
              <MobileNavLink icon={<Library />} label="المكتبة" />
              <MobileNavLink icon={<User />} label="صفحتي" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// مكون البطاقة مع تأثير الـ 3D والمنظور (الأنيميشن المطلوب)
function MangaCard({ manga }: { manga: any }) {
  return (
    <div className="group perspective-[1000px] cursor-pointer pb-4">
      <div className="relative w-full aspect-[2/3] transition-all duration-500 ease-out transform-style-3d group-hover:[transform:rotateX(12deg)_translateY(-10px)] origin-bottom shadow-lg group-hover:shadow-2xl rounded-xl overflow-hidden bg-secondary">
        <img 
          src={manga.image} 
          alt={manga.title} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
        />
        
        {/* التفاصيل التي تظهر من الأسفل عند التمرير */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-3 translate-y-4 group-hover:translate-y-0">
          <div className="flex items-center gap-1 bg-primary/80 backdrop-blur-md w-fit px-2 py-0.5 rounded text-[10px] text-white font-bold mb-2">
            <Star size={10} className="fill-white" />
            {manga.rating}
          </div>
          <h3 className="text-white font-black text-xs line-clamp-2 text-center leading-tight">
            {manga.title}
          </h3>
        </div>
      </div>
      <h3 className="mt-3 text-[13px] font-bold text-center line-clamp-1 group-hover:text-primary transition-colors">
        {manga.title}
      </h3>
    </div>
  );
}

function NavLink({ icon, label, active = false }: { icon: React.ReactNode, label: string, active?: boolean }) {
  return (
    <a href="#" className={cn(
      "relative flex items-center gap-2 pb-1 transition-all font-bold text-sm",
      active ? "text-foreground" : "text-muted hover:text-foreground"
    )}>
      <span className={active ? "text-primary" : ""}>{icon}</span>
      {label}
      {active && <div className="absolute -bottom-1 right-0 left-0 h-0.5 bg-primary rounded-full" />}
    </a>
  );
}

function MobileNavLink({ icon, label }: { icon: React.ReactNode, label: string }) {
  return (
    <a href="#" className="flex items-center gap-4 text-lg font-black hover:text-primary transition-colors">
      <span className="text-primary">{icon}</span>
      {label}
    </a>
  );
}