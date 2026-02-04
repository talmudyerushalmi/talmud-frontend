export enum Direction {
  BACK = 'BACK',
  FORWARD = 'FORWARD',
}

/**
 * Common setters used across navigation hooks
 */
export interface BaseNavigationSetters {
  setTractateName: (value: string) => void;
  setChapterName: (value: string) => void;
  setMishnaName: (value: string) => void;
  setLineNumber: (value: string) => void;
}
