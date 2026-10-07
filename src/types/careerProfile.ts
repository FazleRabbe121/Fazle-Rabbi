/**
 * Career Profile & Matching Types (Requirement 11 & 19)
 */

export interface CareerProfile {
  id?: string;
  userId: string;
  fullName: string;
  email: string;
  phoneNumber?: string;
  currentLocation: string;
  nationality: string;
  workAuthorization: string[];
  targetCountries: string[];
  targetCities?: string[];
  jobTitles: string[];
  skills: string[];
  yearsOfExperience: number;
  countriesOfExperience: string[];
  languages: string[];
  englishLevel: 'Native / Bilingual' | 'Fluent / C2' | 'Advanced / C1' | 'Intermediate / B2' | 'Basic / A2';
  education: string;
  certifications: string[];
  activeCvId?: string;
  activeCvTitle?: string;
  preferredSalaryMin?: number;
  preferredCurrency?: string;
  preferredIndustries: string[];
  updatedAt: string;
}

export const DEFAULT_CAREER_PROFILE: CareerProfile = {
  userId: 'default-user',
  fullName: 'Fazle Rabbi Boyati',
  email: 'FazleRabbe905@gmail.com',
  phoneNumber: '+357 9550 2363',
  currentLocation: 'Limassol, Cyprus',
  nationality: 'Bangladeshi',
  workAuthorization: ['Cyprus Active Work Permit', 'Eligible for International Work Visa'],
  targetCountries: ['United Kingdom', 'Australia', 'New Zealand', 'Cyprus', 'Malta', 'Greece', 'Spain', 'Italy'],
  jobTitles: ['Head Bartender', 'Bartender', 'Mixologist', 'Barista', 'Beverage Specialist'],
  skills: [
    'Classic & Modern Mixology',
    'Cocktail Menu Engineering',
    'Coffee & Specialty Espresso',
    'Customer Hospitality',
    'Inventory & Cost Management',
    'POS & Cash Handling',
    'HACCP & Hygiene Standards',
    'Luxury 5-Star Resort Service',
  ],
  yearsOfExperience: 5,
  countriesOfExperience: ['Cyprus', 'International'],
  languages: ['English (Fluent)', 'Greek (Basic/Conversational)', 'Bengali (Native)'],
  englishLevel: 'Fluent / C2',
  education: 'Diploma in Hospitality Operations',
  certifications: ['WSET Level 2 Award in Spirits', 'Barista Academy Specialist', 'Food Safety Level 3'],
  activeCvTitle: 'Fazle Rabbi — Senior Bartender CV',
  preferredSalaryMin: 1400,
  preferredCurrency: 'EUR',
  preferredIndustries: ['5-Star Luxury Resorts', 'Fine Dining Restaurants', 'High-End Cocktail Lounges', 'Boutique Hotels'],
  updatedAt: new Date().toISOString(),
};
