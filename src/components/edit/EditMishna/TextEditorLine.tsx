import React, { useEffect, useState } from "react"
import { Editor, DefaultDraftBlockRenderMap, EditorState, ContentState} from "draft-js"
import "../text.css"
import { Map } from "immutable";
import { iLine } from "../../../types/types";
import { NumberedBlock } from "../../editors/EditorBlocks"
import { getSublinesFromContent } from "../../../inc/editorUtils";



const blockRenderMap = Map({
  'unstyled': {
    // element is used during paste or html conversion to auto match your component;
    // it is also retained as part of this.props.children and not stripped out
    element: 'div',
    wrapper: <NumberedBlock />,
  }
});

const extendedBlockRenderMap =  DefaultDraftBlockRenderMap.merge(blockRenderMap);

interface Props {
  line: iLine,
  onChange: (e)=>any
}
const TextEditorLine = (props: Props) => {
  const { line, onChange } = props;
  const [ editorState, setEditorState] = useState(EditorState.createEmpty());

  
  

  // needed to update the state when the prop changes
  useEffect(() => {
    const contentState = ContentState.createFromText(line.mainLine);
    const editorState = EditorState.createWithContent(contentState);
    setEditorState(editorState);
  }, [line]); // add 'value' to the dependency list to recalculate state when value changes.



  const _onChange = (editorState)=>{
    const sublines: string[] = getSublinesFromContent(editorState);
    onChange(sublines)
    setEditorState(editorState);
  }




  return (
    <div  className="RichEditor-root">
      <Editor
       // keyBindingFn={onKey}
        editorState={editorState}
        blockRenderMap={extendedBlockRenderMap}
        onChange={editorState => _onChange(editorState)}
        preserveSelectionOnBlur={true}
        textAlignment='right'
      />
    </div>
  )
}

export default TextEditorLine
