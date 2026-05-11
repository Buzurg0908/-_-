import React, { useEffect, useState } from 'react';
import { Outlet, useLocation, Link } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { Background3D } from './Background3D';
import { useLanguage } from '../context/LanguageContext';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  MessageSquare, 
  BarChart3, 
  Settings as SettingsIcon,
  Plus,
  CreditCard,
  Star
} from 'lucide-react';
import { cn } from '../lib/utils';

export function Layout() {
  const location = useLocation();
  const { t, language } = useLanguage();

  const isDashboardLayout = ['/dashboard', '/marketplace', '/chat', '/profile', '/analytics', '/support', '/create-order', '/settings', '/payments', '/reviews'].some(path => 
    location.pathname.startsWith(path)
  );

  const navItems = [
    { icon: LayoutDashboard, path: '/dashboard' },
    { icon: ShoppingBag, path: '/marketplace' },
    { icon: Plus, path: '/create-order', center: true },
    { icon: MessageSquare, path: '/chat' },
    { icon: BarChart3, path: '/analytics' },
  ];

  return (
    <div className="relative min-h-screen bg-black overflow-x-hidden selection:bg-cyan-500/30">
      <Background3D />
      
      {/* Navigation */}
      <Navbar />
      
      <div className="flex pt-16 md:pt-20">
        {isDashboardLayout && <Sidebar />}
        
        <main className={cn(
          "flex-1 transition-all duration-500 overflow-x-hidden",
          isDashboardLayout ? "px-0 md:px-6 pb-24 md:pb-10" : "pt-10"
        )}>
          <div className={cn(
            isDashboardLayout ? "max-w-[1600px] mx-auto min-h-[calc(100vh-100px)]" : ""
          )}>
            <Outlet />
          </div>
        </main>
      </div>

      {/* MOBILE BOTTOM NAVIGATION */}
      {isDashboardLayout && (
        <nav className="md:hidden fixed bottom-6 left-6 right-6 z-50">
          <div className="glass flex items-center justify-around p-2 rounded-2xl border border-white/10 bg-black/40 backdrop-blur-xl shadow-[0_10px_40px_rgba(0,0,0,0.5)]">
            {navItems.map((item) => (
              <Link 
                key={item.path} 
                to={item.path}
                className={cn(
                  "relative p-3 rounded-xl transition-all duration-300",
                  item.center ? "bg-white text-black -mt-6 shadow-[0_0_20px_rgba(255,255,255,0.3)] scale-110 active:scale-95" : 
                  location.pathname === item.path ? "text-cyan-400 bg-white/5" : "text-white/40 hover:text-white"
                )}
              >
                <item.icon size={item.center ? 22 : 18} />
                {location.pathname === item.path && !item.center && (
                  <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-cyan-400 rounded-full shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
                )}
              </Link>
            ))}
          </div>
        </nav>
      )}
      
      {/* Footer is only on Landing page or simple pages */}
      {!isDashboardLayout && (
        <footer className="py-20 px-6 border-t border-white/5 bg-black/80 backdrop-blur-3xl relative z-10">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12">
            <div className="flex flex-col gap-6 text-center md:text-left">
              <span className="text-4xl font-black font-display tracking-tighter neon-text uppercase italic">NEO-LANCE</span>
              <p className="text-white/40 max-w-sm text-sm font-medium leading-relaxed">
                {t('footer_desc')}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-16 text-xs uppercase font-black tracking-widest">
              <div className="flex flex-col gap-4">
                <span className="text-white/20">{t('footer_platform')}</span>
                <a href="#" className="hover:text-cyan-400 transition-colors uppercase tracking-widest">{t('nav_marketplace')}</a>
                <a href="#" className="hover:text-cyan-400 transition-colors uppercase tracking-widest">{t('footer_talents')}</a>
                <a href="#" className="hover:text-cyan-400 transition-colors uppercase tracking-widest">{t('footer_tools')}</a>
              </div>
              <div className="flex flex-col gap-4">
                <span className="text-white/20">{t('footer_help')}</span>
                <a href="#" className="hover:text-cyan-400 transition-colors uppercase tracking-widest">{t('footer_community')}</a>
                <a href="#" className="hover:text-cyan-400 transition-colors uppercase tracking-widest">{t('footer_contacts')}</a>
                <a href="#" className="hover:text-cyan-400 transition-colors uppercase tracking-widest">{t('footer_help')}</a>
              </div>
            </div>
          </div>
          <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-black uppercase tracking-[0.3em] text-white/20">
            <span>© 2026 NEO-LANCE. {t('footer_rights')}.</span>
            <div className="flex gap-8">
              <a href="#" className="hover:text-white transition-colors uppercase tracking-widest">{t('footer_privacy')}</a>
              <a href="#" className="hover:text-white transition-colors uppercase tracking-widest">{t('footer_terms')}</a>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}
