import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, Search, CheckCheck, Zap, ChevronLeft, MoreVertical, X, UserPlus } from 'lucide-react';
import { cn } from '../lib/utils';
import { useLanguage } from '../context/LanguageContext';
import { api } from '../lib/api';
import { useAuth } from '../context/AuthContext';

export function Chat() {
  const { t, language } = useLanguage();
  const { user } = useAuth();
  const [conversations, setConversations] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [activeChat, setActiveChat] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [sending, setSending] = useState(false);
  const [search, setSearch] = useState('');
  const [userSearch, setUserSearch] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searching, setSearching] = useState(false);
  const [showNewChat, setShowNewChat] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const pollRef = useRef<any>(null);

  useEffect(() => {
    loadConversations();
    return () => { if (pollRef.current) clearInterval(pollRef.current); };
  }, []);

  useEffect(() => {
    if (activeChat) {
      loadMessages(activeChat);
      pollRef.current = setInterval(() => loadMessages(activeChat), 5000);
    }
    return () => { if (pollRef.current) clearInterval(pollRef.current); };
  }, [activeChat]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const loadConversations = async () => {
    try {
      const convs = await api.messages.conversations();
      setConversations(convs || []);
    } catch {}
  };

  const loadMessages = async (contactId: string) => {
    try {
      const msgs = await api.messages.get(contactId);
      setMessages(msgs || []);
    } catch {}
  };

  // Search users by name
  useEffect(() => {
    if (!userSearch.trim()) { setSearchResults([]); return; }
    const timer = setTimeout(async () => {
      setSearching(true);
      try {
        const results = await api.users.search(userSearch);
        setSearchResults(results.filter((u: any) => u.id !== user?.id));
      } catch {} finally { setSearching(false); }
    }, 400);
    return () => clearTimeout(timer);
  }, [userSearch]);

  const startChat = (contactId: string) => {
    setActiveChat(contactId);
    setShowNewChat(false);
    setUserSearch('');
    setSearchResults([]);
    // Add to conversations if not there
    loadConversations();
  };

  const sendMessage = async () => {
    if (!inputValue.trim() || !activeChat || sending) return;
    setSending(true);
    try {
      const msg = await api.messages.send({ receiver_id: activeChat, content: inputValue.trim() });
      setMessages(prev => [...prev, msg]);
      setInputValue('');
      loadConversations();
    } catch {} finally { setSending(false); }
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  const filteredConversations = conversations.filter(c =>
    c.contact_name?.toLowerCase().includes(search.toLowerCase())
  );

  const activeContact = conversations.find(c => c.contact_id === activeChat);

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col md:flex-row gap-4 animate-in fade-in duration-500 pb-20 md:pb-0">
      {/* Contacts list */}
      <div className={cn(
        "w-full md:w-72 lg:w-80 glass-card flex flex-col overflow-hidden border border-white/5 rounded-3xl bg-white/[0.02]",
        activeChat ? "hidden md:flex" : "flex"
      )}>
        <header className="p-5 border-b border-white/5 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-display font-black tracking-tighter italic uppercase text-white/90">{t('chat_title')}</h2>
            <button onClick={() => setShowNewChat(true)}
              className="p-2 rounded-xl bg-white/5 hover:bg-cyan-500/20 text-white/30 hover:text-cyan-400 transition-all">
              <UserPlus size={16} />
            </button>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20" size={15} />
            <input type="text" value={search} onChange={e => setSearch(e.target.value)}
              placeholder={t('chat_search')}
              className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-9 pr-4 text-[10px] font-black uppercase tracking-widest outline-none focus:border-cyan-500/50 text-white placeholder:text-white/10" />
          </div>
        </header>

        <div className="flex-1 overflow-y-auto scrollbar-none py-2">
          {filteredConversations.length === 0 ? (
            <div className="p-8 text-center space-y-3">
              <div className="text-[10px] font-black uppercase tracking-widest text-white/10 italic">{t('chat_no_contacts')}</div>
              <button onClick={() => setShowNewChat(true)}
                className="text-[10px] font-black uppercase text-cyan-400/60 hover:text-cyan-400 transition-colors">
                {language === 'ru' ? '+ Найти пользователя' : '+ Find user'}
              </button>
            </div>
          ) : filteredConversations.map(c => (
            <button key={c.contact_id} onClick={() => setActiveChat(c.contact_id)}
              className={cn("w-full p-4 flex items-center gap-3 transition-all relative",
                activeChat === c.contact_id ? "bg-white/5" : "hover:bg-white/[0.02]")}>
              {activeChat === c.contact_id && <motion.div layoutId="active-chat" className="absolute left-0 top-0 bottom-0 w-1 bg-cyan-400 rounded-r" />}
              <div className="relative shrink-0">
                <div className="w-10 h-10 rounded-xl border border-white/10 overflow-hidden bg-white/5">
                  {c.contact_avatar
                    ? <img src={c.contact_avatar} alt={c.contact_name} className="w-full h-full object-cover" />
                    : <div className="w-full h-full flex items-center justify-center font-black text-white/30 text-sm">{c.contact_name?.[0]}</div>}
                </div>
                <div className={cn("absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-[#121212]",
                  c.contact_status === 'online' ? 'bg-emerald-500' : 'bg-white/20')} />
              </div>
              <div className="flex-1 text-left min-w-0">
                <div className="flex justify-between items-center mb-0.5">
                  <span className="font-bold text-xs uppercase tracking-tight text-white/80 truncate">{c.contact_name}</span>
                  {c.unread_count > 0 && (
                    <span className="w-4 h-4 rounded-full bg-cyan-400 text-black text-[8px] font-black flex items-center justify-center shrink-0">{c.unread_count}</span>
                  )}
                </div>
                <p className="text-[10px] text-white/40 font-medium truncate">{c.last_message}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* New chat modal */}
      <AnimatePresence>
        {showNewChat && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-sm glass-card p-6 rounded-3xl border border-white/10 bg-[#0a0a0a] space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-black text-sm uppercase tracking-tight text-white">
                  {language === 'ru' ? 'Найти пользователя' : 'Find User'}
                </h3>
                <button onClick={() => { setShowNewChat(false); setUserSearch(''); setSearchResults([]); }}
                  className="p-2 text-white/30 hover:text-white rounded-xl hover:bg-white/5">
                  <X size={18} />
                </button>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20" size={16} />
                <input type="text" value={userSearch} onChange={e => setUserSearch(e.target.value)}
                  placeholder={language === 'ru' ? 'Имя пользователя...' : 'User name...'}
                  autoFocus
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 outline-none focus:border-cyan-500/50 text-sm font-medium text-white placeholder:text-white/20" />
              </div>
              <div className="space-y-2 max-h-64 overflow-y-auto scrollbar-none">
                {searching && <div className="text-center py-4 text-[10px] text-white/20 uppercase font-black">Поиск...</div>}
                {!searching && userSearch && searchResults.length === 0 && (
                  <div className="text-center py-4 text-[10px] text-white/20 uppercase font-black">
                    {language === 'ru' ? 'Никого не найдено' : 'No users found'}
                  </div>
                )}
                {searchResults.map(u => (
                  <button key={u.id} onClick={() => startChat(u.id)}
                    className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-all text-left">
                    <div className="w-9 h-9 rounded-xl overflow-hidden bg-white/10 shrink-0">
                      {u.avatar ? <img src={u.avatar} alt={u.name} className="w-full h-full object-cover" />
                        : <div className="w-full h-full flex items-center justify-center text-white/30 font-black text-xs">{u.name?.[0]}</div>}
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-white/80 truncate">{u.name}</div>
                      <div className="text-[9px] text-white/30 uppercase font-black">{u.role}</div>
                    </div>
                    <div className={cn("w-2 h-2 rounded-full shrink-0 ml-auto",
                      u.status === 'online' ? 'bg-emerald-500' : 'bg-white/20')} />
                  </button>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Chat window */}
      {activeChat ? (
        <div className="flex-1 glass-card flex flex-col overflow-hidden border border-white/5 rounded-3xl bg-white/[0.02]">
          <header className="p-4 md:p-5 border-b border-white/5 flex items-center justify-between bg-black/20 backdrop-blur-md">
            <div className="flex items-center gap-3">
              <button onClick={() => setActiveChat(null)} className="md:hidden p-2 text-white/40 hover:text-white">
                <ChevronLeft size={22} />
              </button>
              <div className="w-9 h-9 rounded-xl border border-white/10 overflow-hidden bg-white/5 shrink-0">
                {activeContact?.contact_avatar
                  ? <img src={activeContact.contact_avatar} alt="" className="w-full h-full object-cover" />
                  : <div className="w-full h-full flex items-center justify-center text-white/30 font-black text-xs">{activeContact?.contact_name?.[0]}</div>}
              </div>
              <div>
                <div className="font-black text-sm flex items-center gap-2 uppercase tracking-tight text-white/90">
                  {activeContact?.contact_name}
                  <div className={cn("w-1.5 h-1.5 rounded-full shrink-0",
                    activeContact?.contact_status === 'online' ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]" : "bg-white/20")} />
                </div>
                <div className="text-[9px] text-white/30 uppercase tracking-widest font-black">{t('chat_secure')}</div>
              </div>
            </div>
            <button className="p-2 text-white/40 hover:text-white"><MoreVertical size={18} /></button>
          </header>

          <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 scrollbar-none">
            {messages.length === 0 && (
              <div className="flex items-center justify-center h-full">
                <p className="text-[10px] font-black uppercase tracking-widest text-white/20">
                  {language === 'ru' ? 'Начните разговор' : 'Start conversation'}
                </p>
              </div>
            )}
            {messages.map(msg => (
              <div key={msg.id}
                className={cn("flex flex-col gap-1 max-w-[85%] md:max-w-[70%]",
                  msg.sender_id === user?.id ? "ml-auto items-end" : "mr-auto items-start")}>
                <div className={cn("p-3 md:p-4 rounded-2xl text-sm leading-relaxed font-medium shadow-lg",
                  msg.sender_id === user?.id
                    ? "bg-gradient-to-br from-blue-600 to-cyan-500 text-white rounded-tr-sm"
                    : "glass border border-white/5 text-white/90 rounded-tl-sm bg-white/[0.03]")}>
                  {msg.content}
                </div>
                <div className="flex items-center gap-1 text-[9px] text-white/20 px-1 font-black uppercase">
                  {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  {msg.sender_id === user?.id && (
                    <CheckCheck size={12} className={cn(msg.is_read ? "text-cyan-400" : "text-white/20")} />
                  )}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <footer className="p-4 border-t border-white/5 bg-black/20">
            <div className="glass rounded-2xl p-1 flex items-center gap-2 border border-white/10 focus-within:border-cyan-500/30 transition-all bg-white/[0.02]">
              <input type="text" value={inputValue} onChange={e => setInputValue(e.target.value)} onKeyDown={handleKey}
                placeholder={t('chat_input_placeholder')}
                className="flex-1 bg-transparent border-none outline-none text-sm py-2.5 px-3 text-white placeholder:text-white/20 font-medium" />
              <button onClick={sendMessage} disabled={!inputValue.trim() || sending}
                className="w-11 h-11 rounded-xl bg-white text-black flex items-center justify-center hover:bg-cyan-400 active:scale-95 transition-all shadow-lg shrink-0 disabled:opacity-40">
                {sending ? <span className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" /> : <Send size={18} />}
              </button>
            </div>
          </footer>
        </div>
      ) : (
        <div className="hidden md:flex flex-1 glass-card items-center justify-center border border-white/5 rounded-3xl bg-white/[0.02]">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 rounded-3xl bg-white/5 flex items-center justify-center mx-auto border border-white/5 text-white/10">
              <Zap size={32} className="animate-pulse" />
            </div>
            <p className="text-[10px] font-black uppercase tracking-widest text-white/20">
              {language === 'ru' ? 'Выберите сеанс связи' : 'Select a session'}
            </p>
            <button onClick={() => setShowNewChat(true)}
              className="px-6 py-3 bg-white/5 hover:bg-white/10 text-white/40 hover:text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 mx-auto">
              <UserPlus size={14} /> {language === 'ru' ? 'Найти пользователя' : 'Find user'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}