import React from 'react'
import { ContentDocument, ContentTextField, isFieldDocument, isFieldParagraph, isFieldText } from './types'


interface Props {
    fieldValue: ContentTextField
}

const TextField = (props: Props)=>{

    const { fieldValue } = props
    return (
        <>
        {fieldValue.value}
        {/* <div>{fieldName}</div>
        <div>{JSON.stringify(fieldValue)}</div> */}
        {/* <div>{fieldName}</div>
        <div>{JSON.parse(fieldValue)}</div> */}
      </>
    )
}

export default TextField

