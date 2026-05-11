import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Lock, User, Globe, Cpu, ShieldCheck, Zap, ChevronLeft, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { cn } from '../lib/utils';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';

export function Auth() {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'freelancer' | 'customer'>('freelancer');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const { t } = useLanguage();
  const { login, register, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      if (mode === 'login') {
        await login(email, password);
      } else {
        if (!name.trim()) { setError('Введите имя'); return; }
        await register(name, email, password, role);
      }
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Ошибка авторизации');
    }
  };

  const title = mode === 'login' ? t('auth_login_title') : t('auth_register_title');

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-[#0a0a0a]">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-cyan-500/7 rounded-full blur-[140px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md glass-card p-8 md:p-12 space-y-8 rounded-[40px] border border-white/5 shadow-2xl bg-white/[0.02] backdrop-blur-3xl"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent rounded-t-[40px]" />

        <div className="text-center space-y-3">
          <Link to="/" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white/20 hover:text-cyan-400 transition-colors">
            <ChevronLeft size={16} /> {t('nav_home')}
          </Link>
          <h1 className="text-3xl md:text-4xl font-display font-black tracking-tighter uppercase italic leading-none text-white/90">
            {title.split(' ')[0]} <span className="neon-text">{title.split(' ').slice(1).join(' ')}</span>
          </h1>
          <p className="text-white/40 text-xs font-semibold italic">{t('auth_subtitle')}</p>
        </div>

        {/* Mode switcher */}
        <div className="flex gap-2 p-1.5 bg-black/40 rounded-2xl border border-white/5 relative">
          <button onClick={() => { setMode('login'); setError(''); }}
            className={cn("flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all z-10",
              mode === 'login' ? "text-black" : "text-white/40 hover:text-white")}>
            {t('btn_login')}
          </button>
          <button onClick={() => { setMode('register'); setError(''); }}
            className={cn("flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all z-10",
              mode === 'register' ? "text-black" : "text-white/40 hover:text-white")}>
            {t('btn_register')}
          </button>
          <motion.div className="absolute top-1.5 bottom-1.5 left-1.5 w-[calc(50%-6px)] bg-white rounded-xl shadow-lg"
            animate={{ x: mode === 'login' ? 0 : '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }} />
        </div>

        <form onSubmit={handleAuth} className="space-y-5">
          <AnimatePresence mode="wait">
            {mode === 'register' && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="space-y-4 overflow-hidden">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-white/20 tracking-widest">{t('auth_avatar_label')}</label>
                  <div className="relative">
                    <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" />
                    <input type="text" value={name} onChange={e => setName(e.target.value)}
                      placeholder={t('auth_name_placeholder')}
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-6 outline-none focus:border-cyan-500/50 transition-all text-sm font-bold text-white placeholder:text-white/10" />
                  </div>
                </div>
                <div className="flex gap-2">
                  {(['freelancer', 'customer'] as const).map(r => (
                    <button key={r} type="button" onClick={() => setRole(r)}
                      className={cn("flex-1 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all",
                        role === r ? "border-cyan-500/50 text-cyan-400 bg-cyan-500/10" : "border-white/5 text-white/20 hover:border-white/20")}>
                      {r === 'freelancer' ? '🧑‍💻 Фрилансер' : '🏢 Клиент'}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-white/20 tracking-widest">{t('auth_email')}</label>
              <div className="relative">
                <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" />
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
                  placeholder="name@example.com"
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-6 outline-none focus:border-cyan-500/50 transition-all text-sm font-bold text-white placeholder:text-white/10" />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-[10px] font-black uppercase text-white/20 tracking-widest">{t('auth_password')}</label>
                {mode === 'login' && <button type="button" className="text-[10px] font-black uppercase text-cyan-400/40 hover:text-cyan-400 transition-colors">{t('auth_forgot')}</button>}
              </div>
              <div className="relative">
                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" />
                <input type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} required
                  placeholder="••••••••"
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-12 outline-none focus:border-cyan-500/50 transition-all text-sm font-bold text-white placeholder:text-white/10" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 hover:text-white">
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold">
              <AlertCircle size={16} /> {error}
            </div>
          )}

          <button type="submit" disabled={isLoading}
            className="w-full py-5 bg-white text-black font-black rounded-2xl text-[10px] uppercase tracking-widest hover:bg-cyan-400 transition-all shadow-xl active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed group flex items-center justify-center gap-2">
            {isLoading ? (
              <span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" /> Загрузка...</span>
            ) : (
              <><span>{mode === 'login' ? t('auth_btn_login') : t('auth_btn_register')}</span><Zap size={14} className="group-hover:animate-pulse" /></>
            )}
          </button>
        </form>

        <div className="space-y-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/5" /></div>
            <div className="relative flex justify-center text-[9px] uppercase font-black"><span className="bg-[#121212] px-4 text-white/20 tracking-widest">{t('auth_or_continue')}</span></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <button className="flex items-center justify-center gap-3 py-4 rounded-xl glass border border-white/5 text-[10px] font-black uppercase tracking-widest hover:bg-white/5 transition-all text-white/70">
              <Globe size={18} className="text-white/40" /> Google
            </button>
            <button className="flex items-center justify-center gap-3 py-4 rounded-xl glass border border-white/5 text-[10px] font-black uppercase tracking-widest hover:bg-white/5 transition-all text-white/70">
              <Cpu size={18} className="text-white/40" /> Github
            </button>
          </div>
          <div className="grid grid-cols-3 gap-4 pt-6 border-t border-white/5">
            {[{ icon: Cpu, label: 'Secure' }, { icon: ShieldCheck, label: 'Verified', color: 'text-cyan-400' }, { icon: Zap, label: 'Fast' }].map(({ icon: Icon, label, color }) => (
              <div key={label} className={cn("flex flex-col items-center gap-2 opacity-20 hover:opacity-40 transition-opacity", color)}>
                <Icon size={18} /><span className="text-[8px] font-black uppercase tracking-widest">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}