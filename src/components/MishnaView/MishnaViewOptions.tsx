import React from "react";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import { connect } from "react-redux";
import { toggleShowPunctuation } from "../../store/actions";
import {
  toggleDivideToLines,
  toggleEditType,
  toggleShowSources,
} from "../../store/actions/mishnaViewActions";
import { useTranslation } from "react-i18next";
import { Link, MenuItem, Select } from "@mui/material";
import { useParams } from "react-router-dom";
import { routeObject } from "../../routes/AdminRoutes";
import { ShowEditType } from "../../store/reducers/mishnaViewReducer";
import Manuscripts from "./Manuscripts";

const mapStateToProps = (state) => ({
  divideToLines: state.mishnaView.divideToLines,
  showPunctuation: state.mishnaView.showPunctuation,
  showSources: state.mishnaView.showSources,
  showEditType: state.mishnaView.showEditType,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  toggleShowPunctuation: () => {
    dispatch(toggleShowPunctuation());
  },
  toggleDivideToLines: () => {
    dispatch(toggleDivideToLines());
  },
  toggleShowSources: () => {
    dispatch(toggleShowSources());
  },
  toggleEditType: (e) => {
    dispatch(toggleEditType(e.target.value));
  },
});

const MishnaViewOptions = (props) => {
  const {
    divideToLines,
    showPunctuation,
    toggleShowPunctuation,
    toggleDivideToLines,
    showSources,
    toggleShowSources,
    showEditType,
    toggleEditType,
  } = props;
  const { t } = useTranslation();
  const route = useParams<routeObject>();

  return (
    <FormGroup row>
      {/*    <FormControlLabel
        control={
          <Checkbox
            checked={divideToLines}
            onChange={toggleDivideToLines}
            name="checkedB"
            color="primary"
          />
        }
        label={t("Division to Lines") as string}
      />
      <FormControlLabel
        control={
          <Checkbox
            checked={showPunctuation}
            onChange={toggleShowPunctuation}
            name="checkedA"
            color="primary"
          />
        }
        label={t("Punctuation") as string}
      /> */}
      {/* <FormControlLabel
        control={
          <Checkbox
            checked={showSources}
            onChange={toggleShowSources}
            name="hideSources"
            color="primary"
          />
        }
        label={t("References") as string}
      /> */}
      <Select
        sx={{
          '.MuiOutlinedInput-notchedOutline': { border: 'none' },
        }}
        value={showEditType}
        label=""
        onChange={toggleEditType}
      >
        <MenuItem sx={{ direction: 'ltr' }} value={ShowEditType.ORIGINAL}>
          {t('Original') as string}
        </MenuItem>
        <MenuItem sx={{ direction: 'ltr' }} value={ShowEditType.EDITED}>
          {t('Edited') as string}
        </MenuItem>
      </Select>
      <Link
        sx={{
          textDecoration: 'none',
          display: 'inline-flex',
          alignItems: 'center',
          cursor: 'pointer',
          verticalAlign: 'middle',
        }}
        target="_blank"
        href={`${process.env.REACT_APP_DB_HOST}/mishna/${route.tractate}/${route.chapter}/${route.mishna}/tei`}
        download
      >
        [TEI]
      </Link>
      {/* <Manuscripts tractate={route!.tractate} chapter={route.chapter}/> */}
    </FormGroup>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(MishnaViewOptions);
