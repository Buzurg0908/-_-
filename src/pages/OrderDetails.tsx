import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  Zap, Clock, DollarSign, ShieldCheck, FileText, Paperclip,
  MessageCircle, ChevronLeft, Columns3, Star, CheckCircle2, AlertTriangle
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { cn } from '../lib/utils';
import { api } from '../lib/api';
import { useAuth } from '../context/AuthContext';

export function OrderDetails() {
  const { id } = useParams();
  const { t, language } = useLanguage();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [showProposalForm, setShowProposalForm] = useState(false);
  const [proposal, setProposal] = useState({ cover_letter: '', proposed_budget: '', delivery_days: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (!id) return;
    api.orders.get(id)
      .then(setOrder)
      .catch(() => navigate('/marketplace'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleApply = async () => {
    if (!isAuthenticated) { navigate('/auth'); return; }
    if (!proposal.cover_letter || !proposal.proposed_budget || !proposal.delivery_days) {
      setError(language === 'ru' ? 'Заполните все поля' : 'Fill all fields');
      return;
    }
    setApplying(true);
    setError('');
    try {
      await api.orders.submitProposal(id!, {
        cover_letter: proposal.cover_letter,
        proposed_budget: Number(proposal.proposed_budget),
        delivery_days: Number(proposal.delivery_days),
      });
      setSuccess(language === 'ru' ? 'Заявка отправлена!' : 'Proposal submitted!');
      setShowProposalForm(false);
      setOrder((o: any) => o ? { ...o, proposals_count: (o.proposals_count || 0) + 1 } : o);
    } catch (e: any) {
      setError(e.message || 'Error');
    } finally {
      setApplying(false);
    }
  };

  const handleConnect = () => {
    if (!isAuthenticated) { navigate('/auth'); return; }
    if (order?.customer_id) navigate(`/chat?to=${order.customer_id}`);
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="w-8 h-8 border-2 border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin" />
    </div>
  );

  if (!order) return null;

  const milestones = order.milestones || [];
  const budget = order.budget_max > order.budget_min
    ? `$${order.budget_min.toLocaleString()} – $${order.budget_max.toLocaleString()}`
    : `$${order.budget_min.toLocaleString()}`;

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20 md:pb-0">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-4 md:px-0">
        <div className="space-y-2">
          <Link to="/marketplace" className="text-[10px] text-white/30 hover:text-white flex items-center gap-1 uppercase tracking-widest font-black transition-colors">
            <ChevronLeft size={14} /> {t('order_back')}
          </Link>
          <h1 className="text-3xl md:text-4xl font-display font-black tracking-tighter uppercase italic leading-tight text-white">
            {t('order_manifest').split(' ')[0]} <span className="neon-text">{t('order_manifest').split(' ').slice(1).join(' ')}</span>
          </h1>
        </div>
        <div className="flex gap-2">
          {success ? (
            <div className="px-6 py-3.5 bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
              <CheckCircle2 size={16} /> {success}
            </div>
          ) : (
            <>
              <button onClick={handleConnect}
                className="flex-1 md:flex-none px-6 py-3.5 glass rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all flex items-center justify-center gap-2 text-white/60 hover:text-white">
                <MessageCircle size={16} className="shrink-0" /> {t('order_connect')}
              </button>
              {user?.id !== order.customer_id && (
                <button onClick={() => setShowProposalForm(true)}
                  className="flex-1 md:flex-none px-8 py-3.5 bg-white text-black font-black rounded-xl text-[10px] uppercase hover:bg-cyan-400 transition-all shadow-[0_0_20px_rgba(34,211,238,0.3)] active:scale-95">
                  {t('order_apply')}
                </button>
              )}
            </>
          )}
        </div>
      </header>

      {/* Proposal Modal */}
      {showProposalForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-lg glass-card p-8 rounded-3xl border border-white/10 bg-[#0a0a0a] space-y-6">
            <h3 className="text-xl font-display font-black uppercase italic tracking-tight text-white">
              {language === 'ru' ? 'Подать заявку' : 'Submit Proposal'}
            </h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-white/30">
                  {language === 'ru' ? 'Сопроводительное письмо' : 'Cover Letter'}
                </label>
                <textarea rows={4} value={proposal.cover_letter}
                  onChange={e => setProposal(p => ({ ...p, cover_letter: e.target.value }))}
                  placeholder={language === 'ru' ? 'Почему именно вы подходите...' : 'Why you are the best fit...'}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 outline-none focus:border-cyan-500/50 text-sm font-medium text-white placeholder:text-white/20 resize-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-white/30">
                    {language === 'ru' ? 'Ваш бюджет ($)' : 'Your Budget ($)'}
                  </label>
                  <input type="number" value={proposal.proposed_budget}
                    onChange={e => setProposal(p => ({ ...p, proposed_budget: e.target.value }))}
                    placeholder="5000"
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 outline-none focus:border-cyan-500/50 text-sm font-bold text-white placeholder:text-white/20" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-white/30">
                    {language === 'ru' ? 'Дней на выполнение' : 'Delivery Days'}
                  </label>
                  <input type="number" value={proposal.delivery_days}
                    onChange={e => setProposal(p => ({ ...p, delivery_days: e.target.value }))}
                    placeholder="14"
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 outline-none focus:border-cyan-500/50 text-sm font-bold text-white placeholder:text-white/20" />
                </div>
              </div>
            </div>
            {error && <div className="text-red-400 text-xs font-bold p-3 bg-red-500/10 rounded-xl border border-red-500/20">{error}</div>}
            <div className="flex gap-3">
              <button onClick={() => { setShowProposalForm(false); setError(''); }}
                className="flex-1 py-4 glass rounded-xl text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-white hover:bg-white/5 transition-all">
                {language === 'ru' ? 'Отмена' : 'Cancel'}
              </button>
              <button onClick={handleApply} disabled={applying}
                className="flex-1 py-4 bg-white text-black font-black rounded-xl text-[10px] uppercase tracking-widest hover:bg-cyan-400 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2">
                {applying ? <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" /> : t('order_apply')}
              </button>
            </div>
          </motion.div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 px-4 md:px-0">
        <div className="lg:col-span-8 space-y-8">
          <div className="glass-card p-6 md:p-12 space-y-8 relative overflow-hidden rounded-3xl border border-white/5 bg-white/[0.02]">
            <div className="absolute top-0 right-0 p-6 md:p-8">
              <div className="px-3 py-1 rounded bg-cyan-500/10 text-cyan-400 text-[10px] font-black uppercase border border-cyan-500/20 tracking-tighter">
                {t('order_active')}
              </div>
            </div>
            <div className="space-y-4 pt-8 md:pt-0">
              <h2 className="text-2xl md:text-3xl font-bold font-display leading-tight uppercase tracking-tight text-white">{order.title}</h2>
              <div className="flex flex-wrap gap-4 text-[10px] uppercase font-black tracking-widest text-white/30">
                <span className="flex items-center gap-2"><DollarSign size={14} className="text-emerald-400" /> {budget}</span>
                <span className="flex items-center gap-2"><Clock size={14} className="text-cyan-400" /> {order.deadline}</span>
                <span className="flex items-center gap-2"><Columns3 size={14} className="text-pink-500" /> {milestones.length} {language === 'ru' ? 'Этапа' : 'Milestones'}</span>
                <span className="flex items-center gap-2"><MessageCircle size={14} className="text-white/30" /> {order.proposals_count} {language === 'ru' ? 'откликов' : 'proposals'}</span>
              </div>
            </div>
            {order.skills?.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {order.skills.map((s: string) => (
                  <span key={s} className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-[10px] font-black uppercase text-white/50">{s}</span>
                ))}
              </div>
            )}
            <div className="space-y-4 pt-8 border-t border-white/5">
              <h3 className="font-black text-[10px] uppercase tracking-[0.3em] text-white/20">{t('order_core')}</h3>
              <p className="text-white/60 leading-relaxed text-sm whitespace-pre-wrap">{order.description}</p>
            </div>
            {order.attachments?.length > 0 && (
              <div className="space-y-4 pt-8 border-t border-white/5">
                <h3 className="font-black text-[10px] uppercase tracking-[0.3em] text-white/20">{t('order_attachments')}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {order.attachments.map((file: any, i: number) => (
                    <div key={i} className="p-4 glass rounded-2xl border-white/5 flex items-center justify-between group hover:border-cyan-500/30 cursor-pointer transition-all">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0">
                          <FileText size={20} className="text-white/20" />
                        </div>
                        <div className="text-[10px] font-bold uppercase text-white">{file.name || file}</div>
                      </div>
                      <Paperclip size={16} className="text-white/10 group-hover:text-cyan-400 transition-colors shrink-0" />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {milestones.length > 0 && (
            <div className="space-y-6">
              <h3 className="text-2xl md:text-3xl font-display font-black tracking-tighter uppercase italic text-white/80">
                {t('order_milestones').split(' ')[0]} <span className="neon-text">{t('order_milestones').split(' ').slice(1).join(' ')}</span>
              </h3>
              <div className="space-y-4">
                {milestones.map((ms: any, i: number) => (
                  <div key={ms.id} className="glass-card p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-2xl border border-white/5 bg-white/[0.02]">
                    <div className="flex items-center gap-4 md:gap-6">
                      <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center font-black text-xs text-white/20 shrink-0">0{i + 1}</div>
                      <div>
                        <div className="font-bold text-xs md:text-sm uppercase tracking-tight text-white/90">{ms.title}</div>
                        <div className="text-[9px] text-white/20 uppercase tracking-widest font-black mt-1">Status: {ms.status}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 justify-between md:justify-end shrink-0 pt-4 md:pt-0 border-t md:border-none border-white/5">
                      <div className="text-lg md:text-xl font-display font-bold text-cyan-400">${ms.amount?.toLocaleString()}</div>
                      <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white/10 shrink-0"><ShieldCheck size={18} /></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="lg:col-span-4 space-y-6">
          <div className="glass-card p-6 space-y-6 rounded-3xl border border-white/5 bg-white/[0.02]">
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30">{t('order_client_origin')}</h4>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl overflow-hidden bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center font-black text-white shrink-0 text-xs shadow-lg">
                {order.customer_avatar
                  ? <img src={order.customer_avatar} alt="" className="w-full h-full object-cover" />
                  : order.customer_name?.[0]?.toUpperCase()}
              </div>
              <div className="min-w-0">
                <div className="font-bold flex items-center gap-2 text-white text-sm">
                  {order.customer_name} {order.customer_verified ? <Zap size={14} className="text-amber-400 fill-amber-400 shrink-0" /> : null}
                </div>
                <div className="text-[10px] text-white/30 uppercase tracking-widest font-black">{t('order_verified_corp')}</div>
              </div>
            </div>
            <div className="space-y-4 pt-4 border-t border-white/5">
              {[
                { label: t('prof_rating') || 'Rating', val: `${(order.customer_rating || 0).toFixed(1)} ★`, icon: Star, color: 'text-amber-400' },
                { label: language === 'ru' ? 'Откликов' : 'Proposals', val: order.proposals_count?.toString(), icon: CheckCircle2, color: 'text-cyan-400' },
              ].map(stat => (
                <div key={stat.label} className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest">
                  <span className="text-white/40 flex items-center gap-2"><stat.icon size={14} className={cn("shrink-0", stat.color)} /> {stat.label}</span>
                  <span className="text-white">{stat.val}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card p-6 bg-red-500/5 border border-red-500/20 space-y-4 rounded-3xl">
            <div className="flex items-center gap-2 text-red-500 font-black text-[10px] uppercase tracking-widest">
              <AlertTriangle size={14} className="shrink-0" /> {t('order_security_protocol')}
            </div>
            <p className="text-[10px] text-white/30 leading-relaxed italic font-medium">"{t('order_security_text')}"</p>
          </div>
        </div>
      </div>
    </div>
  );
}