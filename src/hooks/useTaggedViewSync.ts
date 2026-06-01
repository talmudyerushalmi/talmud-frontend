import { useEffect } from 'react';
import { useAppDispatch } from '../app/hooks';
import { fetchTaggingData, clearTaggedState } from '../store/actions/mishnaViewActions';
import { ShowEditType } from '../store/reducers/mishnaViewReducer';

/**
 * Keeps the Redux "tagged view" slice in sync with the page's current mode and route params.
 * - Fetches tagging data when entering TAGGED mode (and on tractate/chapter/mishna/part change).
 * - Clears the slice when leaving TAGGED mode.
 * - Clears the slice on unmount so state doesn't survive navigation away from the page.
 *
 * `part` matters for split halachas: switching mini-halacha tabs must re-fetch so the
 * sidebar reflects the part currently in view (the BE returns part-local sublines).
 */
export function useTaggedViewSync(
  showEditType: ShowEditType,
  tractate: string | undefined,
  chapter: string | undefined,
  mishna: string | undefined,
  part?: number,
) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (showEditType === ShowEditType.TAGGED) {
      if (tractate && chapter && mishna) {
        dispatch(fetchTaggingData(tractate, chapter, mishna, part));
      }
    } else {
      dispatch(clearTaggedState());
    }
  }, [showEditType, tractate, chapter, mishna, part, dispatch]);

  useEffect(() => {
    return () => {
      dispatch(clearTaggedState());
    };
  }, [dispatch]);
}
