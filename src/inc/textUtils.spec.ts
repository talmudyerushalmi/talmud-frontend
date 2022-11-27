import { cleanCharacters, getOffsetOfWordOccurence } from './textUtils';

describe('textUtils', () => {
  test('cleanCharacters', () => {
    expect(cleanCharacters('[עליה]')).toBe('עליה');
    expect(cleanCharacters('[<עליה>]')).toBe('עליה');
    expect(cleanCharacters('[עליה??]')).toBe('עליה');
  });

  test('getOffsetOfWordOccurence', () => {
    const text = 'the first word, the second word, the third word';
    expect(getOffsetOfWordOccurence(text, 'word', 1)).toBe(10);
    expect(getOffsetOfWordOccurence(text, 'word', 2)).toBe(27);
  });
});
