import { useField } from "formik";
import React from "react";
import { connect } from "react-redux";
import { Box, IconButton, makeStyles, Paper, Tooltip } from "@material-ui/core";
import SynopsisField from "./SynopsisField";
import MainLineEditor from "./MainLineEditor/MainLineEditor";
import {
  deleteSubline,
  saveNosach,
} from "../../store/actions/mishnaEditActions";
import { routeObject } from "../../routes/AdminRoutes";
import { useParams } from "react-router";
import { RemoveCircle } from "@material-ui/icons";
import { RawDraftContentState } from "draft-js";

const mapStateToProps = (state) => ({});
const mapDispatchToProps = (dispatch, ownProps) => ({
  saveNosach: async (
    route: routeObject,
    index: number,
    newNosach: RawDraftContentState
  ) => {
    dispatch(saveNosach(route, index, newNosach));
  },
  deleteSubline: async (route: routeObject, index: number, subline: number) => {
    dispatch(deleteSubline(route, index));
  },
});

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 345,
  },
  removeButton: {
    position: "absolute",
    left: "-2.5rem",
    top: "-0.8rem",
  },
}));

interface Props {
  name: string;
  index: number;
  onRemoveSource: Function;
  saveNosach: (route: routeObject, line: number, nosachnosach:RawDraftContentState)=>void;
  deleteSubline: Function;
}
const SublineField = (props: Props) => {
  const route = useParams<routeObject>();
  const [field, meta, helpers] = useField(props.name);
  const { value } = meta;
  const { index, onRemoveSource, saveNosach, deleteSubline } = props;

  if (!value?.synopsis) {
    value.synopsis = [];
  }

  const updateSource = (newVal) => {
    const indexToUpdate = value.synopsis.findIndex((s) => s.id === newVal.id);
    value.synopsis[indexToUpdate] = newVal;
    helpers.setValue(value);
  };


  const deleteSublineHandler = () => {
    deleteSubline(route, value.index);
  }

  return (
    <>
      <Paper elevation={3} style={{ marginBottom: "1rem", padding: "0.5rem" }}>
        <SublineTitle index={index} onClick={deleteSublineHandler} />
        <MainLineEditor
          fieldName={field.name + "piska"}
          lines={[value.text]}
          content={value.nosach}
          onSave={(nosach: RawDraftContentState) => {
            saveNosach(route, value.index, nosach);
          }}
        />

        {value.synopsis.map((source) => {
          return (
            <div key={source.id}>
              <SynopsisField
                source={source}
                onChange={(newVal) => {
                  updateSource(newVal);
                }}
                onDelete={() => {
                  onRemoveSource(source.id);
                }}
              />
            </div>
          );
        })}
      </Paper>
    </>
  );
};

const SublineTitle = (props) => {
  const classes = useStyles();
  const { index, onClick } = props;
  const removeButton = (
    <Tooltip title="איחוד תת השורה עם תת השורה שמעליה">
      <IconButton
      size="small" 
      onClick={onClick}
      className={classes.removeButton}>
        <RemoveCircle></RemoveCircle>
      </IconButton>
    </Tooltip>
  );

  return (
    <div style={{ direction: "rtl", position:'relative'}}>
        {index > 0 ? removeButton : null}
    </div>
  );
};
export default connect(mapStateToProps, mapDispatchToProps)(SublineField);
