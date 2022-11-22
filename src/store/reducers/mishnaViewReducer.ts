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
} from '../actions/mishnaViewActions';
import { RECEIVE_MISHNA, SET_CURRENT_MISHNA } from '../actions/navigationActions';

export enum ShowEditType {
  ORIGINAL = 'ORIGINAL',
  EDITED = 'EDITED',
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
};

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
      };
    case ADD_MISHNA_TO_MISHNAIOT:
      const mishnaiot = state.mishnaiot;
      mishnaiot.push(action.mishna);
      return {
        ...state,
        totalMishnaiot: action.totalMishnaiot,
        mishnaiot: [...mishnaiot],
      };
    default:
      return state;
  }
};
export default mishnaViewReducer;
