import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Filter, DollarSign, Users, Zap, ArrowUpRight, Plus, Edit2, Trash2, X, Check } from 'lucide-react';
import { cn } from '../lib/utils';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { api } from '../lib/api';
import { useAuth } from '../context/AuthContext';

export function Marketplace() {
  const navigate = useNavigate();
  const { language, t } = useLanguage();
  const { user, isAuthenticated } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [sort, setSort] = useState('newest');
  const [total, setTotal] = useState(0);
  const [editingOrder, setEditingOrder] = useState<any>(null);
  const [editForm, setEditForm] = useState({ title: '', description: '', budget_min: '', budget_max: '' });
  const [editSaving, setEditSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const categories = language === 'ru'
    ? ['Все', 'Веб-дизайн', 'Разработка', 'Блокчейн', 'Креатив', 'Маркетинг', 'Мобайл']
    : ['All', 'Web Design', 'Development', 'Blockchain', 'Creative', 'Marketing', 'Mobile'];

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const isAll = activeCategory === 'Все' || activeCategory === 'All';
      const res = await api.orders.list({
        category: isAll ? undefined : activeCategory,
        search: search.trim() || undefined,
        sort,
        status: 'open',
      });
      setOrders(res.orders || []);
      setTotal(res.total || 0);
    } catch (e) {
      console.error(e);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOrders(); }, [activeCategory, sort]);

  const handleSearch = (e: React.FormEvent) => { e.preventDefault(); fetchOrders(); };

  const handleEdit = (order: any) => {
    setEditingOrder(order);
    setEditForm({
      title: order.title,
      description: order.description,
      budget_min: String(order.budget_min),
      budget_max: String(order.budget_max),
    });
  };

  const handleEditSave = async () => {
    if (!editingOrder) return;
    setEditSaving(true);
    try {
      await api.orders.update(editingOrder.id, {
        title: editForm.title,
        description: editForm.description,
        budget_min: Number(editForm.budget_min),
        budget_max: Number(editForm.budget_max || editForm.budget_min),
      });
      setEditingOrder(null);
      fetchOrders();
    } catch (e) { console.error(e); }
    finally { setEditSaving(false); }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.orders.delete(id);
      setDeleteConfirm(null);
      fetchOrders();
    } catch (e) { console.error(e); }
  };

  const statusColor: Record<string, string> = {
    open: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    in_progress: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
    completed: 'text-white/40 bg-white/5 border-white/10',
    dispute: 'text-red-400 bg-red-500/10 border-red-500/20',
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-24 md:pb-0">

      {/* Edit Modal */}
      {editingOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-lg glass-card p-8 rounded-3xl border border-white/10 bg-[#0a0a0a] space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-display font-black uppercase italic text-white">
                {language === 'ru' ? 'Редактировать заказ' : 'Edit Order'}
              </h3>
              <button onClick={() => setEditingOrder(null)} className="p-2 text-white/30 hover:text-white"><X size={20} /></button>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-white/30 tracking-widest">{language === 'ru' ? 'Название' : 'Title'}</label>
                <input type="text" value={editForm.title} onChange={e => setEditForm(f => ({ ...f, title: e.target.value }))}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 outline-none focus:border-cyan-500/50 text-sm font-bold text-white" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-white/30 tracking-widest">{language === 'ru' ? 'Описание' : 'Description'}</label>
                <textarea rows={4} value={editForm.description} onChange={e => setEditForm(f => ({ ...f, description: e.target.value }))}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 outline-none focus:border-cyan-500/50 text-sm font-medium text-white resize-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-white/30 tracking-widest">Min $</label>
                  <input type="number" value={editForm.budget_min} onChange={e => setEditForm(f => ({ ...f, budget_min: e.target.value }))}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 outline-none focus:border-cyan-500/50 text-sm font-bold text-white" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-white/30 tracking-widest">Max $</label>
                  <input type="number" value={editForm.budget_max} onChange={e => setEditForm(f => ({ ...f, budget_max: e.target.value }))}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 outline-none focus:border-cyan-500/50 text-sm font-bold text-white" />
                </div>
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <button onClick={() => setEditingOrder(null)} className="flex-1 py-4 glass rounded-xl text-[10px] font-black uppercase text-white/40 hover:text-white transition-all">
                {language === 'ru' ? 'Отмена' : 'Cancel'}
              </button>
              <button onClick={handleEditSave} disabled={editSaving}
                className="flex-1 py-4 bg-white text-black font-black rounded-xl text-[10px] uppercase hover:bg-cyan-400 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2">
                {editSaving ? <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" /> : <><Check size={14} /> {language === 'ru' ? 'Сохранить' : 'Save'}</>}
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Delete confirm */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-sm glass-card p-8 rounded-3xl border border-red-500/20 bg-[#0a0a0a] space-y-6 text-center">
            <Trash2 size={40} className="text-red-400 mx-auto" />
            <div>
              <h3 className="text-lg font-black uppercase italic text-white">{language === 'ru' ? 'Удалить заказ?' : 'Delete order?'}</h3>
              <p className="text-[11px] text-white/40 mt-1">{language === 'ru' ? 'Это действие нельзя отменить' : 'This action cannot be undone'}</p>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirm(null)} className="flex-1 py-3 glass rounded-xl text-[10px] font-black uppercase text-white/40 hover:text-white">
                {language === 'ru' ? 'Отмена' : 'Cancel'}
              </button>
              <button onClick={() => handleDelete(deleteConfirm)}
                className="flex-1 py-3 bg-red-500 text-white font-black rounded-xl text-[10px] uppercase hover:bg-red-400 transition-all active:scale-95">
                {language === 'ru' ? 'Удалить' : 'Delete'}
              </button>
            </div>
          </motion.div>
        </div>
      )}

      <header className="flex flex-col gap-4 px-4 md:px-0">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <h1 className="text-3xl md:text-5xl font-display font-black tracking-tighter uppercase italic text-white/90 leading-none">
              {t('market_title').split(' ')[0]} <span className="neon-text">{t('market_title').split(' ').slice(1).join(' ')}</span>
            </h1>
            <p className="text-white/40 text-xs mt-2 font-medium italic">
              {t('market_subtitle')} — <span className="text-cyan-400">{total} {language === 'ru' ? 'заказов' : 'orders'}</span>
            </p>
          </div>
          <div className="flex items-center gap-2 self-end md:self-auto">
            <select value={sort} onChange={e => setSort(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-[10px] font-black uppercase text-white/60 outline-none focus:border-cyan-500/50">
              <option value="newest">{language === 'ru' ? 'Новые' : 'Newest'}</option>
              <option value="budget_high">{language === 'ru' ? 'Бюджет ↓' : 'Budget ↓'}</option>
              <option value="budget_low">{language === 'ru' ? 'Бюджет ↑' : 'Budget ↑'}</option>
            </select>
          </div>
        </div>

        <form onSubmit={handleSearch} className="grid grid-cols-2 md:grid-cols-12 gap-3">
          <div className="col-span-2 md:col-span-8 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 shrink-0" size={18} />
            <input type="text" value={search} onChange={e => setSearch(e.target.value)}
              placeholder={t('market_search_placeholder')}
              className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-12 pr-6 outline-none focus:border-cyan-500/50 transition-all text-sm font-medium text-white placeholder:text-white/20" />
          </div>
          <button type="submit" className="col-span-1 md:col-span-2 glass flex items-center justify-center gap-2 rounded-xl py-3.5 font-black text-[10px] uppercase tracking-widest hover:bg-white/10 transition-all text-white/60">
            <Filter size={14} /> {t('market_filters')}
          </button>
          <Link to="/create-order" className="col-span-1 md:col-span-2 bg-white text-black flex items-center justify-center gap-2 rounded-xl py-3.5 font-black text-[10px] uppercase tracking-widest hover:bg-cyan-400 transition-all shadow-lg active:scale-95">
            <Plus size={14} /> {t('market_create')}
          </Link>
        </form>

        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none -mx-4 px-4 md:mx-0 md:px-0">
          {categories.map(cat => (
            <button key={cat} onClick={() => setActiveCategory(cat)}
              className={cn("px-5 py-2.5 rounded-full text-[10px] font-black whitespace-nowrap transition-all uppercase tracking-widest border shrink-0",
                activeCategory === cat
                  ? "bg-white text-black border-white shadow-[0_0_20px_rgba(255,255,255,0.2)]"
                  : "bg-white/[0.03] text-white/40 border-white/5 hover:text-white hover:border-white/20")}>
              {cat}
            </button>
          ))}
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 px-4 md:px-0">
        <AnimatePresence mode="wait">
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="glass-card rounded-3xl border border-white/5 h-64 animate-pulse bg-white/[0.02]" />
            ))
          ) : orders.length > 0 ? (
            orders.map((order, i) => {
              const isOwner = isAuthenticated && user?.id === order.customer_id;
              return (
                <motion.div key={order.id}
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                  whileHover={{ y: -3 }}
                  className="glass-card group overflow-hidden flex flex-col rounded-3xl border border-white/5 bg-white/[0.02]">
                  <div className="p-6 flex flex-col flex-1 gap-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0 cursor-pointer" onClick={() => navigate(`/orders/${order.id}`)}>
                        <h3 className="font-bold text-sm md:text-base uppercase tracking-tight text-white line-clamp-2 group-hover:text-cyan-400 transition-colors">{order.title}</h3>
                        <p className="text-white/40 text-xs mt-1 font-medium line-clamp-2">{order.description}</p>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <span className={cn("px-2 py-1 rounded text-[8px] font-black uppercase border", statusColor[order.status] || statusColor.open)}>
                          {order.status === 'open' ? (language === 'ru' ? 'Открыт' : 'Open') : order.status}
                        </span>
                        {isOwner && (
                          <div className="flex gap-1 ml-1">
                            <button onClick={() => handleEdit(order)}
                              className="p-1.5 rounded-lg bg-white/5 hover:bg-cyan-500/20 text-white/30 hover:text-cyan-400 transition-all">
                              <Edit2 size={13} />
                            </button>
                            <button onClick={() => setDeleteConfirm(order.id)}
                              className="p-1.5 rounded-lg bg-white/5 hover:bg-red-500/20 text-white/30 hover:text-red-400 transition-all">
                              <Trash2 size={13} />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    {order.skills?.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {order.skills.slice(0, 4).map((s: string) => (
                          <span key={s} className="px-2 py-1 bg-white/5 border border-white/10 rounded-lg text-[9px] font-black uppercase text-white/40">{s}</span>
                        ))}
                        {order.skills.length > 4 && <span className="text-[9px] text-white/20 font-black">+{order.skills.length - 4}</span>}
                      </div>
                    )}

                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/5 cursor-pointer" onClick={() => navigate(`/orders/${order.id}`)}>
                      <div className="flex items-center gap-4 text-[10px] font-black text-white/30 uppercase tracking-widest">
                        <span className="flex items-center gap-1 text-emerald-400">
                          <DollarSign size={12} /> ${order.budget_min?.toLocaleString()}
                          {order.budget_max > order.budget_min && `–$${order.budget_max?.toLocaleString()}`}
                        </span>
                        <span className="flex items-center gap-1"><Users size={12} /> {order.proposals_count || 0}</span>
                        {order.is_urgent ? <span className="text-amber-400 flex items-center gap-1"><Zap size={12} /> Urgent</span> : null}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] text-white/20 font-black">{order.customer_name}</span>
                        <ArrowUpRight size={16} className="text-white/20 group-hover:text-cyan-400 transition-colors" />
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })
          ) : (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
              className="col-span-full py-20 text-center flex flex-col items-center gap-6">
              <div className="w-20 h-20 rounded-[32px] bg-white/5 border border-white/10 flex items-center justify-center text-white/10 animate-pulse">
                <Search size={40} />
              </div>
              <div>
                <h3 className="text-2xl font-display font-black uppercase italic tracking-tighter text-white/80">{t('market_no_orders')}</h3>
                <p className="text-white/30 text-sm mt-2">{language === 'ru' ? 'Создайте первый заказ прямо сейчас' : 'Create the first order right now'}</p>
              </div>
              <Link to="/create-order" className="px-10 py-5 bg-white text-black rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-cyan-400 transition-all shadow-2xl active:scale-95 flex items-center gap-3">
                <Plus size={18} /> {t('market_create')}
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}