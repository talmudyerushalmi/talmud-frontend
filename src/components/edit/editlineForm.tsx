import React, { useState } from "react"
import * as Yup from "yup"
import { withFormik, FieldArray, FormikProps } from "formik"
import FieldMainLineEditor from "./MainLineEditor/MainLineEditor"
import { EditorState, ContentState } from "draft-js"
import SourceButtons from "./MainLineEditor/SourceButtons"
import SublineField from "./SublineField"
import LineService from "../../services/line.service"
import { iLine, iMishna, iSource, iSubline, iSynopsis } from "../../types/types"
import SugiaField from "./SugiaField"

interface Props {
  line: iLine | null;
  currentMishna: any;

}
const formikEnhancer = withFormik({
  mapPropsToValues: (props: Props) => {
    const { line } = props
    const textForEditor = line?.sublines
      ? line.sublines
          .map(s => s.text)
          .join("\n")
          .replace(/^\s+|\s+$/g, "") // trim new lines
      : line?.mainLine

      // todo  - sublines init
      // let initSublines = line?.sublines || [];
      // initSublines = initSublines.map(s => {
      //   return {
      //   text: s.text,
      //   synopsis:{}
      //   }
      // });
    return {
      mainLine: EditorState.createWithContent(
        ContentState.createFromText(textForEditor || "")
      ),
      sublines: line?.sublines || [],
      sugiaName: line?.sugiaName? line.sugiaName :  ""
    }
  },
  validationSchema: Yup.object().shape({
    // email: Yup.string().email("That's not an email").required("Required!"),
  }),
  handleSubmit:  (values, formProps) => {
    const { setSubmitting, props } = formProps;
    const {currentMishna, line } = props;
    console.log(props)
    console.log(values)
     LineService.saveLine(
      currentMishna.tractate,
      currentMishna.chapter,
      currentMishna.mishna,
      line?.lineNumber,
      {...values,

      }
      )

    setTimeout(() => {
      // you probably want to transform draftjs state to something else, but I'll leave that to you.
      console.log("submitted ", values)
      // alert(JSON.stringify(values, null, 2));
      setSubmitting(false)
    }, 1000)
  },
  displayName: "MyForm",
  enableReinitialize: true,
})

 // Shape of form values
 interface FormValues {
  sublines: iSubline[]
  email: string;
  password: string;
}

interface OtherProps {
  message: string;
  tractateSettings: any;
  currentMishna: iMishna;
}
interface Props {
  props: FormikProps<FormValues>
}
const EditLineForm = (props: OtherProps & FormikProps<FormValues>) => {
  const {
    values,
    touched,
    dirty,
    errors,
    handleChange,
    handleBlur,
    handleSubmit,
    handleReset,
    setFieldValue,
    isSubmitting,
    tractateSettings,
    currentMishna
  } = props;
  const [sources, setSources] = useState<iSource[]>([])
  const changeSublines = e => {
    //console.log("change sub", e)
    // check value of field
    //console.log("values", values.mainLine)
   // console.log("values sublines", values.sublines)
   // todo - return set value later
  // setFieldValue("sublines", e)
  }
  const onAddExternalSource = (source)=>{

     console.log('ADD',source)
     setSources([...sources,source]);
  }
  const onRemoveSource = (id)=>{
    console.log('remove',id);
    const index = sources.findIndex(s=>s.id === id);
    sources.splice(index,1);
    setSources([...sources])
    values.sublines.forEach((subline)=>{
      const indexToRemove = subline.synopsis.findIndex(s=>s.id===id);
      subline.synopsis.splice(indexToRemove,1)
    });
    setFieldValue('sublines',values.sublines)
  }
  const onAddSource = (source) => {
    console.log('add',source,'to',values.sublines);

    values.sublines.forEach((subline)=>{
      const addedSynopsis: iSynopsis = {
        ...source,
        text: { simpleText: subline.text}
      }
      subline.synopsis.push(addedSynopsis)
    });
   setFieldValue('sublines',values.sublines)
  }
  return (
    <form onSubmit={(e)=>{e.preventDefault(); handleSubmit()}}>
      <SugiaField
        name="sugiaName"      
      />
      <SourceButtons
        sources={values.sublines}
        tractateSettings={tractateSettings}
        onAddSource={source=>onAddSource(source)}
        onRemoveSource={id=>onRemoveSource(id)}
        onAddExternalSource={onAddExternalSource}
      ></SourceButtons>
      <FieldArray
        name="sublines"
        render={arrayHelpers => (
          <div>
            {values.sublines.map((subline, index) => (
              <div key={index}>
                <SublineField
                  name={`sublines[${index}]`}
                  onRemoveSource={(idToRemove)=>{onRemoveSource(idToRemove)}}

                />
              </div>
            ))}
          </div>
        )}
      />

      <button
        type="button"
        className="outline"
        onClick={handleReset}
        disabled={!dirty || isSubmitting}
      >
        Reset
      </button>
      <button type="submit" disabled={isSubmitting}>
        שמור
      </button>
    </form>
  )
}
//@ts-ignore // todo fix later
export default formikEnhancer(EditLineForm)
