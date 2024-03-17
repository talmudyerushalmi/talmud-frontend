import React from 'react'
import { ContentDocument, TextField, isFieldDocument, isFieldParagraph, isFieldText } from './types'


interface Props {
    fieldValue: TextField
}

const TextField = (props: Props)=>{

    const { fieldValue } = props
    return (
        <>


        Textfield
        {/* <div>{fieldName}</div>
        <div>{JSON.stringify(fieldValue)}</div> */}
        {/* <div>{fieldName}</div>
        <div>{JSON.parse(fieldValue)}</div> */}
      </>
    )
}

export default TextField

