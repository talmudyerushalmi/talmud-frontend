import React from 'react';
import { FieldArray, Field } from "formik"
import MyFieldEditor from './MyFieldEditor';

 
const SynopsisDirectSourcesFields = (repeater,repeaterValue)=>{
    return (
      <>
        {
            <MyFieldEditor name={`${repeater}.text`}/>
        }
      </>
    )
  }
  const SynopsisInternalParallelFields = (repeater,repeaterValue)=>{
    return (
      <>
        <Field as="select" name={`${repeater}.tractate`}>
          <option value="kidushin">קידושין</option>
          <option value="berachot">ברכות</option>
        </Field>
        <label for={`${repeater}.line`}>שורה</label>
        <Field id={`${repeater}.line`} name={`${repeater}.line`}>
        </Field>
    

      </>
    )
  }

  const SynopsisExternalFields = (repeater,repeaterValue)=>{
    return (
      <>
       <label for={`${repeater}.details`}>פירוט</label>
           <Field id={`${repeater}.details`} name={`${repeater}.details`}>
               </Field>
       <MyFieldEditor name={`${repeater}.text`}/>
      </>
    )
  }

const switchTypes = (repeaterValue,repeater)=> {

    switch(repeaterValue.type) {
        case 'direct_sources':
             return SynopsisDirectSourcesFields(repeater,repeaterValue)
        case 'internal_parallel':
             return SynopsisInternalParallelFields(repeater,repeaterValue)
        case 'external': return SynopsisExternalFields(repeater, repeaterValue)
    }
}  
const synopsisForm = (index, values,tractateSettings) => {
    const root = `sublines[${index}].synopsis`; 
    const synopsisArray = values.sublines[index].synopsis;
    const alreadyUsedCodes = synopsisArray.map(a => a.button_code);
    return (
      <div>
        <FieldArray
          name={`sublines[${index}].synopsis`}
          render={arrayHelpers => {
            return (
            <div>
              {values.sublines[index].synopsis?.map((_, synopsisRepeater) => {
                const repeaterValue = values.sublines[index].synopsis[synopsisRepeater];
                const repeater = `${root}[${synopsisRepeater}]`;
                return (
                <div style={{direction:'rtl'}} key={synopsisRepeater}>
                  {repeaterValue.name}
                  
                  {switchTypes(repeaterValue, repeater)}
                  <button type="button"
                  onClick={()=>{arrayHelpers.remove(synopsisRepeater)}}
                  >-</button>
                </div>
              )})}
              {sourceButtons(tractateSettings, arrayHelpers,alreadyUsedCodes)}
       
            </div>
          )}
        }
        />
      </div>
    )
  }

  export default synopsisForm;


  const sourceButtons = (tractateSettings,arrayHelpers,alreadyUsedCodes)=>{
    const { synopsisAllowed, synopsisList } = tractateSettings;
    return synopsisAllowed
    .map(button => {
     const source =  synopsisList[button]; 
     if (!source) {return null}
     return (<button
        type="button"
        key={button}
        disabled={alreadyUsedCodes.includes(button)}
              onClick={()=>arrayHelpers.push(
                {...source,
                  text: {
                    main:"",
                    styled:""
                  }
                }
                )}>{source.name}
    </button>)})

  }