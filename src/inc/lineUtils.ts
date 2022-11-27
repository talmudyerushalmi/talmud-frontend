import { iLine } from '../types/types';

export const getLineAsText = (line: iLine | null) => {
  if (!(line && line.sublines)) {
    return '';
  }
  const step1 = line.sublines.reduce((carrier, subline) => `${carrier}${subline.text.trim()}\n`, '');
  return step1.trim();
};
