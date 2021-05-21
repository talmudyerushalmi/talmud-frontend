import { useField } from "formik"
import React from "react"
import { connect } from "react-redux"
import { Paper } from "@material-ui/core"
import SynopsisField from "./SynopsisField"

const mapStateToProps = state => ({})

const SublineField = props => {
  const [field, meta, helpers] = useField(props.name)
  const { value } = meta
  const { onRemoveSource } = props;

  if (!value?.synopsis) {
    value.synopsis = [];
  }
  
  const updateSource = (newVal) => {
    const indexToUpdate = value.synopsis.findIndex(s=>s.id===newVal.id);
    value.synopsis[indexToUpdate] = newVal;
    helpers.setValue(value)
  }

  return (
    <>
      <Paper elevation={3} style={{ marginBottom: "1rem", padding: "0.5rem" }}>
        <div style={{ direction: "rtl", fontWeight: "bold" }}>תת שורה</div>
        <p style={{ direction: "rtl" }}>{value.text}</p>
      
        {value.synopsis.map(source => {
          return (
            <div key={source.id}>
              <SynopsisField
               source={source}
               onChange={(newVal)=>{updateSource(newVal)}}
               onDelete={()=>{onRemoveSource(source.id)}}
                />
            </div>
          )
        })}
      </Paper>
    </>
  )
}

export default connect(mapStateToProps)(SublineField)
