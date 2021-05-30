import React, { useEffect, useState } from "react"
import { Editor } from "draft-js"
import "../text.css"


const TextEditor = (props) => {
  const { onChange, initialState } = props;
  const [ editorState, setEditorState] = useState(initialState);

  
  

  // needed to update the state when the prop changes
  useEffect(() => {
    setEditorState(initialState);
  }, [initialState]); // add 'value' to the dependency list to recalculate state when value changes.



  const _onChange = (editorState)=>{
    onChange(editorState)
    setEditorState(editorState);
  }




  return (
    <div  className="RichEditor-root">
      <Editor
        editorState={editorState}
        onChange={editorState => _onChange(editorState)}
        preserveSelectionOnBlur={true}
        textAlignment='right'
      />
    </div>
  )
}

export default TextEditor







const styles = {
  root: {
    fontFamily: '\'Georgia\', serif',
    fontSize: 14,
    padding: 20,
    width: 600,
  },
  editor: {
    borderTop: '1px solid #ddd',
    cursor: 'text',
    fontSize: 16,
    marginTop: 20,
    minHeight: 400,
    paddingTop: 20,
  },
  controls: {
    fontFamily: '\'Helvetica\', sans-serif',
    fontSize: 14,
    marginBottom: 10,
    userSelect: 'none',
  },
  styleButton: {
    color: '#999',
    cursor: 'pointer',
    marginRight: 16,
    padding: '2px 0',
  },
};