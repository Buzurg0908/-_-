import React, { useState, useRef } from 'react';
import { User, Settings as SettingsIcon, Shield, Bell, Smartphone, Lock, Eye, Key, Globe, Languages, Check, CreditCard, Star, Camera, X, AlertTriangle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { cn } from '../lib/utils';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../lib/api';

type SettingsTab = 'profile' | 'security' | 'notifications' | 'devices' | 'language';

export function Settings() {
  const [activeTab, setActiveTab] = useState<SettingsTab>('profile');
  const { language, setLanguage, t } = useLanguage();
  const { user, updateUser } = useAuth();
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [bio, setBio] = useState('');
  const [location, setLocation] = useState('');
  const [avatarPreview, setAvatarPreview] = useState<string | null>(user?.avatar || null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Security toggles
  const [security, setSecurity] = useState({
    twoFactor: true,
    incognito: false,
    biometric: false,
  });

  // Notification toggles
  const [notifications, setNotifications] = useState({
    messages: true,
    payments: true,
    marketing: false,
    news: true,
  });

  // Password change
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwords, setPasswords] = useState({ current: '', next: '', confirm: '' });
  const [passwordError, setPasswordError] = useState('');
  const [passwordSaved, setPasswordSaved] = useState(false);

  const ru = language === 'ru';

  const handleAvatarClick = () => fileInputRef.current?.click();

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      alert(ru ? 'Файл слишком большой. Максимум 5MB.' : 'File too large. Max 5MB.');
      return;
    }
    setAvatarFile(file);
    const reader = new FileReader();
    reader.onload = () => {
    const preview = reader.result as string;
    setAvatarPreview(preview);
    updateUser({ avatar: preview } as any);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveAvatar = () => {
    setAvatarPreview(null);
    setAvatarFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handlePasswordSave = () => {
    setPasswordError('');
    if (!passwords.current) {
      setPasswordError(ru ? 'Введите текущий пароль' : 'Enter current password');
      return;
    }
    if (passwords.next.length < 6) {
      setPasswordError(ru ? 'Минимум 6 символов' : 'Minimum 6 characters');
      return;
    }
    if (passwords.next !== passwords.confirm) {
      setPasswordError(ru ? 'Пароли не совпадают' : 'Passwords do not match');
      return;
    }
    // TODO: api.users.changePassword(passwords.current, passwords.next)
    setPasswordSaved(true);
    setPasswords({ current: '', next: '', confirm: '' });
    setShowPasswordForm(false);
    setTimeout(() => setPasswordSaved(false), 3000);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.users.updateMe({ name, bio, location });
updateUser({ name, bio, location } as any);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  const langs = [
    { id: 'ru', label: 'Русский', flag: '🇷🇺' },
    { id: 'en', label: 'English', flag: '🇺🇸' },
    { id: 'am', label: 'Հայերեն', flag: '🇦🇲' },
    { id: 'cn', label: '中文', flag: '🇨🇳' },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-8 md:space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20 md:pb-0">
      <header className="px-4 md:px-0">
        <h1 className="text-3xl md:text-4xl font-display font-black tracking-tighter uppercase italic">
          {t('settings_title')} <span className="neon-text">CONFIG</span>
        </h1>
        <p className="text-white/40 text-[10px] md:text-sm mt-1 uppercase tracking-widest font-black">
          {ru ? 'Управление профилем и настройками.' : 'Manage profile and settings.'}
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-8 px-4 md:px-0">
        {/* Sidebar */}
        <div className="space-y-2 overflow-x-auto pb-2 md:pb-0 flex md:flex-col gap-2 no-scrollbar">
          {[
            { id: 'profile', label: t('settings_profile'), icon: User },
            { id: 'security', label: t('settings_security'), icon: Shield },
            { id: 'notifications', label: t('settings_notifications'), icon: Bell },
            { id: 'devices', label: ru ? 'Устройства' : 'Devices', icon: Smartphone },
            { id: 'language', label: t('settings_language'), icon: Languages },
          ].map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as SettingsTab)}
              className={cn(
                "whitespace-nowrap flex items-center gap-3 p-4 rounded-xl text-[10px] md:text-xs font-bold uppercase tracking-widest transition-all shrink-0",
                activeTab === item.id
                  ? "bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.2)]"
                  : "text-white/40 hover:text-white hover:bg-white/5"
              )}
            >
              <item.icon size={16} className="shrink-0" /> {item.label}
            </button>
          ))}
          <div className="hidden md:block pt-4 mt-4 border-t border-white/5 space-y-2">
            <Link to="/payments" className="w-full flex items-center gap-3 p-4 rounded-xl text-xs font-bold uppercase tracking-widest text-white/40 hover:text-white hover:bg-white/5 transition-all">
              <CreditCard size={16} /> {t('nav_payments')}
            </Link>
            <Link to="/reviews" className="w-full flex items-center gap-3 p-4 rounded-xl text-xs font-bold uppercase tracking-widest text-white/40 hover:text-white hover:bg-white/5 transition-all">
              <Star size={16} /> {t('nav_reviews')}
            </Link>
          </div>
        </div>

        {/* Main content */}
        <div className="md:col-span-3">
          <div className="glass-card p-6 md:p-8 space-y-8 min-h-[400px] rounded-3xl border border-white/5 bg-white/[0.02]">

            {/* ── PROFILE ── */}
            {activeTab === 'profile' && (
              <div className="space-y-6 animate-in fade-in duration-500">
                <h3 className="font-bold text-xs uppercase tracking-widest flex items-center gap-2">
                  <SettingsIcon size={16} className="text-cyan-400" /> {ru ? 'Профиль' : 'Profile'}
                </h3>

                {/* Avatar */}
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase text-white/30 tracking-widest">{ru ? 'Аватар' : 'Avatar'}</label>
                  <div className="flex items-center gap-5">
                    <div className="relative group">
                      <div className="w-16 h-16 rounded-2xl border border-white/10 overflow-hidden bg-white/5 flex items-center justify-center">
                        {avatarPreview
                          ? <img src={avatarPreview} alt="avatar" className="w-full h-full object-cover" />
                          : <User size={28} className="text-white/20" />
                        }
                      </div>
                      {/* overlay on hover */}
                      <button
                        onClick={handleAvatarClick}
                        className="absolute inset-0 rounded-2xl bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Camera size={18} className="text-white" />
                      </button>
                    </div>

                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleAvatarChange}
                    />

                    <div className="flex flex-col gap-2">
                      <button
                        onClick={handleAvatarClick}
                        className="px-4 py-2 glass rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all border border-white/10"
                      >
                        {ru ? 'Изменить' : 'Change'}
                      </button>
                      {avatarPreview && (
                        <button
                          onClick={handleRemoveAvatar}
                          className="px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest text-red-400 hover:bg-red-500/10 border border-red-500/20 transition-all flex items-center gap-1"
                        >
                          <X size={10} /> {ru ? 'Удалить' : 'Remove'}
                        </button>
                      )}
                      <p className="text-[9px] text-white/20 uppercase font-black">JPG, PNG · max 5MB</p>
                    </div>
                  </div>
                </div>

                {/* Name + Location */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase text-white/30 tracking-widest">{ru ? 'Имя' : 'Display Name'}</label>
                    <input
                      type="text"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 outline-none focus:border-cyan-500/50 text-sm font-bold text-white transition-colors"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase text-white/30 tracking-widest">{ru ? 'Локация' : 'Location'}</label>
                    <input
                      type="text"
                      value={location}
                      onChange={e => setLocation(e.target.value)}
                      placeholder={ru ? 'Город, Страна' : 'City, Country'}
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 outline-none focus:border-cyan-500/50 text-sm font-bold text-white placeholder:text-white/20 transition-colors"
                    />
                  </div>
                </div>

                {/* Bio */}
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase text-white/30 tracking-widest">{ru ? 'Био' : 'Bio'}</label>
                  <textarea
                    value={bio}
                    onChange={e => setBio(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 outline-none focus:border-cyan-500/50 text-sm min-h-[100px] text-white/80 resize-none transition-colors"
                    placeholder={ru ? 'Расскажите о себе...' : 'Tell about yourself...'}
                  />
                </div>
              </div>
            )}

            {/* ── SECURITY ── */}
            {activeTab === 'security' && (
              <div className="space-y-6 animate-in fade-in duration-500">
                <h3 className="font-bold text-xs uppercase tracking-widest flex items-center gap-2">
                  <Lock size={16} className="text-pink-500" /> {ru ? 'Безопасность' : 'Security'}
                </h3>

                <div className="space-y-4">
                  {/* Toggles */}
                  {([
                    { key: 'twoFactor', title: ru ? 'Двухфакторная аутентификация' : 'Two-Factor Auth', desc: ru ? 'Защита кодом из приложения' : 'App-based protection', icon: Key, color: 'text-pink-500' },
                    { key: 'incognito', title: ru ? 'Режим Инкогнито' : 'Incognito Mode', desc: ru ? 'Скрыть профиль из поиска' : 'Hide profile from search', icon: Eye, color: 'text-cyan-400' },
                    { key: 'biometric', title: ru ? 'Биометрический вход' : 'Biometric Login', desc: 'FaceID / TouchID', icon: Shield, color: 'text-white/40' },
                  ] as const).map(item => (
                    <div
                      key={item.key}
                      onClick={() => setSecurity(prev => ({ ...prev, [item.key]: !prev[item.key] }))}
                      className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5 hover:border-white/20 transition-all cursor-pointer select-none"
                    >
                      <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-xl bg-white/5 ${item.color} shrink-0`}><item.icon size={20} /></div>
                        <div>
                          <div className="text-xs font-bold text-white">{item.title}</div>
                          <div className="text-[9px] text-white/20 uppercase font-black">{item.desc}</div>
                        </div>
                      </div>
                      <div className={cn("w-10 h-5 rounded-full flex items-center px-1 transition-colors shrink-0", security[item.key] ? "bg-cyan-500" : "bg-white/10")}>
                        <div className={cn("w-3 h-3 bg-white rounded-full transition-transform", security[item.key] ? "translate-x-5" : "translate-x-0")} />
                      </div>
                    </div>
                  ))}

                  {/* Change password */}
                  <div className="pt-2">
                    <button
                      onClick={() => setShowPasswordForm(v => !v)}
                      className="w-full flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5 hover:border-white/20 transition-all"
                    >
                      <div className="flex items-center gap-4">
                        <div className="p-3 rounded-xl bg-white/5 text-amber-400 shrink-0"><Lock size={20} /></div>
                        <div className="text-left">
                          <div className="text-xs font-bold text-white">{ru ? 'Сменить пароль' : 'Change Password'}</div>
                          <div className="text-[9px] text-white/20 uppercase font-black">{ru ? 'Последнее изменение неизвестно' : 'Last changed unknown'}</div>
                        </div>
                      </div>
                      <span className="text-[10px] font-black uppercase text-white/30">{showPasswordForm ? '▲' : '▼'}</span>
                    </button>

                    {showPasswordForm && (
                      <div className="mt-3 p-4 rounded-xl bg-white/[0.03] border border-white/10 space-y-3 animate-in fade-in duration-300">
                        {(['current', 'next', 'confirm'] as const).map((field, i) => (
                          <input
                            key={field}
                            type="password"
                            value={passwords[field]}
                            onChange={e => setPasswords(prev => ({ ...prev, [field]: e.target.value }))}
                            placeholder={
                              ru
                                ? ['Текущий пароль', 'Новый пароль', 'Повторите новый пароль'][i]
                                : ['Current password', 'New password', 'Confirm new password'][i]
                            }
                            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 outline-none focus:border-cyan-500/50 text-sm font-bold text-white placeholder:text-white/20 transition-colors"
                          />
                        ))}
                        {passwordError && (
                          <div className="flex items-center gap-2 text-red-400 text-[10px] font-black uppercase">
                            <AlertTriangle size={12} /> {passwordError}
                          </div>
                        )}
                        <button
                          onClick={handlePasswordSave}
                          className="w-full py-3 bg-pink-500/20 border border-pink-500/40 text-pink-400 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-pink-500/30 transition-all"
                        >
                          {ru ? 'Обновить пароль' : 'Update Password'}
                        </button>
                      </div>
                    )}

                    {passwordSaved && (
                      <div className="mt-2 flex items-center gap-2 text-emerald-400 text-[10px] font-black uppercase animate-in fade-in">
                        <Check size={12} /> {ru ? 'Пароль обновлён!' : 'Password updated!'}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* ── NOTIFICATIONS ── */}
            {activeTab === 'notifications' && (
              <div className="space-y-6 animate-in fade-in duration-500">
                <h3 className="font-bold text-xs uppercase tracking-widest flex items-center gap-2">
                  <Bell size={16} className="text-amber-400" /> {ru ? 'Уведомления' : 'Notifications'}
                </h3>
                <div className="space-y-4">
                  {([
                    { key: 'messages', title: ru ? 'Новые сообщения' : 'New Messages' },
                    { key: 'payments', title: ru ? 'Статус платежа' : 'Payment Status' },
                    { key: 'marketing', title: ru ? 'Маркетинговые' : 'Marketing' },
                    { key: 'news', title: ru ? 'Новости платформы' : 'Platform News' },
                  ] as const).map(n => (
                    <div
                      key={n.key}
                      onClick={() => setNotifications(prev => ({ ...prev, [n.key]: !prev[n.key] }))}
                      className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5 hover:border-white/20 transition-all cursor-pointer select-none"
                    >
                      <span className="text-xs font-bold text-white/80">{n.title}</span>
                      <div className={cn("w-10 h-5 rounded-full flex items-center px-1 transition-colors shrink-0", notifications[n.key] ? "bg-emerald-500" : "bg-white/10")}>
                        <div className={cn("w-3 h-3 bg-white rounded-full transition-transform", notifications[n.key] ? "translate-x-5" : "translate-x-0")} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── DEVICES ── */}
            {activeTab === 'devices' && (
              <div className="space-y-6 animate-in fade-in duration-500">
                <h3 className="font-bold text-xs uppercase tracking-widest flex items-center gap-2">
                  <Smartphone size={16} className="text-indigo-400" /> {ru ? 'Устройства' : 'Devices'}
                </h3>
                <div className="space-y-4">
                  {[
                    { name: 'Current Browser', location: ru ? 'Активная сессия' : 'Active Session', time: ru ? 'Сейчас' : 'Now', current: true },
                  ].map(device => (
                    <div key={device.name} className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5">
                      <div className="flex items-center gap-4">
                        <Globe size={20} className="text-white/30" />
                        <div>
                          <div className="text-xs font-bold text-white flex items-center gap-2">
                            {device.name}
                            {device.current && (
                              <span className="text-[8px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded uppercase font-black">Online</span>
                            )}
                          </div>
                          <div className="text-[9px] text-white/20 uppercase font-black">{device.location} · {device.time}</div>
                        </div>
                      </div>
                    </div>
                  ))}

                  <button className="w-full py-3 rounded-xl border border-red-500/20 text-red-400 text-[10px] font-black uppercase tracking-widest hover:bg-red-500/10 transition-all">
                    {ru ? 'Завершить все другие сессии' : 'Sign out all other sessions'}
                  </button>
                </div>
              </div>
            )}

            {/* ── LANGUAGE ── */}
            {activeTab === 'language' && (
              <div className="space-y-6 animate-in fade-in duration-500">
                <h3 className="font-bold text-xs uppercase tracking-widest flex items-center gap-2">
                  <Languages size={16} className="text-cyan-400" /> {t('settings_language')}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {langs.map(lang => (
                    <button
                      key={lang.id}
                      onClick={() => setLanguage(lang.id as any)}
                      className={cn(
                        "flex items-center justify-between p-4 md:p-5 rounded-2xl border transition-all text-left",
                        language === lang.id ? "bg-cyan-500/10 border-cyan-500/50" : "bg-white/5 border-white/5 hover:border-white/20"
                      )}
                    >
                      <div className="flex items-center gap-4">
                        <span className="text-xl">{lang.flag}</span>
                        <span className={cn("text-xs font-bold", language === lang.id ? "text-white" : "text-white/40")}>{lang.label}</span>
                      </div>
                      {language === lang.id && <Check size={18} className="text-cyan-400" />}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* ── SAVE BUTTON ── */}
            <div className="pt-8 border-t border-white/5 flex justify-end">
              <button
                onClick={handleSave}
                disabled={saving}
                className="w-full md:w-auto px-8 py-4 bg-white text-black font-black rounded-2xl text-[10px] uppercase hover:bg-cyan-400 transition-all shadow-lg active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {saving
                  ? <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                  : saved
                  ? <><Check size={16} /> {ru ? 'Сохранено!' : 'Saved!'}</>
                  : t('btn_save')
                }
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}