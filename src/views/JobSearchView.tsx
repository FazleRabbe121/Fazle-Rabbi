import React, { useState, useMemo, useEffect } from 'react';
import {
  Briefcase,
  Search,
  Filter,
  Globe,
  SlidersHorizontal,
  Bookmark,
  Bell,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  ChevronDown,
  Layers,
  Building,
  MapPin,
  DollarSign,
  UserCheck,
  Send,
  Plus,
  Trash2,
  ExternalLink,
  RefreshCw,
  Award,
  Home,
  Plane,
  X,
} from 'lucide-react';
import { JobEntity, ApplicationRecord, SavedJobRecord, JobAlertConfig, SavedSearchQuery } from '../types/jobEntities';
import { JobCard } from '../components/JobCard';
import { ApplicationTrackingModal } from '../components/ApplicationTrackingModal';
import {
  CENTRAL_COUNTRY_DATABASE,
  QUICK_COUNTRY_FILTERS,
  QuickCountryFilterKey,
  CountryConfig,
} from '../services/countryDatabase';
import {
  buildEnrichedJobEntities,
  searchJobs,
  JobSearchFilters,
  loadSavedJobs,
  saveJobToFavorites,
  removeSavedJob,
  isJobSaved,
  loadApplications,
  saveApplication,
  updateApplicationStatus,
  loadJobAlerts,
  saveJobAlert,
  toggleJobAlert,
  deleteJobAlert,
  loadSavedSearches,
  saveSearchQuery,
  deleteSavedSearch,
  loadCareerProfile,
  saveCareerProfile,
} from '../services/jobSearchService';
import { CareerProfile } from '../types/careerProfile';
import { useTheme } from '../context/ThemeContext';

interface JobSearchViewProps {
  onNavigateToComposeEmail?: (job: JobEntity) => void;
}

export const JobSearchView: React.FC<JobSearchViewProps> = ({ onNavigateToComposeEmail }) => {
  const { theme } = useTheme();

  // Active View Tab
  const [activeTab, setActiveTab] = useState<'search' | 'saved' | 'applications' | 'alerts' | 'profile'>('search');

  // Career Profile
  const [careerProfile, setCareerProfile] = useState<CareerProfile>(() => loadCareerProfile());

  // Master Jobs List (Enriched with Sponsorship Audit & Match Engine)
  const masterJobs = useMemo(() => {
    return buildEnrichedJobEntities(undefined, careerProfile);
  }, [careerProfile]);

  // Search Filters
  const [keyword, setKeyword] = useState('');
  const [selectedQuickFilter, setSelectedQuickFilter] = useState<QuickCountryFilterKey>('all');
  const [selectedCountry, setSelectedCountry] = useState('all');
  const [cityFilter, setCityFilter] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [jobTypeFilter, setJobTypeFilter] = useState('');
  const [workplaceTypeFilter, setWorkplaceTypeFilter] = useState('');
  const [visaSponsorshipOnly, setVisaSponsorshipOnly] = useState(false);
  const [accommodationOnly, setAccommodationOnly] = useState(false);
  const [relocationOnly, setRelocationOnly] = useState(false);
  const [minMatchScore, setMinMatchScore] = useState(0);
  const [sortBy, setSortBy] = useState<JobSearchFilters['sortBy']>('best_match');
  const [currentPage, setCurrentPage] = useState(1);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  // Saved Jobs & Applications state
  const [savedJobs, setSavedJobs] = useState<SavedJobRecord[]>(() => loadSavedJobs());
  const [applications, setApplications] = useState<ApplicationRecord[]>(() => loadApplications());
  const [jobAlerts, setJobAlerts] = useState<JobAlertConfig[]>(() => loadJobAlerts());
  const [savedSearches, setSavedSearches] = useState<SavedSearchQuery[]>(() => loadSavedSearches());

  // Modal State
  const [trackingJob, setTrackingJob] = useState<JobEntity | null>(null);

  // Quick Country Filter handler
  const handleQuickFilterClick = (key: QuickCountryFilterKey) => {
    setSelectedQuickFilter(key);
    setCurrentPage(1);
    if (key === 'visa_sponsorship') {
      setVisaSponsorshipOnly(true);
      setSelectedCountry('all');
    } else {
      setVisaSponsorshipOnly(false);
      setSelectedCountry(key);
    }
  };

  // Run Search Query
  const searchResult = useMemo(() => {
    const filters: JobSearchFilters = {
      keyword,
      country: selectedCountry,
      city: cityFilter,
      jobTitle: roleFilter,
      visaSponsorshipOnly,
      jobType: jobTypeFilter,
      workplaceType: workplaceTypeFilter,
      accommodationProvided: accommodationOnly,
      relocationSupport: relocationOnly,
      minMatchScore,
      sortBy,
      page: currentPage,
      pageSize: 9,
    };
    return searchJobs(masterJobs, filters, careerProfile);
  }, [
    masterJobs,
    keyword,
    selectedCountry,
    cityFilter,
    roleFilter,
    visaSponsorshipOnly,
    jobTypeFilter,
    workplaceTypeFilter,
    accommodationOnly,
    relocationOnly,
    minMatchScore,
    sortBy,
    currentPage,
    careerProfile,
  ]);

  // Toggle Save Favorite
  const handleToggleSaveJob = (job: JobEntity) => {
    if (isJobSaved(job.id)) {
      removeSavedJob(job.id);
    } else {
      saveJobToFavorites(job);
    }
    setSavedJobs(loadSavedJobs());
  };

  // Save Application
  const handleSaveApplicationRecord = (rec: ApplicationRecord) => {
    saveApplication(rec);
    setApplications(loadApplications());
  };

  // Save Search Query
  const handleSaveCurrentSearch = () => {
    const name = `${keyword || 'All Roles'} in ${selectedCountry === 'all' ? 'Global' : selectedCountry}${
      visaSponsorshipOnly ? ' (Visa Sponsored)' : ''
    }`;
    saveSearchQuery(name, {
      keywords: keyword,
      country: selectedCountry,
      visaSponsorshipOnly,
    });
    setSavedSearches(loadSavedSearches());
    alert('Search query saved to your alerts and quick searches!');
  };

  // Save Career Profile
  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    saveCareerProfile(careerProfile);
    alert('Career profile updated! Match scores updated across all jobs.');
  };

  return (
    <div className="space-y-6 animate-fade-in pb-24">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#202738]">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#ffd700] px-2.5 py-0.5 rounded-full bg-[#ffd700]/10 border border-[#d4af37]/30 flex items-center gap-1">
              <Globe className="w-3 h-3 text-[#ffd700]" />
              <span>Multi-Source Job Engine</span>
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              Active Visa Auditing
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-['Cinzel'] text-[#fdf8f0] tracking-wide mt-1.5">
            Global Hospitality Job Search
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Verified luxury vacancies across UK, Australia, New Zealand, Malta, Greece, Cyprus & Schengen EU.
          </p>
        </div>

        {/* Sub-tab navigation */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-[#0e111a] border border-[#232938] overflow-x-auto">
          <button
            onClick={() => setActiveTab('search')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 ${
              activeTab === 'search'
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Search className="w-3.5 h-3.5" />
            <span>Search Jobs</span>
          </button>

          <button
            onClick={() => setActiveTab('saved')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 ${
              activeTab === 'saved'
                ? 'bg-gradient-to-r from-amber-600 to-yellow-600 text-slate-950 font-black shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Bookmark className="w-3.5 h-3.5" />
            <span>Saved ({savedJobs.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('applications')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 ${
              activeTab === 'applications'
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5" />
            <span>Tracking ({applications.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('alerts')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 ${
              activeTab === 'alerts'
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Bell className="w-3.5 h-3.5" />
            <span>Alerts ({jobAlerts.filter(a => a.active).length})</span>
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 ${
              activeTab === 'profile'
                ? 'bg-[#d4af37] text-slate-950 font-black shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>Matching Profile</span>
          </button>
        </div>
      </div>

      {/* ========================================================
          TAB 1: SEARCH JOBS
          ======================================================== */}
      {activeTab === 'search' && (
        <div className="space-y-5">
          {/* Main Search & Action Bar */}
          <div className="p-4 rounded-3xl bg-[#11141c] border border-[#232938] shadow-lg space-y-3">
            <div className="flex flex-col md:flex-row gap-3">
              {/* Keyword Input */}
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  value={keyword}
                  onChange={e => {
                    setKeyword(e.target.value);
                    setCurrentPage(1);
                  }}
                  placeholder="Job title, keywords, or luxury company (e.g. Bartender, Savoy, Mixologist)..."
                  className="w-full pl-10 pr-4 py-2.5 bg-[#090b10] border border-[#232838] rounded-2xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              {/* Specific Country Dropdown */}
              <div className="w-full md:w-56">
                <select
                  value={selectedCountry}
                  onChange={e => {
                    setSelectedCountry(e.target.value);
                    setSelectedQuickFilter('all');
                    setCurrentPage(1);
                  }}
                  className="w-full px-3.5 py-2.5 bg-[#090b10] border border-[#232838] rounded-2xl text-xs text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="all">🌍 All Countries</option>
                  <option value="eu">🇪🇺 All 27 EU Member States</option>
                  <option value="schengen">🛂 All 29 Schengen Countries</option>
                  <optgroup label="Primary Priority Markets">
                    <option value="United Kingdom">🇬🇧 United Kingdom</option>
                    <option value="Australia">🇦🇺 Australia</option>
                    <option value="New Zealand">🇳🇿 New Zealand</option>
                    <option value="Malta">🇲🇹 Malta</option>
                    <option value="Greece">🇬🇷 Greece</option>
                    <option value="Cyprus">🇨🇾 Cyprus</option>
                  </optgroup>
                  <optgroup label="All European Countries">
                    {CENTRAL_COUNTRY_DATABASE.map(c => (
                      <option key={c.id} value={c.countryName}>
                        {c.flag} {c.countryName}
                      </option>
                    ))}
                  </optgroup>
                </select>
              </div>

              {/* Sort By Dropdown */}
              <div className="w-full md:w-44">
                <select
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 bg-[#090b10] border border-[#232838] rounded-2xl text-xs text-slate-300 focus:outline-none focus:border-indigo-500"
                >
                  <option value="best_match">✨ Best Match Score</option>
                  <option value="sponsorship">🛂 Visa Sponsorship First</option>
                  <option value="newest">🕒 Newest Posted</option>
                  <option value="salary">💰 Highest Salary</option>
                  <option value="relevance">🎯 Relevance</option>
                </select>
              </div>

              {/* Filters Toggle Button */}
              <button
                type="button"
                onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                className={`px-4 py-2.5 rounded-2xl border text-xs font-bold flex items-center justify-center gap-1.5 transition shrink-0 ${
                  showAdvancedFilters || visaSponsorshipOnly || accommodationOnly || relocationOnly
                    ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300'
                    : 'bg-[#181d29] border-[#293245] text-slate-300 hover:text-white'
                }`}
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>Filters</span>
                {(visaSponsorshipOnly || accommodationOnly || relocationOnly || minMatchScore > 0) && (
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                )}
              </button>
            </div>

            {/* Quick Country Filter Pills (Requirements 7 & 18) */}
            <div className="flex items-center gap-2 overflow-x-auto pt-1 pb-1 no-scrollbar text-xs">
              {QUICK_COUNTRY_FILTERS.map(pill => (
                <button
                  type="button"
                  key={pill.key}
                  onClick={() => handleQuickFilterClick(pill.key)}
                  className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition flex items-center gap-1.5 shrink-0 ${
                    selectedQuickFilter === pill.key ||
                    (pill.key === 'visa_sponsorship' && visaSponsorshipOnly) ||
                    (pill.key !== 'all' && selectedCountry.toLowerCase() === pill.label.toLowerCase())
                      ? 'bg-[#d4af37] text-slate-950 shadow-md font-black'
                      : 'bg-[#181d29] border border-[#273042] text-slate-300 hover:text-white'
                  }`}
                >
                  <span>{pill.icon}</span>
                  <span>{pill.label}</span>
                  {pill.badge && (
                    <span className="px-1.5 py-0.2 rounded text-[9px] bg-black/20 text-current">
                      {pill.badge}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Advanced Filters Drawer (Requirement 8) */}
            {showAdvancedFilters && (
              <div className="pt-3 border-t border-[#1e2538] grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs animate-fade-in">
                {/* Visa Sponsorship Only Toggle */}
                <label className="flex items-center gap-2 p-2.5 rounded-xl bg-[#090b10] border border-[#232838] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={visaSponsorshipOnly}
                    onChange={e => {
                      setVisaSponsorshipOnly(e.target.checked);
                      setCurrentPage(1);
                    }}
                    className="w-4 h-4 rounded text-emerald-500 focus:ring-0 bg-slate-900 border-slate-700"
                  />
                  <span className="font-bold text-emerald-400">Visa Sponsorship Only</span>
                </label>

                {/* Accommodation Provided Toggle */}
                <label className="flex items-center gap-2 p-2.5 rounded-xl bg-[#090b10] border border-[#232838] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={accommodationOnly}
                    onChange={e => {
                      setAccommodationOnly(e.target.checked);
                      setCurrentPage(1);
                    }}
                    className="w-4 h-4 rounded text-indigo-500 focus:ring-0 bg-slate-900 border-slate-700"
                  />
                  <span className="font-semibold text-slate-300 flex items-center gap-1">
                    <Home className="w-3.5 h-3.5 text-indigo-400" /> Accommodation Included
                  </span>
                </label>

                {/* Relocation Support Toggle */}
                <label className="flex items-center gap-2 p-2.5 rounded-xl bg-[#090b10] border border-[#232838] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={relocationOnly}
                    onChange={e => {
                      setRelocationOnly(e.target.checked);
                      setCurrentPage(1);
                    }}
                    className="w-4 h-4 rounded text-teal-500 focus:ring-0 bg-slate-900 border-slate-700"
                  />
                  <span className="font-semibold text-slate-300 flex items-center gap-1">
                    <Plane className="w-3.5 h-3.5 text-teal-400" /> Relocation Support
                  </span>
                </label>

                {/* Job Type Selector */}
                <select
                  value={jobTypeFilter}
                  onChange={e => {
                    setJobTypeFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="p-2.5 rounded-xl bg-[#090b10] border border-[#232838] text-xs text-white"
                >
                  <option value="">Job Type: Any</option>
                  <option value="full-time">Full-Time</option>
                  <option value="seasonal">Seasonal Resort</option>
                  <option value="permanent">Permanent</option>
                  <option value="contract">Contract</option>
                  <option value="part-time">Part-Time</option>
                </select>

                {/* City Input */}
                <input
                  type="text"
                  value={cityFilter}
                  onChange={e => {
                    setCityFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  placeholder="Filter by city (e.g. London, Limassol)..."
                  className="p-2.5 rounded-xl bg-[#090b10] border border-[#232838] text-xs text-white placeholder-slate-500"
                />

                {/* Min Match Score */}
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-[#090b10] border border-[#232838]">
                  <span className="text-slate-400 whitespace-nowrap">Min Match:</span>
                  <input
                    type="range"
                    min="0"
                    max="90"
                    step="10"
                    value={minMatchScore}
                    onChange={e => {
                      setMinMatchScore(Number(e.target.value));
                      setCurrentPage(1);
                    }}
                    className="w-full accent-indigo-500"
                  />
                  <span className="font-bold text-white text-xs">{minMatchScore}%</span>
                </div>

                {/* Save Current Search Button */}
                <button
                  type="button"
                  onClick={handleSaveCurrentSearch}
                  className="col-span-1 sm:col-span-2 p-2.5 rounded-xl bg-[#1c2230] hover:bg-[#252d40] border border-[#2d3850] text-xs font-bold text-amber-300 flex items-center justify-center gap-1.5 transition"
                >
                  <Bookmark className="w-3.5 h-3.5" />
                  <span>Save This Search Query</span>
                </button>
              </div>
            )}
          </div>

          {/* Search Result Overview Bar */}
          <div className="flex items-center justify-between text-xs text-slate-400 px-1">
            <div className="flex items-center gap-2">
              <span>
                Found <strong className="text-white">{searchResult.totalCount}</strong> relevant opportunities
              </span>
              <span className="text-slate-600">•</span>
              <span className="text-emerald-400 font-semibold">
                {searchResult.sponsorshipCounts.confirmed} Visa Confirmed
              </span>
              <span className="text-slate-600">•</span>
              <span className="text-amber-400 font-semibold">
                {searchResult.sponsorshipCounts.possible} Possible
              </span>
            </div>
            <span>
              Page {searchResult.page} of {searchResult.totalPages}
            </span>
          </div>

          {/* Job Cards Grid (Requirement 10) */}
          {searchResult.jobs.length === 0 ? (
            <div className="p-12 rounded-3xl bg-[#11141c] border border-[#232838] text-center space-y-3">
              <Briefcase className="w-12 h-12 text-slate-600 mx-auto" />
              <h3 className="text-base font-bold text-white">No jobs match your selected filters</h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                Try widening your country selection, lowering the minimum match percentage, or turning off the strict
                Visa Sponsorship Only filter.
              </p>
              <button
                type="button"
                onClick={() => {
                  setKeyword('');
                  setSelectedCountry('all');
                  setSelectedQuickFilter('all');
                  setVisaSponsorshipOnly(false);
                  setAccommodationOnly(false);
                  setRelocationOnly(false);
                  setMinMatchScore(0);
                  setCityFilter('');
                  setRoleFilter('');
                }}
                className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-bold text-xs"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {searchResult.jobs.map(job => {
                const application = applications.find(a => a.jobId === job.id);
                return (
                  <JobCard
                    key={job.id}
                    job={job}
                    isSaved={isJobSaved(job.id)}
                    applicationStatus={application?.status}
                    onToggleSave={handleToggleSaveJob}
                    onApplyByEmail={onNavigateToComposeEmail}
                    onTrackApplication={j => setTrackingJob(j)}
                  />
                );
              })}
            </div>
          )}

          {/* Pagination Controls (Requirement 17) */}
          {searchResult.totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-4">
              <button
                type="button"
                disabled={currentPage <= 1}
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                className="px-4 py-2 rounded-xl bg-[#151924] border border-[#232838] text-xs font-semibold text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed hover:text-white"
              >
                &larr; Previous Page
              </button>

              <div className="flex items-center gap-1">
                {Array.from({ length: searchResult.totalPages }, (_, i) => i + 1).map(p => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setCurrentPage(p)}
                    className={`w-8 h-8 rounded-xl text-xs font-bold transition ${
                      currentPage === p
                        ? 'bg-indigo-600 text-white font-black'
                        : 'bg-[#151924] text-slate-400 hover:text-white'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>

              <button
                type="button"
                disabled={currentPage >= searchResult.totalPages}
                onClick={() => setCurrentPage(p => Math.min(searchResult.totalPages, p + 1))}
                className="px-4 py-2 rounded-xl bg-[#151924] border border-[#232838] text-xs font-semibold text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed hover:text-white"
              >
                Next Page &rarr;
              </button>
            </div>
          )}
        </div>
      )}

      {/* ========================================================
          TAB 2: SAVED JOBS (Requirement 12 & 13)
          ======================================================== */}
      {activeTab === 'saved' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#232838]">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Bookmark className="w-4 h-4 text-[#ffd700]" />
              <span>Saved Job Opportunities ({savedJobs.length})</span>
            </h2>
            <span className="text-xs text-slate-400">Your curated bookmarked vacancies</span>
          </div>

          {savedJobs.length === 0 ? (
            <div className="p-12 rounded-3xl bg-[#11141c] border border-[#232838] text-center space-y-2">
              <Bookmark className="w-10 h-10 text-slate-600 mx-auto" />
              <p className="text-sm font-semibold text-white">No saved jobs yet</p>
              <p className="text-xs text-slate-400">Click the bookmark icon on any job card to save it for later review.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {savedJobs.map(item => (
                <JobCard
                  key={item.id}
                  job={item.job}
                  isSaved={true}
                  onToggleSave={handleToggleSaveJob}
                  onApplyByEmail={onNavigateToComposeEmail}
                  onTrackApplication={j => setTrackingJob(j)}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* ========================================================
          TAB 3: APPLICATIONS & INTERVIEW TRACKER (Requirement 13)
          ======================================================== */}
      {activeTab === 'applications' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#232838]">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-purple-400" />
              <span>Application Pipeline & Timeline ({applications.length})</span>
            </h2>
            <span className="text-xs text-slate-400">
              Track interviews, offers, follow-ups, and recruiter communications
            </span>
          </div>

          {applications.length === 0 ? (
            <div className="p-12 rounded-3xl bg-[#11141c] border border-[#232838] text-center space-y-2">
              <Briefcase className="w-10 h-10 text-slate-600 mx-auto" />
              <p className="text-sm font-semibold text-white">No applications tracked yet</p>
              <p className="text-xs text-slate-400">
                Click "Track" on any job card or apply by email to automatically start tracking.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {applications.map(app => (
                <div
                  key={app.id}
                  className="p-4 rounded-2xl bg-[#11141c] border border-[#232838] flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition hover:border-[#333d54]"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-bold text-sm sm:text-base text-white">{app.jobTitle}</h3>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-purple-500/20 text-purple-300 border border-purple-500/30">
                        {app.status}
                      </span>
                    </div>
                    <div className="text-xs text-slate-400 flex items-center gap-2">
                      <span className="text-[#ffd700] font-semibold">{app.company}</span>
                      <span>•</span>
                      <span>{app.location}</span>
                      <span>•</span>
                      <span>Applied: {app.appliedDate}</span>
                    </div>

                    {app.interviewDate && (
                      <div className="text-xs text-purple-400 font-semibold flex items-center gap-1.5 pt-1">
                        <span>🗓️ Interview Scheduled: {app.interviewDate}</span>
                      </div>
                    )}

                    {app.salaryOffered && (
                      <div className="text-xs text-emerald-400 font-semibold pt-0.5">
                        💰 Offer: {app.salaryOffered}
                      </div>
                    )}

                    {app.notes && (
                      <p className="text-xs text-slate-400 italic pt-1 line-clamp-1">"{app.notes}"</p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                    <button
                      type="button"
                      onClick={() => {
                        const job = masterJobs.find(j => j.id === app.jobId) || {
                          id: app.jobId,
                          title: app.jobTitle,
                          company: app.company,
                          country: app.country,
                          city: app.location,
                          location: app.location,
                          salary: 'Competitive',
                          currency: 'EUR',
                          jobType: 'full-time',
                          workplaceType: 'on-site',
                          datePosted: 'Recent',
                          experienceRequired: '2+ years',
                          requiredExperienceYears: 2,
                          visaSponsorshipStatus: 'confirmed',
                          sponsorshipEvidence: 'Recorded application',
                          sponsorshipReason: 'In tracking',
                          workPermitSupport: true,
                          relocationSupport: false,
                          accommodationProvided: false,
                          matchScore: 90,
                          source: 'Direct Tracker',
                          sourceId: 'src_custom',
                          sourceUrl: app.applicationUrl || '',
                          applicationUrl: app.applicationUrl || '',
                          description: 'Tracked job vacancy',
                          industry: 'Hospitality',
                          createdAt: new Date().toISOString(),
                        };
                        setTrackingJob(job);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-[#1c2230] text-xs font-semibold text-slate-200 hover:text-white"
                    >
                      Update Status
                    </button>
                    {app.applicationUrl && (
                      <a
                        href={app.applicationUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-xl bg-[#1c2230] text-slate-400 hover:text-white"
                        title="View Job"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ========================================================
          TAB 4: JOB ALERTS & SAVED SEARCHES (Requirements 14 & 15)
          ======================================================== */}
      {activeTab === 'alerts' && (
        <div className="space-y-6">
          {/* Job Alerts Section */}
          <div className="p-5 rounded-3xl bg-[#11141c] border border-[#232838] space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#232838]">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Bell className="w-4 h-4 text-emerald-400" />
                  <span>Configured Job Alerts</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Get notified when new vacancies match your target role and sponsorship criteria.
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {jobAlerts.map(alert => (
                <div
                  key={alert.id}
                  className="p-4 rounded-2xl bg-[#090b10] border border-[#1e2536] flex items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-white">{alert.name}</span>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          alert.active
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {alert.active ? 'Active' : 'Paused'}
                      </span>
                    </div>
                    <div className="text-xs text-slate-400 flex items-center gap-2 flex-wrap">
                      <span>Role: {alert.jobTitle}</span>
                      <span>•</span>
                      <span>Countries: {alert.countries.join(', ')}</span>
                      <span>•</span>
                      <span>Min Match: {alert.minMatchScore}%</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        toggleJobAlert(alert.id);
                        setJobAlerts(loadJobAlerts());
                      }}
                      className="px-3 py-1.5 rounded-xl bg-[#181d29] text-xs font-semibold text-slate-300 hover:text-white"
                    >
                      {alert.active ? 'Pause' : 'Activate'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        deleteJobAlert(alert.id);
                        setJobAlerts(loadJobAlerts());
                      }}
                      className="p-2 rounded-xl text-slate-500 hover:text-rose-400"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Saved Searches Section */}
          <div className="p-5 rounded-3xl bg-[#11141c] border border-[#232838] space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Bookmark className="w-4 h-4 text-amber-400" />
              <span>1-Tap Saved Searches</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {savedSearches.map(s => (
                <div
                  key={s.id}
                  className="p-3.5 rounded-2xl bg-[#090b10] border border-[#1e2536] flex items-center justify-between gap-3"
                >
                  <div>
                    <span className="font-bold text-xs sm:text-sm text-white block">{s.name}</span>
                    <span className="text-[11px] text-slate-400">
                      Keywords: "{s.keywords}" • {s.country}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => {
                        setKeyword(s.keywords);
                        setSelectedCountry(s.country);
                        setVisaSponsorshipOnly(s.visaSponsorshipOnly);
                        setActiveTab('search');
                      }}
                      className="px-3 py-1 rounded-xl bg-indigo-600/30 hover:bg-indigo-600 text-indigo-300 hover:text-white text-xs font-bold transition"
                    >
                      Run
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        deleteSavedSearch(s.id);
                        setSavedSearches(loadSavedSearches());
                      }}
                      className="p-1.5 text-slate-500 hover:text-rose-400"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          TAB 5: CAREER PROFILE & MATCH ENGINE (Requirement 11 & 19)
          ======================================================== */}
      {activeTab === 'profile' && (
        <form onSubmit={handleUpdateProfile} className="p-6 rounded-3xl bg-[#11141c] border border-[#232838] space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-[#232838]">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <Award className="w-5 h-5 text-[#ffd700]" />
                <span>Candidate Career Profile & Matching Engine</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                The smart matching engine compares these attributes against every job posting (0–100% Score).
              </p>
            </div>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#d4af37] via-[#ffd700] to-[#c5a059] text-slate-950 font-black text-xs uppercase tracking-wider shadow"
            >
              Save Profile & Recalculate
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Full Name</label>
              <input
                type="text"
                value={careerProfile.fullName}
                onChange={e => setCareerProfile({ ...careerProfile, fullName: e.target.value })}
                className="w-full p-2.5 rounded-xl bg-[#090b10] border border-[#232838] text-white"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-semibold mb-1">Current Location</label>
              <input
                type="text"
                value={careerProfile.currentLocation}
                onChange={e => setCareerProfile({ ...careerProfile, currentLocation: e.target.value })}
                className="w-full p-2.5 rounded-xl bg-[#090b10] border border-[#232838] text-white"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-semibold mb-1">Nationality</label>
              <input
                type="text"
                value={careerProfile.nationality}
                onChange={e => setCareerProfile({ ...careerProfile, nationality: e.target.value })}
                className="w-full p-2.5 rounded-xl bg-[#090b10] border border-[#232838] text-white"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-semibold mb-1">Years of Experience</label>
              <input
                type="number"
                value={careerProfile.yearsOfExperience}
                onChange={e => setCareerProfile({ ...careerProfile, yearsOfExperience: Number(e.target.value) })}
                className="w-full p-2.5 rounded-xl bg-[#090b10] border border-[#232838] text-white"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-semibold mb-1">English Proficiency</label>
              <select
                value={careerProfile.englishLevel}
                onChange={e => setCareerProfile({ ...careerProfile, englishLevel: e.target.value as any })}
                className="w-full p-2.5 rounded-xl bg-[#090b10] border border-[#232838] text-white"
              >
                <option value="Fluent / C2">Fluent / C2</option>
                <option value="Advanced / C1">Advanced / C1</option>
                <option value="Intermediate / B2">Intermediate / B2</option>
                <option value="Native / Bilingual">Native / Bilingual</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-400 font-semibold mb-1">Minimum Desired Salary (€/month)</label>
              <input
                type="number"
                value={careerProfile.preferredSalaryMin || 1400}
                onChange={e => setCareerProfile({ ...careerProfile, preferredSalaryMin: Number(e.target.value) })}
                className="w-full p-2.5 rounded-xl bg-[#090b10] border border-[#232838] text-white"
              />
            </div>
          </div>

          {/* Target Job Titles */}
          <div className="text-xs">
            <label className="block text-slate-400 font-semibold mb-1">
              Target Job Titles (Comma-separated)
            </label>
            <input
              type="text"
              value={careerProfile.jobTitles.join(', ')}
              onChange={e =>
                setCareerProfile({
                  ...careerProfile,
                  jobTitles: e.target.value.split(',').map(s => s.trim()).filter(Boolean),
                })
              }
              className="w-full p-2.5 rounded-xl bg-[#090b10] border border-[#232838] text-white"
            />
          </div>

          {/* Core Technical Skills */}
          <div className="text-xs">
            <label className="block text-slate-400 font-semibold mb-1">
              Core Skills & Specializations (Comma-separated)
            </label>
            <textarea
              rows={2}
              value={careerProfile.skills.join(', ')}
              onChange={e =>
                setCareerProfile({
                  ...careerProfile,
                  skills: e.target.value.split(',').map(s => s.trim()).filter(Boolean),
                })
              }
              className="w-full p-2.5 rounded-xl bg-[#090b10] border border-[#232838] text-white resize-none"
            />
          </div>

          {/* Target Countries */}
          <div className="text-xs">
            <label className="block text-slate-400 font-semibold mb-1">
              Target Countries of Interest (Comma-separated)
            </label>
            <input
              type="text"
              value={careerProfile.targetCountries.join(', ')}
              onChange={e =>
                setCareerProfile({
                  ...careerProfile,
                  targetCountries: e.target.value.split(',').map(s => s.trim()).filter(Boolean),
                })
              }
              className="w-full p-2.5 rounded-xl bg-[#090b10] border border-[#232838] text-white"
            />
          </div>
        </form>
      )}

      {/* Application Tracking Modal */}
      {trackingJob && (
        <ApplicationTrackingModal
          job={trackingJob}
          existingRecord={applications.find(a => a.jobId === trackingJob.id)}
          isOpen={true}
          onClose={() => setTrackingJob(null)}
          onSave={handleSaveApplicationRecord}
        />
      )}
    </div>
  );
};
