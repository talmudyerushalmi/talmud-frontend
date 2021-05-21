import React from "react"
import { useField } from "formik"
import SynopsisTextEditor from "../SynopsisTextEditor"

const SynopsisField = ({ label, ...props }) => {
  const [field, meta, helpers] = useField(props.name)
  const { value } = meta
  const { synopsis } = props;

  console.log('value ',value)
  console.log('synopsis ', synopsis);
  // if (!value || !value.main) {
  //   helpers.setValue( {
  //     main: "",
  //     styled: ""
  //   })
  // }

  //const { main, styled } = value
  //const { text } = value;

  // const [text, setText] = useState("startText");

  const changeE = a => {
   console.log('change editor ',a);
   //helpers.setValue(a.main)
  }

  return (
    <>
      <div style={{direction:'rtl'}}>
        <label><strong>{label}</strong></label>
        {/* <input {...field} {...props}  type="hidden"/> */}
        <SynopsisTextEditor value={""} onChange={(a)=>{console.log(a)}}  />
      </div>
    </>
  )
}

export default SynopsisField
