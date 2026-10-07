/**
 * Comprehensive Job Search, Source Management & Application Service
 * (Requirements 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 23)
 */

import {
  JobEntity,
  JobSourceConfig,
  ApplicationRecord,
  SavedJobRecord,
  JobAlertConfig,
  SavedSearchQuery,
  isDuplicateJob,
} from '../types/jobEntities';
import { detectVisaSponsorship } from './sponsorshipDetection';
import { calculateJobMatch } from './jobMatchingEngine';
import { CareerProfile, DEFAULT_CAREER_PROFILE } from '../types/careerProfile';
import { getCountryByName, CountryConfig } from './countryDatabase';

const STORAGE_SAVED_JOBS = 'ccd_saved_jobs_v3';
const STORAGE_APPLICATIONS = 'ccd_applications_v3';
const STORAGE_JOB_ALERTS = 'ccd_job_alerts_v3';
const STORAGE_SAVED_SEARCHES = 'ccd_saved_searches_v3';
const STORAGE_CAREER_PROFILE = 'ccd_career_profile_v3';

// ----------------------------------------------------
// Modular Job Sources (Requirement 16)
// ----------------------------------------------------
export const CONFIGURED_JOB_SOURCES: JobSourceConfig[] = [
  {
    sourceId: 'src_verified_resorts',
    sourceName: '5-Star Luxury Resorts & Hotel Chains Directory',
    type: 'verified_employer',
    active: true,
    rateLimitPerMinute: 60,
    status: 'healthy',
  },
  {
    sourceId: 'src_uk_hospitality',
    sourceName: 'UK Hospitality & Skilled Worker Visa Network',
    type: 'curated_feed',
    active: true,
    rateLimitPerMinute: 45,
    status: 'healthy',
  },
  {
    sourceId: 'src_oceania_network',
    sourceName: 'Australia & New Zealand Tourism Career Exchange',
    type: 'curated_feed',
    active: true,
    rateLimitPerMinute: 45,
    status: 'healthy',
  },
  {
    sourceId: 'src_med_hospitality',
    sourceName: 'Mediterranean Luxury Career Gateway (Malta, Greece, Cyprus)',
    type: 'verified_employer',
    active: true,
    rateLimitPerMinute: 60,
    status: 'healthy',
  },
  {
    sourceId: 'src_eu_career_hub',
    sourceName: 'European Union Schengen Hospitality Index',
    type: 'rss_aggregator',
    active: true,
    rateLimitPerMinute: 50,
    status: 'healthy',
  },
  {
    sourceId: 'src_ai_grounded',
    sourceName: 'Gemini Real-time Google Search Grounded Job Intelligence',
    type: 'gemini_grounded_search',
    active: true,
    rateLimitPerMinute: 20,
    status: 'healthy',
  },
];

// ----------------------------------------------------
// Global Seed Job Catalog (Multi-Country, Luxury & Hospitality)
// ----------------------------------------------------
interface RawCatalogItem {
  title: string;
  company: string;
  country: string;
  city: string;
  salary: string;
  salaryMin?: number;
  salaryMax?: number;
  currency: string;
  jobType: 'full-time' | 'part-time' | 'permanent' | 'contract' | 'seasonal' | 'temporary';
  workplaceType: 'on-site' | 'hybrid' | 'remote';
  datePosted: string;
  experienceRequired: string;
  requiredExperienceYears: number;
  description: string;
  source: string;
  sourceId: string;
  sourceUrl: string;
  applicationUrl: string;
  recipientEmail: string;
  industry: string;
}

const GLOBAL_RAW_JOBS: RawCatalogItem[] = [
  // 1. UNITED KINGDOM (Confirmed Sponsorship)
  {
    title: 'Senior Cocktail Bartender',
    company: 'The Savoy Hotel London (Fairmont)',
    country: 'United Kingdom',
    city: 'London',
    salary: '£34,000 – £38,000 / year + service charge',
    salaryMin: 34000,
    salaryMax: 38000,
    currency: 'GBP',
    jobType: 'full-time',
    workplaceType: 'on-site',
    datePosted: '3 days ago',
    experienceRequired: '3+ years high-end cocktail bar experience',
    requiredExperienceYears: 3,
    description: 'The American Bar at The Savoy is seeking an elite Senior Cocktail Bartender. Visa sponsorship available: UK Skilled Worker Visa sponsorship offered for qualifying international hospitality professionals. Relocation assistance and uniform provided.',
    source: 'The Savoy Careers / UK Skilled Worker Sponsor',
    sourceId: 'src_uk_hospitality',
    sourceUrl: 'https://www.thesavoylondon.com/careers',
    applicationUrl: 'https://careers.accor.com/global/en/savoy-london',
    recipientEmail: 'recruitment.london@fairmont.com',
    industry: '5-Star Luxury Hotel',
  },
  {
    title: 'Head Bartender & Mixologist',
    company: 'The Balmoral Hotel (Rocco Forte)',
    country: 'United Kingdom',
    city: 'Edinburgh',
    salary: '£32,000 – £36,000 / year + tips',
    salaryMin: 32000,
    salaryMax: 36000,
    currency: 'GBP',
    jobType: 'permanent',
    workplaceType: 'on-site',
    datePosted: '5 days ago',
    experienceRequired: '4+ years bar leadership experience',
    requiredExperienceYears: 4,
    description: 'Leading Scotch whisky bar at The Balmoral Edinburgh. Work visa sponsorship provided: Tier 2 / Skilled Worker visa sponsorship available for experienced bartenders. Full company benefits and pension.',
    source: 'Rocco Forte Hotels Careers',
    sourceId: 'src_uk_hospitality',
    sourceUrl: 'https://www.roccofortehotels.com/careers',
    applicationUrl: 'https://www.roccofortehotels.com/careers',
    recipientEmail: 'recruitment.balmoral@roccofortehotels.com',
    industry: 'Luxury Hotel & Scotch Bar',
  },
  {
    title: 'Lobby Lounge Barista & Bartender',
    company: 'The Edwardian Manchester (Radisson Collection)',
    country: 'United Kingdom',
    city: 'Manchester',
    salary: '£26,500 – £29,000 / year',
    salaryMin: 26500,
    salaryMax: 29000,
    currency: 'GBP',
    jobType: 'full-time',
    workplaceType: 'on-site',
    datePosted: '1 week ago',
    experienceRequired: '2+ years barista & bar experience',
    requiredExperienceYears: 2,
    description: 'Peter Street Kitchen and Lounge at The Edwardian Manchester. Artisanal coffee brewing, specialty cocktail service. Applicants must have right to work in the UK; no visa sponsorship available for this position.',
    source: 'Radisson Hotel Group UK',
    sourceId: 'src_uk_hospitality',
    sourceUrl: 'https://www.radissonhotels.com/careers',
    applicationUrl: 'https://www.radissonhotels.com/careers',
    recipientEmail: 'careers.manchester@radissoncollection.com',
    industry: 'Hospitality & Boutique Bar',
  },

  // 2. AUSTRALIA (Confirmed & Possible Sponsorship)
  {
    title: 'Lead Mixologist & Bar Manager',
    company: 'Crown Sydney Luxury Resort',
    country: 'Australia',
    city: 'Sydney',
    salary: 'A$78,000 – A$88,000 / year + superannuation',
    salaryMin: 78000,
    salaryMax: 88000,
    currency: 'AUD',
    jobType: 'full-time',
    workplaceType: 'on-site',
    datePosted: '2 days ago',
    experienceRequired: '4+ years luxury cocktail bar leadership',
    requiredExperienceYears: 4,
    description: 'Crown Sydney Barangaroo waterfront destination. Visa sponsorship available: Subclass 482 / TSS visa sponsorship available for eligible overseas candidates with demonstrated mixology background. Relocation package covered.',
    source: 'Crown Resorts Careers Australia',
    sourceId: 'src_oceania_network',
    sourceUrl: 'https://www.crownresorts.com.au/careers',
    applicationUrl: 'https://www.crownresorts.com.au/careers',
    recipientEmail: 'careers@crownsydney.com.au',
    industry: '5-Star Luxury Casino Resort',
  },
  {
    title: 'Cocktail Bartender & Barista',
    company: 'The Langham Melbourne',
    country: 'Australia',
    city: 'Melbourne',
    salary: 'A$62,000 – A$68,000 / year + penalties & tips',
    salaryMin: 62000,
    salaryMax: 68000,
    currency: 'AUD',
    jobType: 'full-time',
    workplaceType: 'on-site',
    datePosted: '4 days ago',
    experienceRequired: '2+ years cocktail & coffee service',
    requiredExperienceYears: 2,
    description: 'ARIA Bar & Lounge at The Langham Melbourne Southbank. International applicants welcome: Employer provides assistance with paperwork and sponsorship may be considered for experienced hospitality professionals.',
    source: 'Langham Hospitality Group AU',
    sourceId: 'src_oceania_network',
    sourceUrl: 'https://www.langhamhotels.com/careers',
    applicationUrl: 'https://www.langhamhotels.com/careers',
    recipientEmail: 'recruitment.melbourne@langhamhotels.com',
    industry: '5-Star Luxury Hotel',
  },

  // 3. NEW ZEALAND (Confirmed Sponsorship)
  {
    title: 'Resort Cocktail Bartender',
    company: 'Eichardt’s Private Hotel & Bar',
    country: 'New Zealand',
    city: 'Queenstown',
    salary: 'NZ$29.50 – NZ$34.00 / hour (NZ$62,000 / year)',
    salaryMin: 60000,
    salaryMax: 68000,
    currency: 'NZD',
    jobType: 'permanent',
    workplaceType: 'on-site',
    datePosted: '3 days ago',
    experienceRequired: '2+ years craft cocktail bar experience',
    requiredExperienceYears: 2,
    description: 'Iconic Lake Wakatipu luxury establishment. Accredited employer work visa sponsorship available: We are an NZ Accredited Employer offering work visa sponsorship and shared staff apartment accommodation in Queenstown.',
    source: 'Imperium Collection NZ',
    sourceId: 'src_oceania_network',
    sourceUrl: 'https://www.eichardts.com/careers',
    applicationUrl: 'https://www.eichardts.com/careers',
    recipientEmail: 'careers@imperiumcollection.com',
    industry: 'Boutique Luxury Hotel',
  },

  // 4. MALTA (EU & Schengen, Work Permit Support & Accommodation)
  {
    title: 'Palm Court Cocktail Bartender',
    company: 'The Phoenicia Malta',
    country: 'Malta',
    city: 'Valletta',
    salary: '€1,450 – €1,750 / month + gratuities',
    salaryMin: 17400,
    salaryMax: 21000,
    currency: 'EUR',
    jobType: 'full-time',
    workplaceType: 'on-site',
    datePosted: '4 days ago',
    experienceRequired: '2+ years hotel bar service',
    requiredExperienceYears: 2,
    description: 'Historic 5-star hotel next to Valletta city gate. Work permit support provided: Full assistance with Identity Malta single work permit application for non-EU/EU candidates. Shared staff housing assistance and duty meals provided.',
    source: 'Leading Hotels of the World / The Phoenicia',
    sourceId: 'src_med_hospitality',
    sourceUrl: 'https://www.phoeniciamalta.com/careers',
    applicationUrl: 'https://www.phoeniciamalta.com/careers',
    recipientEmail: 'careers@phoeniciamalta.com',
    industry: '5-Star Historic Hotel',
  },
  {
    title: 'Rooftop Lounge Mixologist',
    company: 'InterContinental Malta',
    country: 'Malta',
    city: 'St. Julian’s',
    salary: '€1,500 – €1,850 / month + tips',
    salaryMin: 18000,
    salaryMax: 22200,
    currency: 'EUR',
    jobType: 'full-time',
    workplaceType: 'on-site',
    datePosted: '1 week ago',
    experienceRequired: '3+ years mixology background',
    requiredExperienceYears: 3,
    description: 'SKYBEACH 19th floor infinity pool bar and lounge. International candidates welcome: Work visa sponsorship available for qualified candidates meeting Malta hospitality employment quotas. Staff meals provided.',
    source: 'IHG Hotels & Resorts Malta',
    sourceId: 'src_med_hospitality',
    sourceUrl: 'https://careers.ihg.com',
    applicationUrl: 'https://careers.ihg.com',
    recipientEmail: 'malta.recruitment@ihg.com',
    industry: '5-Star Luxury Resort',
  },

  // 5. GREECE (EU & Schengen, Seasonal Work Permit & Accommodation)
  {
    title: 'Sunset Pool Bar Mixologist',
    company: 'Canaves Oia Luxury Suites & Spa',
    country: 'Greece',
    city: 'Santorini',
    salary: '€1,600 – €2,100 / month net + tips + room & board',
    salaryMin: 19200,
    salaryMax: 25200,
    currency: 'EUR',
    jobType: 'seasonal',
    workplaceType: 'on-site',
    datePosted: '2 days ago',
    experienceRequired: '2+ years luxury cocktail experience',
    requiredExperienceYears: 2,
    description: 'Iconic cliffside luxury resort overlooking the caldera. Visa sponsorship available: Seasonal work permit sponsorship arranged for international mixologists. Free private accommodation provided, plus 3 daily meals and competitive tip share.',
    source: 'Canaves Oia Luxury Collection',
    sourceId: 'src_med_hospitality',
    sourceUrl: 'https://canaves.com/careers',
    applicationUrl: 'https://canaves.com/careers',
    recipientEmail: 'careers@canaves.com',
    industry: '5-Star Ultra-Luxury Resort',
  },
  {
    title: 'Beach Club Bartender',
    company: 'Scorpios Mykonos (Soho House)',
    country: 'Greece',
    city: 'Mykonos',
    salary: '€1,800 – €2,400 / month + high tips',
    salaryMin: 21600,
    salaryMax: 28800,
    currency: 'EUR',
    jobType: 'seasonal',
    workplaceType: 'on-site',
    datePosted: '3 days ago',
    experienceRequired: '3+ years high-volume craft cocktail bar',
    requiredExperienceYears: 3,
    description: 'World-renowned sunset beach sanctuary. International applicants welcome: Assistance with Greek seasonal work permit paperwork. Board and lodging included (shared staff apartment in Mykonos) and daily meals.',
    source: 'Soho House & Scorpios Careers',
    sourceId: 'src_med_hospitality',
    sourceUrl: 'https://www.scorpiosmykonos.com/careers',
    applicationUrl: 'https://www.scorpiosmykonos.com/careers',
    recipientEmail: 'careers@scorpiosmykonos.com',
    industry: 'World-Class Beach Club & Lounge',
  },
  {
    title: 'Lobby Lounge & Cocktail Barman',
    company: 'Hotel Grande Bretagne, Luxury Collection',
    country: 'Greece',
    city: 'Athens',
    salary: '€1,400 – €1,700 / month',
    salaryMin: 16800,
    salaryMax: 20400,
    currency: 'EUR',
    jobType: 'permanent',
    workplaceType: 'on-site',
    datePosted: '6 days ago',
    experienceRequired: '2+ years 5-star hotel bar experience',
    requiredExperienceYears: 2,
    description: 'Alexander’s Bar at Syntagma Square. Candidates must possess valid EU right to work. No visa sponsorship available for this vacancy.',
    source: 'Marriott Luxury Collection Greece',
    sourceId: 'src_med_hospitality',
    sourceUrl: 'https://careers.marriott.com',
    applicationUrl: 'https://careers.marriott.com',
    recipientEmail: 'hr.athens@luxurycollection.com',
    industry: '5-Star Grand Luxury Hotel',
  },

  // 6. CYPRUS (EU Member, Luxury Resorts)
  {
    title: 'Pool Bar & Beach Lounge Bartender',
    company: 'Four Seasons Resort Cyprus',
    country: 'Cyprus',
    city: 'Limassol',
    salary: '€1,350 – €1,650 / month + 13th salary + tips',
    salaryMin: 16200,
    salaryMax: 19800,
    currency: 'EUR',
    jobType: 'full-time',
    workplaceType: 'on-site',
    datePosted: '1 day ago',
    experienceRequired: '2+ years cocktail bartender experience',
    requiredExperienceYears: 2,
    description: 'Beachfront 5-star hotel in Limassol Marina district. Work permit sponsorship supported: Cyprus immigration work permit support provided for eligible third-country national hospitality workers. Duty meals and uniform supplied.',
    source: 'Four Seasons Resort Cyprus HR',
    sourceId: 'src_med_hospitality',
    sourceUrl: 'https://www.fourseasons.com.cy/careers',
    applicationUrl: 'https://www.fourseasons.com.cy/careers',
    recipientEmail: 'hr@fourseasons.com.cy',
    industry: '5-Star Beachfront Luxury Resort',
  },
  {
    title: 'Rooftop Bar Mixologist & Bartender',
    company: 'Amara Hotel Limassol',
    country: 'Cyprus',
    city: 'Limassol',
    salary: '€1,400 – €1,750 / month + tips',
    salaryMin: 16800,
    salaryMax: 21000,
    currency: 'EUR',
    jobType: 'permanent',
    workplaceType: 'on-site',
    datePosted: '2 days ago',
    experienceRequired: '3+ years creative cocktail mixology',
    requiredExperienceYears: 3,
    description: 'Panoramic rooftop cocktail lounge at Amara. International candidates welcome: Employer provides assistance with Cyprus work permit renewal and application. Excellent career progression within luxury hotel group.',
    source: 'Amara Hotel Careers Limassol',
    sourceId: 'src_med_hospitality',
    sourceUrl: 'https://www.amarahotel.com/careers',
    applicationUrl: 'https://www.amarahotel.com/careers',
    recipientEmail: 'careers@amarahotel.com',
    industry: '5-Star Ultra-Luxury Hotel',
  },
  {
    title: 'Lobby Lounge Barista & Bartender',
    company: 'Parklane, a Luxury Collection Resort & Spa',
    country: 'Cyprus',
    city: 'Limassol',
    salary: '€1,300 – €1,600 / month + tips + 13th salary',
    salaryMin: 15600,
    salaryMax: 19200,
    currency: 'EUR',
    jobType: 'full-time',
    workplaceType: 'on-site',
    datePosted: '4 days ago',
    experienceRequired: '2+ years espresso coffee & bar service',
    requiredExperienceYears: 2,
    description: 'Lobby lounge at Marriott Luxury Collection resort. High-volume specialty coffee preparation and evening cocktails. Work permit assistance offered for experienced candidates.',
    source: 'Marriott Luxury Collection Cyprus',
    sourceId: 'src_med_hospitality',
    sourceUrl: 'https://careers.marriott.com',
    applicationUrl: 'https://careers.marriott.com',
    recipientEmail: 'careers@parklanelimassol.com',
    industry: '5-Star Marriott Luxury Collection',
  },
  {
    title: 'Pool Bar & Cocktail Bartender',
    company: 'Cap St Georges Hotel & Resort',
    country: 'Cyprus',
    city: 'Paphos',
    salary: '€1,350 – €1,650 / month + tips + accommodation',
    salaryMin: 16200,
    salaryMax: 19800,
    currency: 'EUR',
    jobType: 'seasonal',
    workplaceType: 'on-site',
    datePosted: '3 days ago',
    experienceRequired: '2+ years resort pool bar service',
    requiredExperienceYears: 2,
    description: 'Mediterranean coastal 5-star resort in Peyia, Paphos. Free accommodation provided in nearby staff residence, full board meals, and seasonal work permit support.',
    source: 'Cap St Georges Resort Paphos',
    sourceId: 'src_med_hospitality',
    sourceUrl: 'https://www.capstgeorges.com/careers',
    applicationUrl: 'https://www.capstgeorges.com/careers',
    recipientEmail: 'careers@capstgeorges.com',
    industry: '5-Star Coastal Palace Resort',
  },

  // 7. EUROPEAN UNION & SCHENGEN (Germany, France, Spain, Italy, Austria, Netherlands)
  {
    title: 'Signature Cocktail Bartender',
    company: 'Hotel de Crillon, A Rosewood Hotel',
    country: 'France',
    city: 'Paris',
    salary: '€2,200 – €2,600 / month + tips',
    salaryMin: 26400,
    salaryMax: 31200,
    currency: 'EUR',
    jobType: 'permanent',
    workplaceType: 'on-site',
    datePosted: '5 days ago',
    experienceRequired: '3+ years luxury Parisian cocktail bar',
    requiredExperienceYears: 3,
    description: 'Bar Les Ambassadeurs at Place de la Concorde Paris. Exceptional mixology craft. Applicants must hold existing EU right to work; no visa sponsorship provided.',
    source: 'Rosewood Hotel Group France',
    sourceId: 'src_eu_career_hub',
    sourceUrl: 'https://www.rosewoodhotels.com/careers',
    applicationUrl: 'https://www.rosewoodhotels.com/careers',
    recipientEmail: 'crillon.careers@rosewoodhotels.com',
    industry: 'Palace Hotel Paris',
  },
  {
    title: 'Hotel Bar & Speakeasy Mixologist',
    company: 'The Ritz-Carlton Berlin',
    country: 'Germany',
    city: 'Berlin',
    salary: '€2,300 – €2,700 / month + service tips',
    salaryMin: 27600,
    salaryMax: 32400,
    currency: 'EUR',
    jobType: 'full-time',
    workplaceType: 'on-site',
    datePosted: '2 days ago',
    experienceRequired: '2+ years sensory cocktail mixology',
    requiredExperienceYears: 2,
    description: 'Fragrances Bar and The Curtain Club at Potsdamer Platz. Visa sponsorship available: German Opportunity Card and skilled worker visa sponsorship supported for qualified candidates with verified language proficiency.',
    source: 'Marriott International Germany',
    sourceId: 'src_eu_career_hub',
    sourceUrl: 'https://careers.marriott.com',
    applicationUrl: 'https://careers.marriott.com',
    recipientEmail: 'berlin.careers@ritzcarlton.com',
    industry: '5-Star Luxury Hotel',
  },
  {
    title: 'Rooftop Sunset Lounge Bartender',
    company: 'W Barcelona (Marriott)',
    country: 'Spain',
    city: 'Barcelona',
    salary: '€1,650 – €1,950 / month + tips',
    salaryMin: 19800,
    salaryMax: 23400,
    currency: 'EUR',
    jobType: 'full-time',
    workplaceType: 'on-site',
    datePosted: '3 days ago',
    experienceRequired: '2+ years beach club or rooftop bar service',
    requiredExperienceYears: 2,
    description: 'WET Deck and Eclipse Rooftop lounge at W Barcelona beachfront. Modern cocktail culture and electronic music events. Spanish and English fluency required. Seasonal work permit assistance considered.',
    source: 'Marriott International Spain',
    sourceId: 'src_eu_career_hub',
    sourceUrl: 'https://careers.marriott.com',
    applicationUrl: 'https://careers.marriott.com',
    recipientEmail: 'wbarcelona.careers@whotels.com',
    industry: 'Lifestyle Luxury Hotel',
  },
  {
    title: 'Venetian Cocktail & Spritz Artisan',
    company: 'Hotel Cipriani, A Belmond Hotel',
    country: 'Italy',
    city: 'Venice',
    salary: '€1,850 – €2,300 / month + room & board',
    salaryMin: 22200,
    salaryMax: 27600,
    currency: 'EUR',
    jobType: 'seasonal',
    workplaceType: 'on-site',
    datePosted: '4 days ago',
    experienceRequired: '3+ years luxury Italian cocktail experience',
    requiredExperienceYears: 3,
    description: 'Giudecca Island luxury legend. Work visa sponsorship available: Seasonal work permit sponsorship provided for skilled international bartenders. Accommodation provided in private staff quarters plus full board.',
    source: 'Belmond Hotels Italy',
    sourceId: 'src_eu_career_hub',
    sourceUrl: 'https://www.belmond.com/careers',
    applicationUrl: 'https://www.belmond.com/careers',
    recipientEmail: 'careers.cipriani@belmond.com',
    industry: 'Iconic Luxury Hotel',
  },
  {
    title: 'Alpine Cocktail Lounge Bartender',
    company: 'Badrutt’s Palace Hotel',
    country: 'Switzerland',
    city: 'St. Moritz',
    salary: 'CHF 4,100 – CHF 4,600 / month (approx €4,300)',
    salaryMin: 49200,
    salaryMax: 55200,
    currency: 'CHF',
    jobType: 'seasonal',
    workplaceType: 'on-site',
    datePosted: '1 day ago',
    experienceRequired: '3+ years 5-star ski resort cocktail service',
    requiredExperienceYears: 3,
    description: 'Legendary Renaissance Bar in St. Moritz. Swiss seasonal L-permit visa sponsorship available for experienced European and international candidates. Shared staff accommodation provided in St. Moritz.',
    source: 'Leading Hotels of the World / Switzerland',
    sourceId: 'src_eu_career_hub',
    sourceUrl: 'https://www.badruttspalace.com/careers',
    applicationUrl: 'https://www.badruttspalace.com/careers',
    recipientEmail: 'jobs@badruttspalace.com',
    industry: 'Alpine Palace Hotel',
  },
  {
    title: 'Canal-side Cocktail Barista & Bartender',
    company: 'Waldorf Astoria Amsterdam',
    country: 'Netherlands',
    city: 'Amsterdam',
    salary: '€2,250 – €2,600 / month + travel stipend',
    salaryMin: 27000,
    salaryMax: 31200,
    currency: 'EUR',
    jobType: 'permanent',
    workplaceType: 'on-site',
    datePosted: '5 days ago',
    experienceRequired: '2+ years boutique cocktail experience',
    requiredExperienceYears: 2,
    description: 'Herengracht canal historic luxury residence. Cocktails and refined afternoon tea service. Applicants must hold current EU/Dutch work permit. No visa sponsorship available.',
    source: 'Hilton Luxury Brands Amsterdam',
    sourceId: 'src_eu_career_hub',
    sourceUrl: 'https://jobs.hilton.com',
    applicationUrl: 'https://jobs.hilton.com',
    recipientEmail: 'amsterdam.careers@waldorfastoria.com',
    industry: '5-Star Historic Luxury Hotel',
  },
];

// ----------------------------------------------------
// Build Full Job Entities with Sponsorship Audit & Match
// ----------------------------------------------------
export function buildEnrichedJobEntities(
  rawList: RawCatalogItem[] = GLOBAL_RAW_JOBS,
  profile: CareerProfile = DEFAULT_CAREER_PROFILE
): JobEntity[] {
  return rawList.map((item, idx) => {
    const audit = detectVisaSponsorship(item.description, `${item.company} ${item.source}`);
    const match = calculateJobMatch(
      {
        position: item.title,
        company: item.company,
        country: item.country,
        city: item.city,
        location: `${item.city}, ${item.country}`,
        description: item.description,
        requiredExperienceYears: item.requiredExperienceYears,
        salaryMin: item.salaryMin,
        salaryMax: item.salaryMax,
        currency: item.currency,
        visaSponsorshipStatus: audit.status,
      },
      profile
    );

    const id = `job_${item.country.slice(0, 2).toLowerCase()}_${item.city.slice(0, 3).toLowerCase()}_${idx + 100}`;

    return {
      id,
      title: item.title,
      company: item.company,
      country: item.country,
      city: item.city,
      location: `${item.city}, ${item.country}`,
      salary: item.salary,
      salaryMin: item.salaryMin,
      salaryMax: item.salaryMax,
      currency: item.currency,
      jobType: item.jobType,
      workplaceType: item.workplaceType,
      datePosted: item.datePosted,
      experienceRequired: item.experienceRequired,
      requiredExperienceYears: item.requiredExperienceYears,
      visaSponsorshipStatus: audit.status,
      sponsorshipEvidence: audit.evidence,
      sponsorshipReason: audit.reason,
      workPermitSupport: audit.workPermitSupport,
      relocationSupport: audit.relocationSupport,
      accommodationProvided: audit.accommodationProvided,
      matchScore: match.matchScore,
      matchedReasons: match.matchedReasons,
      potentialIssues: match.potentialIssues,
      source: item.source,
      sourceId: item.sourceId,
      sourceUrl: item.sourceUrl,
      applicationUrl: item.applicationUrl,
      recipientEmail: item.recipientEmail,
      description: item.description,
      industry: item.industry,
      createdAt: new Date().toISOString(),
    };
  });
}

// ----------------------------------------------------
// Search & Filter Execution Engine (Requirements 8, 14, 17, 18)
// ----------------------------------------------------
export interface JobSearchFilters {
  keyword?: string;
  country?: string; // 'all', 'eu', 'schengen', or specific country name/code
  city?: string;
  jobTitle?: string;
  industry?: string;
  visaSponsorshipOnly?: boolean;
  jobType?: string;
  workplaceType?: string;
  minSalary?: number;
  currency?: string;
  accommodationProvided?: boolean;
  relocationSupport?: boolean;
  minMatchScore?: number;
  sortBy?: 'best_match' | 'sponsorship' | 'newest' | 'salary' | 'relevance';
  page?: number;
  pageSize?: number;
}

export interface JobSearchResult {
  jobs: JobEntity[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
  sponsorshipCounts: {
    confirmed: number;
    possible: number;
    not_mentioned: number;
    not_available: number;
  };
  countryFacet: Record<string, number>;
}

export function searchJobs(
  allJobs: JobEntity[],
  filters: JobSearchFilters,
  profile: CareerProfile = DEFAULT_CAREER_PROFILE
): JobSearchResult {
  const {
    keyword = '',
    country = 'all',
    city = '',
    jobTitle = '',
    industry = '',
    visaSponsorshipOnly = false,
    jobType = '',
    workplaceType = '',
    minSalary = 0,
    accommodationProvided = false,
    relocationSupport = false,
    minMatchScore = 0,
    sortBy = 'best_match',
    page = 1,
    pageSize = 12,
  } = filters;

  const kw = keyword.toLowerCase().trim();
  const cityNorm = city.toLowerCase().trim();
  const titleNorm = jobTitle.toLowerCase().trim();
  const indNorm = industry.toLowerCase().trim();

  // Deduplicate before filtering
  const seenFingerprints = new Set<string>();
  const uniqueJobs: JobEntity[] = [];
  for (const job of allJobs) {
    const fp = `${job.company.toLowerCase().trim()}_${job.title.toLowerCase().trim()}_${job.location.toLowerCase().trim()}`;
    if (!seenFingerprints.has(fp)) {
      seenFingerprints.add(fp);
      uniqueJobs.push(job);
    }
  }

  // Filter
  const filtered = uniqueJobs.filter(job => {
    // 1. Keyword search (title, company, description, city, country)
    if (kw) {
      const skillsStr = Array.isArray(job.skillsRequired) ? job.skillsRequired.join(' ') : (job.skillsRequired || '');
      const haystack = `${job.title} ${job.company} ${job.city} ${job.country} ${job.description} ${skillsStr}`.toLowerCase();
      if (!haystack.includes(kw)) return false;
    }

    // 2. Country / Territory Group Filter
    if (country && country !== 'all') {
      const cLower = country.toLowerCase().trim();
      const countryConf = getCountryByName(job.country);

      if (cLower === 'eu' || cLower === 'eu countries') {
        if (!countryConf?.euMember) return false;
      } else if (cLower === 'schengen' || cLower === 'schengen countries') {
        if (!countryConf?.schengenMember) return false;
      } else if (cLower === 'uk' || cLower === 'united kingdom') {
        if (job.country.toLowerCase() !== 'united kingdom') return false;
      } else if (cLower === 'australia') {
        if (job.country.toLowerCase() !== 'australia') return false;
      } else if (cLower === 'new_zealand' || cLower === 'new zealand') {
        if (job.country.toLowerCase() !== 'new zealand') return false;
      } else if (cLower === 'malta') {
        if (job.country.toLowerCase() !== 'malta') return false;
      } else if (cLower === 'greece') {
        if (job.country.toLowerCase() !== 'greece') return false;
      } else if (cLower === 'visa_sponsorship') {
        if (job.visaSponsorshipStatus !== 'confirmed') return false;
      } else {
        // Specific country match
        if (job.country.toLowerCase() !== cLower && countryConf?.isoCode.toLowerCase() !== cLower) {
          return false;
        }
      }
    }

    // 3. City filter
    if (cityNorm && !job.city.toLowerCase().includes(cityNorm)) {
      return false;
    }

    // 4. Job Title filter
    if (titleNorm && !job.title.toLowerCase().includes(titleNorm)) {
      return false;
    }

    // 5. Industry filter
    if (indNorm && !job.industry.toLowerCase().includes(indNorm)) {
      return false;
    }

    // 6. Visa Sponsorship Only filter (CRITICAL)
    if (visaSponsorshipOnly && job.visaSponsorshipStatus !== 'confirmed') {
      return false;
    }

    // 7. Job Type filter
    if (jobType && job.jobType !== jobType) {
      return false;
    }

    // 8. Workplace Type filter
    if (workplaceType && job.workplaceType !== workplaceType) {
      return false;
    }

    // 9. Minimum Salary
    if (minSalary > 0 && job.salaryMin && job.salaryMin < minSalary) {
      return false;
    }

    // 10. Accommodation Provided
    if (accommodationProvided && !job.accommodationProvided) {
      return false;
    }

    // 11. Relocation Support
    if (relocationSupport && !job.relocationSupport) {
      return false;
    }

    // 12. Minimum Match Score
    if (minMatchScore > 0 && job.matchScore < minMatchScore) {
      return false;
    }

    return true;
  });

  // Calculate facets & counts
  const sponsorshipCounts = {
    confirmed: 0,
    possible: 0,
    not_mentioned: 0,
    not_available: 0,
  };
  const countryFacet: Record<string, number> = {};

  for (const job of filtered) {
    if (job.visaSponsorshipStatus in sponsorshipCounts) {
      sponsorshipCounts[job.visaSponsorshipStatus]++;
    }
    countryFacet[job.country] = (countryFacet[job.country] || 0) + 1;
  }

  // Sort
  filtered.sort((a, b) => {
    if (sortBy === 'best_match') {
      return b.matchScore - a.matchScore;
    }
    if (sortBy === 'sponsorship') {
      const priorityMap: Record<string, number> = {
        confirmed: 4,
        possible: 3,
        not_mentioned: 2,
        not_available: 1,
      };
      const diff = (priorityMap[b.visaSponsorshipStatus] || 0) - (priorityMap[a.visaSponsorshipStatus] || 0);
      return diff !== 0 ? diff : b.matchScore - a.matchScore;
    }
    if (sortBy === 'salary') {
      return (b.salaryMin || 0) - (a.salaryMin || 0);
    }
    if (sortBy === 'newest') {
      return a.id.localeCompare(b.id);
    }
    // relevance default: combine match and sponsorship
    const weightA = a.matchScore + (a.visaSponsorshipStatus === 'confirmed' ? 20 : 0);
    const weightB = b.matchScore + (b.visaSponsorshipStatus === 'confirmed' ? 20 : 0);
    return weightB - weightA;
  });

  // Pagination (Requirement 17)
  const totalCount = filtered.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const currentPage = Math.min(Math.max(1, page), totalPages);
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedJobs = filtered.slice(startIndex, startIndex + pageSize);

  return {
    jobs: paginatedJobs,
    totalCount,
    page: currentPage,
    pageSize,
    totalPages,
    sponsorshipCounts,
    countryFacet,
  };
}

// ----------------------------------------------------
// Saved Jobs Local Persistence (Requirement 12 & 13)
// ----------------------------------------------------
export function loadSavedJobs(): SavedJobRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_SAVED_JOBS);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveJobToFavorites(job: JobEntity, notes?: string): SavedJobRecord {
  const existing = loadSavedJobs();
  const filtered = existing.filter(s => s.jobId !== job.id);
  const newRecord: SavedJobRecord = {
    id: `saved_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
    jobId: job.id,
    userId: 'current-user',
    job,
    savedAt: new Date().toISOString(),
    notes,
  };
  const updated = [newRecord, ...filtered];
  try {
    localStorage.setItem(STORAGE_SAVED_JOBS, JSON.stringify(updated));
  } catch {}
  return newRecord;
}

export function removeSavedJob(jobId: string): void {
  const existing = loadSavedJobs();
  const updated = existing.filter(s => s.jobId !== jobId);
  try {
    localStorage.setItem(STORAGE_SAVED_JOBS, JSON.stringify(updated));
  } catch {}
}

export function isJobSaved(jobId: string): boolean {
  return loadSavedJobs().some(s => s.jobId === jobId);
}

// ----------------------------------------------------
// Application Tracking Records (Requirement 13)
// ----------------------------------------------------
export function loadApplications(): ApplicationRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_APPLICATIONS);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveApplication(record: Partial<ApplicationRecord> & { jobId: string; jobTitle: string; company: string }): ApplicationRecord {
  const existing = loadApplications();
  const now = Date.now();
  const dateStr = new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  const fullRecord: ApplicationRecord = {
    id: record.id || `app_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
    jobId: record.jobId,
    userId: record.userId || 'current-user',
    jobTitle: record.jobTitle,
    company: record.company,
    location: record.location || 'International',
    country: record.country || 'Global',
    appliedDate: record.appliedDate || dateStr,
    appliedTimestamp: record.appliedTimestamp || now,
    status: record.status || 'applied',
    interviewDate: record.interviewDate,
    salaryOffered: record.salaryOffered,
    contactPerson: record.contactPerson,
    notes: record.notes,
    applicationUrl: record.applicationUrl,
    followUpDate: record.followUpDate,
    timeline: record.timeline || [
      {
        id: `evt_${now}`,
        date: new Date().toISOString(),
        status: record.status || 'applied',
        note: 'Application logged into tracker.',
      },
    ],
    updatedAt: new Date().toISOString(),
  };

  const filtered = existing.filter(a => a.id !== fullRecord.id && a.jobId !== fullRecord.jobId);
  const updated = [fullRecord, ...filtered];
  try {
    localStorage.setItem(STORAGE_APPLICATIONS, JSON.stringify(updated));
  } catch {}
  return fullRecord;
}

export function updateApplicationStatus(id: string, newStatus: ApplicationRecord['status'], note?: string): ApplicationRecord | null {
  const existing = loadApplications();
  const idx = existing.findIndex(a => a.id === id);
  if (idx === -1) return null;

  const app = existing[idx];
  const newEvent = {
    id: `evt_${Date.now()}`,
    date: new Date().toISOString(),
    status: newStatus,
    note: note || `Status changed to ${newStatus}`,
  };

  const updatedApp: ApplicationRecord = {
    ...app,
    status: newStatus,
    timeline: [newEvent, ...app.timeline],
    updatedAt: new Date().toISOString(),
  };

  existing[idx] = updatedApp;
  try {
    localStorage.setItem(STORAGE_APPLICATIONS, JSON.stringify(existing));
  } catch {}
  return updatedApp;
}

// ----------------------------------------------------
// Job Alerts (Requirement 15)
// ----------------------------------------------------
export function loadJobAlerts(): JobAlertConfig[] {
  try {
    const raw = localStorage.getItem(STORAGE_JOB_ALERTS);
    if (!raw) {
      // Default initial alert
      return [
        {
          id: 'alert_default_bartender',
          userId: 'current-user',
          name: 'Bartender & Mixology with Visa Sponsorship',
          jobTitle: 'Bartender',
          countries: ['United Kingdom', 'Australia', 'New Zealand', 'Malta', 'Greece', 'Cyprus'],
          sponsorshipRequired: true,
          minMatchScore: 75,
          active: true,
          createdAt: new Date().toISOString(),
        },
      ];
    }
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveJobAlert(alert: Omit<JobAlertConfig, 'id' | 'createdAt'> & { id?: string }): JobAlertConfig {
  const existing = loadJobAlerts();
  const fullAlert: JobAlertConfig = {
    id: alert.id || `alert_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
    userId: alert.userId || 'current-user',
    name: alert.name,
    jobTitle: alert.jobTitle,
    countries: alert.countries,
    sponsorshipRequired: alert.sponsorshipRequired,
    minMatchScore: alert.minMatchScore,
    active: alert.active,
    createdAt: new Date().toISOString(),
  };

  const filtered = existing.filter(a => a.id !== fullAlert.id);
  const updated = [fullAlert, ...filtered];
  try {
    localStorage.setItem(STORAGE_JOB_ALERTS, JSON.stringify(updated));
  } catch {}
  return fullAlert;
}

export function toggleJobAlert(id: string): void {
  const existing = loadJobAlerts();
  const updated = existing.map(a => (a.id === id ? { ...a, active: !a.active } : a));
  try {
    localStorage.setItem(STORAGE_JOB_ALERTS, JSON.stringify(updated));
  } catch {}
}

export function deleteJobAlert(id: string): void {
  const existing = loadJobAlerts();
  const updated = existing.filter(a => a.id !== id);
  try {
    localStorage.setItem(STORAGE_JOB_ALERTS, JSON.stringify(updated));
  } catch {}
}

// ----------------------------------------------------
// Saved Searches (Requirement 14)
// ----------------------------------------------------
export function loadSavedSearches(): SavedSearchQuery[] {
  try {
    const raw = localStorage.getItem(STORAGE_SAVED_SEARCHES);
    if (!raw) {
      return [
        {
          id: 'search_1',
          userId: 'current-user',
          name: 'Bartender + UK + Visa Sponsorship',
          keywords: 'Bartender',
          country: 'United Kingdom',
          visaSponsorshipOnly: true,
          createdAt: new Date().toISOString(),
        },
        {
          id: 'search_2',
          userId: 'current-user',
          name: 'Mixologist + Australia + Sponsorship',
          keywords: 'Mixologist',
          country: 'Australia',
          visaSponsorshipOnly: true,
          createdAt: new Date().toISOString(),
        },
        {
          id: 'search_3',
          userId: 'current-user',
          name: 'Barista & Bartender + Malta',
          keywords: 'Barista',
          country: 'Malta',
          visaSponsorshipOnly: false,
          createdAt: new Date().toISOString(),
        },
        {
          id: 'search_4',
          userId: 'current-user',
          name: 'Hotel Resort Bar + Greece + Accommodation',
          keywords: 'Resort Bar',
          country: 'Greece',
          visaSponsorshipOnly: false,
          createdAt: new Date().toISOString(),
        },
      ];
    }
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveSearchQuery(name: string, query: { keywords: string; country: string; visaSponsorshipOnly: boolean }): SavedSearchQuery {
  const existing = loadSavedSearches();
  const record: SavedSearchQuery = {
    id: `search_${Date.now()}`,
    userId: 'current-user',
    name,
    keywords: query.keywords,
    country: query.country,
    visaSponsorshipOnly: query.visaSponsorshipOnly,
    createdAt: new Date().toISOString(),
  };
  const updated = [record, ...existing];
  try {
    localStorage.setItem(STORAGE_SAVED_SEARCHES, JSON.stringify(updated));
  } catch {}
  return record;
}

export function deleteSavedSearch(id: string): void {
  const existing = loadSavedSearches();
  const updated = existing.filter(s => s.id !== id);
  try {
    localStorage.setItem(STORAGE_SAVED_SEARCHES, JSON.stringify(updated));
  } catch {}
}

// ----------------------------------------------------
// Career Profile Persistence (Requirement 19)
// ----------------------------------------------------
export function loadCareerProfile(): CareerProfile {
  try {
    const raw = localStorage.getItem(STORAGE_CAREER_PROFILE);
    if (!raw) return DEFAULT_CAREER_PROFILE;
    return { ...DEFAULT_CAREER_PROFILE, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_CAREER_PROFILE;
  }
}

export function saveCareerProfile(profile: Partial<CareerProfile>): CareerProfile {
  const current = loadCareerProfile();
  const updated: CareerProfile = {
    ...current,
    ...profile,
    updatedAt: new Date().toISOString(),
  };
  try {
    localStorage.setItem(STORAGE_CAREER_PROFILE, JSON.stringify(updated));
  } catch {}
  return updated;
}
