import React from "react"
import { makeStyles } from "@material-ui/core/styles"
import List from "@material-ui/core/List"
import ListItem from "@material-ui/core/ListItem"
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction"
import ListItemText from "@material-ui/core/ListItemText"
import IconButton from "@material-ui/core/IconButton"
import ShortTextIcon from "@material-ui/icons/ShortText"
import DeleteIcon from "@material-ui/icons/Delete"
import { Paper, Typography } from "@material-ui/core"
import { getExcerptTitle } from "../../../inc/excerptUtils"
import { iExcerpt } from "../../../types/types"
import { EXCERPT_TYPE } from "./ExcerptDialog"

const useStyles = makeStyles(theme => ({
  root: {
    width: "100%",
    backgroundColor: theme.palette.background.paper,
  },
  typeCol: {
    maxWidth: "3rem",
  },
  textItemRoot: {
    paddingRight: "2rem",
  },
}))

interface Props {
  excerpts: iExcerpt[],
  filter: any,
  admin: any,
  onDelete: Function,
  onClick: Function,
  onUpdateSelectionForExcerpt: Function
}
const ExcerptList = (props:Props) => {
  const classes = useStyles()
  const {
    excerpts,
    filter,
    admin,
    onDelete,
    onClick,
    onUpdateSelectionForExcerpt,
  } = props

  if (!excerpts) {
    return null
  }
  let listname = ""
  switch (filter) {
    case EXCERPT_TYPE.MUVAA:
      listname = "רשימת מובאות"
      break;
    case EXCERPT_TYPE.MAKBILA:
      listname = "רשימת מקבילות"
      break;
    case EXCERPT_TYPE.NOSACH:
      listname = "הערות נוסח"
      break;
    case EXCERPT_TYPE.BIBLIO:
      listname = "הערות ביבליוגרפיה"
      break;
    case EXCERPT_TYPE.EXPLANATORY:
      listname = "הערות פרשניות"
      break;
    default: 
  }

  const filteredExcerpts = excerpts.filter(f=>f.type===filter);
  if (filteredExcerpts.length===0) { return null;}
  return (
    <>
      <Typography variant="h3">{listname}</Typography>
      <Paper style={{ maxHeight: 400, overflow: "auto" }}>
        <List className={classes.root}>
          {filteredExcerpts.map(excerpt => {
            const labelId = `checkbox-list-label-${excerpt.key}`
            const selectionInfo = admin && excerpt.selection ? `משורה ${excerpt.selection.fromLine}, "${excerpt.selection.fromWord}"  עד שורה ${excerpt.selection.toLine}, "${excerpt.selection.toWord}"` 
            : "";
       

            return (
              <ListItem
                title={selectionInfo}
                key={excerpt.key}
                style={excerpt.flagBadSelection?{background:'red'}:{}}
                dense
                button
                onClick={() => {
                  onClick(excerpt)
                }}
              >
                <ListItemText
                  id={labelId}
                  primary={getExcerptTitle(excerpt)}
                  classes={{ root: classes.textItemRoot }}
                />
                {admin ? (
                  <ListItemSecondaryAction>
                    <IconButton
                      edge="end"
                      aria-label="reselect"
                      title="הגדר טווח סימון מחדש"
                      onClick={() => {
                        onUpdateSelectionForExcerpt(excerpt)
                      }}
                    >
                      <ShortTextIcon />
                    </IconButton>
                    <IconButton
                      edge="end"
                      aria-label="delete"
                      title="מחק"
                      onClick={() => {
                        onDelete(excerpt.key)
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                ) : null}
              </ListItem>
            )
          })}
        </List>
      </Paper>
    </>
  )
}

export default ExcerptList
