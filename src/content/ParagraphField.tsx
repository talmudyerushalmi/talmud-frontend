import React from 'react'
import { ContentDocument, ContentParagraphField, isFieldDocument, isFieldParagraph, isFieldText } from './types'


interface Props {
    fieldValue: ContentParagraphField
}

const ParagraphField = (props: Props)=>{

    const { fieldValue } = props
    console.log('ContentField', fieldValue)
    return (
        <>

{/* { fieldValue.content.map(f => {
    isFieldText(f) ? " text": null;
})} */}
        DocField
        {/* <div>{fieldName}</div>
        <div>{JSON.stringify(fieldValue)}</div> */}
        {/* <div>{fieldName}</div>
        <div>{JSON.parse(fieldValue)}</div> */}
      </>
    )
}

export default ParagraphField

