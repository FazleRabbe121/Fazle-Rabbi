import React, { useState } from 'react';
import { Clock, Calendar, CheckCircle, ShieldAlert, X } from 'lucide-react';
import { ActivityRecord } from '../types';

interface RelapseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmRelapse: (record: Omit<ActivityRecord, 'id' | 'userId' | 'createdAt'>) => Promise<void>;
  habitName: string;
  currentStreakDays: number;
  onOpenGuide?: () => void;
}

export const RelapseModal: React.FC<RelapseModalProps> = ({
  isOpen,
  onClose,
  onConfirmRelapse,
  habitName,
  currentStreakDays,
  onOpenGuide,
}) => {
  if (!isOpen) return null;

  const now = new Date();
  const defaultDate = now.toISOString().split('T')[0];
  const defaultTime = now.toTimeString().split(' ')[0].slice(0, 5);
  const userTz = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';

  const [date, setDate] = useState(defaultDate);
  const [time, setTime] = useState(defaultTime);
  const [trigger, setTrigger] = useState('Routine Check / Scroll');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const displayTitle = habitName || 'Social Media Tracking';

  const triggersList = [
    'Routine Check / Scroll',
    'Boredom / Idle Time',
    'Notification Alert',
    'Stress / Mental Fatigue',
    'Late Night Screen Time',
    'Work Break / Distraction',
    'Other Context',
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const combinedDateTime = new Date(`${date}T${time}:00`);
      const timestamp = !isNaN(combinedDateTime.getTime()) ? combinedDateTime.getTime() : Date.now();

      const localDateStr = new Date(timestamp).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        timeZone: userTz,
      });

      const localTimeStr = new Date(timestamp).toLocaleTimeString(undefined, {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
        timeZone: userTz,
      });

      await onConfirmRelapse({
        habitName: displayTitle,
        relapseDate: date,
        relapseTime: time,
        date: localDateStr,
        time: localTimeStr,
        timezone: userTz,
        timestamp,
        streakDaysLost: currentStreakDays,
        trigger,
        notes: notes.trim(),
      });
      onClose();
    } catch (err) {
      console.error('Failed to log activity record:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg bg-[#12141c] border border-[#2b3348] rounded-3xl p-6 sm:p-8 shadow-[0_10px_40px_rgba(0,0,0,0.8)] text-[#f1f5f9]">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#242938]">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold font-['Cinzel'] text-[#fdf8f0] tracking-wide">
                Log Activity: {displayTitle}
              </h2>
              <p className="text-xs text-[#94a3b8] mt-0.5">
                Exact date, time, and streak reset will be recorded
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-[#94a3b8] hover:text-[#fdf8f0] p-1.5 rounded-xl hover:bg-[#1c2130] transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Activity Information Box */}
        <div className="my-4 p-3.5 rounded-2xl bg-[#141824] border border-[#232b3f] text-xs text-[#cbd5e1] leading-relaxed space-y-1">
          <p>
            Current uninterrupted streak:{' '}
            <strong className="text-[#ffd700]">{currentStreakDays} day(s)</strong>.
          </p>
          <p className="text-slate-400 text-[11px]">
            Logging an activity will start a new streak starting right now ({userTz}) and preserve all historical logs.
          </p>
        </div>

        {/* Activity Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium uppercase tracking-wider text-[#94a3b8] mb-1.5">
                Exact Date
              </label>
              <div className="relative">
                <Calendar className="w-4 h-4 absolute left-3 top-3 text-[#64748b]" />
                <input
                  type="date"
                  value={date}
                  onChange={e => setDate(e.target.value)}
                  required
                  className="w-full pl-9 pr-3 py-2.5 bg-[#0b0d13] border border-[#232838] rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-[#d4af37]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium uppercase tracking-wider text-[#94a3b8] mb-1.5">
                Exact Time
              </label>
              <div className="relative">
                <Clock className="w-4 h-4 absolute left-3 top-3 text-[#64748b]" />
                <input
                  type="time"
                  value={time}
                  onChange={e => setTime(e.target.value)}
                  required
                  className="w-full pl-9 pr-3 py-2.5 bg-[#0b0d13] border border-[#232838] rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-[#d4af37]"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium uppercase tracking-wider text-[#94a3b8] mb-1.5">
              Activity Context / Trigger
            </label>
            <select
              value={trigger}
              onChange={e => setTrigger(e.target.value)}
              className="w-full px-3 py-2.5 bg-[#0b0d13] border border-[#232838] rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-[#d4af37]"
            >
              {triggersList.map(t => (
                <option key={t} value={t} className="bg-[#12141c]">
                  {t}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium uppercase tracking-wider text-[#94a3b8] mb-1.5">
              Optional Note
            </label>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="e.g. Logged 25 minutes scrolling before bed."
              rows={2}
              className="w-full p-3 bg-[#0b0d13] border border-[#232838] rounded-xl text-xs sm:text-sm text-white placeholder-[#475569] focus:outline-none focus:border-[#d4af37] resize-none"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-[#232838] text-xs font-semibold text-[#94a3b8] hover:text-white hover:bg-[#1b202e] transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-700 hover:opacity-95 text-white font-semibold text-xs tracking-wider uppercase shadow-lg transition disabled:opacity-50"
            >
              {isSubmitting ? 'Recording...' : 'Log Activity & Start Streak'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
