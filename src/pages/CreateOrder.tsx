import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Zap, BrainCircuit, ChevronRight, ChevronLeft, Upload, DollarSign, Target, Layers, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';
import { cn } from '../lib/utils';
import { useLanguage } from '../context/LanguageContext';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../lib/api';
import { DatePicker } from '../components/DatePicker';

export function CreateOrder() {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const totalSteps = 4;

  const [form, setForm] = useState({
    title: '',
    description: '',
    category: '',
    expertise_level: 'Elite' as 'Junior' | 'Middle' | 'Elite',
    budget_min: '',
    budget_max: '',
    deadline: '',
    skills: [] as string[],
    is_urgent: false,
    price_type: 'fixed',
  });

  const [skillInput, setSkillInput] = useState('');

  const update = (key: keyof typeof form, val: any) => setForm(f => ({ ...f, [key]: val }));

  const addSkill = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && skillInput.trim()) {
      e.preventDefault();
      update('skills', [...form.skills, skillInput.trim()]);
      setSkillInput('');
    }
  };

  const removeSkill = (i: number) => update('skills', form.skills.filter((_, idx) => idx !== i));

  const nextStep = () => {
    setError('');
    if (step === 1 && (!form.title.trim() || !form.description.trim())) {
      setError(language === 'ru' ? 'Заполните название и описание' : 'Fill in title and description');
      return;
    }
    if (step === 2 && !form.category) {
      setError(language === 'ru' ? 'Выберите категорию' : 'Select a category');
      return;
    }
    if (step === 3 && (!form.budget_min || !form.deadline)) {
      setError(language === 'ru' ? 'Укажите бюджет и дедлайн' : 'Specify budget and deadline');
      return;
    }
    if (step < totalSteps) setStep(s => s + 1);
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setError('');
    try {
      const order = await api.orders.create({
        title: form.title,
        description: form.description,
        category: form.category,
        expertise_level: form.expertise_level,
        budget_min: Number(form.budget_min),
        budget_max: Number(form.budget_max || form.budget_min),
        deadline: form.deadline,
        skills: form.skills,
        is_urgent: form.is_urgent,
      });
      navigate(`/orders/${order.id}`);
    } catch (err: any) {
      setError(err.message || 'Error creating order');
    } finally {
      setSubmitting(false);
    }
  };

  const steps = [
    { id: 1, label: t('co_step_1') },
    { id: 2, label: t('co_step_2') },
    { id: 3, label: t('co_step_3') },
    { id: 4, label: t('co_step_4') },
  ];

  const cats = language === 'ru'
    ? ['Веб-разработка', 'ИИ и ML', '3D / Геймдизайн', 'Блокчейн / DeFi', 'Мобайл', 'Маркетинг', 'Дизайн']
    : ['Web Development', 'AI & ML', '3D / Game Design', 'Blockchain / DeFi', 'Mobile', 'Marketing', 'Design'];

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-24 md:pb-0">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 px-4 md:px-0">
        <div>
          <h1 className="text-3xl md:text-4xl font-display font-black tracking-tighter uppercase italic text-white/90 leading-none">
            {t('co_title').split(' ')[0]} <span className="neon-text">{t('co_title').split(' ').slice(1).join(' ')}</span>
          </h1>
          <p className="text-white/40 text-xs mt-2 font-medium italic">{t('co_subtitle')}</p>
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {steps.map((s, idx) => (
            <div key={s.id} className="flex items-center shrink-0">
              <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center font-black text-xs transition-all",
                step === s.id ? "bg-cyan-500 text-black shadow-[0_0_20px_rgba(6,182,212,0.3)]" :
                  step > s.id ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" : "bg-white/5 text-white/20")}>
                {step > s.id ? <CheckCircle2 size={16} /> : s.id}
              </div>
              {idx < 3 && <div className={cn("w-8 h-0.5 mx-1 rounded-full", step > s.id ? "bg-emerald-500/30" : "bg-white/5")} />}
            </div>
          ))}
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 px-4 md:px-0">
        <div className="lg:col-span-8 glass-card p-6 md:p-10 min-h-[480px] flex flex-col border border-white/5 rounded-[32px] bg-white/[0.02]">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6 flex-1">
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-white/30">{t('co_label_title')}</label>
                  <input type="text" value={form.title} onChange={e => update('title', e.target.value)}
                    placeholder={language === 'ru' ? "Например: 3D дашборд нового поколения" : "e.g. Next-Gen 3D Dashboard"}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-5 outline-none focus:border-cyan-500/50 transition-all text-lg font-bold placeholder:text-white/10 text-white" />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-white/30">{t('co_label_desc')}</label>
                  <textarea rows={8} value={form.description} onChange={e => update('description', e.target.value)}
                    placeholder={language === 'ru' ? "Опишите задачу подробно..." : "Describe your task in detail..."}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-5 outline-none focus:border-cyan-500/50 transition-all text-sm font-medium resize-none placeholder:text-white/10 text-white leading-relaxed" />
                </div>
                <div className="flex items-center gap-3">
                  <input type="checkbox" id="urgent" checked={form.is_urgent} onChange={e => update('is_urgent', e.target.checked)}
                    className="w-4 h-4 rounded accent-cyan-400" />
                  <label htmlFor="urgent" className="text-[11px] font-black uppercase tracking-widest text-white/40 cursor-pointer flex items-center gap-2">
                    <Zap size={14} className="text-amber-400" /> {language === 'ru' ? 'Срочный заказ' : 'Urgent order'}
                  </label>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8 flex-1">
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-white/30">{t('co_label_industry')}</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                    {cats.map(cat => (
                      <button key={cat} type="button" onClick={() => update('category', cat)}
                        className={cn("p-3 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all text-left",
                          form.category === cat ? "border-cyan-500/50 text-cyan-400 bg-cyan-500/10" : "border-white/5 text-white/30 hover:border-white/20 hover:text-white/60")}>
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-white/30">{t('co_label_expertise')}</label>
                  <div className="flex gap-3">
                    {(['Junior', 'Middle', 'Elite'] as const).map(tier => (
                      <button key={tier} type="button" onClick={() => update('expertise_level', tier)}
                        className={cn("flex-1 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all",
                          form.expertise_level === tier ? "border-cyan-500/50 text-cyan-400 bg-cyan-500/10" : "border-white/5 text-white/20 hover:border-white/20")}>
                        {language === 'ru' ? (tier === 'Junior' ? 'Младший' : tier === 'Middle' ? 'Средний' : 'Элита') : tier}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-white/30">{language === 'ru' ? 'Навыки (Enter для добавления)' : 'Skills (press Enter to add)'}</label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {form.skills.map((s, i) => (
                      <span key={i} className="flex items-center gap-1.5 px-3 py-1.5 bg-cyan-500/10 border border-cyan-500/20 rounded-lg text-[10px] font-black text-cyan-400">
                        {s} <button type="button" onClick={() => removeSkill(i)} className="hover:text-white">×</button>
                      </span>
                    ))}
                  </div>
                  <input type="text" value={skillInput} onChange={e => setSkillInput(e.target.value)} onKeyDown={addSkill}
                    placeholder={language === 'ru' ? "React, TypeScript..." : "React, TypeScript..."}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-5 outline-none focus:border-cyan-500/50 text-sm font-medium placeholder:text-white/10 text-white" />
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8 flex-1">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-white/30">{t('co_budget_limit')} (min)</label>
                    <div className="relative">
                      <DollarSign className="absolute left-5 top-1/2 -translate-y-1/2 text-cyan-400" size={24} />
                      <input type="number" value={form.budget_min} onChange={e => update('budget_min', e.target.value)}
                        placeholder="1000"
                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-6 pl-14 pr-5 outline-none focus:border-cyan-500/50 text-3xl font-display font-black placeholder:text-white/10 text-white" />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-white/30">{t('co_budget_limit')} (max)</label>
                    <div className="relative">
                      <DollarSign className="absolute left-5 top-1/2 -translate-y-1/2 text-cyan-400" size={24} />
                      <input type="number" value={form.budget_max} onChange={e => update('budget_max', e.target.value)}
                        placeholder={form.budget_min || "5000"}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-6 pl-14 pr-5 outline-none focus:border-cyan-500/50 text-3xl font-display font-black placeholder:text-white/10 text-white" />
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-white/30">{language === 'ru' ? 'Дедлайн' : 'Deadline'}</label>
                 <input type="date" value={form.deadline} onChange={e => update('deadline', e.target.value)}
  min={new Date().toISOString().split('T')[0]}
  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-5 outline-none focus:border-cyan-500/50 text-sm font-bold text-white" /> </div>
                <div className="p-6 glass rounded-2xl border border-white/5 bg-gradient-to-br from-cyan-500/5 to-transparent flex items-start gap-4">
                  <Target size={24} className="text-cyan-400 shrink-0 mt-1" />
                  <div>
                    <h4 className="font-black text-sm uppercase tracking-tight text-white/80">{language === 'ru' ? 'Escrow защита' : 'Escrow Protection'}</h4>
                    <p className="text-[11px] text-white/40 leading-relaxed mt-1">
                      {language === 'ru' ? 'Средства заморожены до вашего подтверждения.' : 'Funds are frozen until your approval.'}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div key="step4" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                className="text-center py-10 space-y-8 flex-1 flex flex-col justify-center">
                <div className="w-24 h-24 rounded-3xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center mx-auto text-cyan-400 shadow-[0_0_40px_rgba(6,182,212,0.2)]">
                  <Sparkles size={48} className="animate-pulse" />
                </div>
                <div>
                  <h3 className="text-3xl md:text-4xl font-display font-black uppercase italic tracking-tighter text-white">
                    {t('co_launch_ready').split(' ').slice(0, -1).join(' ')} <span className="neon-text">{t('co_launch_ready').split(' ').slice(-1)}</span>
                  </h3>
                  <p className="text-xs text-white/40 max-w-sm mx-auto font-medium leading-relaxed italic mt-3">
                    {language === 'ru' ? 'Проект будет опубликован и доступен всем специалистам платформы.' : 'Project will be published and available to all platform specialists.'}
                  </p>
                </div>
                <div className="max-w-sm mx-auto p-6 glass-card text-left space-y-4 border border-white/10 rounded-2xl bg-white/[0.02]">
                  <div className="text-[9px] font-black uppercase text-white/20 tracking-widest border-b border-white/5 pb-3">
                    {language === 'ru' ? 'КОНФИГУРАЦИЯ' : 'CONFIGURATION'}
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div><div className="text-[9px] text-white/20 uppercase font-black">{language === 'ru' ? 'Название' : 'Title'}</div>
                      <div className="font-bold text-white/80 text-xs mt-1 truncate">{form.title || '—'}</div></div>
                    <div><div className="text-[9px] text-white/20 uppercase font-black">{language === 'ru' ? 'Категория' : 'Category'}</div>
                      <div className="font-bold text-white/80 text-xs mt-1">{form.category || '—'}</div></div>
                    <div><div className="text-[9px] text-white/20 uppercase font-black">{language === 'ru' ? 'Бюджет' : 'Budget'}</div>
                      <div className="font-black text-emerald-400 mt-1">${form.budget_min || '0'}</div></div>
                    <div><div className="text-[9px] text-white/20 uppercase font-black">{language === 'ru' ? 'Уровень' : 'Level'}</div>
                      <div className="font-bold text-cyan-400 text-xs mt-1">{form.expertise_level}</div></div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {error && (
            <div className="mt-4 flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold">
              <AlertCircle size={16} /> {error}
            </div>
          )}

          <div className="mt-auto pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
            <button onClick={() => { setStep(s => s - 1); setError(''); }} disabled={step === 1}
              className={cn("w-full sm:w-auto px-8 py-4 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 transition-all border border-transparent hover:border-white/10",
                step === 1 ? "opacity-0 pointer-events-none" : "text-white/40 hover:text-white")}>
              <ChevronLeft size={18} /> {t('co_back')}
            </button>
            {step < totalSteps ? (
              <button onClick={nextStep}
                className="w-full sm:w-auto px-10 py-5 bg-white text-black font-black rounded-2xl text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-cyan-400 transition-all shadow-xl active:scale-95">
                {t('co_next')} <ChevronRight size={18} />
              </button>
            ) : (
              <button onClick={handleSubmit} disabled={submitting}
                className="w-full sm:w-auto px-10 py-5 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-black rounded-2xl text-[10px] flex items-center justify-center gap-2 hover:shadow-[0_0_30px_rgba(6,182,212,0.4)] transition-all uppercase tracking-widest active:scale-95 disabled:opacity-50">
                {submitting ? <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><span>{t('co_confirm')}</span><Zap size={18} /></>}
              </button>
            )}
          </div>
        </div>

        {/* AI Sidebar */}
        <div className="lg:col-span-4">
          <div className="glass-card p-6 bg-gradient-to-br from-indigo-500/10 to-purple-500/5 border border-indigo-500/20 sticky top-24 rounded-[32px] overflow-hidden">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-indigo-500 flex items-center justify-center shadow-lg shrink-0">
                <BrainCircuit size={20} className="text-white" />
              </div>
              <div>
                <div className="font-black text-xs uppercase tracking-tight text-white/90">{t('co_ai_assistant')}</div>
                <div className="text-[9px] text-indigo-400 font-black uppercase tracking-widest">{t('co_ai_active')}</div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 space-y-3">
                <div className="flex items-center gap-2 text-indigo-400 font-black text-[9px] uppercase tracking-widest">
                  <Zap size={12} /> {language === 'ru' ? 'Рекомендация' : 'Recommendation'}
                </div>
                <p className="text-[11px] text-white/50 leading-relaxed italic font-medium">
                  {step === 1 && (language === 'ru' ? '"Конкретное название повышает отклики на 45%."' : '"Specific title increases responses by 45%."')}
                  {step === 2 && (language === 'ru' ? '"Добавьте навыки для точного подбора."' : '"Add skills for precise matching."')}
                  {step === 3 && (language === 'ru' ? '"Реалистичный бюджет привлекает лучших."' : '"Realistic budget attracts the best."')}
                  {step === 4 && (language === 'ru' ? '"Ваш заказ готов к публикации!"' : '"Your order is ready to publish!"')}
                </p>
              </div>
              <div className="space-y-3 px-1">
                <div className="text-[9px] font-black uppercase text-white/20 tracking-widest">{language === 'ru' ? 'ПРОГНОЗ' : 'PROJECTION'}</div>
                <div className="space-y-2">
                  {[
                    { label: language === 'ru' ? 'Кандидаты' : 'Candidates', val: '452+', color: 'text-cyan-400' },
                    { label: language === 'ru' ? 'Оценка' : 'Quality', val: 'ELITE', color: 'text-amber-400' },
                    { label: language === 'ru' ? 'Скорость' : 'Speed', val: '~14m', color: 'text-cyan-400' },
                  ].map(item => (
                    <div key={item.label} className="flex justify-between items-center text-[11px] font-bold">
                      <span className="text-white/40 uppercase tracking-tighter">{item.label}</span>
                      <span className={cn("font-black", item.color)}>{item.val}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}