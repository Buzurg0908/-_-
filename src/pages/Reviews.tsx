import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Star, MessageSquare, Filter, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { Link } from 'react-router-dom';
import { cn } from '../lib/utils';
import { api } from '../lib/api';

export function Reviews() {
  const { t, language } = useLanguage();
  const [data, setData] = useState<any>({ reviews: [], stats: null });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.reviews.get()
      .then(setData)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const { reviews, stats } = data;
  const avgRating = stats?.avg_rating ? Number(stats.avg_rating).toFixed(1) : '0.0';

  const pct = (count: number) => stats?.total ? Math.round((count / stats.total) * 100) : 0;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20 md:pb-0">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-4 md:px-0">
        <div>
          <h1 className="text-3xl md:text-5xl font-display font-black tracking-tighter uppercase italic text-white/90 leading-none">
            {t('rev_title').split(' ')[0]} <span className="neon-text">{t('rev_title').split(' ').slice(1).join(' ')}</span>
          </h1>
          <p className="text-white/40 text-xs md:text-sm mt-2 font-medium italic">{t('rev_subtitle')}</p>
        </div>
        <div className="flex gap-2">
          <button className="flex-1 md:flex-none px-4 py-3.5 glass rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 text-white/60">
            <Filter size={14} /> {t('rev_filter')}
          </button>
          <Link to="/marketplace" className="flex-1 md:flex-none px-6 py-3.5 bg-white text-black font-black rounded-xl text-[10px] uppercase hover:bg-cyan-400 transition-all shadow-lg active:scale-95 flex items-center justify-center">
            {t('rev_write')}
          </Link>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 px-4 md:px-0">
        <div className="lg:col-span-1 space-y-6">
          <div className="glass-card p-8 text-center space-y-4 rounded-3xl border border-white/5 bg-white/[0.02]">
            <div className="text-6xl font-display font-black" style={{ color: avgRating === '0.0' ? 'rgba(255,255,255,0.1)' : 'white' }}>{avgRating}</div>
            <div className="flex justify-center gap-1">
              {[1,2,3,4,5].map(i => (
                <Star key={i} size={20} fill="currentColor"
                  className={i <= Math.round(Number(avgRating)) ? 'text-amber-400' : 'text-white/5'} />
              ))}
            </div>
            <div className="text-[10px] font-black uppercase tracking-widest text-white/30">{t('rev_platform_rating')}</div>
            <div className="pt-4 border-t border-white/5 space-y-3">
              {[5,4,3,2,1].map(stars => (
                <div key={stars} className="flex items-center gap-3 text-[10px] font-black">
                  <span className="w-4 text-white/40">{stars}★</span>
                  <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <motion.div initial={{ width: 0 }}
                      animate={{ width: `${pct(stats?.[`${['one','two','three','four','five'][stars-1]}_star`] || 0)}%` }}
                      transition={{ duration: 1, delay: 0.2 }}
                      className="h-full bg-cyan-400 rounded-full" />
                  </div>
                  <span className="w-8 text-white/30">{pct(stats?.[`${['one','two','three','four','five'][stars-1]}_star`] || 0)}%</span>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card p-6 border border-white/5 bg-gradient-to-br from-magenta-500/5 to-transparent rounded-3xl">
            <h3 className="font-bold text-[10px] uppercase tracking-widest text-white/80 mb-3">{t('rev_integrity')}</h3>
            <p className="text-[10px] text-white/40 leading-relaxed italic font-medium">{t('rev_integrity_text')}</p>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          {loading ? (
            [1,2,3].map(i => <div key={i} className="glass-card rounded-3xl border border-white/5 h-32 animate-pulse" />)
          ) : reviews.length === 0 ? (
            <div className="glass-card p-20 text-center flex flex-col items-center gap-4 rounded-3xl border border-white/5 bg-white/[0.02]">
              <MessageSquare size={40} className="text-white/10 animate-pulse" />
              <div className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20 italic">{t('rev_no_reviews')}</div>
              <p className="text-[10px] text-white/20 max-w-xs mx-auto">
                {language === 'ru' ? 'Выполните заказ чтобы получить первый отзыв' : 'Complete an order to receive your first review'}
              </p>
            </div>
          ) : reviews.map((review: any, idx: number) => (
            <motion.div key={review.id}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.08 }}
              className="glass-card p-6 md:p-8 space-y-5 rounded-3xl border border-white/5 bg-white/[0.02] group">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="relative shrink-0">
                    <div className="w-12 h-12 rounded-xl border border-white/10 overflow-hidden bg-white/5">
                      {review.reviewer_avatar
                        ? <img src={review.reviewer_avatar} alt="" className="w-full h-full object-cover" />
                        : <div className="w-full h-full flex items-center justify-center font-black text-white/30">{review.reviewer_name?.[0]}</div>}
                    </div>
                    <div className="absolute -bottom-1 -right-1 bg-cyan-500 text-black p-0.5 rounded-full shadow-lg"><CheckCircle2 size={10} /></div>
                  </div>
                  <div>
                    <div className="font-bold text-sm text-white/90">{review.reviewer_name}</div>
                    <div className="text-[9px] text-white/30 uppercase font-black tracking-widest">{review.order_title}</div>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-amber-400 shrink-0">
                  {[...Array(review.rating)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
                </div>
              </div>
              <p className="text-sm text-white/60 leading-relaxed italic">"{review.comment}"</p>
              <div className="text-[9px] text-white/20 font-black uppercase tracking-widest border-t border-white/5 pt-3">
                {new Date(review.created_at).toLocaleDateString()}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}