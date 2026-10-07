import React, { useMemo } from 'react';
import {
  Flame,
  Wallet,
  Heart,
  UtensilsCrossed,
  Sparkles,
  ChevronRight,
  Clock,
  FileBarChart,
  FileText,
  Briefcase,
  Bookmark,
  CheckCircle2,
  Calendar,
  Globe,
  Award,
  ShieldCheck,
  Building,
  MapPin,
  DollarSign,
  ArrowRight,
  Activity,
} from 'lucide-react';
import {
  UserProfile,
  UserSettings,
  ActivityRecord,
  FinanceRecord,
  FamilyMoneyRecord,
  RecipeRecord,
} from '../types';
import { NavTab } from '../components/BottomNav';
import { loadSavedJobs, loadApplications, buildEnrichedJobEntities } from '../services/jobSearchService';

interface DashboardViewProps {
  profile: UserProfile | null;
  settings: UserSettings;
  relapses: ActivityRecord[];
  finances: FinanceRecord[];
  familyMoney: FamilyMoneyRecord[];
  recipes: RecipeRecord[];
  onNavigate: (tab: NavTab) => void;
  onOpenRelapseModal: () => void;
  onOpenFinanceModal: (type?: 'income' | 'expense') => void;
  onOpenFamilyModal: () => void;
  onOpenRecipeModal: () => void;
  onOpenReportModal: () => void;
  onOpenUrgeGuide: () => void;
  isCloudSynced?: boolean;
  isOnline?: boolean;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  profile,
  settings,
  relapses,
  finances,
  familyMoney,
  recipes,
  onNavigate,
  onOpenRelapseModal,
  onOpenFinanceModal,
  onOpenFamilyModal,
  onOpenRecipeModal,
  onOpenReportModal,
  onOpenUrgeGuide,
  isCloudSynced = true,
  isOnline = true,
}) => {
  const currentMonth = new Date().toISOString().slice(0, 7);
  const userTz = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
  const displayTrackerTitle = settings.trackerSectionTitle || settings.habitName || 'Social Media Tracking';

  // Compute Streak Stats (Requirement 2)
  const sortedActivities = useMemo(() => {
    return [...relapses].sort((a, b) => b.timestamp - a.timestamp);
  }, [relapses]);

  const lastActivity = sortedActivities.length > 0 ? sortedActivities[0] : null;
  const streakStartTime = lastActivity
    ? lastActivity.timestamp
    : new Date(settings.habitStartDate || Date.now()).getTime();

  const now = Date.now();
  const diffMs = Math.max(0, now - streakStartTime);
  const currentStreakDays = Math.floor(diffMs / 86400000);
  const currentStreakHours = Math.floor((diffMs % 86400000) / 3600000);

  // Dynamic Day X calculation (Today • Day 1, Day 2, Day 3, etc.)
  const dayCounterLabel = currentStreakDays === 0 ? 'Today • Day 1' : `Day ${currentStreakDays + 1}`;

  // Longest Streak
  let longestStreak = currentStreakDays;
  for (let i = 0; i < sortedActivities.length; i++) {
    if (sortedActivities[i].streakDaysLost > longestStreak) {
      longestStreak = sortedActivities[i].streakDaysLost;
    }
  }

  // Job Search & Pipeline Metrics (Requirement 20)
  const savedJobs = useMemo(() => loadSavedJobs(), []);
  const applications = useMemo(() => loadApplications(), []);
  const allMasterJobs = useMemo(() => buildEnrichedJobEntities(), []);

  const appliedCount = applications.filter(a => a.status === 'applied' || a.status === 'new').length;
  const interviewCount = applications.filter(a => a.status === 'interview').length;
  const offerCount = applications.filter(a => a.status === 'offer').length;
  const highMatchJobsCount = allMasterJobs.filter(j => j.matchScore >= 80).length;
  const sponsorshipJobsCount = allMasterJobs.filter(j => j.visaSponsorshipStatus === 'confirmed').length;

  const topMatchJob = useMemo(() => {
    const sorted = [...allMasterJobs].sort((a, b) => b.matchScore - a.matchScore);
    return sorted[0];
  }, [allMasterJobs]);

  // Monthly Finances
  const monthlyFinances = finances.filter(f => f.date.startsWith(currentMonth));
  const monthlySalary = monthlyFinances
    .filter(f => f.type === 'income' && f.category === 'Salary')
    .reduce((sum, f) => sum + f.amount, 0);
  const monthlyTips = monthlyFinances
    .filter(f => f.type === 'income' && f.category === 'Tips')
    .reduce((sum, f) => sum + f.amount, 0);
  const monthlyOtherIncome = monthlyFinances
    .filter(f => f.type === 'income' && f.category === 'Other Income')
    .reduce((sum, f) => sum + f.amount, 0);
  const totalIncome = monthlySalary + monthlyTips + monthlyOtherIncome;
  const totalExpenses = monthlyFinances
    .filter(f => f.type === 'expense')
    .reduce((sum, f) => sum + f.amount, 0);
  const monthlySavings = totalIncome - totalExpenses;
  const savingsRate = totalIncome > 0 ? Math.round((monthlySavings / totalIncome) * 100) : 0;

  // Monthly Family Money
  const monthlyFamilyTotal = familyMoney
    .filter(fm => fm.date.startsWith(currentMonth))
    .reduce((sum, fm) => sum + fm.amount, 0);

  const currency = settings.currency || '$';

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in pb-20">
      {/* Hero Welcome & Cloud Sync Status (Requirements 4, 20, 23) */}
      <div className="relative rounded-3xl bg-gradient-to-br from-[#161a25] via-[#0f1219] to-[#07080c] border border-[#d4af37]/25 p-6 sm:p-8 overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-[#d4af37]/10 via-[#831843]/10 to-transparent blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#d4af37]/10 border border-[#d4af37]/30 text-[#ffd700] text-xs font-semibold tracking-wider uppercase">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Executive Command Center</span>
              </div>

              {/* Cloud Sync Status Badge (Requirement 4 & 23) */}
              <div
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${
                  isOnline && isCloudSynced
                    ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
                    : isOnline
                    ? 'bg-amber-950/40 border-amber-500/40 text-amber-300'
                    : 'bg-slate-900 border-slate-700 text-slate-400'
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    isOnline && isCloudSynced ? 'bg-emerald-400' : isOnline ? 'bg-amber-400 animate-pulse' : 'bg-slate-500'
                  }`}
                />
                <span>
                  {isOnline && isCloudSynced ? '✓ Synced with Cloud' : isOnline ? '⟳ Syncing...' : '⚠ Offline Mode'}
                </span>
              </div>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold font-['Cinzel'] text-[#fdf8f0] tracking-wide">
              {profile?.displayName ? `Greetings, ${profile.displayName.split(' ')[0]}` : 'A Better You Every Day'}
            </h1>
            <p className="text-xs sm:text-sm text-[#94a3b8] max-w-xl leading-relaxed">
              Discipline in your habits. Strategic career progression. Mastery over your capital.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigate('jobs')}
              className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs tracking-wider uppercase shadow-md transition flex items-center gap-2"
            >
              <Briefcase className="w-4 h-4" />
              <span>Job Search</span>
            </button>
            <button
              onClick={() => onNavigate('cv')}
              className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-[#d4af37]/20 via-[#ffd700]/15 to-[#aa771c]/20 hover:from-[#d4af37]/30 hover:to-[#aa771c]/30 border border-[#d4af37]/50 text-[#ffd700] font-bold text-xs tracking-wider uppercase transition flex items-center gap-2 shadow-sm"
            >
              <FileText className="w-4 h-4 text-[#ffd700]" />
              <span>CV Builder</span>
            </button>
            <button
              onClick={onOpenReportModal}
              className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-[#d4af37] via-[#ffd700] to-[#c5a059] text-[#0b0c10] font-bold text-xs tracking-wider uppercase shadow-lg shadow-amber-950/40 hover:opacity-95 transition flex items-center gap-2"
            >
              <FileBarChart className="w-4 h-4" />
              <span>AI Report</span>
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================
          CAREER & JOB SEARCH DASHBOARD SECTION (Requirement 20)
          ======================================================== */}
      <div className="p-6 rounded-3xl bg-[#11141c] border border-[#222838] shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#1f2638]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-500/20 border border-blue-500/40 flex items-center justify-center text-blue-400">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white leading-tight">
                Career & Job Application Pipeline
              </h2>
              <p className="text-xs text-slate-400">
                UK, Australia, New Zealand, Malta, Greece & Europe verified hospitality opportunities
              </p>
            </div>
          </div>

          <button
            onClick={() => onNavigate('jobs')}
            className="text-xs text-blue-400 hover:text-blue-300 font-bold flex items-center gap-1 self-start sm:self-auto"
          >
            <span>Explore All Vacancies</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 6 Metric KPI Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <div
            onClick={() => onNavigate('jobs')}
            className="p-3.5 rounded-2xl bg-[#090b10] border border-[#1d2334] text-center hover:border-blue-500/40 cursor-pointer transition"
          >
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Matching Jobs</span>
            <span className="text-xl font-black text-blue-400 mt-1 block">{highMatchJobsCount}</span>
            <span className="text-[9px] text-slate-500">80%+ Match Score</span>
          </div>

          <div
            onClick={() => onNavigate('jobs')}
            className="p-3.5 rounded-2xl bg-[#090b10] border border-[#1d2334] text-center hover:border-emerald-500/40 cursor-pointer transition"
          >
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Sponsorship Jobs</span>
            <span className="text-xl font-black text-emerald-400 mt-1 block">{sponsorshipJobsCount}</span>
            <span className="text-[9px] text-slate-500">Confirmed Visa</span>
          </div>

          <div
            onClick={() => onNavigate('jobs')}
            className="p-3.5 rounded-2xl bg-[#090b10] border border-[#1d2334] text-center hover:border-amber-500/40 cursor-pointer transition"
          >
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Saved Jobs</span>
            <span className="text-xl font-black text-[#ffd700] mt-1 block">{savedJobs.length}</span>
            <span className="text-[9px] text-slate-500">Bookmarked</span>
          </div>

          <div
            onClick={() => onNavigate('jobs')}
            className="p-3.5 rounded-2xl bg-[#090b10] border border-[#1d2334] text-center hover:border-indigo-500/40 cursor-pointer transition"
          >
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Applied Jobs</span>
            <span className="text-xl font-black text-indigo-400 mt-1 block">{appliedCount}</span>
            <span className="text-[9px] text-slate-500">Submitted</span>
          </div>

          <div
            onClick={() => onNavigate('jobs')}
            className="p-3.5 rounded-2xl bg-[#090b10] border border-[#1d2334] text-center hover:border-purple-500/40 cursor-pointer transition"
          >
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Interviews</span>
            <span className="text-xl font-black text-purple-400 mt-1 block">{interviewCount}</span>
            <span className="text-[9px] text-slate-500">In Progress</span>
          </div>

          <div
            onClick={() => onNavigate('jobs')}
            className="p-3.5 rounded-2xl bg-[#090b10] border border-[#1d2334] text-center hover:border-emerald-500/40 cursor-pointer transition"
          >
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Offers</span>
            <span className="text-xl font-black text-emerald-300 mt-1 block">{offerCount}</span>
            <span className="text-[9px] text-slate-500">Received</span>
          </div>
        </div>

        {/* Top Match Showcase Card (Requirement 20) */}
        {topMatchJob && (
          <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-950/30 via-[#0d1017] to-indigo-950/30 border border-blue-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  TOP MATCH: {topMatchJob.matchScore}%
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Visa: {topMatchJob.visaSponsorshipStatus.toUpperCase()}
                </span>
              </div>
              <h3 className="text-base font-bold text-white">{topMatchJob.title} — {topMatchJob.company}</h3>
              <p className="text-xs text-slate-400">
                {topMatchJob.location} • {topMatchJob.salary} • {topMatchJob.experienceRequired}
              </p>
            </div>

            <button
              onClick={() => onNavigate('jobs')}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:opacity-95 text-white font-bold text-xs uppercase tracking-wider shadow shrink-0"
            >
              View & Apply &rarr;
            </button>
          </div>
        )}
      </div>

      {/* Primary KPI Grid (Habit/Activity Streak, Finances, Family) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Dynamic Activity Tracker & Streak Metric (Requirements 1, 2, 20) */}
        <div
          onClick={() => onNavigate('relapse')}
          className="group relative rounded-3xl bg-[#12151e] border border-[#d4af37]/25 hover:border-[#d4af37]/60 p-5 sm:p-6 transition-all duration-300 cursor-pointer shadow-lg hover:shadow-[0_4px_24px_rgba(212,175,55,0.15)] flex flex-col justify-between"
        >
          <div className="flex items-start justify-between">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500/20 to-rose-500/20 border border-[#d4af37]/30 flex items-center justify-center text-[#ffd700]">
              <Flame className="w-6 h-6 fill-[#ffd700]/30" />
            </div>
            <div className="flex flex-col items-end gap-1">
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#94a3b8] px-2.5 py-0.5 rounded-full bg-[#0b0c10] border border-[#232838] truncate max-w-[140px]">
                {displayTrackerTitle}
              </span>
              <span className="text-[10px] font-black uppercase text-emerald-400">
                {dayCounterLabel}
              </span>
            </div>
          </div>

          <div className="my-4">
            <div className="text-3xl sm:text-4xl font-extrabold font-mono text-[#fdf8f0] tracking-tight">
              {currentStreakDays} <span className="text-sm font-normal text-[#94a3b8]">days</span>
            </div>
            <div className="text-xs text-[#a0aab8] mt-1 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#ffd700]" />
              <span>+ {currentStreakHours} hours active • Peak: {longestStreak}d</span>
            </div>
          </div>

          <div className="pt-3 border-t border-[#232838] flex items-center justify-between text-xs text-[#d4af37] font-semibold group-hover:text-[#ffd700]">
            <span>Activity History & Streak</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Financial Balance & Savings */}
        <div
          onClick={() => onNavigate('finance')}
          className="group relative rounded-3xl bg-[#12151e] border border-emerald-500/25 hover:border-emerald-500/50 p-5 sm:p-6 transition-all duration-300 cursor-pointer shadow-lg flex flex-col justify-between"
        >
          <div className="flex items-start justify-between">
            <div className="w-12 h-12 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <Wallet className="w-6 h-6" />
            </div>
            <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-400 px-2.5 py-1 rounded-full bg-emerald-950/40 border border-emerald-500/30">
              {savingsRate}% Saved
            </span>
          </div>

          <div className="my-4">
            <div className="text-3xl sm:text-4xl font-extrabold font-mono text-emerald-300 tracking-tight">
              {currency}{monthlySavings.toFixed(2)}
            </div>
            <div className="text-xs text-[#94a3b8] mt-1">
              Income: {currency}{totalIncome.toFixed(0)} • Exp: {currency}{totalExpenses.toFixed(0)}
            </div>
          </div>

          <div className="pt-3 border-t border-[#232838] flex items-center justify-between text-xs text-emerald-400 font-semibold group-hover:text-emerald-300">
            <span>Finance Ledger</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Family Support */}
        <div
          onClick={() => onNavigate('family')}
          className="group relative rounded-3xl bg-[#12151e] border border-[#d4af37]/25 hover:border-[#d4af37]/60 p-5 sm:p-6 transition-all duration-300 cursor-pointer shadow-lg flex flex-col justify-between"
        >
          <div className="flex items-start justify-between">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-[#d4af37]/40 flex items-center justify-center text-[#ffd700]">
              <Heart className="w-6 h-6 fill-[#ffd700]/20" />
            </div>
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#a0aab8] px-2.5 py-1 rounded-full bg-[#0b0c10] border border-[#232838]">
              This Month
            </span>
          </div>

          <div className="my-4">
            <div className="text-3xl sm:text-4xl font-extrabold font-mono text-[#ffd700] tracking-tight">
              {currency}{monthlyFamilyTotal.toFixed(2)}
            </div>
            <div className="text-xs text-[#94a3b8] mt-1">
              Sent to parents & relatives this period
            </div>
          </div>

          <div className="pt-3 border-t border-[#232838] flex items-center justify-between text-xs text-[#d4af37] font-semibold group-hover:text-[#ffd700]">
            <span>Family Money</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>
    </div>
  );
};
