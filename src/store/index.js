import { createStore, applyMiddleware, combineReducers } from "redux";
import thunk from "redux-thunk";
import authReducer from "./reducers/authReducer";
import mishnaViewReducer from "./reducers/mishnaViewReducer";
import navigationReducer from "./reducers/navigationReducer";
import { composeWithDevTools } from "redux-devtools-extension";

const rootReducer = combineReducers({
  general: navigationReducer,
  authentication: authReducer,
  mishnaView: mishnaViewReducer,
});

export const initialState = {
  authentication: {},
  general: {
    compositions: [],
    tractates: [],
    tractateSettings: {},
    selectedTractate: null,
    selectedChapter: null,
    selectedMishna: null,
    selectedLine: null,
    currentTractate: null,
    currentChapter: null,
    currentMishna: null,
    currentLine: null
  },
  mishnaView: {
    loading: false,
    selectedSublineData: {},
    selectedLineIndex: null,
    excerpts: [],
    filteredExcerpts: [],
    expanded: false,
    selectedExcerpt: null,
    detailsExcerptPopup: false,
    divideToLines: true,
    showPunctuation: true,
    showSources: true,
  },
};

const store = createStore(
  rootReducer,
  initialState,
  composeWithDevTools(applyMiddleware(thunk))
);
export default store;
