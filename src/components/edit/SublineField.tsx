import { useField } from "formik"
import React from "react"
import { connect } from "react-redux"
import { Paper } from "@material-ui/core"
import SynopsisField from "./SynopsisField"
import MainLineEditor from "./MainLineEditor/MainLineEditor"
import { saveNosach } from "../../store/actions/mishnaEditActions"
import { routeObject } from "../../routes/AdminRoutes"
import { useParams } from "react-router"

const mapStateToProps = state => ({})
const mapDispatchToProps = (dispatch, ownProps) => ({
  saveNosach: async (route: routeObject, index: number, newSublines: string[])=>{
   dispatch(saveNosach(route,  index, newSublines))
  }
});

const SublineField = props => {
  const route = useParams<routeObject>();
  const [field, meta, helpers] = useField(props.name)
  const { value } = meta
  const { onRemoveSource, saveNosach } = props;

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
        <MainLineEditor lines={[value.text]} onSave={(nosach:string[])=>{console.log(nosach)
        saveNosach(route, value.index, nosach)
        }} />

      
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

export default connect(mapStateToProps,mapDispatchToProps)(SublineField)
