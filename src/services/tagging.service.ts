import axiosInstance from './api';
import rabbiesJson from '../assets/rabbies2.json';

// ─── Data model interfaces ───

export interface CategoryConnection {
  type: 'subline' | 'external';
  sublineIndex?: number;
  text?: string;
}

export interface SublineCategory {
  categoryId: string;
  connections: CategoryConnection[];
}

export interface RabbiMention {
  rabbiId: string;
  rabbiName: string;
  startIndex: number;
  endIndex: number;
  text: string;
  doubt?: boolean;
}

export interface SublineComment {
  text: string;
  author: string;
  timestamp: string;
}

export interface TaggingSubline {
  index: number;
  text: string;
  lineNumber: string;
  categories: SublineCategory[];
  rabbiMentions: RabbiMention[];
  comments: SublineComment[];
}

export interface Rabbi {
  id: string;
  title: string | null;
  sortname: string;
  fullname: string | null;
  type: string;
  generation: string | null;
  location: string | null;
  city: string | null;
  displayName: string;
  fullnameVariants: string[];
}

export interface UpdateSublineTagsDto {
  categories?: SublineCategory[];
  rabbiMentions?: RabbiMention[];
  comments?: SublineComment[];
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

// ─── Rabbies data ───

const rabbiesData = rabbiesJson as unknown as Record<string, {
  title: string | null;
  sortname: string;
  fullname: string | null;
  type: string;
  generation: string | null;
  location: string | null;
  city: string | null;
}>;

function parseFullnameVariants(fullname: string | null): string[] {
  if (!fullname) return [];
  return fullname.split('/').map(s => s.trim()).filter(s => s.length > 0);
}

export const ALL_RABBIES: Rabbi[] = Object.entries(rabbiesData).map(([id, r]) => ({
  id,
  title: r.title,
  sortname: r.sortname,
  fullname: r.fullname,
  type: r.type,
  generation: r.generation,
  location: r.location,
  city: r.city,
  displayName: r.title ? `${r.title} ${r.sortname}` : r.sortname,
  fullnameVariants: parseFullnameVariants(r.fullname),
}));

// ─── Hebrew-aware matching ───

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
  normalized = normalized.replace(/\s*\[.*?\]\s*/g, ' ');
  normalized = normalized.replace(/\s+/g, ' ').trim();
  return normalized;
}

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
  if (!normalizedQuery) return 0;

  const normalizedDisplay = normalizeHebrew(rabbi.displayName);
  const normalizedSort = normalizeHebrew(rabbi.sortname);
  const normalizedVariants = rabbi.fullnameVariants.map(normalizeHebrew);

  let bestScore = 0;

  const candidates = [normalizedDisplay, normalizedSort, ...normalizedVariants];

  for (const candidate of candidates) {
    let score = 0;

    if (candidate === normalizedQuery) {
      score = 1000;
    } else if (candidate.startsWith(normalizedQuery)) {
      score = 900;
    } else if (normalizedQuery.includes(candidate) && candidate.length > 1) {
      score = 800;
    } else if (candidate.includes(normalizedQuery)) {
      score = 700;
    } else {
      const queryWords = normalizedQuery.split(' ').filter(w => w.length > 0);
      const candidateWords = candidate.split(' ').filter(w => w.length > 0);
      let wordMatches = 0;
      for (const qw of queryWords) {
        if (candidateWords.some(cw => cw.includes(qw) || qw.includes(cw))) {
          wordMatches++;
        }
      }
      if (wordMatches > 0) {
        score = 300 + (wordMatches / queryWords.length) * 200;
      }
    }

    bestScore = Math.max(bestScore, score);
  }

  if (bestScore === 0) {
    const dist = levenshtein(normalizedQuery, normalizedSort);
    const maxLen = Math.max(normalizedQuery.length, normalizedSort.length);
    if (maxLen > 0) {
      const similarity = 1 - dist / maxLen;
      if (similarity >= 0.5) {
        bestScore = similarity * 200;
      }
    }

    for (const variant of normalizedVariants) {
      const vDist = levenshtein(normalizedQuery, variant);
      const vMax = Math.max(normalizedQuery.length, variant.length);
      if (vMax > 0) {
        const vSim = 1 - vDist / vMax;
        if (vSim >= 0.5) {
          bestScore = Math.max(bestScore, vSim * 200);
        }
      }
    }
  }

  return bestScore;
}

export function findMatchingRabbies(query: string, limit: number = 10): Rabbi[] {
  if (!query.trim()) return [];
  const scored = ALL_RABBIES
    .map(r => ({ rabbi: r, score: scoreRabbi(query, r) }))
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score);
  if (limit <= 0) return scored.map(item => item.rabbi);
  return scored.slice(0, limit).map(item => item.rabbi);
}

export function searchRabbies(query: string, limit: number = 10): Rabbi[] {
  if (!query.trim()) return [];
  const scored = ALL_RABBIES
    .map(r => ({ rabbi: r, score: scoreRabbi(query, r) }))
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score);
  if (limit <= 0) return scored.map(item => item.rabbi);
  return scored.slice(0, limit).map(item => item.rabbi);
}

// ─── API service ───

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
