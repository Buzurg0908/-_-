import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BarChart3, Activity, PieChart as PieChartIcon, BrainCircuit, Zap, Globe } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useLanguage } from '../context/LanguageContext';
import { api } from '../lib/api';

export function Analytics() {
  const { t, language } = useLanguage();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.analytics.get()
      .then(setData)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const barData = data?.revenueByMonth?.map((m: any) => ({
    name: m.month, val: m.total
  })) || [];

  const totalRevenue = data?.revenue?.total || 0;
  const trustIndex = data?.rating ? Number(data.rating).toFixed(1) : '0.0';

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20 md:pb-0">
      <header className="px-4 md:px-0">
        <h1 className="text-3xl md:text-5xl font-display font-black tracking-tighter uppercase italic text-white/90 leading-none">
          {t('ana_title').split(' ')[0]} <span className="neon-text">{t('ana_title').split(' ').slice(1).join(' ') || t('ana_title')}</span>
        </h1>
        <p className="text-white/40 text-xs md:text-sm mt-2 font-medium italic">{t('ana_subtitle')}</p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 px-4 md:px-0">
        <div className="glass-card p-6 bg-gradient-to-br from-cyan-500/10 to-transparent border border-white/5 rounded-3xl relative overflow-hidden group">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-cyan-400/20 text-cyan-400 rounded-xl group-hover:scale-110 transition-transform"><Activity size={24} /></div>
            <div className="text-white/20 text-xs font-black uppercase tracking-widest">{totalRevenue > 0 ? '+∞%' : '--%'}</div>
          </div>
          <div className="text-3xl md:text-4xl font-display font-black tracking-tighter text-white/90">
            {loading ? '...' : `$${totalRevenue.toLocaleString()}`}
          </div>
          <div className="text-[10px] text-white/30 uppercase font-black tracking-widest mt-2">{t('ana_expected_revenue')}</div>
        </div>

        <div className="glass-card p-6 bg-gradient-to-br from-magenta-500/10 to-transparent border border-white/5 rounded-3xl relative overflow-hidden group">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-pink-400/20 text-pink-400 rounded-xl group-hover:scale-110 transition-transform"><BrainCircuit size={24} /></div>
            <div className="text-white/20 text-xs font-black uppercase tracking-widest">{trustIndex > '0' ? '↑' : '--'}</div>
          </div>
          <div className="text-3xl md:text-4xl font-display font-black tracking-tighter text-white/90">{loading ? '...' : trustIndex}</div>
          <div className="text-[10px] text-white/30 uppercase font-black tracking-widest mt-2">{t('ana_trust_index')}</div>
        </div>

        <div className="glass-card p-6 bg-gradient-to-br from-gold-500/10 to-transparent border border-white/5 rounded-3xl relative overflow-hidden group sm:col-span-2 md:col-span-1">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-amber-400/20 text-amber-400 rounded-xl group-hover:scale-110 transition-transform"><Globe size={24} /></div>
            <div className="text-white/20 text-[10px] font-black uppercase tracking-widest">{language === 'ru' ? 'НУЛЕВОЙ' : 'ZERO'}</div>
          </div>
          <div className="text-3xl md:text-4xl font-display font-black tracking-tighter text-white/90">
            {loading ? '...' : (data?.proposalStats?.accepted || 0)}/{loading ? '...' : (data?.proposalStats?.total_proposals || 0)}
          </div>
          <div className="text-[10px] text-white/30 uppercase font-black tracking-widest mt-2">{language === 'ru' ? 'Принято / Подано' : 'Accepted / Submitted'}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 px-4 md:px-0">
        <div className="glass-card p-6 md:p-8 rounded-3xl border border-white/5 bg-white/[0.02] min-h-[350px] flex flex-col">
          <h3 className="font-black text-[10px] uppercase tracking-widest text-white/60 mb-6 flex items-center gap-2">
            <BarChart3 size={18} className="text-cyan-400" /> {t('ana_ecosystem_revenue')}
          </h3>
          {barData.length > 0 ? (
            <div className="flex-1">
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={barData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis dataKey="name" stroke="rgba(255,255,255,0.2)" fontSize={9} tickLine={false} axisLine={false} />
                  <YAxis stroke="rgba(255,255,255,0.2)" fontSize={9} tickLine={false} axisLine={false} tickFormatter={v => `$${v}`} />
                  <Tooltip contentStyle={{ backgroundColor: 'rgba(0,0,0,0.9)', borderColor: 'rgba(255,255,255,0.1)', color: '#fff', borderRadius: '12px', fontSize: '10px', fontWeight: '900' }} />
                  <Bar dataKey="val" fill="#00f2ff" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center gap-4">
              <BarChart3 size={40} className="text-white/10 animate-pulse" />
              <div className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20 italic">{t('ana_no_data')}</div>
            </div>
          )}
        </div>

        <div className="glass-card p-6 md:p-8 rounded-3xl border border-white/5 bg-white/[0.02] min-h-[350px] flex flex-col">
          <h3 className="font-black text-[10px] uppercase tracking-widest text-white/60 mb-6 flex items-center gap-2">
            <PieChartIcon size={18} className="text-pink-400" /> {language === 'ru' ? 'Статистика заказов' : 'Order Statistics'}
          </h3>
          {data?.orderStats ? (
            <div className="flex-1 space-y-4 pt-4">
              {[
                { label: language === 'ru' ? 'Открыты' : 'Open', val: data.orderStats.open || 0, color: 'bg-cyan-400' },
                { label: language === 'ru' ? 'В работе' : 'In Progress', val: data.orderStats.active || 0, color: 'bg-amber-400' },
                { label: language === 'ru' ? 'Завершены' : 'Completed', val: data.orderStats.completed || 0, color: 'bg-emerald-400' },
              ].map(item => {
                const total = (data.orderStats.open || 0) + (data.orderStats.active || 0) + (data.orderStats.completed || 0);
                const pct = total > 0 ? Math.round((item.val / total) * 100) : 0;
                return (
                  <div key={item.label} className="space-y-2">
                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                      <span className="text-white/50">{item.label}</span>
                      <span className="text-white/80">{item.val}</span>
                    </div>
                    <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <div className={`h-full ${item.color} rounded-full transition-all duration-1000`} style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center gap-4">
              <PieChartIcon size={40} className="text-white/10 animate-pulse" />
              <div className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20 italic">{t('ana_no_data')}</div>
            </div>
          )}
        </div>
      </div>

      <div className="px-4 md:px-0">
        <div className="glass-card p-6 md:p-12 bg-gradient-to-r from-cyan-500/10 via-magenta-500/5 to-transparent border border-white/10 rounded-[40px] relative overflow-hidden group">
          <div className="absolute top-[-50%] right-[-10%] w-[40%] h-[200%] bg-white/[0.02] rotate-[15deg] blur-3xl pointer-events-none" />
          <div className="max-w-2xl space-y-6 relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/5 text-[10px] font-black uppercase tracking-widest text-cyan-400">
              <Zap size={14} className="animate-pulse" /> {language === 'ru' ? 'Стратегическая оптимизация' : 'STRATEGIC OPTIMIZATION'}
            </div>
            <h2 className="text-3xl md:text-5xl font-display font-black leading-tight italic uppercase tracking-tight text-white">
              <span>{t('ana_strategy_title').split(' ').slice(0, -2).join(' ')}</span>
              <br /><span className="neon-text pb-1">{t('ana_strategy_title').split(' ').slice(-2).join(' ')}</span>
            </h2>
            <p className="text-sm text-white/50 leading-relaxed font-medium italic">
              {language === 'ru'
                ? 'На основе данных платформы оптимизируйте профиль для привлечения лучших заказов.'
                : 'Based on platform data, optimize your profile to attract the best orders.'}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link to="/settings" className="w-full sm:w-auto px-10 py-4 bg-white text-black font-black rounded-2xl text-[10px] uppercase tracking-widest hover:bg-cyan-400 transition-all active:scale-95 text-center">
                {t('ana_optimize')}
              </Link>
              <Link to="/analytics" className="w-full sm:w-auto px-10 py-4 glass text-white/60 font-black rounded-2xl text-[10px] uppercase tracking-widest hover:bg-white/10 transition-all active:scale-95 text-center">
                {t('ana_full_report')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
