import { excerptInSubline } from '../../inc/excerptUtils';
import { RichTextsMishnas } from '../../services/pageService';
import { iMishna, iSubline } from '../../types/types';
import {
  FILTER_EXCERPTS_BY_LINES,
  REQUEST_START,
  SELECT_EXCERPT,
  SELECT_SUBLINES,
  SET_EXCERPT_POPUP,
  TOGGLE_DIVIDE_TO_LINES,
  TOGGLE_SHOW_SOURCES,
  TOGGLE_SHOW_PUNCTUATION,
  TOGGLE_EDIT_TYPE,
  SET_MISHNA_VIEW_OPTIONS,
  ADD_MISHNA_TO_MISHNAIOT,
  CLEAR_MISHNAIOT,
  SET_TAGGING_DATA,
  TOGGLE_TAGGED_RABBI,
  TOGGLE_TAGGED_CATEGORY,
  SET_TAGGED_SUBLINE,
  CLEAR_TAGGED_STATE,
  TOGGLE_TAGGED_DETAILED,
} from '../actions/mishnaViewActions';
import { TaggingSubline } from '../../services/tagging.service';
import { RECEIVE_MISHNA, SET_CURRENT_MISHNA } from '../actions/navigationActions';

export enum ShowEditType {
  ORIGINAL = 'ORIGINAL',
  EDITED = 'EDITED',
  COMBINED = 'COMBINED',
  TAGGED = 'TAGGED',
}
interface ViewState {
  loading: boolean;
  mishnaiot: iMishna[];
  totalMishnaiot: number | null;
  richTextMishnas: RichTextsMishnas[];
  selectedSublines: iSubline[];
  excerpts: any;
  filteredExcerpts: any;
  expanded: boolean;
  showSugiaName: boolean;
  selectedExcerpt: null;
  detailsExcerptPopup: boolean;
  divideToLines: boolean;
  showPunctuation: boolean;
  showSources: boolean;
  showEditType: ShowEditType;
  taggingData: TaggingSubline[];
  selectedRabbis: string[];
  selectedCategories: string[];
  selectedTaggedSubline: number | null;
  taggedDetailedView: boolean;
}

const initialState: ViewState = {
  loading: false,
  mishnaiot: [],
  totalMishnaiot: null,
  richTextMishnas: [],
  selectedSublines: [],
  excerpts: [],
  filteredExcerpts: [],
  expanded: false,
  showSugiaName: true,
  selectedExcerpt: null,
  detailsExcerptPopup: false,
  divideToLines: true,
  showPunctuation: true,
  showSources: true,
  showEditType: ShowEditType.ORIGINAL,
  taggingData: [],
  selectedRabbis: [],
  selectedCategories: [],
  selectedTaggedSubline: null,
  taggedDetailedView: true,
};

const toggleInArray = (arr: string[], id: string): string[] =>
  arr.includes(id) ? arr.filter((x) => x !== id) : [...arr, id];

const mishnaViewReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_CURRENT_MISHNA:
      const excerpts = action.currentMishna?.excerpts?.sort((a, b) => a.selection.fromLine - b.selection.fromLine);
      return {
        ...state,
        excerpts,
        selectedSublines: [],
        filteredExcerpts: action.currentMishna?.excerpts,
      };
    case REQUEST_START:
      return { ...state, loading: true };
    case RECEIVE_MISHNA:
      return { ...state, currentMishna: action.currentMishna, loading: false };
    case SELECT_SUBLINES:
      return {
        ...state,
        selectedSublines: action.selectedSublines,
      };
    case SELECT_EXCERPT:
      return {
        ...state,
        selectedExcerpt: action.excerpt,
        detailsExcerptPopup: action.excerpt !== null,
      };
    case SET_EXCERPT_POPUP:
      return { ...state, detailsExcerptPopup: action.detailsExcerptPopup };
    case TOGGLE_SHOW_PUNCTUATION:
      return { ...state, showPunctuation: !state.showPunctuation };
    case TOGGLE_DIVIDE_TO_LINES:
      const newDivideToLines = !state.divideToLines;
      return {
        ...state,
        divideToLines: newDivideToLines,
        showPunctuation: newDivideToLines ? state.showPunctuation : false,
      };
    case TOGGLE_SHOW_SOURCES:
      return { ...state, showSources: !state.showSources };
    case TOGGLE_EDIT_TYPE:
      return { ...state, showEditType: action.payload.showEditType };
    case FILTER_EXCERPTS_BY_LINES:
      const selectedSublines = action?.selectedSublines;
      const newExcerpts =
        selectedSublines.length > 0
          ? state.excerpts.filter((excerpt) => {
              return selectedSublines!.some((subline) => excerptInSubline(excerpt, subline));
            })
          : state.excerpts;

      return {
        ...state,
        filteredExcerpts: newExcerpts,
        expanded: action.selectedSublineData,
      };
    case SET_MISHNA_VIEW_OPTIONS:
      const options = action.options;
      return { ...state, showSugiaName: options.showSugiaName };
    case CLEAR_MISHNAIOT:
      return {
        ...state,
        totalMishnaiot: null,
        mishnaiot: [],
        richTextMishnas: [],
      };
    case ADD_MISHNA_TO_MISHNAIOT:
      // Don't mutate state - create a new array with the new mishna
      return {
        ...state,
        totalMishnaiot: action.totalMishnaiot,
        mishnaiot: [...state.mishnaiot, action.mishna],
        // Set richTextMishnas only once (it's the same for all mishnaiot in the chapter)
        richTextMishnas: state.richTextMishnas.length === 0 ? action.richTextsMishnas : state.richTextMishnas,
      };
    case SET_TAGGING_DATA:
      return { ...state, taggingData: action.taggingData };
    case TOGGLE_TAGGED_RABBI:
      return {
        ...state,
        selectedRabbis: toggleInArray(state.selectedRabbis, action.rabbiId),
      };
    case TOGGLE_TAGGED_CATEGORY:
      return {
        ...state,
        selectedCategories: toggleInArray(state.selectedCategories, action.categoryId),
      };
    case SET_TAGGED_SUBLINE:
      return { ...state, selectedTaggedSubline: action.sublineIndex };
    case TOGGLE_TAGGED_DETAILED:
      return { ...state, taggedDetailedView: !state.taggedDetailedView };
    case CLEAR_TAGGED_STATE:
      return {
        ...state,
        taggingData: [],
        selectedRabbis: [],
        selectedCategories: [],
        selectedTaggedSubline: null,
        taggedDetailedView: true,
      };
    default:
      return state;
  }
};
export default mishnaViewReducer;
