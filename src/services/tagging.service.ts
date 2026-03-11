import axiosInstance from './api';
import rabbiesJson from '../assets/rabbies.json';

export interface RabbiMention {
  rabbiId: string;
  rabbiName: string;
  startIndex: number;
  endIndex: number;
  text: string;
}

export interface TaggingSubline {
  index: number;
  text: string;
  lineNumber: string;
  categories: string[];
  connections: string[];
  rabbiMentions: RabbiMention[];
}

export interface Rabbi {
  id: string;
  title: string | null;
  sortname: string;
  type: string;
  generation: string | null;
  location: string | null;
  city: string | null;
  displayName: string;
}

export interface UpdateSublineTagsDto {
  categories?: string[];
  connections?: string[];
  rabbiMentions?: RabbiMention[];
}

export const TAGGING_CATEGORIES = [
  { id: 'role_1', label: 'משנה' },
  { id: 'role_2', label: 'היגד' },
  { id: 'role_3', label: 'ראיה' },
  { id: 'role_4', label: 'פירוש' },
  { id: 'role_5', label: 'סיוע' },
  { id: 'role_6', label: 'שאלה' },
  { id: 'role_7', label: 'תשובה' },
  { id: 'role_8', label: 'קושיה' },
  { id: 'role_9', label: 'תירוץ' },
  { id: 'role_10', label: 'פסיקה' },
  { id: 'role_11', label: 'דחייה' },
  { id: 'role_12', label: 'הערה' },
  { id: 'role_13', label: 'הדגמה' },
  { id: 'role_14', label: 'מעשה' },
  { id: 'role_15', label: 'סיכום' },
  { id: 'role_16', label: 'התאמה' },
  { id: 'role_17', label: 'הגהה' },
  { id: 'role_18', label: 'המשך' },
  { id: 'role_28', label: 'שונות' },
];

const rabbiesData = rabbiesJson as unknown as Record<string, {
  title: string | null;
  sortname: string;
  type: string;
  generation: string | null;
  location: string | null;
  city: string | null;
}>;

export const ALL_RABBIES: Rabbi[] = Object.entries(rabbiesData).map(([id, r]) => ({
  id,
  title: r.title,
  sortname: r.sortname,
  type: r.type,
  generation: r.generation,
  location: r.location,
  city: r.city,
  displayName: r.title ? `${r.title} ${r.sortname}` : r.sortname,
}));

// Hebrew title abbreviation expansions
const TITLE_ABBREVIATIONS: [RegExp, string][] = [
  [/^ר׳\s*/g, 'רבי '],
  [/^ר'\s*/g, 'רבי '],
  [/^ר"\s*/g, 'רבי '],
  [/\bר׳\s*/g, 'רבי '],
  [/\bר'\s*/g, 'רבי '],
  [/\bר"\s*/g, 'רבי '],
];

function normalizeHebrew(text: string): string {
  let normalized = text.trim();
  for (const [pattern, replacement] of TITLE_ABBREVIATIONS) {
    normalized = normalized.replace(pattern, replacement);
  }
  // Remove disambiguation brackets like [א] [ב] for comparison
  normalized = normalized.replace(/\s*\[.*?\]\s*/g, ' ');
  // Collapse multiple spaces
  normalized = normalized.replace(/\s+/g, ' ').trim();
  return normalized;
}

// Levenshtein distance for fuzzy matching
function levenshtein(a: string, b: string): number {
  const m = a.length;
  const n = b.length;
  if (m === 0) return n;
  if (n === 0) return m;

  const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + cost);
    }
  }
  return dp[m][n];
}

function scoreRabbi(query: string, rabbi: Rabbi): number {
  const normalizedQuery = normalizeHebrew(query);
  const normalizedDisplay = normalizeHebrew(rabbi.displayName);
  const normalizedSort = normalizeHebrew(rabbi.sortname);

  if (!normalizedQuery) return 0;

  // Exact match on full displayName (after normalization)
  if (normalizedDisplay === normalizedQuery) return 1000;
  if (normalizedSort === normalizedQuery) return 950;

  // displayName starts with query
  if (normalizedDisplay.startsWith(normalizedQuery)) return 900;
  if (normalizedSort.startsWith(normalizedQuery)) return 850;

  // query contains full sortname
  if (normalizedQuery.includes(normalizedSort)) return 800;

  // displayName or sortname contains query as substring
  if (normalizedDisplay.includes(normalizedQuery)) return 700;
  if (normalizedSort.includes(normalizedQuery)) return 650;

  // query is contained in displayName
  if (normalizedDisplay.includes(normalizedQuery) || normalizedQuery.includes(normalizedDisplay)) return 600;

  // Word-level matching: how many query words appear in the rabbi name
  const queryWords = normalizedQuery.split(' ').filter(w => w.length > 0);
  const displayWords = normalizedDisplay.split(' ').filter(w => w.length > 0);
  let wordMatches = 0;
  for (const qw of queryWords) {
    if (displayWords.some(dw => dw.includes(qw) || qw.includes(dw))) {
      wordMatches++;
    }
  }
  if (wordMatches > 0) {
    const wordScore = 300 + (wordMatches / queryWords.length) * 200;
    return wordScore;
  }

  // Levenshtein similarity as fallback: compare to sortname (shorter = better for distance)
  const dist = levenshtein(normalizedQuery, normalizedSort);
  const maxLen = Math.max(normalizedQuery.length, normalizedSort.length);
  if (maxLen === 0) return 0;
  const similarity = 1 - dist / maxLen;
  if (similarity >= 0.5) {
    return similarity * 200;
  }

  return 0;
}

const MAX_RESULTS = 10;

export function findMatchingRabbies(query: string): Rabbi[] {
  if (!query.trim()) return [];
  const scored = ALL_RABBIES
    .map(r => ({ rabbi: r, score: scoreRabbi(query, r) }))
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, MAX_RESULTS);
  return scored.map(item => item.rabbi);
}

export function searchRabbies(query: string): Rabbi[] {
  if (!query.trim()) return [];
  const normalizedQuery = normalizeHebrew(query);
  return ALL_RABBIES
    .filter(r => {
      const nd = normalizeHebrew(r.displayName);
      return nd.includes(normalizedQuery) || normalizedQuery.includes(nd);
    })
    .slice(0, MAX_RESULTS);
}

export const taggingService = {
  getSublines: async (tractate: string, chapter: string, mishna: string): Promise<TaggingSubline[]> => {
    const response = await axiosInstance.get(`/tagging/${tractate}/${chapter}/${mishna}/sublines`);
    return response.data;
  },

  updateSublineTags: async (
    tractate: string,
    chapter: string,
    mishna: string,
    sublineIndex: number,
    dto: UpdateSublineTagsDto,
  ): Promise<void> => {
    await axiosInstance.put(`/tagging/${tractate}/${chapter}/${mishna}/sublines/${sublineIndex}`, dto);
  },
};
