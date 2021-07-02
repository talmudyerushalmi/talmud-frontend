import { Box, IconButton, makeStyles } from "@material-ui/core";
import React from "react";
import EditIcon from "@material-ui/icons/Edit";
import SublineDisplay from "./SublineDisplay";
import { connect } from "react-redux";

const useStyles = makeStyles({
  editLineButton: {
    display: "block",
  },
});

const mapStateToProps = (state) => ({
  userAuth: state.authentication.userAuth,
});
const mapDispatchToProps = (dispatch, ownProps) => ({});
const MainLine = (props) => {
  const { line, lineIndex, userAuth } = props;
  const classes = useStyles();
  return (
    <>
      <Box style={{ position: "relative" }}>
        {userAuth ? (
          <IconButton className={classes.editLineButton} aria-label="edit">
            <EditIcon fontSize="small" />
          </IconButton>
        ) : null}
        {line?.sublines
          ? line.sublines.map((subline, index) => {
              return (
                <SublineDisplay
                  key={index}
                  lineIndex={lineIndex}
                  subline={subline}
                />
              );
            })
          : null}
      </Box>
    </>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(MainLine);
