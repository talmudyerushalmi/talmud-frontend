export function cleanCharacters(str: string): string {
  const regex = /[.+:!{},?<>[\]]/g;
  return str.replace(regex, '');
}

export function getOffsetOfWordOccurence(text: string, word: string, occurence = 1): number {
  if (occurence === 1) {
    return text.indexOf(word);
  } else {
    const offset = text.indexOf(word) + word.length;
    const sub = text.substr(offset);
    console.log('look in ', sub);
    return getOffsetOfWordOccurence(sub, word, occurence - 1) + offset;
  }
}

export function getWordOccurence(inText: string, offset: number, word: string): [number, number] {
  const textUntilOffset = inText.substring(0, offset);
  const regex = new RegExp(word, 'g');
  const foundUntilOffset = textUntilOffset.match(regex);
  const foundInText = inText.match(regex);
  const occurences = foundInText ? foundInText.length : 0;
  const occurence = foundUntilOffset ? foundUntilOffset.length + 1 : 1;
  return [occurence, occurences];
}

// export function getWordOccurence(word: string, text: string):number {
//   console.log('getWordOccurence',word)

// const regex = new RegExp(word, 'g');
// const found = text.match(regex);
// console.log('found',found)
// return -1;
// }

export const getFirstAndLastWordOfString = (text: string) =>{
  const words = text.split(' ');
  const firstWord = words[0];
  const lastWord = words.at(-1);
  if (lastWord === ''){
    return [firstWord, words.at(-2)];
  }
  return [firstWord, lastWord];
}
