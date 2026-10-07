/**
 * Central Country Database & Configuration Service
 * Supports:
 * - United Kingdom (England, Scotland, Wales, Northern Ireland)
 * - Australia
 * - New Zealand
 * - Malta & Greece
 * - ALL 27 European Union (EU) Member States
 * - ALL 29 Schengen Area Member States
 * - Regional classifications & active status
 */

export interface CountryConfig {
  id: string;
  countryName: string;
  isoCode: string; // 2-letter uppercase ISO code
  euMember: boolean;
  schengenMember: boolean;
  region: 'Western Europe' | 'Southern Europe' | 'Northern Europe' | 'Eastern Europe' | 'Oceania' | 'British Isles';
  subdivisions?: string[];
  active: boolean;
  currency: string;
  currencySymbol: string;
  flag: string;
  popularCities: string[];
}

export const CENTRAL_COUNTRY_DATABASE: CountryConfig[] = [
  // United Kingdom
  {
    id: 'uk',
    countryName: 'United Kingdom',
    isoCode: 'GB',
    euMember: false,
    schengenMember: false,
    region: 'British Isles',
    subdivisions: ['England', 'Scotland', 'Wales', 'Northern Ireland'],
    active: true,
    currency: 'GBP',
    currencySymbol: '£',
    flag: '🇬🇧',
    popularCities: ['London', 'Manchester', 'Edinburgh', 'Birmingham', 'Glasgow', 'Belfast', 'Cardiff', 'Bristol'],
  },
  // Australia
  {
    id: 'australia',
    countryName: 'Australia',
    isoCode: 'AU',
    euMember: false,
    schengenMember: false,
    region: 'Oceania',
    subdivisions: ['New South Wales', 'Victoria', 'Queensland', 'Western Australia', 'South Australia', 'Tasmania'],
    active: true,
    currency: 'AUD',
    currencySymbol: 'A$',
    flag: '🇦🇺',
    popularCities: ['Sydney', 'Melbourne', 'Brisbane', 'Perth', 'Adelaide', 'Gold Coast'],
  },
  // New Zealand
  {
    id: 'new_zealand',
    countryName: 'New Zealand',
    isoCode: 'NZ',
    euMember: false,
    schengenMember: false,
    region: 'Oceania',
    active: true,
    currency: 'NZD',
    currencySymbol: 'NZ$',
    flag: '🇳🇿',
    popularCities: ['Auckland', 'Wellington', 'Christchurch', 'Queenstown', 'Hamilton'],
  },
  // Malta (EU + Schengen)
  {
    id: 'malta',
    countryName: 'Malta',
    isoCode: 'MT',
    euMember: true,
    schengenMember: true,
    region: 'Southern Europe',
    active: true,
    currency: 'EUR',
    currencySymbol: '€',
    flag: '🇲🇹',
    popularCities: ['Valletta', "St. Julian's", 'Sliema', 'Bugibba', 'Mellieha', 'Gozo'],
  },
  // Greece (EU + Schengen)
  {
    id: 'greece',
    countryName: 'Greece',
    isoCode: 'GR',
    euMember: true,
    schengenMember: true,
    region: 'Southern Europe',
    active: true,
    currency: 'EUR',
    currencySymbol: '€',
    flag: '🇬🇷',
    popularCities: ['Athens', 'Thessaloniki', 'Santorini', 'Mykonos', 'Crete', 'Rhodes', 'Corfu'],
  },
  // Cyprus (EU member, Schengen candidate)
  {
    id: 'cyprus',
    countryName: 'Cyprus',
    isoCode: 'CY',
    euMember: true,
    schengenMember: false,
    region: 'Southern Europe',
    active: true,
    currency: 'EUR',
    currencySymbol: '€',
    flag: '🇨🇾',
    popularCities: ['Limassol Marina', 'Paphos', 'Ayia Napa', 'Protaras', 'Larnaca', 'Nicosia', 'Polis Chrysochous'],
  },
  // Ireland (EU member)
  {
    id: 'ireland',
    countryName: 'Ireland',
    isoCode: 'IE',
    euMember: true,
    schengenMember: false,
    region: 'British Isles',
    active: true,
    currency: 'EUR',
    currencySymbol: '€',
    flag: '🇮🇪',
    popularCities: ['Dublin', 'Cork', 'Galway', 'Limerick', 'Kilkenny'],
  },
  // Germany (EU + Schengen)
  {
    id: 'germany',
    countryName: 'Germany',
    isoCode: 'DE',
    euMember: true,
    schengenMember: true,
    region: 'Western Europe',
    active: true,
    currency: 'EUR',
    currencySymbol: '€',
    flag: '🇩🇪',
    popularCities: ['Berlin', 'Munich', 'Frankfurt', 'Hamburg', 'Cologne', 'Düsseldorf'],
  },
  // France (EU + Schengen)
  {
    id: 'france',
    countryName: 'France',
    isoCode: 'FR',
    euMember: true,
    schengenMember: true,
    region: 'Western Europe',
    active: true,
    currency: 'EUR',
    currencySymbol: '€',
    flag: '🇫🇷',
    popularCities: ['Paris', 'Nice', 'Cannes', 'Lyon', 'Marseille', 'Bordeaux'],
  },
  // Italy (EU + Schengen)
  {
    id: 'italy',
    countryName: 'Italy',
    isoCode: 'IT',
    euMember: true,
    schengenMember: true,
    region: 'Southern Europe',
    active: true,
    currency: 'EUR',
    currencySymbol: '€',
    flag: '🇮🇹',
    popularCities: ['Rome', 'Milan', 'Venice', 'Florence', 'Amalfi Coast', 'Naples'],
  },
  // Spain (EU + Schengen)
  {
    id: 'spain',
    countryName: 'Spain',
    isoCode: 'ES',
    euMember: true,
    schengenMember: true,
    region: 'Southern Europe',
    active: true,
    currency: 'EUR',
    currencySymbol: '€',
    flag: '🇪🇸',
    popularCities: ['Barcelona', 'Madrid', 'Ibiza', 'Mallorca', 'Valencia', 'Seville', 'Marbella'],
  },
  // Portugal (EU + Schengen)
  {
    id: 'portugal',
    countryName: 'Portugal',
    isoCode: 'PT',
    euMember: true,
    schengenMember: true,
    region: 'Southern Europe',
    active: true,
    currency: 'EUR',
    currencySymbol: '€',
    flag: '🇵🇹',
    popularCities: ['Lisbon', 'Porto', 'Algarve', 'Faro', 'Funchal (Madeira)'],
  },
  // Netherlands (EU + Schengen)
  {
    id: 'netherlands',
    countryName: 'Netherlands',
    isoCode: 'NL',
    euMember: true,
    schengenMember: true,
    region: 'Western Europe',
    active: true,
    currency: 'EUR',
    currencySymbol: '€',
    flag: '🇳🇱',
    popularCities: ['Amsterdam', 'Rotterdam', 'The Hague', 'Utrecht'],
  },
  // Belgium (EU + Schengen)
  {
    id: 'belgium',
    countryName: 'Belgium',
    isoCode: 'BE',
    euMember: true,
    schengenMember: true,
    region: 'Western Europe',
    active: true,
    currency: 'EUR',
    currencySymbol: '€',
    flag: '🇧🇪',
    popularCities: ['Brussels', 'Antwerp', 'Ghent', 'Bruges'],
  },
  // Austria (EU + Schengen)
  {
    id: 'austria',
    countryName: 'Austria',
    isoCode: 'AT',
    euMember: true,
    schengenMember: true,
    region: 'Western Europe',
    active: true,
    currency: 'EUR',
    currencySymbol: '€',
    flag: '🇦🇹',
    popularCities: ['Vienna', 'Salzburg', 'Innsbruck', 'Graz', 'Kitzbühel'],
  },
  // Switzerland (Schengen, non-EU)
  {
    id: 'switzerland',
    countryName: 'Switzerland',
    isoCode: 'CH',
    euMember: false,
    schengenMember: true,
    region: 'Western Europe',
    active: true,
    currency: 'CHF',
    currencySymbol: 'CHF',
    flag: '🇨🇭',
    popularCities: ['Zurich', 'Geneva', 'Basel', 'Lucerne', 'St. Moritz', 'Zermatt'],
  },
  // Croatia (EU + Schengen)
  {
    id: 'croatia',
    countryName: 'Croatia',
    isoCode: 'HR',
    euMember: true,
    schengenMember: true,
    region: 'Southern Europe',
    active: true,
    currency: 'EUR',
    currencySymbol: '€',
    flag: '🇭🇷',
    popularCities: ['Dubrovnik', 'Split', 'Zagreb', 'Hvar', 'Zadar', 'Rovinj'],
  },
  // Denmark (EU + Schengen)
  {
    id: 'denmark',
    countryName: 'Denmark',
    isoCode: 'DK',
    euMember: true,
    schengenMember: true,
    region: 'Northern Europe',
    active: true,
    currency: 'DKK',
    currencySymbol: 'kr',
    flag: '🇩🇰',
    popularCities: ['Copenhagen', 'Aarhus', 'Odense'],
  },
  // Sweden (EU + Schengen)
  {
    id: 'sweden',
    countryName: 'Sweden',
    isoCode: 'SE',
    euMember: true,
    schengenMember: true,
    region: 'Northern Europe',
    active: true,
    currency: 'SEK',
    currencySymbol: 'kr',
    flag: '🇸🇪',
    popularCities: ['Stockholm', 'Gothenburg', 'Malmö'],
  },
  // Norway (Schengen, non-EU)
  {
    id: 'norway',
    countryName: 'Norway',
    isoCode: 'NO',
    euMember: false,
    schengenMember: true,
    region: 'Northern Europe',
    active: true,
    currency: 'NOK',
    currencySymbol: 'kr',
    flag: '🇳🇴',
    popularCities: ['Oslo', 'Bergen', 'Trondheim', 'Tromsø'],
  },
  // Finland (EU + Schengen)
  {
    id: 'finland',
    countryName: 'Finland',
    isoCode: 'FI',
    euMember: true,
    schengenMember: true,
    region: 'Northern Europe',
    active: true,
    currency: 'EUR',
    currencySymbol: '€',
    flag: '🇫🇮',
    popularCities: ['Helsinki', 'Tampere', 'Turku'],
  },
  // Poland (EU + Schengen)
  {
    id: 'poland',
    countryName: 'Poland',
    isoCode: 'PL',
    euMember: true,
    schengenMember: true,
    region: 'Eastern Europe',
    active: true,
    currency: 'PLN',
    currencySymbol: 'zł',
    flag: '🇵🇱',
    popularCities: ['Warsaw', 'Kraków', 'Wrocław', 'Gdańsk'],
  },
  // Czech Republic (EU + Schengen)
  {
    id: 'czechia',
    countryName: 'Czech Republic',
    isoCode: 'CZ',
    euMember: true,
    schengenMember: true,
    region: 'Eastern Europe',
    active: true,
    currency: 'CZK',
    currencySymbol: 'Kč',
    flag: '🇨🇿',
    popularCities: ['Prague', 'Brno', 'Ostrava', 'Český Krumlov'],
  },
  // Hungary (EU + Schengen)
  {
    id: 'hungary',
    countryName: 'Hungary',
    isoCode: 'HU',
    euMember: true,
    schengenMember: true,
    region: 'Eastern Europe',
    active: true,
    currency: 'HUF',
    currencySymbol: 'Ft',
    flag: '🇭🇺',
    popularCities: ['Budapest', 'Debrecen', 'Szeged'],
  },
  // Romania (EU + Schengen)
  {
    id: 'romania',
    countryName: 'Romania',
    isoCode: 'RO',
    euMember: true,
    schengenMember: true,
    region: 'Eastern Europe',
    active: true,
    currency: 'RON',
    currencySymbol: 'lei',
    flag: '🇷🇴',
    popularCities: ['Bucharest', 'Cluj-Napoca', 'Brașov', 'Timișoara'],
  },
  // Bulgaria (EU + Schengen)
  {
    id: 'bulgaria',
    countryName: 'Bulgaria',
    isoCode: 'BG',
    euMember: true,
    schengenMember: true,
    region: 'Eastern Europe',
    active: true,
    currency: 'BGN',
    currencySymbol: 'лв',
    flag: '🇧🇬',
    popularCities: ['Sofia', 'Plovdiv', 'Varna', 'Burgas'],
  },
  // Slovakia (EU + Schengen)
  {
    id: 'slovakia',
    countryName: 'Slovakia',
    isoCode: 'SK',
    euMember: true,
    schengenMember: true,
    region: 'Eastern Europe',
    active: true,
    currency: 'EUR',
    currencySymbol: '€',
    flag: '🇸🇰',
    popularCities: ['Bratislava', 'Košice'],
  },
  // Slovenia (EU + Schengen)
  {
    id: 'slovenia',
    countryName: 'Slovenia',
    isoCode: 'SI',
    euMember: true,
    schengenMember: true,
    region: 'Southern Europe',
    active: true,
    currency: 'EUR',
    currencySymbol: '€',
    flag: '🇸🇮',
    popularCities: ['Ljubljana', 'Maribor', 'Bled'],
  },
  // Luxembourg (EU + Schengen)
  {
    id: 'luxembourg',
    countryName: 'Luxembourg',
    isoCode: 'LU',
    euMember: true,
    schengenMember: true,
    region: 'Western Europe',
    active: true,
    currency: 'EUR',
    currencySymbol: '€',
    flag: '🇱🇺',
    popularCities: ['Luxembourg City'],
  },
  // Estonia (EU + Schengen)
  {
    id: 'estonia',
    countryName: 'Estonia',
    isoCode: 'EE',
    euMember: true,
    schengenMember: true,
    region: 'Northern Europe',
    active: true,
    currency: 'EUR',
    currencySymbol: '€',
    flag: '🇪🇪',
    popularCities: ['Tallinn', 'Tartu'],
  },
  // Latvia (EU + Schengen)
  {
    id: 'latvia',
    countryName: 'Latvia',
    isoCode: 'LV',
    euMember: true,
    schengenMember: true,
    region: 'Northern Europe',
    active: true,
    currency: 'EUR',
    currencySymbol: '€',
    flag: '🇱🇻',
    popularCities: ['Riga', 'Jūrmala'],
  },
  // Lithuania (EU + Schengen)
  {
    id: 'lithuania',
    countryName: 'Lithuania',
    isoCode: 'LT',
    euMember: true,
    schengenMember: true,
    region: 'Northern Europe',
    active: true,
    currency: 'EUR',
    currencySymbol: '€',
    flag: '🇱🇹',
    popularCities: ['Vilnius', 'Kaunas', 'Klaipėda'],
  },
  // Iceland (Schengen, non-EU)
  {
    id: 'iceland',
    countryName: 'Iceland',
    isoCode: 'IS',
    euMember: false,
    schengenMember: true,
    region: 'Northern Europe',
    active: true,
    currency: 'ISK',
    currencySymbol: 'kr',
    flag: '🇮🇸',
    popularCities: ['Reykjavik', 'Akureyri'],
  },
];

// ----------------------------------------------------
// Filter & Retrieval Helpers
// ----------------------------------------------------

export function getAllCountries(): CountryConfig[] {
  return CENTRAL_COUNTRY_DATABASE.filter(c => c.active);
}

export function getEUCountries(): CountryConfig[] {
  return CENTRAL_COUNTRY_DATABASE.filter(c => c.active && c.euMember);
}

export function getSchengenCountries(): CountryConfig[] {
  return CENTRAL_COUNTRY_DATABASE.filter(c => c.active && c.schengenMember);
}

export function getCountryById(id: string): CountryConfig | undefined {
  const norm = (id || '').toLowerCase().trim();
  return CENTRAL_COUNTRY_DATABASE.find(c => c.id === norm || c.isoCode.toLowerCase() === norm);
}

export function getCountryByName(name: string): CountryConfig | undefined {
  if (!name) return undefined;
  const norm = name.toLowerCase().trim();
  return CENTRAL_COUNTRY_DATABASE.find(
    c =>
      c.countryName.toLowerCase() === norm ||
      c.isoCode.toLowerCase() === norm ||
      c.subdivisions?.some(sub => sub.toLowerCase() === norm)
  );
}

export type QuickCountryFilterKey =
  | 'all'
  | 'visa_sponsorship'
  | 'eu'
  | 'schengen'
  | 'uk'
  | 'australia'
  | 'new_zealand'
  | 'malta'
  | 'greece';

export interface QuickFilterOption {
  key: QuickCountryFilterKey;
  label: string;
  badge?: string;
  icon?: string;
}

export const QUICK_COUNTRY_FILTERS: QuickFilterOption[] = [
  { key: 'all', label: 'All Countries', icon: '🌍' },
  { key: 'visa_sponsorship', label: 'Visa Sponsorship Only', badge: 'High Priority', icon: '🛂' },
  { key: 'eu', label: 'EU Countries', badge: '27 States', icon: '🇪🇺' },
  { key: 'schengen', label: 'Schengen Countries', badge: '29 States', icon: '🛂' },
  { key: 'uk', label: 'United Kingdom', badge: 'UK + NI', icon: '🇬🇧' },
  { key: 'australia', label: 'Australia', badge: 'AU', icon: '🇦🇺' },
  { key: 'new_zealand', label: 'New Zealand', badge: 'NZ', icon: '🇳🇿' },
  { key: 'malta', label: 'Malta', badge: 'EU+Schengen', icon: '🇲🇹' },
  { key: 'greece', label: 'Greece', badge: 'EU+Schengen', icon: '🇬🇷' },
];
