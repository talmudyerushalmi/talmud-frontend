import React, { useEffect, useState } from "react"
import { Editor, EditorState, Modifier, RichUtils, ContentState, SelectionState , getDefaultKeyBinding, DefaultDraftBlockRenderMap} from "draft-js"
import "../text.css"
import { Map } from "immutable";
import { makeStyles } from "@material-ui/core";

const numberStyle = makeStyles({
  root: {
    position: 'relative',
    marginBottom: '0.4rem',
    '> span': {
      color:'red'

    }
  }
});

const NumberedBlock = (props)=> {
    const classes = numberStyle();
    return props.children.map((block,index) => {
          return (
            <div key={index} className={classes.root}>
             <span style={{userSelect: 'none',
              position:'absolute',
              right:'-1rem',
              background:'yellow'}}>{index}</span> 
            {block}
            </div>
            
          )
        });
    
  
}

const blockRenderMap = Map({
  'unstyled': {
    // element is used during paste or html conversion to auto match your component;
    // it is also retained as part of this.props.children and not stripped out
    element: 'div',
    wrapper: <NumberedBlock />,
  }
});

const extendedBlockRenderMap =  DefaultDraftBlockRenderMap.merge(blockRenderMap);


const TextEditorMishna = (props) => {
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



  // don't allow typing in editor - used just for selection
  const onKey = (k) => {
    const allowed = ['ArrowLeft','ArrowRight','ArrowDown','ArrowUp'];
    if (allowed.indexOf(k.key)!==-1) {
      return getDefaultKeyBinding(k)

    }
    return 'not-handled'

  }

  return (
    <div  className="RichEditor-root">
      <Editor
        keyBindingFn={onKey}
        editorState={editorState}
        blockRenderMap={extendedBlockRenderMap}
        onChange={editorState => _onChange(editorState)}
        preserveSelectionOnBlur={true}
        textAlignment='right'
      />
    </div>
  )
}

export default TextEditorMishna







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