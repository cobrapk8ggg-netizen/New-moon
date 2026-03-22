import React from 'react';
import { 
  BookOpen, 
  Star, 
  Clock, 
  User, 
  List, 
  ChevronRight, 
  Play,
  Heart,
  Share2
} from 'lucide-react';

const NovelDetails = () => {
  // بيانات تجريبية لمحاكاة محتوى ازورا
  const novel = {
    title: "الابن البار الذي أنقذ العائلة الشريرة",
    originalTitle: "The Dutiful Kid Who Saved The Villainous Family",
    rating: "4.8",
    status: "مستمر",
    author: "Unknown",
    artist: "Unknown",
    releaseDate: "2024",
    genres: ["فانتازيا", "تراجيدي", "رومانسي", "دراما"],
    description: "تتحدث القصة عن محاولة الابن لإنقاذ عائلته التي وُصمت بالشر من مصيرها المحتوم، محاولاً تغيير مجرى الأحداث في هذا العالم المليء بالمخاطر والسحر.",
    coverImage: "https://images.unsplash.com/photo-1543004218-ee141104308e?q=80&w=1000&auto=format&fit=crop", // استبدلها بصورة الرواية
    chapters: [
      { id: 10, title: "الفصل 10", date: "قبل يومين" },
      { id: 9, title: "الفصل 9", date: "قبل 5 أيام" },
      { id: 8, title: "الفصل 8", date: "قبل أسبوع" },
      { id: 7, title: "الفصل 7", date: "قبل أسبوعين" },
      { id: 6, title: "الفصل 6", date: "قبل شهر" },
    ]
  };

  return (
    <div className="min-h-screen bg-background text-foreground pb-10">
      {/* Header/Banner Section with Blur Background */}
      <div className="relative h-[450px] w-full overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center blur-2xl scale-110 opacity-30"
          style={{ backgroundImage: `url(${novel.coverImage})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
        
        <div className="container mx-auto px-4 h-full flex items-end pb-8 relative z-10">
          <div className="flex flex-col md:flex-row gap-8 items-center md:items-end w-full">
            {/* Poster Image */}
            <div className="w-64 h-96 flex-shrink-0 rounded-xl overflow-hidden shadow-2xl border-4 border-secondary manga-card-shadow">
              <img 
                src={novel.coverImage} 
                alt={novel.title} 
                className="w-full h-full object-cover"
              />
            </div>

            {/* Title and Quick Info */}
            <div className="flex-grow text-right md:text-right text-center">
              <div className="flex flex-wrap gap-2 mb-4 justify-center md:justify-start flex-row-reverse">
                {novel.genres.map((genre, index) => (
                  <span key={index} className="bg-primary/20 text-primary px-3 py-1 rounded-full text-sm font-medium">
                    {genre}
                  </span>
                ))}
              </div>
              <h1 className="text-4xl font-bold mb-2 text-white">{novel.title}</h1>
              <p className="text-muted mb-6 text-lg">{novel.originalTitle}</p>
              
              <div className="flex flex-wrap gap-6 justify-center md:justify-start items-center mb-8 flex-row-reverse">
                <div className="flex items-center gap-2">
                  <Star className="text-accent fill-accent w-5 h-5" />
                  <span className="text-xl font-bold">{novel.rating}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="text-muted w-5 h-5" />
                  <span>{novel.status}</span>
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen className="text-muted w-5 h-5" />
                  <span>{novel.releaseDate}</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-4 justify-center md:justify-start flex-row-reverse">
                <button className="bg-primary hover:bg-primary/80 text-white px-8 py-3 rounded-lg font-bold flex items-center gap-2 transition-all transform hover:scale-105">
                  <Play className="w-5 h-5" /> ابدأ القراءة
                </button>
                <button className="bg-secondary hover:bg-secondary/80 text-white px-6 py-3 rounded-lg font-bold flex items-center gap-2 transition-all">
                  <Heart className="w-5 h-5 text-red-500" /> المفضلة
                </button>
                <button className="bg-secondary hover:bg-secondary/80 text-white p-3 rounded-lg transition-all">
                  <Share2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Section */}
      <div className="container mx-auto px-4 mt-12 grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* Left/Main Column: Description and Chapters */}
        <div className="lg:col-span-2 space-y-10 order-2 lg:order-1">
          {/* Story Summary */}
          <section className="glass p-8 rounded-2xl">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 flex-row-reverse">
              <BookOpen className="text-primary" /> قصة الرواية
            </h2>
            <p className="text-muted leading-relaxed text-lg text-right">
              {novel.description}
            </p>
          </section>

          {/* Chapters List */}
          <section className="glass rounded-2xl overflow-hidden">
            <div className="p-6 border-b border-white/10 flex justify-between items-center flex-row-reverse">
              <h2 className="text-2xl font-bold flex items-center gap-2 flex-row-reverse">
                <List className="text-primary" /> قائمة الفصول
              </h2>
              <span className="text-muted">{novel.chapters.length} فصل</span>
            </div>
            
            <div className="divide-y divide-white/5">
              {novel.chapters.map((chapter) => (
                <a 
                  key={chapter.id} 
                  href={`#chapter-${chapter.id}`}
                  className="flex justify-between items-center p-5 hover:bg-white/5 transition-colors group flex-row-reverse"
                >
                  <div className="flex items-center gap-4 flex-row-reverse">
                    <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center font-bold text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                      {chapter.id}
                    </div>
                    <span className="font-semibold text-lg">{chapter.title}</span>
                  </div>
                  <div className="flex items-center gap-4 text-muted text-sm">
                    <span>{chapter.date}</span>
                    <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform rotate-180" />
                  </div>
                </a>
              ))}
            </div>
          </section>
        </div>

        {/* Right Column: Metadata/Details */}
        <div className="lg:col-span-1 space-y-6 order-1 lg:order-2">
          <section className="glass p-6 rounded-2xl">
            <h3 className="text-xl font-bold mb-6 border-b border-white/10 pb-4 text-right">تفاصيل إضافية</h3>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center flex-row-reverse">
                <span className="text-muted flex items-center gap-2 flex-row-reverse">
                  <User className="w-4 h-4" /> المؤلف
                </span>
                <span className="font-medium text-primary">{novel.author}</span>
              </div>
              
              <div className="flex justify-between items-center flex-row-reverse">
                <span className="text-muted flex items-center gap-2 flex-row-reverse">
                  <User className="w-4 h-4" /> الرسام
                </span>
                <span className="font-medium text-primary">{novel.artist}</span>
              </div>

              <div className="flex justify-between items-center flex-row-reverse">
                <span className="text-muted flex items-center gap-2 flex-row-reverse">
                  <Star className="w-4 h-4" /> التقييم
                </span>
                <span className="font-medium">4.8 / 5.0</span>
              </div>
              
              <div className="flex justify-between items-center flex-row-reverse">
                <span className="text-muted flex items-center gap-2 flex-row-reverse">
                  <Clock className="w-4 h-4" /> حالة النشر
                </span>
                <span className="bg-green-500/20 text-green-500 px-3 py-1 rounded-md text-sm">
                  {novel.status}
                </span>
              </div>
            </div>
          </section>

          {/* Advert / Extra Card (Placeholder like Azora) */}
          <div className="glass p-6 rounded-2xl h-48 flex items-center justify-center border-dashed border-2 border-white/20">
            <span className="text-muted">مساحة إعلانية أو مقترحات</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NovelDetails;