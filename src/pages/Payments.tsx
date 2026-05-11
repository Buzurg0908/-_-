import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  DollarSign, ArrowUpRight, Clock, ShieldCheck, CreditCard,
  Wallet, Zap, X, Plus, Trash2, Check, Bitcoin, Building2, Star
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { cn } from '../lib/utils';
import { api } from '../lib/api';
import { useAuth } from '../context/AuthContext';

const ru = (language: string) => language === 'ru';

// ─── API helpers (добавь в api.ts) ──────────────────────────────────────────
// payments: {
//   ...
//   getMethods: () => request<any[]>('GET', '/payments/methods'),
//   addMethod: (data: any) => request<any>('POST', '/payments/methods', data),
//   deleteMethod: (id: string) => request<any>('DELETE', `/payments/methods/${id}`),
//   setPrimary: (id: string) => request<any>('PATCH', `/payments/methods/${id}/primary`, {}),
// }

export function Payments() {
  const { language } = useLanguage();
  const { user } = useAuth();
  const isRu = ru(language);

  const [balance, setBalance] = useState<any>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [methods, setMethods] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [showDeposit, setShowDeposit] = useState(false);
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [showAddMethod, setShowAddMethod] = useState(false);
  const [deleteMethodId, setDeleteMethodId] = useState<string | null>(null);

  // Forms
  const [amount, setAmount] = useState('');
  const [selectedMethodId, setSelectedMethodId] = useState('');
  const [processing, setProcessing] = useState(false);
  const [msg, setMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Add method form
  const [methodType, setMethodType] = useState<'card' | 'crypto' | 'bank'>('card');
  const [methodForm, setMethodForm] = useState({
    label: '', last4: '', expires: '', coin: 'USDT', bank_name: ''
  });
  const [methodError, setMethodError] = useState('');

  const load = async () => {
    try {
      const [b, t, m] = await Promise.all([
        api.payments.balance(),
        api.payments.transactions(),
        api.payments.getMethods(),
      ]);
      setBalance(b);
      setTransactions(t);
      setMethods(m);
    } catch {}
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  // Показать сообщение
  const showMsg = (text: string, type: 'success' | 'error' = 'success') => {
    setMsg({ text, type });
    setTimeout(() => setMsg(null), 3000);
  };

  const handleDeposit = async () => {
    const n = Number(amount);
    if (!n || n < 1) return showMsg(isRu ? 'Минимум $1' : 'Minimum $1', 'error');
    if (!selectedMethodId) return showMsg(isRu ? 'Выберите метод оплаты' : 'Select payment method', 'error');
    setProcessing(true);
    try {
      await api.payments.deposit(n, selectedMethodId);
      showMsg(isRu ? 'Пополнение успешно!' : 'Deposit successful!');
      setShowDeposit(false); setAmount(''); setSelectedMethodId('');
      load();
    } catch (e: any) { showMsg(e.message, 'error'); }
    finally { setProcessing(false); }
  };

  const handleWithdraw = async () => {
    const n = Number(amount);
    if (!n || n < 1) return showMsg(isRu ? 'Минимум $1' : 'Minimum $1', 'error');
    if (balance && n > balance.balance) {
      return showMsg(
        isRu
          ? `Недостаточно средств. Доступно: $${balance.balance.toFixed(2)}`
          : `Insufficient funds. Available: $${balance.balance.toFixed(2)}`,
        'error'
      );
    }
    if (!selectedMethodId) return showMsg(isRu ? 'Выберите метод вывода' : 'Select withdrawal method', 'error');
    setProcessing(true);
    try {
      await api.payments.withdraw(n, selectedMethodId);
      showMsg(isRu ? 'Вывод успешен!' : 'Withdrawal successful!');
      setShowWithdraw(false); setAmount(''); setSelectedMethodId('');
      load();
    } catch (e: any) { showMsg(e.message, 'error'); }
    finally { setProcessing(false); }
  };

  const handleAddMethod = async () => {
    setMethodError('');
    const data: any = { type: methodType, label: methodForm.label };
    if (methodType === 'card') {
      if (!/^\d{4}$/.test(methodForm.last4)) return setMethodError(isRu ? 'Введите 4 цифры карты' : '4 digits required');
      if (!/^\d{2}\/\d{2}$/.test(methodForm.expires)) return setMethodError(isRu ? 'Формат: MM/YY' : 'Format: MM/YY');
      data.last4 = methodForm.last4;
      data.expires = methodForm.expires;
    }
    if (methodType === 'crypto') data.coin = methodForm.coin;
    if (methodType === 'bank') {
      if (!methodForm.bank_name.trim()) return setMethodError(isRu ? 'Укажите название банка' : 'Bank name required');
      data.bank_name = methodForm.bank_name;
    }
    if (!data.label.trim()) return setMethodError(isRu ? 'Введите название' : 'Label required');

    setProcessing(true);
    try {
      await api.payments.addMethod(data);
      showMsg(isRu ? 'Метод добавлен!' : 'Method added!');
      setShowAddMethod(false);
      setMethodForm({ label: '', last4: '', expires: '', coin: 'USDT', bank_name: '' });
      load();
    } catch (e: any) { setMethodError(e.message); }
    finally { setProcessing(false); }
  };

  const handleDeleteMethod = async (id: string) => {
    try {
      await api.payments.deleteMethod(id);
      setDeleteMethodId(null);
      load();
    } catch (e: any) { showMsg(e.message, 'error'); }
  };

  const handleSetPrimary = async (id: string) => {
    try {
      await api.payments.setPrimary(id);
      load();
    } catch {}
  };

  const typeIcon: Record<string, any> = {
    deposit: { icon: ArrowUpRight, color: 'text-emerald-400' },
    withdrawal: { icon: ArrowUpRight, color: 'text-red-400 rotate-180' },
    escrow_lock: { icon: Clock, color: 'text-amber-400' },
    escrow_release: { icon: Zap, color: 'text-cyan-400' },
    payment: { icon: DollarSign, color: 'text-cyan-400' },
  };

  const methodIcon = (type: string) => {
    if (type === 'card') return <CreditCard size={20} className="text-cyan-400" />;
    if (type === 'crypto') return <Bitcoin size={20} className="text-orange-400" />;
    return <Building2 size={20} className="text-indigo-400" />;
  };

  // ─── Modal: Deposit / Withdraw ─────────────────────────────────────────────
  const PayModal = ({ title, onConfirm, onClose, isWithdraw }: any) => (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-sm glass-card p-8 rounded-3xl border border-white/10 bg-[#0a0a0a] space-y-5">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-display font-black uppercase italic text-white">{title}</h3>
          <button onClick={onClose} className="p-2 text-white/30 hover:text-white"><X size={18} /></button>
        </div>

        {/* Сумма */}
        <div className="relative">
          <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-400" size={20} />
          <input type="number" value={amount} onChange={e => setAmount(e.target.value)}
            placeholder="0.00" min={1}
            className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-5 outline-none focus:border-cyan-500/50 text-2xl font-black text-white placeholder:text-white/10" />
        </div>

        {/* Доступный баланс при выводе */}
        {isWithdraw && balance && (
          <p className="text-[10px] font-black uppercase text-white/30">
            {isRu ? 'Доступно' : 'Available'}:
            <span className="text-emerald-400 ml-1">${balance.balance?.toFixed(2)}</span>
          </p>
        )}

        {/* Выбор метода */}
        {methods.length === 0 ? (
          <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[10px] font-black uppercase text-center">
            {isRu ? 'Сначала добавьте метод оплаты' : 'Add a payment method first'}
          </div>
        ) : (
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-white/30 tracking-widest">
              {isRu ? 'Метод' : 'Method'}
            </label>
            {methods.map(m => (
              <button key={m.id} onClick={() => setSelectedMethodId(m.id)}
                className={cn(
                  "w-full flex items-center gap-3 p-3 rounded-xl border transition-all text-left",
                  selectedMethodId === m.id ? "border-cyan-500/50 bg-cyan-500/10" : "border-white/5 bg-white/5 hover:border-white/20"
                )}>
                {methodIcon(m.type)}
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-bold text-white truncate">{m.label}</div>
                  <div className="text-[9px] text-white/30 font-black uppercase">
                    {m.type === 'card' && `**** ${m.last4} · ${m.expires}`}
                    {m.type === 'crypto' && m.coin}
                    {m.type === 'bank' && m.bank_name}
                  </div>
                </div>
                {selectedMethodId === m.id && <Check size={14} className="text-cyan-400 shrink-0" />}
              </button>
            ))}
          </div>
        )}

        <div className="flex gap-3 pt-1">
          <button onClick={onClose} className="flex-1 py-4 glass rounded-xl text-[10px] font-black uppercase text-white/40 hover:text-white transition-all">
            {isRu ? 'Отмена' : 'Cancel'}
          </button>
          <button onClick={onConfirm} disabled={processing || methods.length === 0}
            className="flex-1 py-4 bg-white text-black font-black rounded-xl text-[10px] uppercase hover:bg-cyan-400 transition-all active:scale-95 disabled:opacity-40">
            {processing
              ? <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin inline-block" />
              : isRu ? 'Подтвердить' : 'Confirm'}
          </button>
        </div>
      </motion.div>
    </div>
  );

  // ─── Modal: Add Method ─────────────────────────────────────────────────────
  const AddMethodModal = () => (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-sm glass-card p-8 rounded-3xl border border-white/10 bg-[#0a0a0a] space-y-5">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-display font-black uppercase italic text-white">
            {isRu ? 'Добавить метод' : 'Add Method'}
          </h3>
          <button onClick={() => { setShowAddMethod(false); setMethodError(''); }}
            className="p-2 text-white/30 hover:text-white"><X size={18} /></button>
        </div>

        {/* Тип */}
        <div className="grid grid-cols-3 gap-2">
          {(['card', 'crypto', 'bank'] as const).map(t => (
            <button key={t} onClick={() => setMethodType(t)}
              className={cn(
                "py-3 rounded-xl border text-[10px] font-black uppercase tracking-widest transition-all flex flex-col items-center gap-2",
                methodType === t ? "border-cyan-500/50 bg-cyan-500/10 text-white" : "border-white/5 bg-white/5 text-white/30 hover:border-white/20"
              )}>
              {t === 'card' && <CreditCard size={16} />}
              {t === 'crypto' && <Bitcoin size={16} />}
              {t === 'bank' && <Building2 size={16} />}
              {t === 'card' ? (isRu ? 'Карта' : 'Card') : t === 'crypto' ? 'Crypto' : (isRu ? 'Банк' : 'Bank')}
            </button>
          ))}
        </div>

        {/* Поля */}
        <div className="space-y-3">
          <input type="text" placeholder={isRu ? 'Название (например: Моя карта)' : 'Label (e.g. My card)'}
            value={methodForm.label} onChange={e => setMethodForm(f => ({ ...f, label: e.target.value }))}
            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 outline-none focus:border-cyan-500/50 text-sm font-bold text-white placeholder:text-white/20" />

          {methodType === 'card' && <>
            <input type="text" placeholder={isRu ? 'Последние 4 цифры карты' : 'Last 4 digits'} maxLength={4}
              value={methodForm.last4} onChange={e => {
  const val = e.target.value.replace(/\D/g, '').slice(0, 4);
  setMethodForm(prev => ({ ...prev, last4: val }));
}}
              className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 outline-none focus:border-cyan-500/50 text-sm font-bold text-white placeholder:text-white/20" />
            <input type="text" placeholder="MM/YY" maxLength={5}
              value={methodForm.expires} onChange={e => {
  let v = e.target.value.replace(/\D/g, '');
  if (v.length > 2) v = v.slice(0, 2) + '/' + v.slice(2, 4);
  setMethodForm(prev => ({ ...prev, expires: v }));
}}

              className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 outline-none focus:border-cyan-500/50 text-sm font-bold text-white placeholder:text-white/20" />
          </>}

          {methodType === 'crypto' && (
            <select value={methodForm.coin} onChange={e => setMethodForm(f => ({ ...f, coin: e.target.value }))}
              className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 outline-none focus:border-cyan-500/50 text-sm font-bold text-white">
              {['BTC', 'ETH', 'USDT', 'USDC', 'TON'].map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          )}

          {methodType === 'bank' && (
            <input type="text" placeholder={isRu ? 'Название банка' : 'Bank name'}
              value={methodForm.bank_name} onChange={e => setMethodForm(f => ({ ...f, bank_name: e.target.value }))}
              className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 outline-none focus:border-cyan-500/50 text-sm font-bold text-white placeholder:text-white/20" />
          )}
        </div>

        {methodError && (
          <p className="text-red-400 text-[10px] font-black uppercase">{methodError}</p>
        )}

        <div className="flex gap-3">
          <button onClick={() => { setShowAddMethod(false); setMethodError(''); }}
            className="flex-1 py-4 glass rounded-xl text-[10px] font-black uppercase text-white/40 hover:text-white transition-all">
            {isRu ? 'Отмена' : 'Cancel'}
          </button>
          <button onClick={handleAddMethod} disabled={processing}
            className="flex-1 py-4 bg-white text-black font-black rounded-xl text-[10px] uppercase hover:bg-cyan-400 transition-all active:scale-95 disabled:opacity-40 flex items-center justify-center gap-2">
            {processing
              ? <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
              : <><Plus size={14} /> {isRu ? 'Добавить' : 'Add'}</>}
          </button>
        </div>
      </motion.div>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20 md:pb-0">

      {/* Modals */}
      {showDeposit && (
        <PayModal
          title={isRu ? 'Пополнить баланс' : 'Deposit'}
          onConfirm={handleDeposit}
          onClose={() => { setShowDeposit(false); setAmount(''); setSelectedMethodId(''); }}
          isWithdraw={false}
        />
      )}
      {showWithdraw && (
        <PayModal
          title={isRu ? 'Вывод средств' : 'Withdraw'}
          onConfirm={handleWithdraw}
          onClose={() => { setShowWithdraw(false); setAmount(''); setSelectedMethodId(''); }}
          isWithdraw={true}
        />
      )}
      {showAddMethod && <AddMethodModal />}

      {/* Delete method confirm */}
      {deleteMethodId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-xs glass-card p-8 rounded-3xl border border-red-500/20 bg-[#0a0a0a] space-y-6 text-center">
            <Trash2 size={36} className="text-red-400 mx-auto" />
            <div>
              <h3 className="text-base font-black uppercase italic text-white">{isRu ? 'Удалить метод?' : 'Delete method?'}</h3>
              <p className="text-[10px] text-white/30 mt-1">{isRu ? 'Нельзя отменить' : 'Cannot be undone'}</p>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setDeleteMethodId(null)} className="flex-1 py-3 glass rounded-xl text-[10px] font-black uppercase text-white/40 hover:text-white">
                {isRu ? 'Отмена' : 'Cancel'}
              </button>
              <button onClick={() => handleDeleteMethod(deleteMethodId)}
                className="flex-1 py-3 bg-red-500 text-white font-black rounded-xl text-[10px] uppercase hover:bg-red-400 transition-all active:scale-95">
                {isRu ? 'Удалить' : 'Delete'}
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-4 md:px-0">
        <div>
          <h1 className="text-3xl md:text-5xl font-display font-black tracking-tighter uppercase italic text-white/90 leading-none">
            {isRu ? 'ПЛАТЁЖНЫЙ ' : 'PAYMENT '}<span className="neon-text">{isRu ? 'ЦЕНТР' : 'CENTER'}</span>
          </h1>
          <p className="text-white/40 text-xs md:text-sm mt-2 font-medium italic">
            {isRu ? 'Управляйте своими финансами' : 'Manage your finances'}
          </p>
          <AnimatePresence>
            {msg && (
              <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className={cn("text-xs font-black mt-2", msg.type === 'error' ? 'text-red-400' : 'text-emerald-400')}>
                {msg.text}
              </motion.p>
            )}
          </AnimatePresence>
        </div>
        <div className="flex gap-2">
          <button onClick={() => { setShowWithdraw(true); setSelectedMethodId(''); }}
            className="flex-1 md:flex-none px-6 py-4 glass rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all flex items-center justify-center gap-2 text-white/70">
            <Wallet size={16} /> {isRu ? 'Вывод' : 'Withdraw'}
          </button>
          <button onClick={() => { setShowDeposit(true); setSelectedMethodId(''); }}
            className="flex-1 md:flex-none px-8 py-4 bg-white text-black font-black rounded-xl text-[10px] uppercase hover:bg-cyan-400 transition-all shadow-lg active:scale-95">
            {isRu ? 'Пополнить' : 'Deposit'}
          </button>
        </div>
      </header>

      {/* Balance Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 px-4 md:px-0">
        <div className="glass-card p-8 bg-gradient-to-br from-cyan-500/10 to-transparent rounded-[32px] border border-white/5">
          <div className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20 mb-3">{isRu ? 'Баланс' : 'Total Balance'}</div>
          <div className="text-4xl md:text-5xl font-display font-black text-white italic tracking-tighter">
            ${loading ? '...' : (balance?.balance || 0).toLocaleString('en', { minimumFractionDigits: 2 })}
          </div>
          <div className="mt-6 flex items-center gap-2 text-white/20 text-[9px] font-black uppercase tracking-widest bg-white/5 w-fit px-3 py-1 rounded-full border border-white/5">
            <ArrowUpRight size={12} /> {isRu ? 'Доступно' : 'Available'}
          </div>
        </div>
        <div className="glass-card p-8 border border-white/5 bg-white/[0.02] rounded-[32px]">
          <div className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20 mb-3">{isRu ? 'Эскроу' : 'Escrow'}</div>
          <div className="text-4xl md:text-5xl font-display font-black text-white/40 italic tracking-tighter">
            ${loading ? '...' : (balance?.escrow_balance || 0).toLocaleString('en', { minimumFractionDigits: 2 })}
          </div>
          <div className="mt-6 flex items-center gap-2 text-white/20 text-[9px] font-black uppercase tracking-widest bg-white/5 w-fit px-3 py-1 rounded-full border border-white/5">
            <Clock size={12} /> {isRu ? 'Заморожено' : 'Locked'}
          </div>
        </div>
        <div className="glass-card p-8 border border-white/5 bg-white/5 sm:col-span-2 md:col-span-1 rounded-[32px]">
          <div className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20 mb-3">{isRu ? 'Заработано' : 'Total Earned'}</div>
          <div className="text-4xl md:text-5xl font-display font-black text-cyan-400 italic tracking-tighter">
            ${loading ? '...' : (balance?.earned_total || 0).toLocaleString('en', { minimumFractionDigits: 2 })}
          </div>
          <div className="mt-6 flex items-center gap-2 text-white/40 text-[9px] font-black uppercase tracking-widest bg-cyan-500/10 w-fit px-3 py-1 rounded-full border border-cyan-500/20">
            <Zap size={12} className="text-cyan-400" /> {isRu ? 'Всего' : 'Lifetime'}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 px-4 md:px-0">

        {/* Transactions */}
        <div className="lg:col-span-8 space-y-4">
          <h3 className="text-2xl font-display font-black tracking-widest uppercase italic text-white/90">
            {isRu ? 'История ' : 'Transaction '}<span className="neon-text">{isRu ? 'операций' : 'History'}</span>
          </h3>

          {loading ? (
            <div className="glass-card rounded-[32px] border border-white/5 p-8 space-y-3">
              {[1,2,3].map(i => <div key={i} className="h-16 bg-white/5 rounded-xl animate-pulse" />)}
            </div>
          ) : transactions.length === 0 ? (
            <div className="glass-card rounded-[32px] border border-white/5 bg-white/[0.01] flex flex-col items-center justify-center py-20 text-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center text-white/10">
                <CreditCard size={32} />
              </div>
              <p className="text-sm font-black uppercase tracking-widest text-white/30">
                {isRu ? 'Нет операций' : 'No transactions yet'}
              </p>
            </div>
          ) : (
            <div className="glass-card rounded-[32px] border border-white/5 bg-white/[0.01] divide-y divide-white/5 overflow-hidden">
              {transactions.map((tx: any) => {
                const meta = typeIcon[tx.type] || typeIcon.payment;
                const isIncome = ['deposit', 'escrow_release', 'payment'].includes(tx.type);
                return (
                  <div key={tx.id} className="flex items-center justify-between p-5 hover:bg-white/[0.02] transition-colors">
                    <div className="flex items-center gap-4">
                      <div className={cn("w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0", meta.color)}>
                        <meta.icon size={18} />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-white/80 capitalize">{tx.description || tx.type}</div>
                        <div className="text-[9px] text-white/30 font-black uppercase tracking-widest">
                          {new Date(tx.created_at).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <div className={cn("font-black text-base", isIncome ? 'text-emerald-400' : 'text-red-400')}>
                      {isIncome ? '+' : '-'}${tx.amount.toLocaleString('en', { minimumFractionDigits: 2 })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Payment Methods */}
        <div className="lg:col-span-4 space-y-4">
          <h3 className="text-xl font-display font-black tracking-widest uppercase italic text-white/80">
            {isRu ? 'Методы ' : 'Payment '}<span className="neon-text">{isRu ? 'оплаты' : 'Methods'}</span>
          </h3>

          <div className="space-y-3">
            {loading ? (
              [1,2].map(i => <div key={i} className="h-20 bg-white/5 rounded-2xl animate-pulse" />)
            ) : methods.length === 0 ? (
              <div className="glass-card p-6 rounded-2xl border border-white/5 text-center space-y-2">
                <CreditCard size={24} className="text-white/10 mx-auto" />
                <p className="text-[10px] font-black uppercase text-white/20">
                  {isRu ? 'Нет методов оплаты' : 'No payment methods'}
                </p>
              </div>
            ) : (
              methods.map(m => (
                <div key={m.id}
                  className={cn(
                    "glass-card p-5 rounded-2xl border transition-all",
                    m.is_primary ? "border-cyan-500/30 bg-cyan-500/5" : "border-white/5 bg-white/[0.02] hover:border-white/20"
                  )}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {methodIcon(m.type)}
                      <div>
                        <div className="text-xs font-bold text-white flex items-center gap-2">
                          {m.label}
                          {m.is_primary === 1 && (
                            <span className="text-[8px] bg-cyan-400 text-black px-1.5 py-0.5 rounded font-black uppercase">
                              {isRu ? 'Основной' : 'Primary'}
                            </span>
                          )}
                        </div>
                        <div className="text-[9px] text-white/30 font-black uppercase mt-0.5">
                          {m.type === 'card' && `**** ${m.last4} · ${m.expires}`}
                          {m.type === 'crypto' && m.coin}
                          {m.type === 'bank' && m.bank_name}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      {m.is_primary !== 1 && (
                        <button onClick={() => handleSetPrimary(m.id)}
                          title={isRu ? 'Сделать основным' : 'Set primary'}
                          className="p-1.5 rounded-lg text-white/20 hover:text-cyan-400 hover:bg-cyan-500/10 transition-all">
                          <Star size={13} />
                        </button>
                      )}
                      <button onClick={() => setDeleteMethodId(m.id)}
                        className="p-1.5 rounded-lg text-white/20 hover:text-red-400 hover:bg-red-500/10 transition-all">
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}

            <button onClick={() => setShowAddMethod(true)}
              className="w-full py-4 border border-dashed border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white/30 hover:text-white hover:border-cyan-500/50 transition-all flex items-center justify-center gap-2">
              <Plus size={14} /> {isRu ? 'Добавить метод' : 'Add method'}
            </button>
          </div>

          {/* Security badge */}
          <div className="p-5 glass rounded-2xl border border-white/5">
            <div className="flex items-center gap-3 mb-2">
              <ShieldCheck size={16} className="text-emerald-400" />
              <h4 className="text-[10px] font-black uppercase tracking-widest text-white/80">
                {isRu ? 'Защита платежей' : 'Secure Payments'}
              </h4>
            </div>
            <p className="text-[10px] text-white/30 leading-relaxed italic">
              {isRu
                ? 'Все транзакции защищены. Данные карт не хранятся на наших серверах.'
                : 'All transactions are protected. Card details are never stored on our servers.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}