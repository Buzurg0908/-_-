import React from 'react';
import { motion } from 'motion/react';
import { 
  Zap, 
  Star, 
  MapPin, 
  Calendar, 
  Globe, 
  ExternalLink, 
  ShieldCheck, 
  Heart,
  Share2,
  MessageSquare,
  Award,
  CheckCircle2,
  TrendingUp,
  Info,
  ArrowUpRight
} from 'lucide-react';
import { cn } from '../lib/utils';
import { useLanguage } from '../context/LanguageContext';

export function Profile() {
  const { t, language } = useLanguage();

  const skills = [
    { name: 'React/Next.js', level: 98, color: 'bg-cyan-400' },
    { name: 'Three.js/WebGL', level: 92, color: 'bg-indigo-400' },
    { name: language === 'ru' ? '' : 'AI Engineering', level: 85, color: 'bg-purple-400' },
    { name: 'Node.js Architecture', level: 90, color: 'bg-emerald-400' },
  ];

  const portfolio = [
    { title: 'Neural Finance Dashboard', category: language === 'ru' ? 'ФИНТЕХ' : 'FINTECH', img: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?auto=format&fit=crop&q=80&w=800' },
    { title: 'Cyber-Concierge AI', category: 'AI/ML', img: 'https://images.unsplash.com/photo-1639322537228-f710d846310a?auto=format&fit=crop&q=80&w=800' },
    { title: '3D Luxury Metaverse', category: '3D/WEBGL', img: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&q=80&w=800' },
    { title: 'Web3 Escrow Protocol', category: language === 'ru' ? 'БЛОКЧЕЙН' : 'BLOCKCHAIN', img: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&q=80&w=800' },
  ];

  const reviews = [
    { author: 'Cyberdyne Systems', rating: 5, comment: language === 'ru' ? "Алекс — редкий талант,  Настоятельно рекомендую для элитных проектов." : "Alex is a rare talent . Highly recommended for elite projects.", avatar: 'CS' },
    { author: 'Neo-City Gov', rating: 5, comment: language === 'ru' ? "Быстро, безопасно и футуристично. Дашборд, который построил Алекс, преобразил наше управление данными." : "Fast, secure, and futuristic. The dashboard Alex built transformed our data management.", avatar: 'NC' },
  ];

  return (
    <div className="space-y-8 md:space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* HEADER SECTION */}
      <section className="glass-card p-6 md:p-12 relative overflow-hidden rounded-3xl">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-cyan-500/10 to-transparent pointer-events-none" />
        <div className="relative flex flex-col md:flex-row gap-6 md:gap-10 items-center md:items-start z-10 text-center md:text-left">
           <div className="relative shrink-0">
              <div className="w-32 h-32 md:w-40 md:h-40 rounded-3xl border-4 border-cyan-500/20 p-2 group bg-white/5 overflow-hidden shadow-2xl">
                 <motion.div 
                   animate={{ rotate: 360 }}
                   transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                   className="absolute inset-0 rounded-3xl border-2 border-dashed border-cyan-400 opacity-20 pointer-events-none"
                 />
                 <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Alex" alt="Avatar" className="w-full h-full rounded-2xl transition-transform group-hover:scale-110 object-cover" />
              </div>
              <div className="absolute -bottom-2 -right-2 w-8 h-8 md:w-10 md:h-10 rounded-xl bg-emerald-500 border-4 border-black flex items-center justify-center shadow-lg">
                 <Zap size={16} className="text-white fill-white animate-pulse shrink-0" />
              </div>
           </div>

           <div className="flex-1 space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                 <div>
                    <h1 className="text-3xl md:text-5xl font-display font-black tracking-tighter flex items-center justify-center md:justify-start gap-4 uppercase italic">
                      Alex Rivera <CheckCircle2 className="text-cyan-400 shrink-0" size={28} />
                    </h1>
                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 md:gap-5 text-[8px] md:text-[10px] font-black text-white/30 uppercase tracking-[0.15em] md:tracking-[0.2em] mt-3">
                       <span className="flex items-center gap-1 shrink-0"><MapPin size={12} className="shrink-0" /> Neo-London, UK</span>
                       <span className="flex items-center gap-1 shrink-0"><Calendar size={12} className="shrink-0" /> {t('prof_member_since')} 2024</span>
                       <span className="flex items-center gap-1 shrink-0"><Globe size={12} className="shrink-0" /> {t('prof_languages')}</span>
                    </div>
                 </div>
                 <div className="flex gap-2 md:gap-3 justify-center">
                    <button className="px-6 md:px-8 py-3.5 md:py-4 bg-white text-black font-black rounded-xl md:rounded-2xl text-[9px] md:text-[10px] uppercase tracking-widest hover:bg-cyan-400 transition-all flex items-center gap-2 shadow-xl active:scale-95">
                       <MessageSquare size={16} className="shrink-0" /> {t('prof_hired')}
                    </button>
                    <button className="p-3.5 md:p-4 glass rounded-xl md:rounded-2xl text-white/40 hover:text-white hover:bg-white/10 transition-all shrink-0">
                       <Heart size={18} className="shrink-0" />
                    </button>
                    <button className="p-3.5 md:p-4 glass rounded-xl md:rounded-2xl text-white/40 hover:text-white hover:bg-white/10 transition-all shrink-0">
                       <Share2 size={18} className="shrink-0" />
                    </button>
                 </div>
              </div>

              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 md:gap-8 pt-6 md:pt-8 border-t border-white/5">
                 {[
                   { label: t('prof_rating'), val: '4.98 ★', icon: Star, color: 'text-amber-400' },
                   { label: t('prof_success'), val: '100%', icon: ShieldCheck, color: 'text-cyan-400' },
                   { label: t('prof_earned'), val: '$240K+', icon: TrendingUp, color: 'text-emerald-400' },
                   { label: t('prof_status'), val: 'VERIFIED', icon: Award, color: 'text-blue-400' },
                 ].map((stat) => (
                    <div key={stat.label} className="flex flex-col items-center md:items-start shrink-0 min-w-[80px]">
                       <span className="text-[8px] md:text-[9px] font-black uppercase text-white/30 tracking-[0.2em] md:tracking-[0.3em] flex items-center gap-2 mb-1.5 md:mb-2">
                         <stat.icon size={10} className={`${stat.color} shrink-0`} /> {stat.label}
                       </span>
                       <span className="text-lg md:text-xl font-black font-display tracking-tight text-white">{stat.val}</span>
                    </div>
                 ))}
              </div>
           </div>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-20">
        {/* LEFT: INFO & SKILLS */}
        <div className="lg:col-span-4 space-y-6">
           <div className="glass-card p-8 md:p-10 space-y-8 md:space-y-10 border border-white/5 rounded-3xl">
              <div className="space-y-4">
                 <h3 className="font-black text-[9px] md:text-[10px] uppercase tracking-[0.3em] md:tracking-[0.4em] text-white/30 flex items-center gap-2 mb-4 md:mb-6">
                   <Info size={16} className="text-cyan-400 shrink-0" /> {t('prof_about_title')}
                 </h3>
                 <p className="text-[13px] md:text-sm text-white/60 leading-relaxed font-medium">
                   {t('prof_about_text')}
                 </p>
              </div>

              <div className="space-y-6 md:space-y-8 pt-8 md:pt-10 border-t border-white/5">
                 <h3 className="font-black text-[9px] md:text-[10px] uppercase tracking-[0.3em] md:tracking-[0.4em] text-white/30 mb-4 md:mb-6">{t('prof_skills_title')}</h3>
                 <div className="space-y-5 md:space-y-6">
                    {skills.map(skill => (
                      <div key={skill.name} className="space-y-2.5 md:space-y-3">
                         <div className="flex justify-between text-[10px] md:text-[11px] font-black uppercase tracking-widest">
                            <span className="text-white/80">{skill.name}</span>
                            <span className="text-cyan-400/60 font-mono">{skill.level}%</span>
                         </div>
                         <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden border border-white/5 p-[1px]">
                            <motion.div 
                              initial={{ width: 0 }}
                              whileInView={{ width: `${skill.level}%` }}
                              transition={{ duration: 1.5, ease: "circOut" }}
                              className={cn("h-full rounded-full shadow-[0_0_10px_rgba(34,211,238,0.3)]", skill.color)} 
                            />
                          </div>
                      </div>
                    ))}
                 </div>
              </div>
           </div>
        </div>

        {/* RIGHT: PORTFOLIO & REVIEWS */}
        <div className="lg:col-span-8 space-y-10">
           <div className="space-y-8">
              <div className="flex items-center justify-between px-2">
                 <h3 className="text-2xl md:text-3xl font-display font-black tracking-tighter uppercase italic">{t('prof_portfolio_title').slice(0, 4)}<span className="neon-text">{t('prof_portfolio_title').slice(4)}</span></h3>
                 <button className="text-[8px] md:text-[9px] font-black text-white/30 hover:text-white flex items-center gap-2 uppercase tracking-widest transition-colors">
                   {t('prof_view_archive')} <ExternalLink size={12} className="shrink-0" />
                 </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                 {portfolio.map((item, i) => (
                   <motion.div 
                    key={i}
                    whileHover={{ y: -5 }}
                    className="glass-card group overflow-hidden cursor-pointer border border-white/5 rounded-3xl"
                   >
                      <div className="h-48 md:h-56 relative overflow-hidden">
                         <img src={item.img} alt={item.title} className="w-full h-full object-cover transition-transform duration-[1.5s] group-hover:scale-110" />
                         <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-md">
                            <button className="px-6 md:px-8 py-2.5 md:py-3 bg-white text-black text-[9px] md:text-[10px] font-black rounded-lg md:rounded-xl uppercase tracking-widest shadow-2xl active:scale-95">{t('prof_inspect_code')}</button>
                         </div>
                         <div className="absolute top-4 left-4 md:top-5 md:left-5">
                            <span className="px-3 md:px-4 py-1 md:py-1.5 bg-black/80 backdrop-blur-xl rounded-lg text-[8px] md:text-[9px] font-black text-cyan-400 border border-white/10 uppercase tracking-widest">{item.category}</span>
                         </div>
                      </div>
                      <div className="p-5 md:p-6 flex justify-between items-center bg-black/40 border-t border-white/5">
                         <h4 className="font-bold text-xs md:text-sm uppercase tracking-tight">{item.title}</h4>
                         <ArrowUpRight size={18} className="text-white/20 group-hover:text-cyan-400 transition-colors shrink-0" />
                      </div>
                   </motion.div>
                 ))}
              </div>
           </div>

           <div className="space-y-8 pt-10 md:pt-12 border-t border-white/5">
              <h3 className="text-2xl md:text-3xl font-display font-black tracking-tighter uppercase italic px-2">{t('prof_reviews_title').slice(0, 3)} <span className="neon-text">({t('prof_reviews_title').slice(3)})</span></h3>
              <div className="space-y-6">
                 {reviews.map((rev, i) => (
                   <div key={i} className="glass-card p-6 md:p-8 flex flex-col sm:flex-row gap-6 md:gap-8 items-start border border-white/5 group hover:bg-white/[0.02] transition-colors rounded-3xl">
                      <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-gradient-to-br from-white/5 to-white/[0.01] border border-white/10 flex items-center justify-center font-black text-[10px] md:text-xs text-white/40 shrink-0 shadow-lg">{rev.avatar}</div>
                      <div className="space-y-3 md:space-y-4 flex-1">
                         <div className="flex justify-between items-center gap-4">
                            <h5 className="font-bold text-xs md:text-sm uppercase tracking-tight text-white/90">{rev.author}</h5>
                            <div className="flex items-center gap-1 text-amber-400">
                               {[...Array(rev.rating)].map((_, j) => <Star key={j} size={12} fill="currentColor" className="shrink-0" />)}
                            </div>
                         </div>
                         <p className="text-xs md:text-sm text-white/40 leading-relaxed italic font-medium">"{rev.comment}"</p>
                      </div>
                   </div>
                 ))}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
