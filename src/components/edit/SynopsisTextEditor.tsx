import React, { useEffect, useState } from "react"
import {
  Editor,
  EditorState,
  Modifier,
  RichUtils,
  ContentState,
  convertFromRaw,
  convertToRaw,
} from "draft-js"
import "./text.css"
import { CSSProperties } from "@material-ui/core/styles/withStyles";
import { EditedText, iSource } from "../../types/types";
import { getTextForSynopsis } from "../../inc/synopsisUtils";
//import Editor from 'draft-js-plugins-editor';


const calculateEditorState = (value: EditedText,source: iSource): EditorState => {
  if (value.content) {
    const content = convertFromRaw(value.content)
    return EditorState.createWithContent(content)
  }
  if (value.simpleText) {
    const allowedSourcesForAutoCalculate = ["leiden","dfus_rishon"];
    if (allowedSourcesForAutoCalculate.includes(source?.id)) {
      return EditorState.createWithContent(
        ContentState.createFromText(getTextForSynopsis(value.simpleText))
      )
  }}
  return EditorState.createEmpty();
}

interface Props {
  onChange: Function;
  value: EditedText;
  source: iSource;
}
const SynopsisTextEditor = (props: Props) => {
  const { onChange, value, source } = props

    // return (
    //   <pre>{JSON.stringify(value)}</pre>
    // )
  const [editorState, setEditorState] = useState(calculateEditorState(value,source))


  useEffect(()=>{
    setEditorState(calculateEditorState(value,source))
  },[source,value]);


  const _onChange = editorState => {
    setEditorState(editorState)
  }
  const collectSublineDetails = () => {
    const text = editorState.getCurrentContent().getPlainText()
    //const js = convertToRaw(editorState.getCurrentContent())

    return {
      simpleText: text,
      editor: editorState.toJS(),
      content: convertToRaw(editorState.getCurrentContent()),
    }
  }


  const moveSelectionToEnd = () => {
    setTimeout(() => {
      setEditorState(EditorState.moveFocusToEnd(editorState))
    }, 0)
  }

  const getContent = editorState => {
    var currentContent = editorState.getCurrentContent().getPlainText()
  }
  const boldText = e => {
    // onMouseDown and e.preventDefault because editor losses focus if you use onClick
    e.preventDefault()

    let nextState = RichUtils.toggleInlineStyle(editorState, "BOLD")
    // var selectionState = editorState.getSelection()
    // var anchorKey = selectionState.getAnchorKey()
    // var currentContent = editorState.getCurrentContent()
    // var currentContentBlock = currentContent.getBlockForKey(anchorKey)
    // var start = selectionState.getStartOffset()
    // var end = selectionState.getEndOffset()
    // var selectedText = currentContentBlock.getText().slice(start, end)
    setEditorState(nextState)
  }

  const toggleColor = toggledColor => _toggleColor(toggledColor)

  const _toggleColor = toggledColor => {
    //const {editorState} = this.state;
    const selection = editorState.getSelection()

    // Let's just allow one color at a time. Turn off all active colors.
    const nextContentState = Object.keys(colorStyleMap).reduce(
      (contentState, color) => {
        return Modifier.removeInlineStyle(contentState, selection, color)
      },
      editorState.getCurrentContent()
    )

    let nextEditorState = EditorState.push(
      editorState,
      nextContentState,
      "change-inline-style"
    )

    const currentStyle = editorState.getCurrentInlineStyle()

    // Unset style override for current color.
    if (selection.isCollapsed()) {
      nextEditorState = currentStyle.reduce((state, color) => {
        //@ts-ignore
        return RichUtils.toggleInlineStyle(state, color)
      }, nextEditorState)
    }

    // If the color is being toggled on, apply it.
    if (!currentStyle.has(toggledColor)) {
      nextEditorState = RichUtils.toggleInlineStyle(
        nextEditorState,
        toggledColor
      )
    }

    _onChange(nextEditorState)
  }

  return (
    <div className="RichEditor-root">
      <button type="button" onMouseDown={e => boldText(e)}>
        Bold
      </button>

      <ColorControls editorState={editorState} onToggle={toggleColor} />

      <Editor
        customStyleMap={colorStyleMap}
        editorState={editorState}
        onChange={editorState => _onChange(editorState)}
        onBlur={()=>{
        onChange(collectSublineDetails())
      }}
        //   onFocus={e => moveSelectionToEnd()}
        preserveSelectionOnBlur={true}
        textAlignment="right"
      />
    </div>
  )
}

export default SynopsisTextEditor

const colorStyleMap = {
  red: {
    color: "rgba(255, 0, 0, 1.0)",
  },
  orange: {
    color: "rgba(255, 127, 0, 1.0)",
  },
  yellow: {
    color: "rgba(180, 180, 0, 1.0)",
  },
  green: {
    color: "rgba(0, 180, 0, 1.0)",
  },
  blue: {
    color: "rgba(0, 0, 255, 1.0)",
  },
  indigo: {
    color: "rgba(75, 0, 130, 1.0)",
  },
  violet: {
    color: "rgba(127, 0, 255, 1.0)",
  },
}

var COLORS = [
  { label: "אדום", style: "red" },
  { label: "ירוק", style: "green" },
  { label: "כחול", style: "blue" },
]

const ColorControls = props => {
  var currentStyle = props.editorState.getCurrentInlineStyle()
  return (
    <div style={styles.controls as CSSProperties}>
      {COLORS.map(type => (
        <StyleButton
          key={type.label}
          //@ts-ignore
          active={currentStyle.has(type.style)}
          label={type.label}
          onToggle={props.onToggle}
          style={type.style}
        />
      ))}
    </div>
  )
}

class StyleButton extends React.Component {
  onToggle: (e: any) => void;
  constructor(props) {
    super(props)
    this.onToggle = e => {
      e.preventDefault()
      //@ts-ignore
      this.props.onToggle(this.props.style)
    }
  }

  render() {
    let style
    //@ts-ignore
    if (this.props.active) {
      //@ts-ignore
      style = { ...styles.styleButton, ...colorStyleMap[this.props.style] }
    } else {
      style = styles.styleButton
    }

    return (
      <span style={style} onMouseDown={this.onToggle}>
        {
        //@ts-ignore */
        this.props.label
        }
      </span>
    )
  }
}

const styles = {
  root: {
    fontFamily: "'Georgia', serif",
    fontSize: 14,
    padding: 20,
    width: 600,
  },
  editor: {
    borderTop: "1px solid #ddd",
    cursor: "text",
    fontSize: 16,
    marginTop: 20,
    minHeight: 400,
    paddingTop: 20,
  },
  controls: {
    fontFamily: "'Helvetica', sans-serif",
    fontSize: 14,
    marginBottom: 10,
    userSelect: "none",
  },
  styleButton: {
    color: "#999",
    cursor: "pointer",
    marginRight: 16,
    padding: "2px 0",
  },
}
