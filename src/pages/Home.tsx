import React from 'react';
import { motion } from 'motion/react';
import { 
  Zap, 
  ShieldCheck, 
  Cpu, 
  Globe, 
  ArrowRight,
  TrendingUp,
  Award,
  Users,
  ShieldAlert
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

export function Home() {
  const { t } = useLanguage();

  return (
    <div className="space-y-20 md:space-y-32 pb-20">
      {/* HERO SECTION */}
      <section className="relative min-h-[85vh] flex flex-col items-center justify-center text-center px-4 overflow-hidden pt-20">
        <div className="absolute top-0 left-0 w-full h-full -z-10">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[800px] aspect-square bg-cyan-500/10 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute top-1/4 left-1/4 w-full max-w-[400px] aspect-square bg-magenta-500/5 rounded-full blur-[100px]" />
          <div className="absolute w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-6 md:space-y-8 max-w-5xl"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border-white/10 text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em] md:tracking-[0.4em] text-cyan-400 mb-2 md:mb-4 animate-neon-pulse">
            <Zap size={14} className="fill-cyan-400" /> {t('hero_tag')}
          </div>
          
          <h1 className="text-4xl sm:text-6xl md:text-9xl font-display font-black tracking-tighter leading-[0.9] italic uppercase">
            <span className="block">{t('hero_title_1')}</span>
            <span className="neon-text block">{t('hero_title_2')}</span>
          </h1>

          <p className="text-white/50 text-sm md:text-xl max-w-2xl mx-auto leading-relaxed font-medium px-4">
            {t('hero_subtitle')}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-6 pt-4 md:pt-8">
            <Link 
              to="/marketplace" 
              className="w-full sm:w-auto group relative px-8 md:px-10 py-4 md:py-5 bg-white text-black font-black rounded-xl md:rounded-2xl text-[10px] md:text-xs uppercase tracking-widest hover:bg-cyan-400 transition-all shadow-[0_0_30px_rgba(255,255,255,0.2)] hover:shadow-[0_0_40px_rgba(0,242,255,0.4)] hover:-translate-y-1 active:scale-95"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                {t('btn_find_talent')} <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>
            <Link 
              to="/auth" 
              className="w-full sm:w-auto px-8 md:px-10 py-4 md:py-5 glass border-white/10 text-white font-black rounded-xl md:rounded-2xl text-[10px] md:text-xs uppercase tracking-widest hover:bg-white/5 transition-all hover:border-white/30 backdrop-blur-3xl"
            >
              {t('btn_be_freelancer')}
            </Link>
          </div>
        </motion.div>

        {/* Floating Badges - Hidden on small mobile */}
        <div className="absolute hidden sm:block top-1/3 left-4 md:left-10 animate-float opacity-50 md:opacity-100">
          <div className="glass p-3 md:p-4 rounded-xl md:rounded-2xl border-white/5 space-y-1 md:space-y-2">
            <div className="flex items-center gap-2 text-magenta-400 font-bold text-[8px] md:text-[10px] uppercase tracking-widest">
              <TrendingUp size={12} className="md:size-[14px]" /> {t('home_trending')}
            </div>
            <div className="text-xs md:text-sm font-bold">Web Architects</div>
          </div>
        </div>

        <div className="absolute hidden sm:block bottom-1/4 right-4 md:right-10 animate-float opacity-50 md:opacity-100" style={{ animationDelay: '2s' }}>
          <div className="glass p-3 md:p-4 rounded-xl md:rounded-2xl border-white/5 space-y-1 md:space-y-2">
            <div className="flex items-center gap-2 text-cyan-400 font-bold text-[8px] md:text-[10px] uppercase tracking-widest">
              <Award size={12} className="md:size-[14px]" /> {t('home_top_rated')}
            </div>
            <div className="text-xs md:text-sm font-bold">Solidity Experts</div>
          </div>
        </div>
      </section>

      {/* STATS SECTION */}
      <section className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {[
            { label: t('stat_experts'), val: '2k' },
            { label: t('stat_contracts'), val: '12M+' },
            { label: t('stat_rating'), val: '4.50' },
            { label: t('stat_secure'), val: '100%' },
          ].map((stat, i) => (
            <div key={i} className="text-center md:text-left space-y-2 group">
              <div className="text-3xl sm:text-4xl md:text-5xl font-display font-black tracking-tighter group-hover:neon-text transition-all duration-500">{stat.val}</div>
              <div className="text-[8px] md:text-[10px] uppercase font-black tracking-[0.15em] md:tracking-[0.2em] text-white/30">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES GRID */}
      <section className="px-6">
        <div className="max-w-7xl mx-auto space-y-12 md:space-y-16">
          <header className="text-center space-y-4">
            <h2 className="text-3xl sm:text-4xl md:text-6xl font-display font-black tracking-tighter uppercase italic px-4">
              {t('feature_security_title').split(' ')[0]} <span className="neon-text">{t('feature_security_title').split(' ')[1]}</span>
            </h2>
            <p className="text-white/40 max-w-xl mx-auto text-[11px] md:text-sm">{t('feature_security_desc')}</p>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
            <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
               {[
                 { icon: ShieldAlert, label: t('feature_1_title'), desc: t('feature_1_desc') },
                 { icon: Award, label: t('feature_2_title'), desc: t('feature_2_desc') },
                 { icon: ShieldCheck, label: t('feature_3_title'), desc: t('feature_3_desc') },
                 { icon: Zap, label: t('feature_4_title'), desc: t('feature_4_desc') },
               ].map((feature, i) => (
                 <div key={i} className="glass-card p-8 md:p-10 space-y-6 hover:bg-white/[0.03] group transition-all animate-in fade-in slide-in-from-bottom-2" style={{ animationDelay: `${i * 100}ms` }}>
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-white/5 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform">
                       <feature.icon size={20} className="md:size-6" />
                    </div>
                    <div className="space-y-2">
                       <h3 className="text-lg md:text-xl font-bold font-display uppercase tracking-tight">{feature.label}</h3>
                       <p className="text-[10px] md:text-xs text-white/40 leading-relaxed font-medium">{feature.desc}</p>
                    </div>
                 </div>
               ))}
            </div>

            <div className="glass-card p-8 md:p-10 bg-gradient-to-br from-magenta-500/10 via-transparent to-transparent flex flex-col justify-between border-white/5 relative overflow-hidden group rounded-3xl">
               <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Cpu size={120} />
               </div>
               <div className="space-y-6 relative z-10">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-magenta-500/20 flex items-center justify-center text-magenta-500">
                     <Users size={20} className="md:size-6" />
                  </div>
                  <h3 className="text-2xl md:text-3xl font-display font-black tracking-tighter uppercase italic leading-tight">
                    {t('community_title').split(' ')[0]} <br /><span className="neon-text">{t('community_title').split(' ')[1]}</span>
                  </h3>
                  <p className="text-[10px] md:text-xs text-white/40 leading-relaxed font-medium">{t('community_desc')}</p>
               </div>
               <Link to="/auth" className="w-full py-4 md:py-5 glass border-white/10 rounded-xl md:rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all mt-8 text-center block">
                  {t('community_btn')}
               </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );

}
