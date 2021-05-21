import { createStore, applyMiddleware, combineReducers } from "redux"
import thunk from "redux-thunk"
import mishnaViewReducer from "./reducers/mishnaViewReducer"
import navigationReducer from "./reducers/navigationReducer"

const rootReducer = combineReducers(
  {
    general: navigationReducer,
    mishnaView: mishnaViewReducer
  })

export const initialState = {
  general: {
    compositions: [],
    tractates: [],
    tractateSettings: {},
    selectedTractate: null,
    selectedChapter: null,
    selectedMishna: null,
    selectedLine: null,
    currentMishna: null,

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
    showSources: true
  },
}

const store = createStore(rootReducer, initialState, applyMiddleware(thunk))
export default store
