import { useState, useMemo, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Newspaper, Clock, User, Calendar, ArrowLeft, X, Share2, Printer,
  AlertTriangle, RefreshCw, Home
} from 'lucide-react';
import { useToast } from '@/components/Toast';
import { dataLoaders } from '@/lib/loaders';

// Card shape rendered by the section — mapped from the backend NewsItem and
// ArticleItem models (NO static fallback; API data only).
interface FeedItem {
  id: string;
  kind: 'news' | 'article';
  title: string;
  category: string;
  date: string;
  readTime: string;
  excerpt: string;
  content: string;
  author: string;
  imageBg: string;
}

// Header banner gradients (cycled) — keeps the section's visual language.
const BANNER_GRADIENTS = [
  'from-emerald-900 to-navy-950',
  'from-amber-900 to-navy-950',
  'from-blue-900 to-navy-950',
];

const faDigits = (n: number) => String(n).replace(/\d/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[Number(d)]);

const formatDate = (iso: string) => {
  try {
    return new Date(iso).toLocaleDateString('fa-IR');
  } catch {
    return '';
  }
};

// Reading-time label: articles expose readingTimeMin; news is estimated
// from the content length (~600 chars per minute).
const readTimeLabel = (chars: number, readingTimeMin?: number) =>
  `${faDigits(readingTimeMin ?? Math.max(1, Math.ceil(chars / 600)))} دقیقه`;

export default function NewsArticlesSection() {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<string>('همه');
  const [selectedArticle, setSelectedArticle] = useState<FeedItem | null>(null);
  const [articles, setArticles] = useState<FeedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load the real news + articles feeds from the backend on mount.
  const loadFeed = useCallback(async () => {
    setLoading(true);
    setError(null);
    const [newsRes, articlesRes] = await Promise.all([
      dataLoaders.loadNews({ limit: 24 }),
      dataLoaders.loadArticles({ limit: 24 }),
    ]);
    const items: FeedItem[] = [];
    (newsRes.data || []).forEach((n, i) => {
      items.push({
        id: `news-${n.id}`,
        kind: 'news',
        title: n.title,
        category: n.category,
        date: formatDate(n.publishedAt),
        readTime: readTimeLabel(n.summary.length + n.content.length),
        excerpt: n.summary,
        content: n.content,
        author: n.authorName || 'تحریریه پلتفرم',
        imageBg: BANNER_GRADIENTS[i % BANNER_GRADIENTS.length],
      });
    });
    (articlesRes.data || []).forEach((a, i) => {
      items.push({
        id: `article-${a.id}`,
        kind: 'article',
        title: a.title,
        category: a.category,
        date: formatDate(a.publishedAt),
        readTime: readTimeLabel(a.summary.length + a.content.length, a.readingTimeMin),
        excerpt: a.summary,
        content: a.content,
        author: a.authorName || 'تحریریه پلتفرم',
        imageBg: BANNER_GRADIENTS[(i + 1) % BANNER_GRADIENTS.length],
      });
    });
    setArticles(items);
    // Only surface an error when BOTH feeds are unreachable.
    if (!newsRes.data && !articlesRes.data) {
      setError(newsRes.error || articlesRes.error || 'خطای ناشناخته');
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    void loadFeed();
  }, [loadFeed]);

  const categories = useMemo(
    () => ['همه', ...Array.from(new Set(articles.map((art) => art.category)))],
    [articles],
  );

  const filteredArticles = useMemo(() => {
    return articles.filter((art) => {
      if (activeTab === 'همه') return true;
      return art.category === activeTab;
    });
  }, [activeTab, articles]);

  const handleShare = (title: string) => {
    navigator.clipboard?.writeText(window.location.href);
    showToast(`لینک مقاله «${title}» کپی شد`, 'success');
  };

  return (
    <section id="news" className="py-24 relative overflow-hidden bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 text-blue-800 rounded-full px-4 py-1.5 mb-4 text-xs font-bold"
          >
            <Newspaper size={16} className="text-blue-600" />
            <span>پایگاه خبررسانی و تحلیل‌های حقوقی</span>
          </motion.div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-navy-900 mb-3">
            اخبار و مقالات تخصصی حقوق گردشگری
          </h2>
          <p className="text-navy-500 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
            آخرین بخشنامه‌های ابلاغی سازمان‌ها، گزارش‌های تحلیلی و یادداشت‌های تخصصی وکلای دادگستری
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveTab(cat)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                activeTab === cat
                  ? 'bg-navy-900 text-white shadow-soft'
                  : 'bg-white text-navy-600 hover:bg-navy-100 border border-navy-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Articles Grid — real API data only */}
        {loading ? (
          <div className="flex flex-col items-center justify-center gap-3 py-16" aria-live="polite">
            <span className="w-8 h-8 border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin"></span>
            <p className="text-sm text-navy-500">در حال بارگذاری اخبار و مقالات...</p>
          </div>
        ) : error ? (
          <div className="max-w-md mx-auto text-center bg-white rounded-2xl border border-navy-100 p-8">
            <div className="w-14 h-14 rounded-full bg-red-50 border border-red-100 flex items-center justify-center mx-auto mb-4">
              <AlertTriangle size={26} className="text-red-500" />
            </div>
            <h4 className="text-base font-bold text-navy-800 mb-1.5">خطا در بارگذاری اخبار و مقالات</h4>
            <p className="text-sm text-navy-500 mb-5 leading-relaxed">{error}</p>
            <button
              onClick={() => void loadFeed()}
              className="inline-flex items-center gap-2 bg-navy-900 hover:bg-navy-800 text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-colors"
            >
              <RefreshCw size={14} />
              تلاش مجدد
            </button>
          </div>
        ) : articles.length === 0 ? (
          <div className="max-w-md mx-auto text-center bg-white rounded-2xl border border-navy-100 p-8">
            <div className="w-14 h-14 rounded-full bg-navy-50 border-2 border-dashed border-navy-200 flex items-center justify-center mx-auto mb-4">
              <Newspaper size={26} className="text-navy-300" />
            </div>
            <h4 className="text-base font-bold text-navy-800 mb-1.5">خبری منتشر نشده است</h4>
            <p className="text-sm text-navy-500 mb-5 leading-relaxed">هنوز خبر یا مقاله‌ای در پلتفرم منتشر نشده است.</p>
            <a
              href="#/"
              className="inline-flex items-center gap-2 bg-navy-900 hover:bg-navy-800 text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-colors"
            >
              <Home size={14} />
              بازگشت به خانه
            </a>
          </div>
        ) : (
          <>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-7">
          {filteredArticles.map((article) => (
            <motion.div
              key={article.id}
              whileHover={{ y: -6 }}
              onClick={() => setSelectedArticle(article)}
              className="group bg-white rounded-3xl border border-navy-100 shadow-card hover:shadow-premium hover:border-emerald-300 transition-all overflow-hidden cursor-pointer flex flex-col justify-between"
            >
              <div>
                {/* Header Banner Background */}
                <div className={`h-40 bg-gradient-to-br ${article.imageBg} p-5 relative flex flex-col justify-between text-white overflow-hidden`}>
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
                  <div className="flex items-center justify-between relative z-10">
                    <span className="text-[10px] font-bold bg-white/20 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/20">
                      {article.category}
                    </span>
                    <span className="text-[11px] text-white/80 flex items-center gap-1">
                      <Clock size={12} /> {article.readTime}
                    </span>
                  </div>

                  <div className="relative z-10 flex items-center gap-2 text-[11px] text-emerald-300 font-medium">
                    <Calendar size={12} /> {article.date}
                  </div>
                </div>

                {/* Article Content Preview */}
                <div className="p-6">
                  <h3 className="font-extrabold text-navy-900 text-base mb-2.5 leading-snug group-hover:text-emerald-700 transition-colors">
                    {article.title}
                  </h3>
                  <p className="text-xs text-navy-600 line-clamp-3 leading-relaxed font-sans">
                    {article.excerpt}
                  </p>
                </div>
              </div>

              {/* Author Footer */}
              <div className="px-6 pb-6 pt-3 border-t border-navy-50 flex items-center justify-between text-xs text-navy-500 font-medium">
                <span className="flex items-center gap-1.5">
                  <User size={13} className="text-emerald-600" /> {article.author}
                </span>
                <span className="text-emerald-700 font-bold flex items-center gap-1 group-hover:translate-x-[-3px] transition-transform">
                  ادامه مطلب <ArrowLeft size={13} />
                </span>
              </div>
            </motion.div>
          ))}
            </div>

            {filteredArticles.length === 0 && (
              <div className="text-center py-12 text-sm text-navy-400 bg-white rounded-3xl border border-navy-100 max-w-md mx-auto">
                موردی در این دسته‌بندی منتشر نشده است.
              </div>
            )}
          </>
        )}
      </div>

      {/* Article Detail Reader Modal */}
      {selectedArticle && (
        <AnimatePresence>
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/70 backdrop-blur-md"
            onClick={() => setSelectedArticle(null)}
            dir="rtl"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden border border-navy-100 flex flex-col max-h-[90vh]"
            >
              {/* Modal Header */}
              <div className={`bg-gradient-to-br ${selectedArticle.imageBg} p-6 text-white flex items-start justify-between relative`}>
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[10px] font-bold bg-white/20 px-2.5 py-0.5 rounded-full border border-white/20">
                      {selectedArticle.category}
                    </span>
                    <span className="text-[11px] text-white/80">{selectedArticle.date}</span>
                  </div>
                  <h3 className="font-extrabold text-lg sm:text-xl text-white leading-tight">
                    {selectedArticle.title}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedArticle(null)}
                  className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors flex-shrink-0 mr-4"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Author metadata */}
              <div className="px-6 py-3 bg-navy-50/70 border-b border-navy-100 flex items-center justify-between text-xs text-navy-600">
                <span className="flex items-center gap-1.5 font-semibold">
                  <User size={14} className="text-emerald-600" /> نویسنده: {selectedArticle.author}
                </span>
                <span className="flex items-center gap-1">
                  <Clock size={13} /> زمان مطالعه: {selectedArticle.readTime}
                </span>
              </div>

              {/* Modal Body Content */}
              <div className="p-6 sm:p-8 overflow-y-auto space-y-4 text-xs sm:text-sm text-navy-800 leading-relaxed font-sans flex-1">
                <p className="font-bold text-navy-900 leading-relaxed bg-emerald-50/50 p-4 rounded-2xl border border-emerald-100 text-sm">
                  {selectedArticle.excerpt}
                </p>
                <div className="space-y-4 pt-2">
                  <p className="leading-relaxed text-navy-700">{selectedArticle.content}</p>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-4 bg-white border-t border-navy-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleShare(selectedArticle.title)}
                    className="flex items-center gap-1.5 bg-navy-50 hover:bg-navy-100 text-navy-700 px-3.5 py-2 rounded-xl text-xs font-semibold border border-navy-200 transition-colors"
                  >
                    <Share2 size={14} />
                    <span>اشتراک‌گذاری</span>
                  </button>
                  <button
                    onClick={() => window.print()}
                    className="flex items-center gap-1.5 bg-navy-50 hover:bg-navy-100 text-navy-700 px-3.5 py-2 rounded-xl text-xs font-semibold border border-navy-200 transition-colors"
                  >
                    <Printer size={14} />
                    <span>چاپ مقاله</span>
                  </button>
                </div>

                <button
                  onClick={() => setSelectedArticle(null)}
                  className="px-4 py-2 bg-navy-900 hover:bg-navy-800 text-white rounded-xl text-xs font-bold"
                >
                  بستن
                </button>
              </div>
            </motion.div>
          </div>
        </AnimatePresence>
      )}
    </section>
  );
}

