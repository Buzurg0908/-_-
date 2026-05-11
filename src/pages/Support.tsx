import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search, HelpCircle, MessageCircle, BookOpen, LifeBuoy, Zap,
  ChevronRight, ShieldCheck, BrainCircuit, Sparkles, CheckCircle2, AlertCircle
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { cn } from '../lib/utils';
import { api } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export function Support() {
  const { t, language } = useLanguage();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [aiInput, setAiInput] = useState('');
  const [aiMessages, setAiMessages] = useState<{ role: 'user' | 'ai'; text: string }[]>([]);
  const [sending, setSending] = useState(false);
  const [contactForm, setContactForm] = useState({ subject: '', message: '' });
  const [contactSent, setContactSent] = useState(false);

  const faqs = [
    {
      q: language === 'ru' ? 'Как работает система Эскроу?' : 'How does Escrow work?',
      a: language === 'ru' ? 'Наша система отслеживает вехи проекта. Средства замораживаются при создании заказа и автоматически освобождаются после подтверждения выполнения каждого этапа.' : 'Our system monitors project milestones. Funds are frozen when an order is created and automatically released after each milestone is confirmed.'
    },
    {
      q: language === 'ru' ? 'Что такое Индекс репутации?' : 'What is the Reputation Index?',
      a: language === 'ru' ? 'Комплексный показатель на основе скорости ответа, качества работ, рейтинга отзывов и сложности выполненных проектов. Обновляется в реальном времени.' : 'A comprehensive metric based on response speed, work quality, review rating, and project complexity. Updated in real time.'
    },
    {
      q: language === 'ru' ? 'Могу ли я платить криптовалютой?' : 'Can I pay with cryptocurrency?',
      a: language === 'ru' ? 'Да, мы поддерживаем основные Web3-кошельки: MetaMask, WalletConnect. Принимаем BTC, ETH и USDC.' : 'Yes, we support major Web3 wallets: MetaMask, WalletConnect. We accept BTC, ETH and USDC.'
    },
    {
      q: language === 'ru' ? 'Как разрешить спор с исполнителем?' : 'How to resolve a dispute with a freelancer?',
      a: language === 'ru' ? 'Откройте спор через страницу заказа. Наша команда медиаторов рассмотрит дело в течение 48 часов и вынесет решение на основе доказательств.' : 'Open a dispute through the order page. Our mediation team will review the case within 48 hours and make a decision based on evidence.'
    },
    {
      q: language === 'ru' ? 'Как защищены мои данные?' : 'How is my data protected?',
      a: language === 'ru' ? 'Все пароли хешируются с bcrypt. Соединения шифруются по TLS. Токены JWT с истечением 30 дней. Мы не храним данные карт — только токены платёжных систем.' : 'All passwords are hashed with bcrypt. Connections are TLS encrypted. JWT tokens expire in 30 days. We do not store card data — only payment system tokens.'
    },
  ];

  const filteredFaqs = faqs.filter(f =>
    f.q.toLowerCase().includes(search.toLowerCase()) ||
    f.a.toLowerCase().includes(search.toLowerCase())
  );

  const sendAiMessage = () => {
    if (!aiInput.trim()) return;
    const userMsg = aiInput.trim();
    setAiMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setAiInput('');
    setSending(true);

    // Simple rule-based AI responses
    setTimeout(() => {
      let response = '';
      const q = userMsg.toLowerCase();
      if (q.includes('эскроу') || q.includes('escrow') || q.includes('деньги') || q.includes('money')) {
        response = language === 'ru'
          ? 'Система Эскроу замораживает средства до подтверждения выполнения работ. Это защищает обе стороны сделки.'
          : 'Escrow freezes funds until work completion is confirmed. This protects both parties in the transaction.';
      } else if (q.includes('пароль') || q.includes('password') || q.includes('безопасность') || q.includes('security')) {
        response = language === 'ru'
          ? 'Ваши пароли защищены шифрованием bcrypt. Рекомендуем включить двухфакторную аутентификацию в настройках.'
          : 'Your passwords are protected with bcrypt encryption. We recommend enabling two-factor authentication in settings.';
      } else if (q.includes('отзыв') || q.includes('review') || q.includes('рейтинг') || q.includes('rating')) {
        response = language === 'ru'
          ? 'Отзывы можно оставить после завершения заказа. Рейтинг рассчитывается автоматически на основе всех отзывов.'
          : 'Reviews can be left after order completion. The rating is calculated automatically based on all reviews.';
      } else if (q.includes('оплат') || q.includes('payment') || q.includes('вывод') || q.includes('withdraw')) {
        response = language === 'ru'
          ? 'Пополнение и вывод доступны в разделе "Платежи". Поддерживаем карты и крипту. Вывод обрабатывается в течение 24 часов.'
          : 'Deposit and withdrawal are available in the "Payments" section. We support cards and crypto. Withdrawals are processed within 24 hours.';
      } else {
        response = language === 'ru'
          ? 'Спасибо за вопрос! Для детальной помощи обратитесь в прямую поддержку или изучите раздел FAQ выше.'
          : 'Thanks for your question! For detailed help, contact direct support or check the FAQ section above.';
      }
      setAiMessages(prev => [...prev, { role: 'ai', text: response }]);
      setSending(false);
    }, 800);
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) { navigate('/auth'); return; }
    setContactSent(true);
    setContactForm({ subject: '', message: '' });
    setTimeout(() => setContactSent(false), 3000);
  };

  const boxes = [
    { icon: BrainCircuit, label: t('sup_ai_bot'), desc: t('sup_ai_bot_desc'), color: 'text-indigo-400', action: () => document.getElementById('ai-assistant')?.scrollIntoView({ behavior: 'smooth' }) },
    { icon: MessageCircle, label: t('sup_direct'), desc: t('sup_direct_desc'), color: 'text-cyan-400', action: () => document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' }) },
    { icon: BookOpen, label: t('sup_protocols'), desc: t('sup_protocols_desc'), color: 'text-pink-400', action: () => document.getElementById('faq-section')?.scrollIntoView({ behavior: 'smooth' }) },
  ];

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20 md:pb-0 font-sans">
      <header className="text-center py-6 md:py-10 space-y-6 px-4">
        <div className="w-16 h-16 rounded-3xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center mx-auto text-cyan-400 shadow-[0_0_30px_rgba(6,182,212,0.1)] hover:rotate-12 transition-transform cursor-pointer">
          <LifeBuoy size={32} />
        </div>
        <div className="space-y-3">
          <h1 className="text-3xl md:text-5xl font-display font-black tracking-tighter uppercase italic leading-none text-white/90">
            {t('sup_title').split(' ')[0]} <span className="neon-text">{t('sup_title').split(' ').slice(1).join(' ')}</span>
          </h1>
          <p className="text-white/40 max-w-lg mx-auto text-xs md:text-sm font-medium italic">{t('sup_subtitle')}</p>
        </div>
        <div className="relative max-w-xl mx-auto">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20" size={18} />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)}
            placeholder={t('sup_search')}
            className="w-full bg-white/5 border border-white/10 rounded-full py-4 md:py-5 pl-14 pr-6 outline-none focus:border-cyan-500/50 transition-all text-sm font-bold placeholder:text-white/10 text-white" />
        </div>
      </header>

      {/* Feature boxes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 px-4 md:px-0">
        {boxes.map((box) => (
          <motion.div key={box.label} whileHover={{ y: -5 }}
            onClick={box.action}
            className="glass-card p-8 border border-white/5 hover:border-white/20 transition-all cursor-pointer group flex flex-col items-center text-center md:items-start md:text-left rounded-[32px] bg-white/[0.02]">
            <div className={cn("w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg", box.color)}>
              <box.icon size={24} />
            </div>
            <h3 className="text-lg font-bold mb-3 uppercase tracking-tight text-white/80">{box.label}</h3>
            <p className="text-xs text-white/30 leading-relaxed mb-8 font-semibold italic">{box.desc}</p>
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white/20 group-hover:text-cyan-400 transition-colors mt-auto">
              {t('sup_connect')} <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-10 border-t border-white/5 px-4 md:px-0">
        {/* FAQ */}
        <div id="faq-section" className="lg:col-span-8 space-y-6">
          <h3 className="text-2xl font-display font-black tracking-tighter uppercase italic text-white/90">
            {t('sup_faqs').split(' ')[0]} <span className="neon-text">{t('sup_faqs').split(' ').slice(1).join(' ')}</span>
          </h3>
          <div className="space-y-3">
            {filteredFaqs.length === 0 ? (
              <div className="glass-card p-8 text-center rounded-2xl border border-white/5">
                <p className="text-[10px] font-black uppercase text-white/20">{language === 'ru' ? 'Ничего не найдено' : 'Nothing found'}</p>
              </div>
            ) : filteredFaqs.map((faq, i) => (
              <div key={i} onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="glass-card rounded-3xl border border-white/5 bg-white/[0.01] overflow-hidden cursor-pointer">
                <div className="p-6 md:p-8 flex items-center justify-between hover:bg-white/[0.02] transition-colors">
                  <h4 className="font-bold text-sm text-white/70 uppercase tracking-tight pr-4">{faq.q}</h4>
                  <ChevronRight size={16} className={cn("text-white/20 transition-all shrink-0", openFaq === i ? "rotate-90 text-cyan-400" : "")} />
                </div>
                <AnimatePresence>
                  {openFaq === i && (
                    <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }}
                      className="overflow-hidden">
                      <p className="text-xs text-white/40 leading-relaxed font-medium italic px-6 md:px-8 pb-6 border-t border-white/5 pt-4">{faq.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>

          {/* Contact form */}
          <div id="contact-form" className="glass-card p-6 md:p-8 rounded-3xl border border-white/5 bg-white/[0.01] space-y-6 mt-8">
            <h3 className="font-black text-sm uppercase tracking-widest text-white/80 flex items-center gap-2">
              <MessageCircle size={18} className="text-cyan-400" />
              {language === 'ru' ? 'Написать в поддержку' : 'Contact Support'}
            </h3>
            {contactSent ? (
              <div className="flex items-center gap-3 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400">
                <CheckCircle2 size={18} />
                <span className="text-xs font-black uppercase tracking-widest">
                  {language === 'ru' ? 'Сообщение отправлено!' : 'Message sent!'}
                </span>
              </div>
            ) : (
              <form onSubmit={handleContactSubmit} className="space-y-4">
                <input type="text" value={contactForm.subject} onChange={e => setContactForm(f => ({ ...f, subject: e.target.value }))}
                  required placeholder={language === 'ru' ? 'Тема обращения' : 'Subject'}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-5 outline-none focus:border-cyan-500/50 text-sm font-medium text-white placeholder:text-white/20" />
                <textarea value={contactForm.message} onChange={e => setContactForm(f => ({ ...f, message: e.target.value }))}
                  required rows={4} placeholder={language === 'ru' ? 'Опишите проблему...' : 'Describe your issue...'}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-5 outline-none focus:border-cyan-500/50 text-sm font-medium text-white placeholder:text-white/20 resize-none" />
                <button type="submit"
                  className="w-full py-4 bg-white text-black font-black rounded-xl text-[10px] uppercase tracking-widest hover:bg-cyan-400 transition-all active:scale-95">
                  {language === 'ru' ? 'Отправить' : 'Send Message'}
                </button>
              </form>
            )}
          </div>
        </div>

        {/* AI Assistant */}
        <div id="ai-assistant" className="lg:col-span-4">
          <div className="glass-card p-6 bg-gradient-to-br from-indigo-500/10 to-purple-500/5 border border-indigo-500/20 rounded-[40px] overflow-hidden relative shadow-2xl sticky top-24">
            <div className="relative z-10 space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-indigo-500 flex items-center justify-center shadow-lg shrink-0">
                  <Sparkles size={20} className="text-white" />
                </div>
                <div>
                  <div className="font-black text-xs text-white/90 tracking-tight">NEO SYSTEM</div>
                  <div className="text-[9px] text-indigo-400 font-black uppercase tracking-widest">AI ASSISTANT</div>
                </div>
              </div>

              {/* Messages */}
              <div className="space-y-3 max-h-[300px] overflow-y-auto scrollbar-none">
                {aiMessages.length === 0 ? (
                  <p className="text-xs text-white/50 leading-relaxed italic border-l-2 border-indigo-500/30 pl-4 py-1 font-semibold">
                    "{t('sup_ai_ass_msg')}"
                  </p>
                ) : aiMessages.map((msg, i) => (
                  <div key={i} className={cn("text-xs leading-relaxed p-3 rounded-xl",
                    msg.role === 'user'
                      ? "bg-white/10 text-white/80 ml-4"
                      : "bg-indigo-500/10 border border-indigo-500/20 text-white/70 italic mr-4"
                  )}>
                    {msg.text}
                  </div>
                ))}
                {sending && (
                  <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-xl p-3 mr-4">
                    <div className="flex gap-1">
                      {[0, 1, 2].map(i => <div key={i} className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />)}
                    </div>
                  </div>
                )}
              </div>

              {/* Quick buttons */}
              {aiMessages.length === 0 && (
                <div className="space-y-2">
                  {[
                    language === 'ru' ? 'Безопасность аккаунта' : 'Account Security',
                    language === 'ru' ? 'Протокол оплаты' : 'Payment Protocol',
                  ].map(q => (
                    <button key={q} onClick={() => { setAiInput(q); }}
                      className="w-full py-2.5 rounded-xl glass border border-white/5 text-[9px] font-black uppercase tracking-widest hover:bg-white/5 transition-all text-white/40 hover:text-white text-left px-3">
                      {q}
                    </button>
                  ))}
                </div>
              )}

              {/* Input */}
              <div className="relative group">
                <input type="text" value={aiInput} onChange={e => setAiInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && sendAiMessage()}
                  placeholder={language === 'ru' ? "Напишите вопрос..." : "Ask a question..."}
                  className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 px-5 pr-12 text-xs outline-none focus:border-indigo-500/50 transition-all font-bold text-white placeholder:text-white/10" />
                <button onClick={sendAiMessage} disabled={sending || !aiInput.trim()}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-indigo-500 rounded-xl text-white flex items-center justify-center shadow-lg hover:bg-indigo-400 transition-all disabled:opacity-40">
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
            <div className="absolute top-[-20%] left-[-20%] w-[80%] h-[80%] bg-indigo-500/5 rounded-full blur-[100px] pointer-events-none" />
          </div>
        </div>
      </div>
    </div>
  );
}