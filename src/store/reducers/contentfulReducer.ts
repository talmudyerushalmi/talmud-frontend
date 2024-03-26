import { GET_ALL_CONTENT_FOR_LOCALE } from '../actions/contentfulActions';

interface ContentfulState {
  items: {
    [lang: string]: any[];
  };
  includes: {
    [lang: string]: any[];
  };
}
const initialState: ContentfulState = {
  items: {},
  includes: {},
};

function mapItems(data: any) {
  const o = {};
  data.items?.forEach((i) => {
    const id = i.sys.id;
    o[id] = i;
  });
  return o;
}

function mapAssets(data: any) {
  const o = {};
  data.includes.Asset.forEach((i) => {
    const id = i.sys.id;
    o[id] = i;
  });

  return o;
}

const contentfulReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_ALL_CONTENT_FOR_LOCALE:
      const payload = action.payload;
      return {
        ...state,
        items: { ...state.items, ['he-IL']: mapItems(payload['he-IL']), ['en-US']: mapItems(payload['en-US']) },
        includes: { ...state.includes, ['he-IL']: mapAssets(payload['he-IL']), ['en-US']: mapAssets(payload['en-US']) },
      };
    default:
      return state;
  }
};
export default contentfulReducer;
