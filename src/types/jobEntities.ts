/**
 * Structured Job Database Entities & Schema (Requirements 10, 12, 13, 14, 15, 16)
 */

import { VisaSponsorshipStatus } from '../services/sponsorshipDetection';

export type ApplicationStatus =
  | 'new'
  | 'viewed'
  | 'saved'
  | 'applied'
  | 'interview'
  | 'offer'
  | 'rejected'
  | 'withdrawn'
  | 'expired';

export type JobType =
  | 'full-time'
  | 'part-time'
  | 'permanent'
  | 'contract'
  | 'seasonal'
  | 'temporary';

export type WorkplaceType = 'on-site' | 'hybrid' | 'remote';

export interface JobEntity {
  id: string;
  title: string;
  company: string;
  country: string;
  city: string;
  location: string;
  salary: string;
  salaryMin?: number;
  salaryMax?: number;
  currency: string;
  jobType: JobType;
  workplaceType: WorkplaceType;
  datePosted: string;
  experienceRequired: string;
  requiredExperienceYears: number;
  visaSponsorshipStatus: VisaSponsorshipStatus;
  sponsorshipEvidence: string;
  sponsorshipReason: string;
  workPermitSupport: boolean;
  relocationSupport: boolean;
  accommodationProvided: boolean;
  matchScore: number;
  matchedReasons?: string[];
  potentialIssues?: string[];
  source: string;
  sourceId: string;
  sourceUrl: string;
  applicationUrl: string;
  recipientEmail?: string;
  description: string;
  skillsRequired?: string[] | string;
  industry: string;
  isDuplicate?: boolean;
  duplicateOf?: string;
  createdAt: string;
  expiresAt?: string;
}

export interface ApplicationTimelineEvent {
  id: string;
  date: string; // ISO date
  status: ApplicationStatus;
  note: string;
  updatedBy?: string;
}

export interface ApplicationRecord {
  id: string;
  jobId: string;
  userId: string;
  jobTitle: string;
  company: string;
  location: string;
  country: string;
  appliedDate: string; // e.g. "October 7, 2026"
  appliedTimestamp: number;
  status: ApplicationStatus;
  interviewDate?: string;
  salaryOffered?: string;
  contactPerson?: string;
  notes?: string;
  applicationUrl?: string;
  followUpDate?: string;
  timeline: ApplicationTimelineEvent[];
  updatedAt: string;
}

export interface SavedJobRecord {
  id: string;
  jobId: string;
  userId: string;
  job: JobEntity;
  savedAt: string;
  notes?: string;
}

export interface JobAlertConfig {
  id: string;
  userId: string;
  name: string;
  jobTitle: string;
  countries: string[];
  sponsorshipRequired: boolean;
  minMatchScore: number; // e.g. 75
  active: boolean;
  lastCheckedAt?: string;
  createdAt: string;
}

export interface SavedSearchQuery {
  id: string;
  userId: string;
  name: string;
  keywords: string;
  country: string;
  visaSponsorshipOnly: boolean;
  jobType?: string;
  minSalary?: number;
  createdAt: string;
}

export interface JobSourceConfig {
  sourceId: string;
  sourceName: string;
  apiEndpoint?: string;
  type: 'verified_employer' | 'curated_feed' | 'gemini_grounded_search' | 'rss_aggregator';
  active: boolean;
  rateLimitPerMinute: number;
  lastSuccessfulSync?: string;
  status: 'healthy' | 'degraded' | 'disabled';
}

/**
 * Duplicate Job Detection Helper (Requirement 12)
 * Compares company, title, location, and URLs
 */
export function generateJobFingerprint(job: Partial<JobEntity>): string {
  const normComp = (job.company || '').toLowerCase().replace(/[^a-z0-9]/g, '');
  const normTitle = (job.title || '').toLowerCase().replace(/[^a-z0-9]/g, '');
  const normLoc = (job.location || job.city || '').toLowerCase().replace(/[^a-z0-9]/g, '');
  return `${normComp}_${normTitle}_${normLoc}`;
}

export function isDuplicateJob(jobA: Partial<JobEntity>, jobB: Partial<JobEntity>): boolean {
  if (jobA.id && jobB.id && jobA.id === jobB.id) return true;
  if (jobA.sourceUrl && jobB.sourceUrl && jobA.sourceUrl.trim().toLowerCase() === jobB.sourceUrl.trim().toLowerCase()) {
    return true;
  }
  const fpA = generateJobFingerprint(jobA);
  const fpB = generateJobFingerprint(jobB);
  return fpA.length > 5 && fpA === fpB;
}
