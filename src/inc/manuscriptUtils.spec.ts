import { iManuscript, iManuscriptPopup } from '../types/types';
import { getImageUrl } from './manuscriptUtils';

const manuscripts: iManuscript[] = [
  {
    slug: 'leiden',
    pageid: '',
    imageurl: 'https://assets.talmudyerushalmi.com/manuscripts/leiden/I363r.jpg',
    thumbnail: 'https://assets.talmudyerushalmi.com/manuscripts/leiden/I363r_thumbnail.jpg',
    anchorref: '',
    anchorexpanded: null,
    fromLine: 0,
    fromSubline: 1,
    toLine: 8,
    toSubline: 43,
  },

  {
    slug: 'leiden',
    pageid: '',
    imageurl: 'https://assets.talmudyerushalmi.com/manuscripts/leiden/I363v.jpg',
    thumbnail: 'https://assets.talmudyerushalmi.com/manuscripts/leiden/I363v_thumbnail.jpg',
    anchorref: '',
    anchorexpanded: null,
    fromLine: 8,
    fromSubline: 43,
    toLine: 26,
    toSubline: 116,
  },
  {
    slug: 'leiden',
    pageid: '',
    imageurl: 'https://assets.talmudyerushalmi.com/manuscripts/leiden/I364r.jpg',
    thumbnail: 'https://assets.talmudyerushalmi.com/manuscripts/leiden/I364r_thumbnail.jpg',
    anchorref: '',
    anchorexpanded: null,
    fromLine: 26,
    fromSubline: 116,
    toLine: 43,
    toSubline: 182,
  },

  {
    slug: 'leiden',
    pageid: '',
    imageurl: 'https://assets.talmudyerushalmi.com/manuscripts/leiden/I364v.jpg',
    thumbnail: 'https://assets.talmudyerushalmi.com/manuscripts/leiden/I364v_thumbnail.jpg',
    anchorref: '',
    anchorexpanded: null,
    fromLine: 43,
    fromSubline: 116,
    toLine: 61,
    toSubline: 242,
  },
  {
    slug: 'leiden',
    pageid: '',
    imageurl: 'https://assets.talmudyerushalmi.com/manuscripts/leiden/I365r.jpg',
    thumbnail: 'https://assets.talmudyerushalmi.com/manuscripts/leiden/I365r_thumbnail.jpg',
    anchorref: '',
    anchorexpanded: null,
    fromLine: 61,
    fromSubline: 242,
    toLine: 80,
    toSubline: 10,
  },
  {
    slug: 'leiden',
    pageid: '',
    imageurl: 'https://assets.talmudyerushalmi.com/manuscripts/leiden/I365v.jpg',
    thumbnail: 'https://assets.talmudyerushalmi.com/manuscripts/leiden/I365v_thumbnail.jpg',
    anchorref: '',
    anchorexpanded: null,
    fromLine: 80,
    fromSubline: 10,
    toLine: 95,
    toSubline: 67,
  },

  {
    slug: 'leiden',
    pageid: '',
    imageurl: 'https://assets.talmudyerushalmi.com/manuscripts/leiden/I366r.jpg',
    thumbnail: 'https://assets.talmudyerushalmi.com/manuscripts/leiden/I366r_thumbnail.jpg',
    anchorref: '',
    anchorexpanded: null,
    fromLine: 95,
    fromSubline: 67,
    toLine: 102,
    toSubline: 97,
  },
];

const sublineData: iManuscriptPopup = {
  line: 1,
  subline: {
    text: "<ב,א> חמש עשרה נשים פוטרות צרותיהן, כול'.",
    index: 1,
    synopsis: [],
    piska: true,
    nosach: {
      blocks: [],
      entityMap: {},
    },
  },
  synopsisCode: 'leiden',
};

const sublineData2: iManuscriptPopup = {
  line: 65,
  subline: {
    text: "<ב,א> חמש עשרה נשים פוטרות צרותיהן, כול'.",
    index: 256,
    synopsis: [],
    piska: true,
    nosach: {
      blocks: [],
      entityMap: {},
    },
  },
  synopsisCode: 'leiden',
};

const sublineDataEqualLine: iManuscriptPopup = {
  line: 61,
  subline: {
    text: "<ב,א> חמש עשרה נשים פוטרות צרותיהן, כול'.",
    index: 242,
    synopsis: [],
    piska: true,
    nosach: {
      blocks: [],
      entityMap: {},
    },
  },
  synopsisCode: 'leiden',
};

const sublineDataEqualLine2: iManuscriptPopup = {
  line: 26,
  subline: {
    text: "<ב,א> חמש עשרה נשים פוטרות צרותיהן, כול'.",
    index: 116,
    synopsis: [],
    piska: true,
    nosach: {
      blocks: [],
      entityMap: {},
    },
  },
  synopsisCode: 'leiden',
};

const sublineDataEqualLine3: iManuscriptPopup = {
  line: 26,
  subline: {
    text: "<ב,א> חמש עשרה נשים פוטרות צרותיהן, כול'.",
    index: 117,
    synopsis: [],
    piska: true,
    nosach: {
      blocks: [],
      entityMap: {},
    },
  },
  synopsisCode: 'leiden',
};

describe('getManuscriptImageUrl', () => {
  it('should return the correct manuscript', () => {
    expect(getImageUrl(manuscripts, sublineData)).toEqual(
      'https://assets.talmudyerushalmi.com/manuscripts/leiden/I363r.jpg'
    );
    expect(getImageUrl(manuscripts, sublineData2)).toEqual(
      'https://assets.talmudyerushalmi.com/manuscripts/leiden/I365r.jpg'
    );
    expect(getImageUrl(manuscripts, sublineDataEqualLine)).toEqual(
      'https://assets.talmudyerushalmi.com/manuscripts/leiden/I364v.jpg'
    );
    expect(getImageUrl(manuscripts, sublineDataEqualLine2)).toEqual(
      'https://assets.talmudyerushalmi.com/manuscripts/leiden/I363v.jpg'
    );
    expect(getImageUrl(manuscripts, sublineDataEqualLine3)).toEqual(
      'https://assets.talmudyerushalmi.com/manuscripts/leiden/I364r.jpg'
    );
  });
});
