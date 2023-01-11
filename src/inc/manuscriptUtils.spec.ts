import { iManuscript, iManuscriptPopup } from '../types/types';
import { getManuscript } from './manuscriptUtils';

const manuscripts: iManuscript[] = [
  {
    slug: 'leiden',
    pageid: '',
    imageurl: 'https://assets.talmudyerushalmi.com/manuscripts/leiden/I363r.jpg',
    thumbnail: 'https://assets.talmudyerushalmi.com/manuscripts/leiden/I363r_thumbnail.jpg',
    anchorref: '',
    anchorexpanded: null,
    fromLine: 1,
    fromSubline: 1,
    toLine: 9,
    toSubline: 43,
  },
  {
    slug: 'kricha_2',
    pageid: '',
    imageurl: 'https://assets.talmudyerushalmi.com/manuscripts/kricha/k2/ub_munchen_2_cod_ms17_fol_Ir.jpg',
    thumbnail: '',
    anchorref: '',
    anchorexpanded: null,
    fromLine: 152,
    fromSubline: 26,
    toLine: 177,
    toSubline: 2,
  },
  {
    slug: 'kricha_2',
    pageid: '',
    imageurl: 'https://assets.talmudyerushalmi.com/manuscripts/kricha/k2/ub_munchen_2_cod_ms17_fol_Iv.jpg',
    thumbnail: '',
    anchorref: '',
    anchorexpanded: null,
    fromLine: 177,
    fromSubline: 2,
    toLine: 178,
    toSubline: 8,
  },
  {
    slug: 'kricha_2',
    pageid: '',
    imageurl: 'https://assets.talmudyerushalmi.com/manuscripts/kricha/k2/HS-898-Fragmente-002.jpg',
    thumbnail: '',
    anchorref: '',
    anchorexpanded: null,
    fromLine: 255,
    fromSubline: 34,
    toLine: 271,
    toSubline: 55,
  },
  {
    slug: 'kricha_2',
    pageid: '',
    imageurl: 'https://assets.talmudyerushalmi.com/manuscripts/kricha/k2/HS-898-Fragmente-001.jpg',
    thumbnail: '',
    anchorref: '',
    anchorexpanded: null,
    fromLine: 276,
    fromSubline: 69,
    toLine: 294,
    toSubline: 22,
  },
  {
    slug: 'kricha_2',
    pageid: '',
    imageurl: 'https://assets.talmudyerushalmi.com/manuscripts/kricha/k2/HS-407-Fragmente_0003.jpg',
    thumbnail: '',
    anchorref: '',
    anchorexpanded: null,
    fromLine: 299,
    fromSubline: 3,
    toLine: 316,
    toSubline: 71,
  },
  {
    slug: 'kricha_2',
    pageid: '',
    imageurl: 'https://assets.talmudyerushalmi.com/manuscripts/kricha/k2/HS-407-Fragmente_0004.jpg',
    thumbnail: '',
    anchorref: '',
    anchorexpanded: null,
    fromLine: 322,
    fromSubline: 89,
    toLine: 339,
    toSubline: 5,
  },
  {
    slug: 'kricha_2',
    pageid: '',
    imageurl: 'https://assets.talmudyerushalmi.com/manuscripts/kricha/k2/ub_munchen_2_cod_ms17_fol_IIv.jpg',
    thumbnail: '',
    anchorref: '',
    anchorexpanded: null,
    fromLine: 394,
    fromSubline: 5,
    toLine: 417,
    toSubline: 17,
  },
  {
    slug: 'kricha_2',
    pageid: '',
    imageurl: 'https://assets.talmudyerushalmi.com/manuscripts/kricha/k2/ub_munchen_2_cod_ms17_fol_IIr.jpg',
    thumbnail: '',
    anchorref: '',
    anchorexpanded: null,
    fromLine: 417,
    fromSubline: 17,
    toLine: 448,
    toSubline: 23,
  },
  {
    slug: 'kricha_2',
    pageid: '',
    imageurl: 'https://assets.talmudyerushalmi.com/manuscripts/kricha/k2/HS-898-Fragmente-001.jpg',
    thumbnail: '',
    anchorref: '',
    anchorexpanded: null,
    fromLine: 1079,
    fromSubline: 25,
    toLine: 1109,
    toSubline: 12,
  },
  {
    slug: 'kricha_2',
    pageid: '',
    imageurl: 'https://assets.talmudyerushalmi.com/manuscripts/kricha/k2/HS-898-Fragmente-002.jpg',
    thumbnail: '',
    anchorref: '',
    anchorexpanded: null,
    fromLine: 1109,
    fromSubline: 13,
    toLine: 1137,
    toSubline: 15,
  },

  {
    slug: 'leiden',
    pageid: '',
    imageurl: 'https://assets.talmudyerushalmi.com/manuscripts/leiden/I363v.jpg',
    thumbnail: 'https://assets.talmudyerushalmi.com/manuscripts/leiden/I363v_thumbnail.jpg',
    anchorref: '',
    anchorexpanded: null,
    fromLine: 9,
    fromSubline: 43,
    toLine: 27,
    toSubline: 116,
  },
  {
    slug: 'leiden',
    pageid: '',
    imageurl: 'https://assets.talmudyerushalmi.com/manuscripts/leiden/I364r.jpg',
    thumbnail: 'https://assets.talmudyerushalmi.com/manuscripts/leiden/I364r_thumbnail.jpg',
    anchorref: '',
    anchorexpanded: null,
    fromLine: 27,
    fromSubline: 116,
    toLine: 44,
    toSubline: 182,
  },

  {
    slug: 'leiden',
    pageid: '',
    imageurl: 'https://assets.talmudyerushalmi.com/manuscripts/leiden/I364v.jpg',
    thumbnail: 'https://assets.talmudyerushalmi.com/manuscripts/leiden/I364v_thumbnail.jpg',
    anchorref: '',
    anchorexpanded: null,
    fromLine: 44,
    fromSubline: 116,
    toLine: 62,
    toSubline: 242,
  },
  {
    slug: 'leiden',
    pageid: '',
    imageurl: 'https://assets.talmudyerushalmi.com/manuscripts/leiden/I365r.jpg',
    thumbnail: 'https://assets.talmudyerushalmi.com/manuscripts/leiden/I365r_thumbnail.jpg',
    anchorref: '',
    anchorexpanded: null,
    fromLine: 62,
    fromSubline: 242,
    toLine: 81,
    toSubline: 10,
  },
  {
    slug: 'leiden',
    pageid: '',
    imageurl: 'https://assets.talmudyerushalmi.com/manuscripts/leiden/I365v.jpg',
    thumbnail: 'https://assets.talmudyerushalmi.com/manuscripts/leiden/I365v_thumbnail.jpg',
    anchorref: '',
    anchorexpanded: null,
    fromLine: 81,
    fromSubline: 10,
    toLine: 96,
    toSubline: 67,
  },

  {
    slug: 'leiden',
    pageid: '',
    imageurl: 'https://assets.talmudyerushalmi.com/manuscripts/leiden/I366r.jpg',
    thumbnail: 'https://assets.talmudyerushalmi.com/manuscripts/leiden/I366r_thumbnail.jpg',
    anchorref: '',
    anchorexpanded: null,
    fromLine: 96,
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
  line: 27,
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
    expect(getManuscript(manuscripts, sublineData)).toEqual(
      manuscripts.find(
        (manuscript) => manuscript.imageurl === 'https://assets.talmudyerushalmi.com/manuscripts/leiden/I363r.jpg'
      )
    );
    expect(getManuscript(manuscripts, sublineData2)).toEqual(
      manuscripts.find(
        (manuscript) => manuscript.imageurl === 'https://assets.talmudyerushalmi.com/manuscripts/leiden/I365r.jpg'
      )
    );
    expect(getManuscript(manuscripts, sublineDataEqualLine)).toEqual(
      manuscripts.find(
        (manuscript) => manuscript.imageurl === 'https://assets.talmudyerushalmi.com/manuscripts/leiden/I364v.jpg'
      )
    );
    expect(getManuscript(manuscripts, sublineDataEqualLine2)).toEqual(
      manuscripts.find(
        (manuscript) => manuscript.imageurl === 'https://assets.talmudyerushalmi.com/manuscripts/leiden/I363v.jpg'
      )
    );
    expect(getManuscript(manuscripts, sublineDataEqualLine3)).toEqual(
      manuscripts.find(
        (manuscript) => manuscript.imageurl === 'https://assets.talmudyerushalmi.com/manuscripts/leiden/I364r.jpg'
      )
    );
  });
});
