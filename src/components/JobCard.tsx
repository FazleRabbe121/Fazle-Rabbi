import React, { useState } from 'react';
import {
  Briefcase,
  MapPin,
  Calendar,
  Building,
  DollarSign,
  Award,
  ChevronDown,
  ChevronUp,
  Bookmark,
  ExternalLink,
  Mail,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Home,
  Plane,
  Sparkles,
} from 'lucide-react';
import { JobEntity, ApplicationStatus } from '../types/jobEntities';
import { useTheme } from '../context/ThemeContext';

interface JobCardProps {
  job: JobEntity;
  isSaved?: boolean;
  onToggleSave?: (job: JobEntity) => void;
  onApplyByEmail?: (job: JobEntity) => void;
  onTrackApplication?: (job: JobEntity) => void;
  applicationStatus?: ApplicationStatus;
}

export const JobCard: React.FC<JobCardProps> = ({
  job,
  isSaved = false,
  onToggleSave,
  onApplyByEmail,
  onTrackApplication,
  applicationStatus,
}) => {
  const { theme } = useTheme();
  const [showMatchDetails, setShowMatchDetails] = useState(false);

  // Status Badge Styling based on the 4 mandatory statuses
  const getSponsorshipBadge = () => {
    switch (job.visaSponsorshipStatus) {
      case 'confirmed':
        return {
          label: 'Visa Sponsorship: Confirmed',
          classes: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
          dot: 'bg-emerald-400',
        };
      case 'possible':
        return {
          label: 'Visa Sponsorship: Possible / Unclear',
          classes: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
          dot: 'bg-amber-400',
        };
      case 'not_available':
        return {
          label: 'Visa Sponsorship: Not Available',
          classes: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
          dot: 'bg-rose-400',
        };
      case 'not_mentioned':
      default:
        return {
          label: 'Visa Sponsorship: Not Mentioned',
          classes: 'bg-slate-500/20 text-slate-300 border-slate-500/40',
          dot: 'bg-slate-400',
        };
    }
  };

  const badge = getSponsorshipBadge();

  // Match score ring color
  const getMatchScoreColor = (score: number) => {
    if (score >= 85) return 'text-emerald-400 border-emerald-500/50 bg-emerald-950/30';
    if (score >= 70) return 'text-amber-400 border-amber-500/50 bg-amber-950/30';
    return 'text-slate-300 border-slate-600 bg-slate-900/40';
  };

  return (
    <div
      className={`rounded-2xl border p-5 transition-all duration-200 flex flex-col justify-between shadow-md ${
        theme === 'dark'
          ? 'bg-[#11131a] border-[#222838] hover:border-[#38425d] text-slate-100'
          : 'bg-white border-slate-200 hover:border-slate-300 text-slate-800'
      }`}
    >
      <div>
        {/* Top Header: Title, Company, Match Score */}
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-bold text-base sm:text-lg leading-snug tracking-tight text-white">
                {job.title}
              </h3>
              {applicationStatus && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-blue-500/20 text-blue-300 border border-blue-500/40">
                  {applicationStatus}
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 text-xs font-semibold text-[#d4af37] flex-wrap">
              <span className="flex items-center gap-1">
                <Building className="w-3.5 h-3.5 shrink-0" />
                {job.company}
              </span>
              <span className="text-slate-500">•</span>
              <span className="text-slate-400 font-normal">{job.industry}</span>
            </div>
          </div>

          {/* Match Score Badge */}
          <div
            className={`px-2.5 py-1.5 rounded-xl border flex flex-col items-center justify-center shrink-0 cursor-pointer transition hover:scale-105 ${getMatchScoreColor(
              job.matchScore
            )}`}
            onClick={() => setShowMatchDetails(!showMatchDetails)}
            title="Click to view detailed match factors"
          >
            <div className="flex items-center gap-1 font-black text-sm">
              <Sparkles className="w-3 h-3" />
              <span>{job.matchScore}%</span>
            </div>
            <span className="text-[9px] uppercase tracking-wider font-bold opacity-80">Match</span>
          </div>
        </div>

        {/* Location & Salary Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3.5 pt-3 border-t border-[#1f2434] text-xs">
          <div className="flex items-center gap-1.5 text-slate-300">
            <MapPin className="w-3.5 h-3.5 text-blue-400 shrink-0" />
            <span className="truncate">
              {job.city}, <strong className="text-white">{job.country}</strong>
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-emerald-400 font-medium">
            <DollarSign className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">{job.salary}</span>
          </div>
        </div>

        {/* Primary Visa Sponsorship Classification (Requirement 9 & 10) */}
        <div className="mt-3.5 p-3 rounded-xl bg-[#090b10] border border-[#1a1f2e] space-y-1.5">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div className={`px-2.5 py-1 rounded-full text-xs font-bold border flex items-center gap-1.5 ${badge.classes}`}>
              <span className={`w-2 h-2 rounded-full shrink-0 ${badge.dot}`} />
              <span>{badge.label}</span>
            </div>

            {/* Additional Perks Badges */}
            <div className="flex items-center gap-1.5 flex-wrap">
              {job.accommodationProvided && (
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center gap-1">
                  <Home className="w-2.5 h-2.5" /> Staff Housing
                </span>
              )}
              {job.relocationSupport && (
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-teal-500/20 text-teal-300 border border-teal-500/30 flex items-center gap-1">
                  <Plane className="w-2.5 h-2.5" /> Relocation
                </span>
              )}
            </div>
          </div>

          {/* Exact Evidence / Reasoning */}
          <p className="text-[11px] text-slate-300 leading-relaxed font-sans italic pt-0.5">
            "{job.sponsorshipEvidence}"
          </p>
        </div>

        {/* Key Job Meta Pills */}
        <div className="flex items-center gap-2 mt-3 flex-wrap text-[11px]">
          <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-medium capitalize">
            {job.jobType}
          </span>
          <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-medium capitalize">
            {job.workplaceType}
          </span>
          <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-medium">
            Exp: {job.experienceRequired}
          </span>
          <span className="text-[10px] text-slate-500 ml-auto flex items-center gap-1">
            <Calendar className="w-3 h-3" /> {job.datePosted}
          </span>
        </div>

        {/* Collapsible Match Breakdown (Requirement 11) */}
        {showMatchDetails && (
          <div className="mt-3 p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs space-y-2 animate-fade-in">
            <div className="flex items-center justify-between text-slate-400 font-bold uppercase tracking-wider text-[10px]">
              <span>Match Analysis ({job.matchScore}%)</span>
              <button
                type="button"
                onClick={() => setShowMatchDetails(false)}
                className="text-slate-400 hover:text-white"
              >
                Close
              </button>
            </div>

            {/* Positive matches */}
            {job.matchedReasons && job.matchedReasons.length > 0 && (
              <div className="space-y-1">
                {job.matchedReasons.map((reason, i) => (
                  <div key={i} className="flex items-start gap-1.5 text-emerald-400 text-[11px]">
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                    <span>{reason}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Potential issues */}
            {job.potentialIssues && job.potentialIssues.length > 0 && (
              <div className="space-y-1 pt-1 border-t border-slate-800">
                {job.potentialIssues.map((issue, i) => (
                  <div key={i} className="flex items-start gap-1.5 text-amber-400 text-[11px]">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                    <span>{issue}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer Actions (Requirement 10) */}
      <div className="mt-4 pt-3 border-t border-[#1f2434] flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 text-[11px] text-slate-400 truncate">
          <span className="font-semibold text-slate-300">Source:</span>
          <span className="truncate text-slate-400" title={job.source}>
            {job.source}
          </span>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          {/* Save Favorite Button */}
          {onToggleSave && (
            <button
              type="button"
              onClick={() => onToggleSave(job)}
              className={`p-2 rounded-xl border transition ${
                isSaved
                  ? 'bg-amber-500/20 border-amber-500/50 text-[#ffd700]'
                  : 'bg-[#181d29] border-[#293245] text-slate-400 hover:text-white'
              }`}
              title={isSaved ? 'Remove from Saved Jobs' : 'Save Job'}
            >
              <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-current' : ''}`} />
            </button>
          )}

          {/* Track Application Button */}
          {onTrackApplication && (
            <button
              type="button"
              onClick={() => onTrackApplication(job)}
              className="px-2.5 py-1.5 rounded-xl bg-[#1c2230] hover:bg-[#252e42] border border-[#2e3952] text-slate-200 text-xs font-semibold transition"
              title="Track Application Status & Interviews"
            >
              Track
            </button>
          )}

          {/* Apply by Email (Direct) */}
          {onApplyByEmail && job.recipientEmail && (
            <button
              type="button"
              onClick={() => onApplyByEmail(job)}
              className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold transition shadow-sm flex items-center gap-1"
              title="Apply directly with attached CV"
            >
              <Mail className="w-3 h-3" />
              <span>Apply</span>
            </button>
          )}

          {/* View Official Link */}
          <a
            href={job.applicationUrl || job.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-xl bg-[#181d29] hover:bg-[#22293a] border border-[#293245] text-slate-300 hover:text-white transition"
            title="Open Original Job Link"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
};
