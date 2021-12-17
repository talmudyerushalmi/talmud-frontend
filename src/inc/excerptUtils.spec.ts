import { iExcerpt, iSubline } from '../types/types';
import { excerptSelection, getEmptyExcerpt } from './excerptUtils';

describe("excerptUtils", ()=>{

  test("something", ()=>{
    const text1 = 'טקסט כלשהוא שמופיע בתת שורה.';
    const text2 = 'טקסט כלשהוא שמופיע בתת שורה.';
    const text3 = 'טקסט כלשהוא שמופיע בתת שורה.';
    const subline1: iSubline = {
      text: text1,
      nosach: null,
      index: 0,
      synopsis: [],
      offset: 0
    }
    const excerpt: iExcerpt = getEmptyExcerpt();
    excerpt.selection = {
      fromSubline: 0,
      fromOffset: 20,
      toSubline: 2,
      toOffset: 60
    }
    const result1 = excerptSelection(subline1.text, subline1, excerpt);

    const subline2: iSubline = {
      text: text2,
      nosach: null,
      index: 1,
      synopsis: [],
      offset: 28
    }

    expect(result1!.from).toBe(20);
    expect(result1!.to).toBe(28);

    const result2 = excerptSelection(subline1.text, subline2, excerpt);
    expect(result2!.from).toBe(0);
    expect(result2!.to).toBe(28);

    const subline3: iSubline = {
      text: text3,
      nosach: null,
      index: 2,
      synopsis: [],
      offset: 56
    }
    const result3 = excerptSelection(subline1.text, subline3, excerpt);
    expect(result3!.from).toBe(0);
    expect(result3!.to).toBe(4);


  })
})