import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { TrendingUp, Clock, CheckCircle2, Wallet, Star, BrainCircuit, ArrowUpRight, Briefcase } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useLanguage } from '../context/LanguageContext';
import { Link } from 'react-router-dom';
import { cn } from '../lib/utils';
import { useAuth } from '../context/AuthContext';
import { api } from '../lib/api';

export function Dashboard() {
  const { t, language } = useLanguage();
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState<any>(null);
  const [myOrders, setMyOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.analytics.get().catch(() => null),
      api.orders.myOrders().catch(() => []),
    ]).then(([ana, orders]) => {
      setAnalytics(ana);
      setMyOrders(orders || []);
    }).finally(() => setLoading(false));
  }, []);

  const stats = [
    { label: t('dash_total_revenue'), val: analytics ? `$${(analytics.revenue?.total || 0).toLocaleString()}` : '$0', change: '+0%', icon: Wallet, color: 'text-emerald-400' },
    { label: t('dash_active_projects'), val: analytics?.orderStats?.active?.toString() || '0', change: '0', icon: Briefcase, color: 'text-cyan-400' },
    { label: t('dash_completed'), val: analytics?.orderStats?.completed?.toString() || '0', change: '0', icon: CheckCircle2, color: 'text-blue-400' },
    { label: t('dash_avg_rating'), val: (user?.rating || 0).toFixed(2), change: '0.0', icon: Star, color: 'text-amber-400' },
  ];

  const chartData = analytics?.revenueByMonth?.map((m: any) => ({
    name: m.month, val: m.total
  })) || [];

  const statusMap: Record<string, { label: string; color: string }> = {
    open: { label: language === 'ru' ? 'Открыт' : 'Open', color: 'text-emerald-400 bg-emerald-500/10' },
    in_progress: { label: language === 'ru' ? 'В работе' : 'In Progress', color: 'text-cyan-400 bg-cyan-500/10' },
    completed: { label: language === 'ru' ? 'Завершён' : 'Completed', color: 'text-white/40 bg-white/5' },
    cancelled: { label: language === 'ru' ? 'Отменён' : 'Cancelled', color: 'text-red-400 bg-red-500/10' },
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-24 md:pb-0">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-4 md:px-0">
        <div>
          <h1 className="text-3xl md:text-4xl font-display font-black tracking-tight uppercase italic text-white/90 leading-none">
            {t('dash_welcome')}, <span className="neon-text">{user?.name?.split(' ')[0] || 'USER'}</span>
          </h1>
          <p className="text-xs text-white/40 font-medium italic mt-2">{t('dash_subtitle')}</p>
        </div>
        <div className="flex items-center gap-3 self-end md:self-auto bg-white/[0.03] p-2 rounded-2xl border border-white/5">
          <div className="text-right px-2">
            <div className="text-[9px] text-white/30 uppercase font-black tracking-widest">Balance</div>
            <div className="text-sm font-black text-cyan-400">${(user?.balance || 0).toLocaleString()}</div>
          </div>
          <div className="w-10 h-10 rounded-xl border border-white/10 overflow-hidden bg-white/5">
            {user?.avatar ? <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover" /> :
              <div className="w-full h-full flex items-center justify-center font-black text-white/20">{user?.name?.[0] || 'U'}</div>}
          </div>
        </div>
      </header>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-5 px-4 md:px-0">
        {stats.map((stat, idx) => (
          <motion.div key={stat.label} whileHover={{ y: -4 }}
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.08 }}
            className="glass-card p-4 md:p-6 border border-white/5 bg-white/[0.02] rounded-3xl group">
            <div className="flex items-start justify-between mb-4">
              <div className={cn("p-2.5 rounded-xl bg-white/5 group-hover:scale-110 transition-transform", stat.color)}>
                <stat.icon size={18} />
              </div>
              <div className="flex items-center gap-1 text-[9px] font-black text-emerald-400 uppercase tracking-widest">
                <TrendingUp size={10} /> {stat.change}
              </div>
            </div>
            <div className="text-2xl md:text-3xl font-black font-display tracking-tight text-white">{loading ? '...' : stat.val}</div>
            <div className="text-[9px] text-white/30 font-black uppercase tracking-wider mt-1 truncate">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 px-4 md:px-0">
        {/* Chart */}
        <div className="lg:col-span-2 glass-card p-5 md:p-8 rounded-3xl border border-white/5 bg-white/[0.02]">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-black flex items-center gap-2 uppercase text-[10px] tracking-widest text-white/80 italic">
              <TrendingUp size={18} className="text-cyan-400" /> {t('dash_growth_title')}
            </h3>
          </div>
          <div className="h-[220px] w-full">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#00f2ff" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#00f2ff" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis dataKey="name" stroke="rgba(255,255,255,0.2)" fontSize={8} tickLine={false} axisLine={false} />
                  <YAxis stroke="rgba(255,255,255,0.2)" fontSize={8} tickLine={false} axisLine={false} tickFormatter={v => `$${v}`} />
                  <Tooltip contentStyle={{ backgroundColor: 'rgba(0,0,0,0.9)', borderColor: 'rgba(255,255,255,0.1)', color: '#fff', borderRadius: '12px', fontSize: '10px', fontWeight: '900' }} />
                  <Area type="monotone" dataKey="val" stroke="#00f2ff" fillOpacity={1} fill="url(#colorVal)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center">
                <p className="text-[10px] font-black uppercase tracking-widest text-white/20 italic">{language === 'ru' ? 'Данных пока нет' : 'No data yet'}</p>
              </div>
            )}
          </div>
        </div>

        {/* AI Insights */}
        <div className="glass-card p-6 md:p-8 bg-gradient-to-br from-indigo-500/10 to-purple-500/5 border border-indigo-500/20 rounded-3xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
            <BrainCircuit size={100} className="text-indigo-400 rotate-12" />
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-6 text-indigo-400">
              <BrainCircuit size={22} className="animate-pulse" />
              <h3 className="font-black uppercase text-[10px] tracking-widest italic">{t('dash_ai_insights')}</h3>
            </div>
            <div className="space-y-4">
              {[
                { text: language === 'ru' ? 'Заполните профиль для лучших предложений.' : 'Complete your profile for better matches.', type: 'tip' },
                { text: language === 'ru' ? 'Добавьте портфолио для привлечения клиентов.' : 'Add portfolio to attract clients.', type: 'suggestion' },
                { text: language === 'ru' ? 'Попробуйте создать первый заказ.' : 'Try creating your first order.', type: 'action' },
              ].map((insight, i) => (
                <div key={i} className="p-4 rounded-2xl bg-white/5 border border-white/5 group/item hover:border-indigo-400/30 transition-all">
                  <div className="text-[10px] text-white/50 leading-relaxed italic font-medium">"{insight.text}"</div>
                  <div className="flex justify-end mt-2">
                    <button className="text-[9px] font-black text-indigo-400 flex items-center gap-1 uppercase tracking-widest">
                      Analyze <ArrowUpRight size={10} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <Link to="/analytics" className="block w-full mt-6 py-4 rounded-2xl bg-indigo-500 text-white font-black text-[10px] hover:bg-indigo-400 transition-all uppercase tracking-widest shadow-xl active:scale-95 text-center">
              {language === 'ru' ? 'Полный отчёт' : 'Full Report'}
            </Link>
          </div>
        </div>
      </div>

      {/* My Orders */}
      <div className="px-4 md:px-0">
        <div className="glass-card p-5 md:p-8 overflow-hidden rounded-3xl border border-white/5 bg-white/[0.02]">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-black uppercase text-[10px] tracking-widest italic text-white/80">
              {t('dash_active_list').split(' ')[0]} <span className="neon-text">{t('dash_active_list').split(' ').slice(1).join(' ')}</span>
            </h3>
            <Link to="/marketplace" className="text-[10px] font-black uppercase tracking-widest text-white/30 hover:text-white transition-colors">
              {language === 'ru' ? 'Смотреть все' : 'View All'}
            </Link>
          </div>
          <div className="overflow-x-auto scrollbar-none">
            <table className="w-full text-left min-w-[500px]">
              <thead>
                <tr className="border-b border-white/5">
                  {[language === 'ru' ? 'Проект' : 'Project', language === 'ru' ? 'Статус' : 'Status', language === 'ru' ? 'Бюджет' : 'Budget', ''].map(h => (
                    <th key={h} className="pb-4 text-[9px] font-black text-white/20 uppercase tracking-widest">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.03]">
                {loading ? (
                  <tr><td colSpan={4} className="py-10 text-center text-[10px] text-white/20 uppercase font-black">Loading...</td></tr>
                ) : myOrders.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-16 text-center">
                      <div className="flex flex-col items-center gap-4">
                        <Briefcase size={36} className="text-white/10 animate-pulse" />
                        <div className="text-[10px] font-black uppercase tracking-widest text-white/20">{t('dash_no_projects')}</div>
                        <Link to="/create-order" className="px-6 py-3 bg-white text-black rounded-xl text-[10px] font-black uppercase hover:bg-cyan-400 transition-all">
                          {language === 'ru' ? 'Создать заказ' : 'Create Order'}
                        </Link>
                      </div>
                    </td>
                  </tr>
                ) : myOrders.slice(0, 5).map((order: any) => (
                  <tr key={order.id} className="group">
                    <td className="py-4 pr-4">
                      <Link to={`/orders/${order.id}`} className="text-sm font-bold text-white/80 group-hover:text-cyan-400 transition-colors line-clamp-1">{order.title}</Link>
                      <div className="text-[9px] text-white/30 font-black uppercase mt-1">{order.category}</div>
                    </td>
                    <td className="py-4 pr-4">
                      <span className={cn("px-2 py-1 rounded text-[9px] font-black uppercase", (statusMap[order.status] || statusMap.open).color)}>
                        {(statusMap[order.status] || statusMap.open).label}
                      </span>
                    </td>
                    <td className="py-4 pr-4 text-emerald-400 font-black text-sm">${order.budget_min?.toLocaleString()}</td>
                    <td className="py-4">
                      <Link to={`/orders/${order.id}`} className="text-white/20 hover:text-cyan-400 transition-colors">
                        <ArrowUpRight size={16} />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}