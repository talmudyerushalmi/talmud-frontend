import { Button, Grid, TextField } from "@mui/material";
import makeStyles from '@mui/styles/makeStyles';
import { Autocomplete } from '@mui/material';
import React, { useState } from "react"
import { connect } from "react-redux"

const useStyles = makeStyles({
  option: {
    direction: "rtl",
  },
  root: {
    minWidth: 300,
  },
})
const mapStateToProps = state => ({
  compositions: state.navigation.compositions,
})

const ExternalSourceDetails = props => {
  const { compositions, onAddExternalSource } = props
  const classes = useStyles()
  const [externalSourceData, setExternalSourceData] = useState({
    composition: null,
    compositionLocation: "",
  })

  const onAddHandle = () => {
    onAddExternalSource(externalSourceData)
    setExternalSourceData({ composition: null, compositionLocation: "" })
  }

  return (
    <Grid container>
      <Grid item>
        <Button onClick={onAddHandle}>עד עקיף</Button>
      </Grid>
      <Grid item>
        <Autocomplete
          classes={classes}
          onChange={(e, compositionValue) => {
            setExternalSourceData({
              ...externalSourceData,
              composition: compositionValue,
            })
          }}
          onInputChange={(_, input) => {
            // setLineInput(input)
          }}
          value={externalSourceData.composition}
          //  inputValue={lineInput}
          options={compositions || []}
          autoHighlight={true}
          getOptionLabel={option => option.title}
          renderInput={params => (
            <TextField
              style={{ direction: "rtl" }}
              {...params}
              label="חיבור"
              variant="outlined"
            />
          )}
        />
      </Grid>
      <Grid item>
        <TextField
          onChange={e => {
            const compositionLocation = e.target.value
            setExternalSourceData({
              ...externalSourceData,
              compositionLocation,
            })
          }}
          value={externalSourceData.compositionLocation}
          label="מיקום"
          variant="outlined"
        />
      </Grid>
    </Grid>
  )
}

export default connect(mapStateToProps)(ExternalSourceDetails)
