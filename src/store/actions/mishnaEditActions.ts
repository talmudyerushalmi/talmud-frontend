import { action } from "typesafe-actions";
import { routeObject } from "../../routes/AdminRoutes";
import ExcerptService from "../../services/excerpt.service";
import LineService from "../../services/line.service";
import PageService from "../../services/pageService";
import { iExcerpt } from "../../types/types";
import { setCurrentMishna } from "./navigationActions";

export const REQUEST_MISHNA_FOR_EDIT = "GET_MISHNA_FOR_EDIT"
export const REQUEST_MISHNA_FOR_EDIT_DONE = "REQUEST_MISHNA_FOR_EDIT_DONE"
export const SAVE_EXCERPT_START = "SAVE_EXCERPT_START";
export const SAVE_EXCERPT = "SAVE_EXCERPT";
export const SAVE_EXCERPT_DONE = "SAVE_EXCERPT_DONE";
export const OPEN_EXCERPT_DIALOG = "OPEN_EXCERPT_DIALOG"
export const CLOSE_EXCERPT_DIALOG = "CLOSE_EXCERPT_DIALOG"
export const DELETE_EXCERPT_START = "DELETE_EXCERPT_START"
export const DELETE_EXCERPT_DONE = "DELETE_EXCERPT_DONE"
export const SAVE_NOSACH = "SAVE_NOSACH"
export const SAVE_NOSACH_DONE = "SAVE_NOSACH_DONE"


export const saveExcerpt7 =
  (tractate, chapter, mishna, excerpt) => (dispatch, getState) => {
    dispatch({
      type: SAVE_EXCERPT,
      tractate,
      chapter,
      mishna,
      excerpt,
    });
  };

export const requestMishnaForEdit = action(REQUEST_MISHNA_FOR_EDIT);
export const requestMishnaForEditDone = (mishnaDoc) => action(REQUEST_MISHNA_FOR_EDIT_DONE, { mishnaDoc } );
export const openExcerptDialog = (excerpt: iExcerpt) => action(OPEN_EXCERPT_DIALOG, { excerpt });  
export const closeExcerptDialog = action(CLOSE_EXCERPT_DIALOG);  
export const saveExcerpt = (tractate, chapter, mishna, excerpt) => {
  return async function (dispatch, getState) {
    dispatch({type: SAVE_EXCERPT_START});
    const mishnaDoc = await ExcerptService.saveExcerpt(
      tractate,
      chapter,
      mishna,
      excerpt
    );
    console.log("saved is ", mishnaDoc);

    dispatch(setCurrentMishna(mishnaDoc));
    dispatch({
      type: SAVE_EXCERPT,
      mishnaDoc,
    });
  };
};
export const deleteExcerpt = (tractate, chapter, mishna, excerptId: number) => {
  return async function (dispatch) {
    dispatch({type: DELETE_EXCERPT_START})
    const mishnaDoc = await ExcerptService.deleteExcerpt(tractate, chapter, mishna, excerptId);
    dispatch(setCurrentMishna(mishnaDoc));
    dispatch({type: DELETE_EXCERPT_DONE, mishnaDoc: {...mishnaDoc}})
  }
}

export const getMishnaForEdit = (tractate, chapter, mishna) => {
  return async function (dispatch) {
    dispatch({type:REQUEST_MISHNA_FOR_EDIT});
    const payload = await PageService.getMishnaEdit(tractate, chapter, mishna);
    console.log(payload)
    dispatch({type:REQUEST_MISHNA_FOR_EDIT_DONE, payload})

  }

}

export const saveNosach = (route: routeObject, nosach: string[]) => {
  return async function (dispatch, getState) {
    dispatch({type: SAVE_NOSACH});
    const mishnaDoc = await LineService.saveNosach(
      route.tractate,
      route.chapter,
      route.mishna,
      route.line,
      nosach
    );

    dispatch(setCurrentMishna(mishnaDoc));
    // dispatch({
    //   type: SAVE_EXCERPT,
    //   mishnaDoc,
    // });
  };
};