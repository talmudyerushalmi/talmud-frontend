import { SET_SYNOPSIS_LIST } from '../actions/synopsisActions';

export interface SynopsisItem {
  type: string;
  code: string;
  name: string;
  button_code: string;
  shortName: string;
  letter?: string;
  manuscript?: string;
}

export interface SynopsisList {
  [key: string]: SynopsisItem;
}

interface SynopsisState {
  synopsisList: SynopsisList | null;
  loaded: boolean;
}

const initialState: SynopsisState = {
  synopsisList: null,
  loaded: false,
};

const synopsisReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_SYNOPSIS_LIST:
      return {
        ...state,
        synopsisList: action.payload,
        loaded: true,
      };
    default:
      return state;
  }
};

export default synopsisReducer;

