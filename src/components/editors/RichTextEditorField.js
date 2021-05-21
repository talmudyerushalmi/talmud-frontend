import React from "react"
import { useField } from "formik"
import RichTextEditor from "./RichTextEditor"

const RichTextEditorField = ({ label, ...props }) => {
  const [field, meta, helpers] = useField(props)
  const { value } = meta;
  // if (!value || !value.main) {
  //   helpers.setValue( {
  //     main: "",
  //     styled: ""
  //   })
  // }

  //const { text } = value;

  // const [text, setText] = useState("startText");

  const changeE = a => {
   helpers.setValue(a)
  }

  return (
    <>
      <div style={{}}>
        <label>{label}</label>
        <RichTextEditor editorState={value} onChange={changeE} />
      </div>
    </>
  )
}

export default RichTextEditorField
