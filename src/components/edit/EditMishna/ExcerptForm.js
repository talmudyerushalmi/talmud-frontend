import React, { useState, useEffect } from "react"
import RichEditor from "./RichEditor"
import {
  EditorState,
  convertToRaw,
  convertFromRaw,
  ContentState,
} from "draft-js"
import makeStyles from '@mui/styles/makeStyles';

const useStyles = makeStyles(theme => {
  return {
    root: {
      width: "100%",
      background: "white",
      paddingTop: "1rem",
    },
  }
})

const ExcerptForm = props => {
  const { onAdd, selectedExcerpt } = props
  const classes = useStyles()

  const [checked, setChecked] = React.useState(true)
  const handleChange = event => {
    setChecked(event.target.checked)
  }
  const [editorState, setEditorState] = useState(EditorState.createEmpty())
  useEffect(() => {
    let content = ContentState.createFromText("")
    if (selectedExcerpt) {
      content = convertFromRaw(selectedExcerpt.rawContent)
    }
    let newEditor = EditorState.push(editorState, content)
    setEditorState(newEditor)
  }, [selectedExcerpt])
  const addExcerpt = type => {
    const content = editorState.getCurrentContent()
    const rawText = content
      .getBlocksAsArray()
      .reduce((carrier, b) => `${carrier}\n${b.getText()}`, "")
    const excerpt = {
      type,
      checked,
      rawContent: convertToRaw(content),
      rawText,
    }
    onAdd(excerpt)
    setEditorState(
      EditorState.push(editorState, ContentState.createFromText(""))
    )
  }
  return (
    <div className={classes.root}>
      <div>
        <button
          disabled={!editorState.getCurrentContent().hasText()}
          onClick={() => {
            addExcerpt("MAKBILA")
          }}
        >
          הוסף מקבילה
        </button>
        <button
          disabled={!editorState.getCurrentContent().hasText()}
          onClick={() => {
            addExcerpt("MUVAA")
          }}
        >
          הוסף מובאה
        </button>
      </div>

      <div dir="rtl">

      </div>
      <RichEditor
        editorState={editorState}
        onChange={e => {
          setEditorState(e)
        }}
      ></RichEditor>
    </div>
  )
}

export default ExcerptForm
