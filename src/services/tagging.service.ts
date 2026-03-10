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

export const FIRST_SIX_RABBIES: Rabbi[] = ALL_RABBIES.slice(0, 6);

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
