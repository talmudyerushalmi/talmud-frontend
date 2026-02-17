import { useCallback } from 'react';
import { iTractate } from '../../../types/types';
import { Direction } from './navigationTypes';

interface CrossTractateResult {
  tractate: iTractate | null;
  position: 'first' | 'last' | null;
}

/**
 * Shared hook for cross-tractate navigation logic
 */
export const useCrossTractateNavigation = () => {
  
  /**
   * Find the next or previous tractate to navigate to
   * @param tractateName - Current tractate ID
   * @param allTractates - List of all tractates
   * @param direction - Navigation direction (FORWARD or BACK)
   * @returns Target tractate and position, or null if can't navigate
   */
  const getCrossTractateTarget = useCallback((
    tractateName: string,
    allTractates: iTractate[] | undefined,
    direction: Direction
  ): CrossTractateResult => {
    if (!allTractates || allTractates.length === 0) {
      return { tractate: null, position: null };
    }

    const currentTractateIndex = allTractates.findIndex((t) => t.id === tractateName);

    if (direction === Direction.FORWARD) {
      // Check if we can go to next tractate
      if (currentTractateIndex !== -1 && currentTractateIndex < allTractates.length - 1) {
        const nextTractate = allTractates[currentTractateIndex + 1];
        return { tractate: nextTractate, position: 'first' };
      }
    } else if (direction === Direction.BACK) {
      // Check if we can go to previous tractate
      if (currentTractateIndex > 0) {
        const previousTractate = allTractates[currentTractateIndex - 1];
        return { tractate: previousTractate, position: 'last' };
      }
    }

    // Can't navigate further
    return { tractate: null, position: null };
  }, []);

  /**
   * Generic handler for attempting cross-tractate navigation
   * @param tractateName - Current tractate ID
   * @param allTractates - List of all tractates
   * @param direction - Navigation direction
   * @param onNavigate - Callback that attempts to navigate to a specific position in the target tractate
   * @returns true if navigation succeeded, false otherwise
   */
  const attemptCrossTractateNavigation = useCallback((
    tractateName: string,
    allTractates: iTractate[] | undefined,
    direction: Direction,
    onNavigate: (tractate: iTractate, position: 'first' | 'last') => boolean
  ): boolean => {
    const { tractate: targetTractate, position } = getCrossTractateTarget(tractateName, allTractates, direction);
    
    if (targetTractate && position) {
      return onNavigate(targetTractate, position);
    }
    
    return false;
  }, [getCrossTractateTarget]);

  return { getCrossTractateTarget, attemptCrossTractateNavigation };
};
