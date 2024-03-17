import React from 'react'
import { isFieldDocument } from './types'
import DocumentField from './DocumentField'


interface Props {
    fieldName: string
    fieldValue: any
}

const ContentField = (props: Props)=>{

    const { fieldName, fieldValue } = props
    console.log('ContentField',fieldName, fieldValue)
    return (
        <>{
            isFieldDocument(fieldValue)? <DocumentField fieldValue={fieldValue}/>:null
        }

        
        {/* <div>{fieldName}</div>
        <div>{JSON.stringify(fieldValue)}</div> */}
        {/* <div>{fieldName}</div>
        <div>{JSON.parse(fieldValue)}</div> */}
      </>
    )
}

export default ContentField

