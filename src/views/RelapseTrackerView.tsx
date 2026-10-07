import React, { useState, useEffect, useMemo } from 'react';
import {
  Flame,
  Calendar,
  Clock,
  TrendingUp,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  Trash2,
  Edit2,
  Plus,
  Shield,
  Layers,
  History,
  Activity,
  CalendarDays,
} from 'lucide-react';
import { ActivityRecord, UserSettings } from '../types';

interface RelapseTrackerViewProps {
  settings: UserSettings;
  relapses: ActivityRecord[];
  onOpenRelapseModal: () => void;
  onOpenUrgeGuide?: () => void;
  onDeleteRelapse: (id: string) => Promise<void>;
  onUpdateHabitName: (name: string) => Promise<void>;
}

export const RelapseTrackerView: React.FC<RelapseTrackerViewProps> = ({
  settings,
  relapses,
  onOpenRelapseModal,
  onOpenUrgeGuide,
  onDeleteRelapse,
  onUpdateHabitName,
}) => {
  const displayTitle = settings.trackerSectionTitle || settings.habitName || 'Social Media Tracking';

  const [editingTitle, setEditingTitle] = useState(false);
  const [titleInput, setTitleInput] = useState(displayTitle);
  const [now, setNow] = useState(Date.now());
  const [selectedCalendarMonth, setSelectedCalendarMonth] = useState(() => new Date());

  const userTz = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';

  // Live timer tick every second for real-time streak precision
  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  // Sync titleInput if settings change
  useEffect(() => {
    setTitleInput(displayTitle);
  }, [displayTitle]);

  // Sort activities chronologically descending (newest first)
  const sortedActivities = useMemo(() => {
    return [...relapses].sort((a, b) => b.timestamp - a.timestamp);
  }, [relapses]);

  const lastActivity = sortedActivities.length > 0 ? sortedActivities[0] : null;
  const previousActivity = sortedActivities.length > 1 ? sortedActivities[1] : null;

  const streakStartTime = lastActivity
    ? lastActivity.timestamp
    : new Date(settings.habitStartDate || Date.now()).getTime();

  const diffMs = Math.max(0, now - streakStartTime);
  const days = Math.floor(diffMs / 86400000);
  const hours = Math.floor((diffMs % 86400000) / 3600000);
  const minutes = Math.floor((diffMs % 3600000) / 60000);
  const seconds = Math.floor((diffMs % 60000) / 1000);

  // Dynamic Day X calculation (Requirement 2)
  // Day 1 on day of event, Day 2 next 24h, Day 3, etc.
  const currentDayCounter = days + 1;
  const dayBadgeLabel = days === 0 ? 'Today • Day 1' : `Day ${currentDayCounter}`;

  // Longest streak calculation
  let longestStreakDays = days;
  for (let i = 0; i < sortedActivities.length; i++) {
    if (sortedActivities[i].streakDaysLost > longestStreakDays) {
      longestStreakDays = sortedActivities[i].streakDaysLost;
    }
  }

  // Activity dates map for calendar marking
  const activityDatesSet = useMemo(() => {
    const set = new Set<string>();
    for (const act of sortedActivities) {
      const d = new Date(act.timestamp);
      const isoDate = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(
        d.getDate()
      ).padStart(2, '0')}`;
      set.add(isoDate);
    }
    return set;
  }, [sortedActivities]);

  const handleSaveTitle = async () => {
    if (titleInput.trim()) {
      await onUpdateHabitName(titleInput.trim());
      setEditingTitle(false);
    }
  };

  // Format timestamp into clean local date/time string
  const formatLocalDateTime = (timestamp: number) => {
    const d = new Date(timestamp);
    const datePart = d.toLocaleDateString(undefined, {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      timeZone: userTz,
    });
    const timePart = d.toLocaleTimeString(undefined, {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
      timeZone: userTz,
    });
    return { datePart, timePart };
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in pb-20">
      {/* Header & Configurable Section Title (Requirement 1) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#1f2434]">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#ffd700] px-2.5 py-0.5 rounded-full bg-[#ffd700]/10 border border-[#d4af37]/30 flex items-center gap-1">
              <Activity className="w-3 h-3 text-[#ffd700]" />
              <span>Personal Activity & Streak System</span>
            </span>
            <span className="text-[10px] text-slate-400 font-mono">TZ: {userTz}</span>
          </div>

          <div className="flex items-center gap-3 mt-2">
            {!editingTitle ? (
              <>
                <h1 className="text-2xl sm:text-3xl font-extrabold font-['Cinzel'] text-[#fdf8f0] tracking-wide">
                  {displayTitle}
                </h1>
                <button
                  onClick={() => setEditingTitle(true)}
                  className="p-1.5 text-[#94a3b8] hover:text-[#ffd700] rounded-lg hover:bg-[#1a1f2e] transition"
                  title="Rename Section / Tracker"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
              </>
            ) : (
              <div className="flex items-center gap-2 flex-wrap">
                <input
                  type="text"
                  value={titleInput}
                  onChange={e => setTitleInput(e.target.value)}
                  className="px-3 py-1.5 rounded-xl bg-[#0b0d13] border border-[#d4af37] text-sm text-white focus:outline-none"
                  placeholder="E.g. Social Media Tracking"
                />
                <button
                  onClick={handleSaveTitle}
                  className="px-3 py-1.5 rounded-xl bg-[#d4af37] text-[#0b0c10] text-xs font-bold uppercase"
                >
                  Save Title
                </button>
                <button
                  onClick={() => setEditingTitle(false)}
                  className="px-2 py-1.5 text-xs text-[#94a3b8] hover:text-white"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time activity logging, streak continuity, and complete private history.
          </p>
        </div>

        {/* Primary Action Button: Log Activity (Requirement 2) */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenRelapseModal}
            className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-700 hover:opacity-95 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-indigo-950/40 transition flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>+ Log {displayTitle} Activity</span>
          </button>
        </div>
      </div>

      {/* Main Streak Counter Hero (Requirement 2) */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#121622] via-[#0d1017] to-[#121622] border border-[#2b354b] p-6 sm:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                {dayBadgeLabel}
              </span>
              <span className="text-xs text-slate-400">Current Standing Streak</span>
            </div>

            <div className="flex items-baseline gap-2">
              <span className="text-4xl sm:text-6xl font-black font-['Montserrat'] text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-[#ffd700] to-teal-300">
                {days}
              </span>
              <span className="text-xl sm:text-2xl font-bold text-slate-300">Days</span>
              <span className="text-base text-slate-400 font-mono pl-2">
                {String(hours).padStart(2, '0')}:{String(minutes).padStart(2, '0')}:
                {String(seconds).padStart(2, '0')}
              </span>
            </div>

            <p className="text-xs text-slate-400 mt-2">
              Calculated accurately since your latest recorded activity. Timezone: {userTz}.
            </p>
          </div>

          {/* Quick Metrics Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 w-full md:w-auto">
            <div className="p-3.5 rounded-2xl bg-[#090b10]/80 border border-[#1e2536] text-center">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Activities</span>
              <span className="text-xl font-bold text-white mt-0.5 block">{sortedActivities.length}</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#090b10]/80 border border-[#1e2536] text-center">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Longest Streak</span>
              <span className="text-xl font-bold text-amber-300 mt-0.5 block">{longestStreakDays}d</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#090b10]/80 border border-[#1e2536] text-center col-span-2 sm:col-span-1">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Status</span>
              <span className="text-xs font-bold text-emerald-400 mt-1 block">Active Counter</span>
            </div>
          </div>
        </div>
      </div>

      {/* Activity Timeline Highlights (Requirement 3: Last & Previous activity) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Last Activity Card */}
        <div className="p-4 rounded-2xl bg-[#11141c] border border-[#232938] space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>Last Activity</span>
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
              Latest
            </span>
          </div>

          {lastActivity ? (
            <div>
              <div className="text-sm font-bold text-white">
                {formatLocalDateTime(lastActivity.timestamp).datePart}
              </div>
              <div className="text-xs text-[#ffd700] font-mono">
                {formatLocalDateTime(lastActivity.timestamp).timePart} ({userTz})
              </div>
              {lastActivity.notes && (
                <p className="text-xs text-slate-400 mt-1 italic line-clamp-1">"{lastActivity.notes}"</p>
              )}
            </div>
          ) : (
            <div className="text-xs text-slate-500 py-1">No activity logged yet. Streak is intact!</div>
          )}
        </div>

        {/* Previous Activity Card */}
        <div className="p-4 rounded-2xl bg-[#11141c] border border-[#232938] space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <History className="w-3.5 h-3.5 text-slate-400" />
              <span>Previous Activity</span>
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-400">
              Prior Record
            </span>
          </div>

          {previousActivity ? (
            <div>
              <div className="text-sm font-bold text-white">
                {formatLocalDateTime(previousActivity.timestamp).datePart}
              </div>
              <div className="text-xs text-slate-400 font-mono">
                {formatLocalDateTime(previousActivity.timestamp).timePart}
              </div>
              {previousActivity.notes && (
                <p className="text-xs text-slate-400 mt-1 italic line-clamp-1">"{previousActivity.notes}"</p>
              )}
            </div>
          ) : (
            <div className="text-xs text-slate-500 py-1">No previous activity recorded.</div>
          )}
        </div>
      </div>

      {/* Activity Calendar (Requirement 3) */}
      <div className="p-5 rounded-3xl bg-[#11141c] border border-[#222838] shadow-lg space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CalendarDays className="w-5 h-5 text-indigo-400" />
            <h2 className="text-sm sm:text-base font-bold text-white">
              Activity Calendar ({selectedCalendarMonth.toLocaleString('default', { month: 'long', year: 'numeric' })})
            </h2>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => {
                const prev = new Date(selectedCalendarMonth);
                prev.setMonth(prev.getMonth() - 1);
                setSelectedCalendarMonth(prev);
              }}
              className="px-2.5 py-1 rounded-lg bg-[#181d29] text-xs text-slate-300 hover:text-white"
            >
              &larr; Prev
            </button>
            <button
              onClick={() => {
                const next = new Date(selectedCalendarMonth);
                next.setMonth(next.getMonth() + 1);
                setSelectedCalendarMonth(next);
              }}
              className="px-2.5 py-1 rounded-lg bg-[#181d29] text-xs text-slate-300 hover:text-white"
            >
              Next &rarr;
            </button>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1 text-center text-xs">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
            <div key={d} className="py-1 text-slate-500 font-bold text-[10px] uppercase">
              {d}
            </div>
          ))}

          {/* Render calendar days */}
          {(() => {
            const year = selectedCalendarMonth.getFullYear();
            const month = selectedCalendarMonth.getMonth();
            const firstDayIndex = new Date(year, month, 1).getDay();
            const totalDaysInMonth = new Date(year, month + 1, 0).getDate();

            const cells = [];
            // Leading blank cells
            for (let i = 0; i < firstDayIndex; i++) {
              cells.push(<div key={`blank-${i}`} className="py-2.5 rounded-lg opacity-20" />);
            }

            for (let d = 1; d <= totalDaysInMonth; d++) {
              const dayStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
              const hasActivity = activityDatesSet.has(dayStr);
              const isToday =
                new Date().getFullYear() === year &&
                new Date().getMonth() === month &&
                new Date().getDate() === d;

              cells.push(
                <div
                  key={dayStr}
                  className={`py-2 rounded-xl text-xs font-semibold transition relative ${
                    hasActivity
                      ? 'bg-rose-950/50 border border-rose-500/50 text-rose-300 font-bold'
                      : isToday
                      ? 'bg-emerald-950/40 border border-emerald-500/50 text-emerald-300 font-bold'
                      : 'bg-[#151924]/60 text-slate-400'
                  }`}
                  title={hasActivity ? `Activity recorded on ${dayStr}` : isToday ? 'Today' : ''}
                >
                  <span>{d}</span>
                  {hasActivity && (
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-400 absolute bottom-1 left-1/2 -translate-x-1/2" />
                  )}
                </div>
              );
            }
            return cells;
          })()}
        </div>
      </div>

      {/* Complete Historical Records (Requirement 3) */}
      <div className="p-5 sm:p-6 rounded-3xl bg-[#11141c] border border-[#222838] shadow-lg space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#1f2638]">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-amber-400" />
            <h2 className="text-base sm:text-lg font-bold text-white">
              Activity History & Complete Records
            </h2>
          </div>
          <span className="text-xs text-slate-400">
            Total {sortedActivities.length} logs preserved
          </span>
        </div>

        {sortedActivities.length === 0 ? (
          <div className="py-12 text-center text-slate-500 text-xs">
            No activity records logged yet. Your clean streak is ongoing!
          </div>
        ) : (
          <div className="space-y-2.5">
            {sortedActivities.map((act, index) => {
              const { datePart, timePart } = formatLocalDateTime(act.timestamp);
              return (
                <div
                  key={act.id}
                  className="p-3.5 rounded-2xl bg-[#0b0e14] border border-[#1d2333] flex items-center justify-between gap-4 transition hover:border-[#2f3952]"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0">
                      <Clock className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs sm:text-sm font-bold text-white">
                        {datePart}
                      </div>
                      <div className="text-[11px] text-[#ffd700] font-mono">
                        {timePart} • <span className="text-slate-400">{act.timezone || userTz}</span>
                      </div>
                      {act.trigger && (
                        <div className="text-[11px] text-slate-400 mt-0.5">
                          Context: <span className="text-slate-300 font-medium">{act.trigger}</span>
                        </div>
                      )}
                      {act.notes && (
                        <div className="text-[11px] text-slate-400 italic mt-0.5">
                          "{act.notes}"
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[10px] text-slate-500 hidden sm:inline">
                      Streak lost: {act.streakDaysLost}d
                    </span>
                    <button
                      onClick={() => onDeleteRelapse(act.id)}
                      className="p-2 text-slate-500 hover:text-rose-400 rounded-lg hover:bg-rose-950/20 transition"
                      title="Delete record"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
