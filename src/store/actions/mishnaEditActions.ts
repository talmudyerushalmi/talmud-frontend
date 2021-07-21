import { action } from "typesafe-actions"

export const SAVE_EXCERPT = "SAVE_EXCERPT"

export const saveExcerpt = (selectedSublineData, selectedLineIndex) => (dispatch, getState)=> {
dispatch({
    type: SAVE_EXCERPT,
    selectedSublineData,
    selectedLineIndex
  })
} 
