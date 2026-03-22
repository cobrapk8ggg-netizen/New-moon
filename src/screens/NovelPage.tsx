import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import Header from '../components/Header';
import { novelService, Novel, ChapterMeta, ChapterFull } from '../services/novel';
import { commentService, Comment, CommentStats } from '../services/comment';
import { Star, ChevronLeft, ChevronRight, Heart, ThumbsUp, ThumbsDown, ArrowUpDown, Eye, BookOpen, X, Calendar, MessageCircle } from 'lucide-react';
import { Skeleton, NovelPageSkeleton } from '../components/Skeleton';

// Modal for page selection (same as before)
const PageSelectorModal = ({ isOpen, onClose, totalPages, currentPage, onSelectPage }: {
  isOpen: boolean;
  onClose: () => void;
  totalPages: number;
  currentPage: number;
  onSelectPage: (page: number) => void;
}) => {
  const [inputPage, setInputPage] = useState(currentPage.toString());

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const pageNum = parseInt(inputPage);
    if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= totalPages) {
      onSelectPage(pageNum);
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 50 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[320px] bg-[#1a1a1a] rounded-2xl shadow-2xl border border-white/10 overflow-hidden"
          >
            <div className="p-5">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-white">اختر الصفحة</h3>
                <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-full transition-colors">
                  <X size={20} className="text-gray-400" />
                </button>
              </div>
              <form onSubmit={handleSubmit}>
                <input
                  type="number"
                  value={inputPage}
                  onChange={(e) => setInputPage(e.target.value)}
                  min={1}
                  max={totalPages}
                  className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-3 text-white text-center text-lg focus:outline-none focus:border-primary transition-colors"
                  placeholder="رقم الصفحة"
                />
                <div className="flex gap-2 mt-4">
                  <button type="submit" className="flex-1 bg-primary hover:bg-primary/80 text-white font-bold py-2 rounded-xl transition-colors">
                    انتقال
                  </button>
                  <button type="button" onClick={onClose} className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 rounded-xl transition-colors">
                    إلغاء
                  </button>
                </div>
              </form>
              <div className="mt-4 text-center text-sm text-gray-400">
                الصفحة {currentPage} من {totalPages}
              </div>
            </div>
            <div className="h-1 bg-gradient-to-r from-primary to-purple-500" />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default function NovelPage() {
  const { slug } = useParams<{ slug: string }>();
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [novel, setNovel] = useState<Novel | null>(null);
  const [chapters, setChapters] = useState<ChapterMeta[]>([]);
  const [chaptersPage, setChaptersPage] = useState(1);
  const [totalChapters, setTotalChapters] = useState(0);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [loadingNovel, setLoadingNovel] = useState(true);
  const [loadingChapters, setLoadingChapters] = useState(false);
  const [activeTab, setActiveTab] = useState<'chapters' | 'description' | 'views'>('chapters');
  const [chapterSearch, setChapterSearch] = useState('');
  const [selectedChapter, setSelectedChapter] = useState<ChapterFull | null>(null);
  const [showReader, setShowReader] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentsStats, setCommentsStats] = useState<CommentStats | null>(null);
  const [loadingComments, setLoadingComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [userReaction, setUserReaction] = useState<string | null>(null);
  const [reactionStats, setReactionStats] = useState({ like: 0, love: 0, funny: 0, sad: 0, angry: 0 });
  const [isFavorite, setIsFavorite] = useState(false);
  const [userProgress, setUserProgress] = useState<{ progress: number; lastChapterId: number; readChapters: number[] }>({
    progress: 0,
    lastChapterId: 0,
    readChapters: [],
  });
  const [isPageModalOpen, setIsPageModalOpen] = useState(false);

  const chaptersPerPage = 25;
  const totalPages = Math.ceil(totalChapters / chaptersPerPage);

  // Fetch novel data
  useEffect(() => {
    if (!slug) return;
    const fetchNovel = async () => {
      try {
        setLoadingNovel(true);
        const data = await novelService.getNovelById(slug);
        setNovel(data);
        setTotalChapters(data.chaptersCount);
        const token = localStorage.getItem('token');
        if (token) {
          const status = await novelService.getNovelStatus(slug);
          setIsFavorite(status.isFavorite);
          setUserProgress({
            progress: status.progress,
            lastChapterId: status.lastChapterId,
            readChapters: status.readChapters || [],
          });
        }
      } catch (err: any) {
        console.error(err);
      } finally {
        setLoadingNovel(false);
      }
    };
    fetchNovel();
  }, [slug]);

  // Fetch chapters with pagination and sort
  useEffect(() => {
    if (!slug) return;
    const fetchChapters = async () => {
      setLoadingChapters(true);
      try {
        const list = await novelService.getChaptersList(slug, chaptersPage, chaptersPerPage, sortOrder);
        setChapters(list);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingChapters(false);
      }
    };
    fetchChapters();
  }, [slug, chaptersPage, sortOrder]);

  // Fetch comments
  useEffect(() => {
    if (!slug) return;
    const fetchComments = async () => {
      setLoadingComments(true);
      try {
        const res = await commentService.getComments(slug, undefined, 1, 20);
        setComments(res.comments);
        setCommentsStats(res.stats);
        setUserReaction(res.stats.userReaction);
        setReactionStats({
          like: res.stats.like,
          love: res.stats.love,
          funny: res.stats.funny,
          sad: res.stats.sad,
          angry: res.stats.angry,
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingComments(false);
      }
    };
    fetchComments();
  }, [slug]);

  const handleReaction = async (type: 'like' | 'love' | 'funny' | 'sad' | 'angry') => {
    if (!slug) return;
    try {
      const result = await novelService.reactToNovel(slug, type);
      setReactionStats({
        like: result.like,
        love: result.love,
        funny: result.funny,
        sad: result.sad,
        angry: result.angry,
      });
      setUserReaction(result.userReaction);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddToFavorites = async () => {
    if (!slug || !novel) return;
    try {
      await novelService.updateReadingStatus({
        novelId: slug,
        title: novel.title,
        cover: novel.cover,
        author: novel.author,
        isFavorite: !isFavorite,
      });
      setIsFavorite(!isFavorite);
    } catch (err) {
      console.error(err);
    }
  };

  const handleChapterClick = async (chapter: ChapterMeta) => {
    if (!slug) return;
    try {
      const full = await novelService.getChapter(slug, chapter._id);
      setSelectedChapter(full);
      setShowReader(true);
      if (userProgress.readChapters.indexOf(chapter.number) === -1) {
        const newRead = [...userProgress.readChapters, chapter.number];
        setUserProgress(prev => ({ ...prev, readChapters: newRead, lastChapterId: chapter.number }));
        await novelService.updateReadingStatus({
          novelId: slug,
          lastChapterId: chapter.number,
          lastChapterTitle: full.title,
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddComment = async () => {
    if (!slug || !newComment.trim()) return;
    try {
      const comment = await commentService.addComment(slug, newComment);
      setComments([comment, ...comments]);
      setNewComment('');
    } catch (err: any) {
      alert(err.message);
    }
  };

  const toggleSortOrder = () => {
    setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'));
    setChaptersPage(1);
  };

  const goToPage = (page: number) => {
    setChaptersPage(Math.min(Math.max(1, page), totalPages));
  };

  const filteredChapters = chapters.filter(ch =>
    ch.number.toString().includes(chapterSearch) ||
    ch.title.toLowerCase().includes(chapterSearch.toLowerCase())
  );

  // Show skeleton loader while loading
  if (loadingNovel) {
    return <NovelPageSkeleton />;
  }

  if (!novel) {
    return (
      <div className="min-h-screen bg-background text-foreground" dir="rtl">
        <Header isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
        <div className="flex items-center justify-center h-64">الرواية غير موجودة</div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-background text-foreground">
      <Header isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />

      {/* Background with parallax effect */}
      <div className="fixed w-full h-screen z-0 top-0 left-0">
        <img
          alt="Background"
          width={1920}
          height={1080}
          className="object-cover object-top opacity-40 dark:opacity-100"
          src={novel.cover}
        />
        <div className="hidden dark:block" style={{ background: 'linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.9), rgba(0,0,0,0.9), rgb(0,0,0))', position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0 }}></div>
        <div className="block dark:hidden" style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.15) 0%, rgba(248,250,252,0.70) 35%, rgba(255,255,255,0.90) 70%, rgba(255,255,255,0.98) 100%)', position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0 }}></div>
      </div>

      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-[1400px] mx-auto my-6 sm:px-2 md:px-4 lg:px-6 relative z-10"
      >
        <div className="flex flex-col gap-4 lg:gap-5 sm:flex-row">
          {/* Left Column */}
          <div className="flex w-full h-auto shrink-0 flex-col gap-3 rounded-lg sm:w-[240px] lg:w-[240px] xl:w-[270px] px-2 sm:p-0 md:sticky md:top-[76px] md:self-start">
            <motion.img
              whileHover={{ scale: 1.02 }}
              transition={{ type: 'spring', stiffness: 300 }}
              alt={`Cover of ${novel.title}`}
              loading="eager"
              width={400}
              height={320}
              className="w-full rounded-lg object-cover object-bottom sm:max-h-[400px] h-auto"
              src={novel.cover}
            />
            <div className="hidden sm:block">
              <div className="flex flex-col gap-2">
                <div className="grid grid-cols-2 gap-[.5rem] text-[.75rem] leading-4">
                  <div>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => chapters.length > 0 && handleChapterClick(chapters[0])}
                      className="items-center whitespace-nowrap text-sm ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 text-primary-foreground px-4 h-full w-full rounded bg-[#d61a4c] hover:bg-[#d61a4c]/80 flex justify-center content-center font-bold py-3"
                    >
                      اقرأ الفصل {chapters[0]?.number || '1'}
                    </motion.button>
                  </div>
                  <div>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleAddToFavorites}
                      className={`inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 text-primary-foreground px-4 py-2 select-none w-full rounded h-12 ${isFavorite ? 'bg-[#186ae6]/80' : 'bg-[#186ae6]'} hover:bg-[#186ae6]/80`}
                    >
                      <span className="text-white">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="inline-block mx-1 size-4">
                          <path fillRule="evenodd" d="M6.32 2.577a49.255 49.255 0 0 1 11.36 0c1.497.174 2.57 1.46 2.57 2.93V21a.75.75 0 0 1-1.085.67L12 18.089l-7.165 3.583A.75.75 0 0 1 3.75 21V5.507c0-1.47 1.073-2.756 2.57-2.93Z" clipRule="evenodd"></path>
                        </svg>
                        <span className="font-normal">{isFavorite ? 'تمت الإضافة' : 'إضافة للمفضلة'}</span>
                      </span>
                    </motion.button>
                  </div>
                </div>
              </div>
              <div className="flex-center pt-2">
                <button className="justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 px-4 py-2 w-full rounded h-12 bg-neutral-700 hover:bg-neutral-600 text-white flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-flag w-5 h-5">
                    <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"></path>
                    <line x1="4" x2="4" y1="22" y2="15"></line>
                  </svg>
                  الإبلاغ عن مشكلة
                </button>
              </div>
            </div>

            {/* Stats: Views & Favorites side by side */}
            <div className="grid grid-cols-2 gap-3 mt-2">
              <div className="bg-[#29292966]/40 rounded-xl p-3 text-center border border-white/10">
                <Eye className="w-6 h-6 text-blue-400 mx-auto mb-1" />
                <div className="text-2xl font-bold">{novel.views.toLocaleString('ar-EG')}</div>
                <div className="text-xs text-gray-400">مشاهدة</div>
              </div>
              <div className="bg-[#29292966]/40 rounded-xl p-3 text-center border border-white/10">
                <Heart className="w-6 h-6 text-pink-400 mx-auto mb-1" />
                <div className="text-2xl font-bold">{novel.favorites.toLocaleString('ar-EG')}</div>
                <div className="text-xs text-gray-400">مفضلة</div>
              </div>
            </div>

            <div className="h-px bg-white/10 my-2" />

            <div className="text-foreground space-y-2">
              {/* Status with divider */}
              <div className="flex justify-between items-center py-2 border-b border-white/10">
                <h1 className="font-semibold text-medium">الحالة</h1>
                <div className="flex items-center">
                  <span className={`h-2 w-2 rounded-full ${novel.status === 'مستمرة' ? 'bg-green-500' : 'bg-red-500'} mr-1`} />
                  <p className="font-normal text-sm">{novel.status}</p>
                </div>
              </div>

              {/* Categories with divider */}
              <div className="flex justify-between items-center py-2 border-b border-white/10">
                <h1 className="font-semibold text-medium">التصنيفات</h1>
                <div className="flex flex-wrap gap-1 justify-end">
                  {novel.tags?.slice(0, 3).map(tag => (
                    <span key={tag} className="px-2 py-0.5 rounded text-xs bg-primary/20 text-primary">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Chapters count with divider */}
              <div className="flex justify-between items-center py-2 border-b border-white/10">
                <h1 className="font-semibold text-medium">الفصول</h1>
                <p className="font-normal text-sm">{totalChapters}</p>
              </div>

              {/* Last update with divider */}
              <div className="flex justify-between items-center py-2 border-b border-white/10">
                <h1 className="font-semibold text-medium">آخر تحديث</h1>
                <p className="font-normal text-sm">
                  {new Date(novel.lastChapterUpdate).toLocaleDateString('en-GB')}
                </p>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="flex flex-1 min-w-0 flex-col gap-3 px-2 sm:px-3 py-4">
            <div className="flex flex-col gap-1 md:gap-2">
              <h1 className="text-2xl font-bold text-foreground leading-[1.5rem]">{novel.title}</h1>
              <div className="text-sm text-gray-400">بواسطة {novel.author}</div>
            </div>

            {/* Small screen action buttons */}
            <div className="block lg:hidden md:hidden sm:hidden">
              <div className="flex flex-col gap-2">
                <div className="grid grid-cols-2 gap-[.5rem] text-[.75rem] leading-4">
                  <div>
                    <button
                      onClick={() => chapters.length > 0 && handleChapterClick(chapters[0])}
                      className="items-center whitespace-nowrap text-sm ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 text-primary-foreground px-4 h-full w-full rounded bg-[#d61a4c] hover:bg-[#d61a4c]/80 flex justify-center content-center font-bold py-3"
                    >
                      اقرأ الفصل {chapters[0]?.number || '1'}
                    </button>
                  </div>
                  <div>
                    <button
                      onClick={handleAddToFavorites}
                      className={`inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 text-primary-foreground px-4 py-2 select-none w-full rounded h-12 ${isFavorite ? 'bg-[#186ae6]/80' : 'bg-[#186ae6]'} hover:bg-[#186ae6]/80`}
                    >
                      <span className="text-white">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="inline-block mx-1 size-4">
                          <path fillRule="evenodd" d="M6.32 2.577a49.255 49.255 0 0 1 11.36 0c1.497.174 2.57 1.46 2.57 2.93V21a.75.75 0 0 1-1.085.67L12 18.089l-7.165 3.583A.75.75 0 0 1 3.75 21V5.507c0-1.47 1.073-2.756 2.57-2.93Z" clipRule="evenodd"></path>
                        </svg>
                        <span className="font-normal">{isFavorite ? 'تمت الإضافة' : 'إضافة للمفضلة'}</span>
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="h-px bg-white/10 my-2" />

            {/* Tabs */}
            <div className="flex border-b border-white/10">
              <button
                onClick={() => setActiveTab('chapters')}
                className={`px-4 py-2 font-medium transition-colors relative ${activeTab === 'chapters' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}
              >
                الفصول ({totalChapters})
                {activeTab === 'chapters' && (
                  <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
                )}
              </button>
              <button
                onClick={() => setActiveTab('description')}
                className={`px-4 py-2 font-medium transition-colors relative ${activeTab === 'description' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}
              >
                الملخص
                {activeTab === 'description' && (
                  <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
                )}
              </button>
              <button
                onClick={() => setActiveTab('views')}
                className={`px-4 py-2 font-medium transition-colors relative ${activeTab === 'views' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}
              >
                المشاهدات
                {activeTab === 'views' && (
                  <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
                )}
              </button>
            </div>

            {/* Chapters Tab */}
            {activeTab === 'chapters' && (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-1">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-search absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400">
                      <circle cx="11" cy="11" r="8" />
                      <path d="m21 21-4.3-4.3" />
                    </svg>
                    <input
                      type="text"
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pr-10 pl-4 text-white placeholder:text-gray-500 focus:outline-none focus:border-primary transition-colors"
                      placeholder="البحث برقم الفصل أو العنوان..."
                      value={chapterSearch}
                      onChange={(e) => setChapterSearch(e.target.value)}
                    />
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={toggleSortOrder}
                    className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors"
                  >
                    <ArrowUpDown size={18} />
                    <span>{sortOrder === 'asc' ? 'الأحدث أولاً' : 'الأقدم أولاً'}</span>
                  </motion.button>
                </div>

                <div className="space-y-2">
                  {loadingChapters ? (
                    // Skeleton for chapters
                    <>
                      <Skeleton className="h-16 rounded-xl" count={5} />
                    </>
                  ) : filteredChapters.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">لا توجد فصول مطابقة</div>
                  ) : (
                    filteredChapters.map((chapter, idx) => (
                      <motion.div
                        key={chapter._id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: idx * 0.02 }}
                        whileHover={{ x: 4 }}
                        className="flex items-center justify-between bg-white/5 hover:bg-white/10 rounded-xl p-3 cursor-pointer transition-all border border-white/5 hover:border-white/20"
                        onClick={() => handleChapterClick(chapter)}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                            <span className="text-primary font-bold">{chapter.number}</span>
                          </div>
                          <div>
                            <div className="font-semibold">الفصل {chapter.number}</div>
                            <div className="text-sm text-gray-400 line-clamp-1">{chapter.title}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <MessageCircle size={14} />
                            0
                          </span>
                          <span className="flex items-center gap-1">
                            <Eye size={14} />
                            {chapter.views}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar size={14} />
                            {new Date(chapter.createdAt).toLocaleDateString('en-GB')}
                          </span>
                        </div>
                      </motion.div>
                    ))
                  )}
                </div>

                {totalPages > 1 && (
                  <div className="flex items-center justify-between pt-4 border-t border-white/10">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => goToPage(chaptersPage - 1)}
                      disabled={chaptersPage === 1}
                      className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/10 transition-colors"
                    >
                      <ChevronRight size={20} />
                      التالي
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setIsPageModalOpen(true)}
                      className="px-6 py-2 bg-primary/20 hover:bg-primary/30 rounded-xl transition-colors font-medium"
                    >
                      الصفحة {chaptersPage} من {totalPages}
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => goToPage(chaptersPage + 1)}
                      disabled={chaptersPage === totalPages}
                      className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/10 transition-colors"
                    >
                      <ChevronLeft size={20} />
                      السابق
                    </motion.button>
                  </div>
                )}

                <PageSelectorModal
                  isOpen={isPageModalOpen}
                  onClose={() => setIsPageModalOpen(false)}
                  totalPages={totalPages}
                  currentPage={chaptersPage}
                  onSelectPage={goToPage}
                />
              </div>
            )}

            {/* Description Tab */}
            {activeTab === 'description' && (
              <div className="prose dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: novel.description }} />
            )}

            {/* Views Tab */}
            {activeTab === 'views' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white/5 rounded-2xl p-6 text-center border border-white/10">
                    <Eye className="w-12 h-12 text-blue-500 mx-auto mb-3" />
                    <div className="text-3xl font-bold">{novel.views.toLocaleString('ar-EG')}</div>
                    <div className="text-gray-400 mt-1">إجمالي المشاهدات</div>
                  </div>
                  <div className="bg-white/5 rounded-2xl p-6 text-center border border-white/10">
                    <div className="text-3xl font-bold">{totalChapters}</div>
                    <div className="text-gray-400 mt-1">عدد الفصول</div>
                  </div>
                  <div className="bg-white/5 rounded-2xl p-6 text-center border border-white/10">
                    <div className="text-3xl font-bold">{novel.favorites.toLocaleString('ar-EG')}</div>
                    <div className="text-gray-400 mt-1">عدد المفضلات</div>
                  </div>
                </div>

                {/* Reactions (optional) */}
                <div className="mt-6">
                  <h3 className="text-lg font-bold mb-4">تفاعلات الرواية</h3>
                  <div className="flex flex-wrap justify-center gap-4">
                    <button onClick={() => handleReaction('like')} className={`flex flex-col items-center gap-1 p-2 rounded-lg transition ${userReaction === 'like' ? 'bg-blue-500/20' : 'hover:bg-white/5'}`}>
                      <ThumbsUp className="w-8 h-8" />
                      <span>{reactionStats.like}</span>
                    </button>
                    <button onClick={() => handleReaction('love')} className={`flex flex-col items-center gap-1 p-2 rounded-lg transition ${userReaction === 'love' ? 'bg-red-500/20' : 'hover:bg-white/5'}`}>
                      <Heart className="w-8 h-8 text-red-500" />
                      <span>{reactionStats.love}</span>
                    </button>
                    <button onClick={() => handleReaction('funny')} className={`flex flex-col items-center gap-1 p-2 rounded-lg transition ${userReaction === 'funny' ? 'bg-yellow-500/20' : 'hover:bg-white/5'}`}>
                      <span className="text-2xl">😂</span>
                      <span>{reactionStats.funny}</span>
                    </button>
                    <button onClick={() => handleReaction('sad')} className={`flex flex-col items-center gap-1 p-2 rounded-lg transition ${userReaction === 'sad' ? 'bg-blue-500/20' : 'hover:bg-white/5'}`}>
                      <span className="text-2xl">😢</span>
                      <span>{reactionStats.sad}</span>
                    </button>
                    <button onClick={() => handleReaction('angry')} className={`flex flex-col items-center gap-1 p-2 rounded-lg transition ${userReaction === 'angry' ? 'bg-red-500/20' : 'hover:bg-white/5'}`}>
                      <span className="text-2xl">😠</span>
                      <span>{reactionStats.angry}</span>
                    </button>
                  </div>
                </div>

                {/* Comments Section */}
                <div>
                  <h3 className="text-lg font-bold mb-4">التعليقات</h3>
                  <div className="bg-muted/20 p-4 rounded-lg">
                    <textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      className="w-full bg-background border border-border rounded-lg p-3 mb-2"
                      rows={3}
                      placeholder="أضف تعليقك..."
                    />
                    <button
                      onClick={handleAddComment}
                      className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/80"
                    >
                      أضف تعليق
                    </button>
                  </div>
                  <div className="mt-4 space-y-4">
                    {loadingComments ? (
                      <Skeleton className="h-24 rounded-xl" count={3} />
                    ) : comments.length === 0 ? (
                      <div className="text-center text-muted-foreground py-8">لا توجد تعليقات بعد</div>
                    ) : (
                      comments.map(comment => (
                        <div key={comment._id} className="bg-muted/10 p-4 rounded-lg">
                          <div className="flex items-center gap-2 mb-2">
                            <img src={comment.user.picture || '/default-avatar.png'} alt={comment.user.name} className="w-8 h-8 rounded-full" />
                            <span className="font-bold">{comment.user.name}</span>
                            <span className="text-xs text-muted-foreground">{new Date(comment.createdAt).toLocaleString()}</span>
                          </div>
                          <p className="text-foreground">{comment.content}</p>
                          <div className="flex gap-4 mt-2">
                            <button className="text-xs text-muted-foreground hover:text-primary">رد</button>
                            <button className="text-xs text-muted-foreground hover:text-primary">إعجاب</button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.section>

      {/* Reader Modal */}
      <AnimatePresence>
        {showReader && selectedChapter && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 overflow-y-auto"
            onClick={() => setShowReader(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="min-h-screen py-8 px-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="max-w-4xl mx-auto bg-[#0a0a0a] rounded-2xl shadow-2xl relative">
                <button
                  onClick={() => setShowReader(false)}
                  className="absolute top-4 left-4 z-10 p-2 bg-gray-800 rounded-full hover:bg-gray-700 transition-colors"
                >
                  <ChevronLeft size={24} />
                </button>
                <div className="p-6 md:p-8">
                  <h1 className="text-2xl font-bold mb-6 text-center">
                    الفصل {selectedChapter.number}: {selectedChapter.title}
                  </h1>
                  <div
                    className="chapter-content prose dark:prose-invert max-w-none leading-loose"
                    style={{
                      fontSize: selectedChapter.copyrightStyles?.fontSize || 18,
                      textAlign: selectedChapter.copyrightStyles?.alignment === 'center' ? 'center' : 'right',
                    }}
                  >
                    {selectedChapter.copyrightStart && (
                      <div className="text-center text-gray-500 mb-6 pb-4 border-b border-white/10">
                        {selectedChapter.copyrightStart}
                      </div>
                    )}
                    <div dangerouslySetInnerHTML={{ __html: selectedChapter.content.replace(/\n/g, '<br/>') }} />
                    {selectedChapter.copyrightEnd && (
                      <div className="text-center text-gray-500 mt-6 pt-4 border-t border-white/10">
                        {selectedChapter.copyrightEnd}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}