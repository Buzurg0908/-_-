import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Search, 
  MessageSquare, 
  CreditCard, 
  Star, 
  ShieldQuestion, 
  Settings,
  PlusCircle,
  BarChart3
} from 'lucide-react';
import { cn } from '../lib/utils';
import { useLanguage } from '../context/LanguageContext';

export function Sidebar() {
  const { t } = useLanguage();

  const menuItems = [
    { icon: LayoutDashboard, label: t('nav_dashboard'), path: '/dashboard' },
    { icon: Search, label: t('nav_marketplace'), path: '/marketplace' },
    { icon: MessageSquare, label: t('nav_chat'), path: '/chat' },
    { icon: BarChart3, label: t('nav_analytics'), path: '/analytics' },
    { icon: CreditCard, label: t('nav_payments'), path: '/payments' },
    { icon: Star, label: t('nav_reviews'), path: '/reviews' },
    { icon: ShieldQuestion, label: t('nav_support'), path: '/support' },
  ];

  return (
    <aside className="sticky top-20 left-0 h-[calc(100vh-80px)] w-20 xl:w-64 border-r border-white/5 bg-black/40 backdrop-blur-xl flex flex-col p-4 z-40">
      <div className="flex-1 space-y-2">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => cn(
              "flex items-center gap-3 p-3 rounded-xl transition-all group overflow-hidden",
              isActive 
                ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shadow-[0_0_15px_rgba(6,182,212,0.1)]" 
                : "text-white/40 hover:text-white hover:bg-white/5"
            )}
          >
            {({ isActive }) => (
              <>
                <item.icon size={22} className={cn("shrink-0 transition-transform group-hover:scale-110", isActive ? "animate-pulse" : "")} />
                <span className="hidden xl:block font-bold text-xs uppercase tracking-widest whitespace-nowrap">{item.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>

      <div className="pt-4 border-t border-white/10 space-y-2">
        <NavLink
            to="/create-order"
            className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-black hover:shadow-[0_0_20px_rgba(6,182,212,0.5)] transition-all overflow-hidden uppercase text-[10px] tracking-widest"
          >
            <PlusCircle size={22} className="shrink-0" />
            <span className="hidden xl:block whitespace-nowrap">{t('nav_create_order')}</span>
        </NavLink>
        
        <NavLink
          to="/settings"
          className={({ isActive }) => cn(
            "flex items-center gap-3 p-3 rounded-xl transition-all group overflow-hidden",
            isActive 
              ? "bg-white text-black" 
              : "text-white/40 hover:text-white hover:bg-white/5"
          )}
        >
          <Settings size={22} className="shrink-0" />
          <span className="hidden xl:block font-bold text-xs uppercase tracking-widest">{t('nav_settings')}</span>
        </NavLink>
      </div>
    </aside>
  );
}
