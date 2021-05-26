import React, { useEffect } from "react"
import { useField } from "formik"
import TextEditor from "./TextEditor"


const FieldMainLineEditor = (props) => {
  const { name , changeSublines , tractateSettings} = props;
  const [field, meta, helpers] = useField(name)

  const { value } = meta

  useEffect(()=>{
   // console.log('updated value',value)
    changeE(value);
  },[value]);
  useEffect(()=>{
   // console.log('updated tractateSettings',tractateSettings)
  },[tractateSettings]);

  const getLines = (editorState)=>{
    const blockMap = editorState.getCurrentContent()
    .getBlockMap();

    const sublines = [];
    blockMap.forEach(b=>{
      const lineObj = {
        text:b.getText()
      };
      sublines.push(lineObj)});

    return sublines;

  }
  const changeE = a => {
   //console.log('change editor ',a);

  // changeSublines(getLines(a));
   helpers.setValue(a)
  }

  return (
    <>
      <div style={{}}>
        <TextEditor 
        initialState={value} 
        onChange={changeE} />
      </div>
    </>
  )
}

export default FieldMainLineEditor


