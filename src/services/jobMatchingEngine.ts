/**
 * Transparent Weighted Job Matching Engine (Requirement 11)
 * Compares User Career Profile against Job Attributes
 * Calculates 0-100% Match Score with explicit reasons and issues.
 */

import { CareerProfile } from '../types/careerProfile';

export interface MatchScoreResult {
  matchScore: number; // 0 - 100
  matchedReasons: string[];
  potentialIssues: string[];
  categoryScores: {
    titleScore: number;
    skillsScore: number;
    experienceScore: number;
    locationScore: number;
    languageScore: number;
    industryScore: number;
  };
}

export interface MatchableJob {
  position: string;
  company: string;
  country?: string;
  city?: string;
  location?: string;
  description?: string;
  requiredExperienceYears?: number;
  requiredSkills?: string[];
  salaryMin?: number;
  salaryMax?: number;
  currency?: string;
  languagesRequired?: string[];
  visaSponsorshipStatus?: 'confirmed' | 'possible' | 'not_mentioned' | 'not_available';
}

export function calculateJobMatch(job: MatchableJob, profile: CareerProfile): MatchScoreResult {
  let score = 0;
  const matchedReasons: string[] = [];
  const potentialIssues: string[] = [];

  const jobPos = (job.position || '').toLowerCase();
  const jobDesc = (job.description || '').toLowerCase();
  const jobLoc = `${job.country || ''} ${job.city || ''} ${job.location || ''}`.toLowerCase();

  // 1. Job Title Match (Up to 25 pts)
  let titleScore = 0;
  const matchedTitle = profile.jobTitles.find(t => jobPos.includes(t.toLowerCase()) || t.toLowerCase().includes(jobPos));
  if (matchedTitle) {
    titleScore = 25;
    matchedReasons.push(`Target role match: ${matchedTitle} closely aligns with "${job.position}"`);
  } else {
    // Check partial keyword (e.g. "bar", "beverage", "hospitality")
    const hasHospitalityKeyword = profile.jobTitles.some(t => {
      const words = t.toLowerCase().split(' ');
      return words.some(w => w.length > 3 && jobPos.includes(w));
    });
    if (hasHospitalityKeyword) {
      titleScore = 15;
      matchedReasons.push(`Related hospitality specialization: ${job.position}`);
    } else {
      potentialIssues.push(`Position title differs slightly from primary target roles: ${profile.jobTitles.slice(0, 2).join(', ')}`);
    }
  }
  score += titleScore;

  // 2. Skills Match (Up to 25 pts)
  let skillsScore = 0;
  const matchedSkills: string[] = [];
  for (const skill of profile.skills) {
    const sLower = skill.toLowerCase();
    if (jobDesc.includes(sLower) || jobPos.includes(sLower) || (job.requiredSkills || []).some(rs => rs.toLowerCase().includes(sLower))) {
      matchedSkills.push(skill);
    }
  }

  if (matchedSkills.length >= 3) {
    skillsScore = 25;
    matchedReasons.push(`Strong core skills match: ${matchedSkills.slice(0, 4).join(', ')}`);
  } else if (matchedSkills.length >= 1) {
    skillsScore = 15;
    matchedReasons.push(`Key technical skills detected: ${matchedSkills.join(', ')}`);
  } else {
    skillsScore = 8;
    potentialIssues.push('Few explicitly required skills listed in posting; review full JD for specific requirements');
  }
  score += skillsScore;

  // 3. Work Experience & Years (Up to 20 pts)
  let experienceScore = 0;
  const requiredYrs = job.requiredExperienceYears || 2;
  if (profile.yearsOfExperience >= requiredYrs) {
    experienceScore = 20;
    matchedReasons.push(`Experience satisfied: ${profile.yearsOfExperience} years relevant career history (requires ${requiredYrs}+ years)`);
  } else {
    experienceScore = 10;
    potentialIssues.push(`Employer may require ${requiredYrs}+ years experience (you have ${profile.yearsOfExperience} recorded)`);
  }
  score += experienceScore;

  // 4. Country / Location Preference (Up to 15 pts)
  let locationScore = 0;
  const matchedCountry = profile.targetCountries.find(tc => jobLoc.includes(tc.toLowerCase()));
  if (matchedCountry) {
    locationScore = 15;
    matchedReasons.push(`Location preference matched: ${matchedCountry}`);
  } else {
    // Check if within current location
    if (jobLoc.includes(profile.currentLocation.toLowerCase())) {
      locationScore = 15;
      matchedReasons.push(`Local market match: ${profile.currentLocation}`);
    } else {
      locationScore = 5;
      potentialIssues.push(`Location is outside top prioritized target countries (${profile.targetCountries.slice(0, 3).join(', ')})`);
    }
  }
  score += locationScore;

  // 5. English & Language Requirement (Up to 10 pts)
  let languageScore = 10;
  if (jobDesc.includes('fluent english') || jobDesc.includes('english required') || jobDesc.includes('english speaking')) {
    matchedReasons.push(`English proficiency satisfied: ${profile.englishLevel}`);
  } else {
    matchedReasons.push('Standard international language requirements met');
  }
  score += languageScore;

  // 6. Visa / Sponsorship Alignment (Up to 5 bonus pts)
  let industryScore = 5;
  if (job.visaSponsorshipStatus === 'confirmed') {
    matchedReasons.push('Employer confirmed visa sponsorship available for international applicants');
    score = Math.min(100, score + 5);
  } else if (job.visaSponsorshipStatus === 'not_available') {
    potentialIssues.push('Employer explicitly states visa sponsorship is not offered; requires existing work authorization');
    score = Math.max(0, score - 10);
  }

  const finalScore = Math.min(99, Math.max(35, Math.round(score)));

  return {
    matchScore: finalScore,
    matchedReasons,
    potentialIssues,
    categoryScores: {
      titleScore,
      skillsScore,
      experienceScore,
      locationScore,
      languageScore,
      industryScore,
    },
  };
}
