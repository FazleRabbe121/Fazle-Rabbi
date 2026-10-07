/**
 * Visa & Work Permit Sponsorship Detection Engine
 * 
 * Strict Four-Status Classification:
 * - GREEN: 'confirmed'       -> "Visa Sponsorship: Confirmed"
 * - YELLOW: 'possible'       -> "Visa Sponsorship: Possible / Unclear"
 * - GREY: 'not_mentioned'    -> "Visa Sponsorship: Not Mentioned"
 * - RED: 'not_available'     -> "Visa Sponsorship: Not Available"
 * 
 * CRITICAL RULE:
 * Never assume sponsorship exists simply because a job is abroad.
 * "Not Mentioned" is never treated as "Confirmed".
 * Full transparent evidence/reasoning is extracted and stored.
 */

export type VisaSponsorshipStatus = 'confirmed' | 'possible' | 'not_mentioned' | 'not_available';

export interface SponsorshipAuditResult {
  status: VisaSponsorshipStatus;
  statusLabel: string;
  badgeColor: 'emerald' | 'amber' | 'slate' | 'rose';
  evidence: string;
  reason: string;
  workPermitSupport: boolean;
  relocationSupport: boolean;
  accommodationProvided: boolean;
  analyzedAt: string;
}

export function detectVisaSponsorship(
  jobDescription: string = '',
  additionalNotes: string = '',
  tags: string[] = []
): SponsorshipAuditResult {
  const combined = `${jobDescription} ${additionalNotes} ${tags.join(' ')}`.toLowerCase();

  // 1. Check RED: Explicitly NOT available
  const notAvailablePatterns = [
    { pattern: /no visa sponsorship/i, quote: 'No visa sponsorship provided' },
    { pattern: /visa sponsorship is not available/i, quote: 'Visa sponsorship is not available' },
    { pattern: /cannot sponsor/i, quote: 'Employer cannot sponsor work visas' },
    { pattern: /unable to sponsor/i, quote: 'Unable to sponsor visas for this role' },
    { pattern: /must have right to work/i, quote: 'Must have existing right to work' },
    { pattern: /must possess valid right to work/i, quote: 'Must possess valid right to work' },
    { pattern: /must be authorized to work without sponsorship/i, quote: 'Must be authorized to work without sponsorship' },
    { pattern: /no sponsorship available/i, quote: 'No sponsorship available' },
    { pattern: /applicants must already hold work authorization/i, quote: 'Must already hold work authorization' },
    { pattern: /only candidates eligible to work in/i, quote: 'Only candidates with existing local work eligibility' },
    { pattern: /sponsorship not offered/i, quote: 'Sponsorship not offered' },
  ];

  for (const item of notAvailablePatterns) {
    if (item.pattern.test(combined)) {
      return {
        status: 'not_available',
        statusLabel: 'Visa Sponsorship: Not Available',
        badgeColor: 'rose',
        evidence: item.quote,
        reason: 'The employer explicitly states that visa or work permit sponsorship is not available.',
        workPermitSupport: false,
        relocationSupport: false,
        accommodationProvided: checkAccommodation(combined),
        analyzedAt: new Date().toISOString(),
      };
    }
  }

  // 2. Check GREEN: Explicitly CONFIRMED
  const confirmedPatterns = [
    { pattern: /visa sponsorship (available|provided|offered|supported)/i, quote: 'Visa sponsorship available / provided by employer' },
    { pattern: /work visa sponsorship (available|provided|offered)/i, quote: 'Work visa sponsorship available for international candidates' },
    { pattern: /work permit (sponsorship|support provided|arranged)/i, quote: 'Work permit sponsorship & government application supported' },
    { pattern: /skilled worker visa sponsor/i, quote: 'UK Skilled Worker Visa sponsorship available' },
    { pattern: /tier 2 (visa|sponsor)/i, quote: 'Tier 2 / Skilled Worker visa sponsorship available' },
    { pattern: /tss 482|subclass 482|subclass 494/i, quote: 'Australian TSS / Subclass 482 visa sponsorship available' },
    { pattern: /accredited employer work visa/i, quote: 'New Zealand AEWV work visa sponsorship available' },
    { pattern: /we sponsor (visas|international candidates|eligible candidates)/i, quote: 'We sponsor eligible international candidates' },
    { pattern: /relocation (package|allowance|assistance) (and|with) visa/i, quote: 'Relocation package with comprehensive visa sponsorship' },
    { pattern: /full immigration support/i, quote: 'Full legal immigration and work permit sponsorship' },
    { pattern: /sponsorship: confirmed/i, quote: 'Visa Sponsorship Confirmed' },
  ];

  for (const item of confirmedPatterns) {
    if (item.pattern.test(combined)) {
      return {
        status: 'confirmed',
        statusLabel: 'Visa Sponsorship: Confirmed',
        badgeColor: 'emerald',
        evidence: item.quote,
        reason: 'The employer explicitly confirms visa sponsorship / work permit support for eligible applicants.',
        workPermitSupport: true,
        relocationSupport: checkRelocation(combined),
        accommodationProvided: checkAccommodation(combined),
        analyzedAt: new Date().toISOString(),
      };
    }
  }

  // 3. Check YELLOW: POSSIBLE / UNCLEAR
  const possiblePatterns = [
    { pattern: /international (candidates|applicants) welcome/i, quote: 'International candidates welcome to apply' },
    { pattern: /assistance with (work permit|relocation|paperwork)/i, quote: 'Assistance with paperwork and administrative relocation' },
    { pattern: /sponsorship may be considered/i, quote: 'Sponsorship may be considered for exceptional talent' },
    { pattern: /relocation assistance/i, quote: 'Relocation assistance offered' },
    { pattern: /open to overseas applicants/i, quote: 'Open to overseas applicants' },
    { pattern: /help with visa/i, quote: 'Employer offers guidance on visa process' },
    { pattern: /seasonal work permit/i, quote: 'Assistance with seasonal work permit application' },
  ];

  for (const item of possiblePatterns) {
    if (item.pattern.test(combined)) {
      return {
        status: 'possible',
        statusLabel: 'Visa Sponsorship: Possible / Unclear',
        badgeColor: 'amber',
        evidence: item.quote,
        reason: 'Indications of international welcome or relocation support, but visa sponsorship is not explicitly guaranteed.',
        workPermitSupport: false,
        relocationSupport: checkRelocation(combined),
        accommodationProvided: checkAccommodation(combined),
        analyzedAt: new Date().toISOString(),
      };
    }
  }

  // 4. Default GREY: NOT MENTIONED
  return {
    status: 'not_mentioned',
    statusLabel: 'Visa Sponsorship: Not Mentioned',
    badgeColor: 'slate',
    evidence: 'No sponsorship or right-to-work terms detected in posting.',
    reason: 'The job posting does not provide clear information regarding visa or work permit support.',
    workPermitSupport: false,
    relocationSupport: checkRelocation(combined),
    accommodationProvided: checkAccommodation(combined),
    analyzedAt: new Date().toISOString(),
  };
}

function checkRelocation(text: string): boolean {
  return /relocation (package|allowance|assistance|support|covered)/i.test(text);
}

function checkAccommodation(text: string): boolean {
  return /(accommodation provided|free accommodation|staff housing|board & lodging|room and board|shared staff apartment|lodging included)/i.test(text);
}
