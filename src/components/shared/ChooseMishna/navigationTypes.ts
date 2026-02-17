import { useTranslation } from 'react-i18next';

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

/**
 * Core chapter/mishna setters shared by both navigation components
 * Extracted from BaseNavigationSetters to avoid duplication
 */
export type CoreChapterMishnaSetters = Pick<BaseNavigationSetters, 'setChapterName' | 'setMishnaName'>;

/**
 * Common props shared by both navigation components
 */
export interface BaseNavigationComponentProps {
  isHebrew: boolean;
  navButtons: boolean;
  isNavigating: boolean;
  onNavigateBack: () => void;
  onNavigateForward: () => void;
}

/**
 * Custom hook to determine if the current language is Hebrew
 * Centralizes the language check logic used across all navigation components
 */
export const useIsHebrew = (): boolean => {
  const { i18n } = useTranslation();
  return i18n.language === 'he';
};
