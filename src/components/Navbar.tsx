import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  ShoppingBag, HelpCircle, Globe, Bell, Sun, Moon, Sparkles, Menu, X, Languages,
  LayoutDashboard, LogOut, Settings, User, ChevronDown
} from 'lucide-react';
import { cn } from '../lib/utils';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';

export function Navbar() {
  const [isScrolled, setIsScrolled] = React.useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(true);
  const { t, language, setLanguage } = useLanguage();
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menus on outside click
  React.useEffect(() => {
    const handler = () => { setIsLangMenuOpen(false); setIsUserMenuOpen(false); };
    document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, []);

  const navLinks = [
    { label: t('nav_home'), path: '/', icon: Globe },
    { label: t('nav_orders'), path: '/marketplace', icon: ShoppingBag },
    { label: t('nav_analytics'), path: '/analytics', icon: Sparkles },
    { label: t('nav_support'), path: '/support', icon: HelpCircle },
  ];

  const languages: { code: 'ru' | 'en' | 'am' | 'cn'; label: string }[] = [
    { code: 'en', label: 'English' },
    { code: 'ru', label: 'Русский' },
    { code: 'am', label: 'Հայերեն' },
    { code: 'cn', label: '中文' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsUserMenuOpen(false);
  };

  return (
    <nav className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-500 py-4 px-4 md:px-6 shrink-0",
      isScrolled ? "bg-black/90 backdrop-blur-3xl border-b border-white/5 py-3 shadow-2xl" : "bg-transparent"
    )}>
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* LOGO */}
        <NavLink to="/" className="flex items-center gap-2 md:gap-3 group shrink-0">
          <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-cyan-400 to-magenta-500 rounded-lg md:rounded-xl flex items-center justify-center p-[1px] group-hover:rotate-[10deg] transition-transform shadow-[0_0_15px_rgba(34,211,238,0.3)]">
            <div className="w-full h-full bg-black rounded-[7px] md:rounded-[10px] flex items-center justify-center text-lg md:text-xl font-black italic tracking-tighter text-white">N</div>
          </div>
          <span className="text-xl md:text-2xl font-black font-display tracking-tighter uppercase italic">
            NEO<span className="neon-text">LANCE</span>
          </span>
        </NavLink>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center gap-1 bg-white/5 rounded-2xl border border-white/5 p-1 backdrop-blur-md">
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) => cn(
                "px-4 py-2 text-[10px] font-black uppercase tracking-widest transition-all rounded-xl relative group overflow-hidden shrink-0",
                isActive ? "bg-white text-black" : "text-white/40 hover:text-white"
              )}
            >
              {link.label}
            </NavLink>
          ))}
        </div>

        <div className="flex items-center gap-2 md:gap-3 shrink-0">
          {/* Language Selector */}
          <div className="relative" onClick={e => e.stopPropagation()}>
            <button
              onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
              className="p-2 md:p-2.5 text-white/20 hover:text-cyan-400 transition-all flex items-center gap-1"
            >
              <Languages size={18} />
              <span className="text-[10px] font-black uppercase hidden sm:block">{language}</span>
            </button>
            <AnimatePresence>
              {isLangMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute right-0 mt-2 w-32 glass-card border border-white/10 p-2 z-[60] rounded-2xl"
                >
                  {languages.map((lang) => (
                    <button key={lang.code}
                      onClick={() => { setLanguage(lang.code); setIsLangMenuOpen(false); }}
                      className={cn(
                        "w-full text-left px-3 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-colors",
                        language === lang.code ? "bg-cyan-500 text-black" : "hover:bg-white/5 text-white/60"
                      )}>
                      {lang.label}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Theme toggle */}
          <button
            onClick={() => setIsDark(!isDark)}
            className="hidden md:flex p-2.5 text-white/20 hover:text-cyan-400 transition-all"
          >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {/* Bell */}
          <button className="hidden md:flex p-2.5 text-white/20 hover:text-cyan-400 transition-all relative">
            <Bell size={18} />
          </button>

          {/* Auth buttons OR user avatar */}
          {isAuthenticated && user ? (
            <div className="relative" onClick={e => e.stopPropagation()}>
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-2 p-1.5 rounded-2xl border border-white/10 hover:border-white/30 transition-all bg-white/5"
              >
                <div className="w-8 h-8 rounded-xl overflow-hidden bg-white/10 shrink-0">
                  {user.avatar
                    ? <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                    : <div className="w-full h-full flex items-center justify-center font-black text-white/60 text-xs">{user.name?.[0]?.toUpperCase()}</div>
                  }
                </div>
                <span className="hidden md:block text-[10px] font-black text-white/70 uppercase tracking-widest max-w-[80px] truncate">{user.name}</span>
                <ChevronDown size={14} className="hidden md:block text-white/30" />
              </button>

              <AnimatePresence>
                {isUserMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 mt-2 w-48 glass-card border border-white/10 p-2 z-[60] rounded-2xl"
                  >
                    <div className="px-3 py-2 border-b border-white/5 mb-2">
                      <div className="text-xs font-black text-white/80 truncate">{user.name}</div>
                      <div className="text-[9px] text-white/30 uppercase font-black">{user.role}</div>
                    </div>
                    {[
                      { icon: LayoutDashboard, label: language === 'ru' ? 'Панель' : 'Dashboard', path: '/dashboard' },
                      { icon: User, label: language === 'ru' ? 'Профиль' : 'Profile', path: `/profile/${user.id}` },
                      { icon: Settings, label: language === 'ru' ? 'Настройки' : 'Settings', path: '/settings' },
                    ].map(item => (
                      <button key={item.path}
                        onClick={() => { navigate(item.path); setIsUserMenuOpen(false); }}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest text-white/50 hover:text-white hover:bg-white/5 transition-all">
                        <item.icon size={14} /> {item.label}
                      </button>
                    ))}
                    <div className="border-t border-white/5 mt-2 pt-2">
                      <button onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest text-red-400 hover:bg-red-500/10 transition-all">
                        <LogOut size={14} /> {language === 'ru' ? 'Выйти' : 'Logout'}
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <>
              <NavLink to="/auth" className="text-[10px] font-black uppercase tracking-widest text-white/30 hover:text-white transition-colors shrink-0 px-2 hidden sm:block">{t('btn_login')}</NavLink>
              <NavLink to="/auth" className="px-4 md:px-6 py-2.5 md:py-3 bg-white text-black text-[10px] font-black uppercase tracking-widest rounded-lg md:rounded-xl hover:bg-cyan-400 transition-all shadow-lg shrink-0">
                {t('btn_register')}
              </NavLink>
            </>
          )}

          {/* Hamburger */}
          <button
            className="lg:hidden p-2 text-white/60 hover:text-white transition-all shrink-0"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden mt-4 glass-card border border-white/10 overflow-hidden rounded-2xl"
          >
            <div className="flex flex-col p-4 gap-2">
              {navLinks.map((link) => (
                <NavLink key={link.path} to={link.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={({ isActive }) => cn(
                    "px-4 py-4 text-xs font-black uppercase tracking-widest transition-all rounded-xl flex items-center gap-3",
                    isActive ? "bg-white text-black" : "text-white/40 hover:bg-white/5"
                  )}>
                  <link.icon size={16} /> {link.label}
                </NavLink>
              ))}
              {isAuthenticated && (
                <button onClick={handleLogout}
                  className="px-4 py-4 text-xs font-black uppercase tracking-widest text-red-400 hover:bg-red-500/10 rounded-xl flex items-center gap-3 transition-all">
                  <LogOut size={16} /> {language === 'ru' ? 'Выйти' : 'Logout'}
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}