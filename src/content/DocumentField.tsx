import React from 'react'
import { ContentDocument, isFieldDocument, isFieldParagraph } from './types'
import ParagraphField from './ParagraphField'


interface Props {
    fieldValue: ContentDocument
}

const DocumentField = (props: Props)=>{

    const { fieldValue } = props
    console.log('ContentField', fieldValue)
    return (
        <>

{ fieldValue.content.map(f => {
    isFieldParagraph(f)? <ParagraphField fieldValue={f} /> : null
})}
        DocField
        {/* <div>{fieldName}</div>
        <div>{JSON.stringify(fieldValue)}</div> */}
        {/* <div>{fieldName}</div>
        <div>{JSON.parse(fieldValue)}</div> */}
      </>
    )
}

export default DocumentField

