import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { cn } from '../lib/utils';

interface DatePickerProps {
  value: string;
  onChange: (date: string) => void;
  min?: string;
  placeholder?: string;
  className?: string;
}

const MONTHS = {
  ru: ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'],
  en: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
};

const DAYS = {
  ru: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'],
  en: ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'],
};

export function DatePicker({ value, onChange, min, placeholder, className }: DatePickerProps) {
  const [open, setOpen] = useState(false);
  const lang = localStorage.getItem('neolance_lang') || 'ru';
  const months = MONTHS[lang as keyof typeof MONTHS] || MONTHS.en;
  const days = DAYS[lang as keyof typeof DAYS] || DAYS.en;

  const today = new Date();
  const minDate = min ? new Date(min) : today;

  const [viewDate, setViewDate] = useState(() => {
    if (value) return new Date(value);
    return new Date(today.getFullYear(), today.getMonth(), 1);
  });

  const selectedDate = value ? new Date(value) : null;

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();

  // First day of month (adjust for Monday start)
  const firstDay = new Date(year, month, 1);
  const startDow = (firstDay.getDay() + 6) % 7; // 0=Mon
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells: (number | null)[] = [
    ...Array(startDow).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  // Pad to full weeks
  while (cells.length % 7 !== 0) cells.push(null);

  const handleDay = (day: number) => {
    const d = new Date(year, month, day);
    if (d < minDate) return;
    const iso = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    onChange(iso);
    setOpen(false);
  };

  const isDisabled = (day: number) => {
    const d = new Date(year, month, day);
    return d < minDate;
  };

  const isSelected = (day: number) => {
    if (!selectedDate) return false;
    return selectedDate.getFullYear() === year &&
      selectedDate.getMonth() === month &&
      selectedDate.getDate() === day;
  };

  const isToday = (day: number) => {
    return today.getFullYear() === year &&
      today.getMonth() === month &&
      today.getDate() === day;
  };

  const displayValue = selectedDate
    ? `${String(selectedDate.getDate()).padStart(2, '0')}.${String(selectedDate.getMonth() + 1).padStart(2, '0')}.${selectedDate.getFullYear()}`
    : '';

  return (
    <div className={cn("relative", className)}>
      <button type="button" onClick={() => setOpen(!open)}
        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-5 outline-none focus:border-cyan-500/50 transition-all text-sm font-bold text-white flex items-center justify-between hover:border-white/20">
        <span className={displayValue ? 'text-white' : 'text-white/20'}>
          {displayValue || placeholder || 'Выберите дату'}
        </span>
        <Calendar size={18} className="text-white/30 shrink-0" />
      </button>

      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.97 }}
              transition={{ duration: 0.15 }}
              className="absolute top-full mt-2 left-0 right-0 z-50 glass-card border border-white/10 rounded-2xl p-4 bg-[#0c0c0c] shadow-2xl"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <button type="button" onClick={() => setViewDate(new Date(year, month - 1, 1))}
                  className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-white/5 text-white/40 hover:text-white transition-all">
                  <ChevronLeft size={16} />
                </button>
                <span className="text-[11px] font-black uppercase tracking-widest text-white/70">
                  {months[month]} {year}
                </span>
                <button type="button" onClick={() => setViewDate(new Date(year, month + 1, 1))}
                  className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-white/5 text-white/40 hover:text-white transition-all">
                  <ChevronRight size={16} />
                </button>
              </div>

              {/* Day headers */}
              <div className="grid grid-cols-7 mb-2">
                {days.map(d => (
                  <div key={d} className="text-center text-[9px] font-black uppercase text-white/20 py-1">{d}</div>
                ))}
              </div>

              {/* Cells */}
              <div className="grid grid-cols-7 gap-0.5">
                {cells.map((day, i) => (
                  <button key={i} type="button"
                    onClick={() => day && handleDay(day)}
                    disabled={!day || isDisabled(day)}
                    className={cn(
                      "aspect-square flex items-center justify-center rounded-xl text-xs font-bold transition-all",
                      !day && "opacity-0 pointer-events-none",
                      day && isDisabled(day) && "text-white/10 cursor-not-allowed",
                      day && !isDisabled(day) && !isSelected(day) && "text-white/50 hover:bg-white/10 hover:text-white cursor-pointer",
                      day && isSelected(day) && "bg-cyan-500 text-black font-black shadow-[0_0_12px_rgba(6,182,212,0.4)]",
                      day && isToday(day) && !isSelected(day) && "text-cyan-400 border border-cyan-500/30",
                    )}>
                    {day}
                  </button>
                ))}
              </div>

              {/* Quick select */}
              <div className="flex gap-2 mt-3 pt-3 border-t border-white/5">
                {[7, 14, 30].map(d => (
                  <button key={d} type="button"
                    onClick={() => {
                      const date = new Date();
                      date.setDate(date.getDate() + d);
                      const iso = date.toISOString().split('T')[0];
                      onChange(iso);
                      setOpen(false);
                    }}
                    className="flex-1 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-[9px] font-black uppercase text-white/40 hover:text-white transition-all">
                    +{d}д
                  </button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}