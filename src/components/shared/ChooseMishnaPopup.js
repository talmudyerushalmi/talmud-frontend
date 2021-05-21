import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  makeStyles,
  TextField,
} from "@material-ui/core"
import { Autocomplete } from "@material-ui/lab"
import React, { useState } from "react"

const useStyles = makeStyles({
  // need to specifiy direction for flex -
  // wanted direction is rtl but RTL function switches it to ltr, so we put ltr..
  option: {
    direction: "ltr",
  },
  root: {
      marginBottom: '0.5rem'
  }
})

const ChooseMishnaPopup = props => {
  const classes = useStyles()
  const { onClose, open, allTractates } = props

  const [tractateInput, setTractateInput] = useState("")
  const [chapterInput, setChapterInput] = useState("")
  const [mishnaInput, setMishnaInput] = useState("")
  const [selectedTractate, setSelectedTractate] = useState(null)
  const [selectedChapter, setSelectedChapter] = useState(null)
  const [selectedMishna, setSelectedMishna] = useState(null)
  const [chapters, setChapters] = useState([])
  const [mishnaiot, setMishnaiot] = useState([])

  const handleSelect = () => {
    if (selectedTractate && selectedChapter && selectedMishna) {
      onClose({
        tractate: selectedTractate?.id,
        chapter: selectedChapter.id,
        mishna: selectedMishna.mishna,
      })
    } else {
      onClose(null)
    }
    resetLink()
  }

  const resetLink = () => {
    setTractateInput("")
    setChapterInput("")
    setMishnaInput("")
    setSelectedTractate(null)
    setSelectedChapter(null)
    setSelectedMishna(null)
  }

  const tractateSelected = tractate => {
    setSelectedTractate(tractate)
    if (!tractate) {
      setChapters([])
      setSelectedChapter(null)
      setSelectedMishna(null)
      setChapterInput("")
      setMishnaInput("")
      return
    }
    setChapters(tractate.chapters)
  }
  const chapterSelected = chapter => {
    setSelectedChapter(chapter)
    if (!chapter) {
      setSelectedMishna(null)
      setMishnaInput("")
      return
    }
    setMishnaiot(chapter.mishnaiot)
  }

  const mishnaSelected = mishna => {
    setSelectedMishna(mishna)
    if (!mishna) {
      return
    }
  }

  const selectButtonDisabled = () => {
    return !(selectedTractate && selectedChapter && selectedMishna)
  }

  return (
    <Dialog
      style={{ direction: "rtl" }}
      aria-labelledby="simple-dialog-title"
      open={open}
    >
      <form>
      <DialogTitle>נווט למשנה</DialogTitle>
      <DialogContent>
        <Autocomplete
          classes={classes}
          onChange={(e, value) => {
            tractateSelected(value)
          }}
          onInputChange={(_, input) => {
            setTractateInput(input)
          }}
          inputValue={tractateInput}
          options={allTractates}
          autoHighlight={true}
          getOptionLabel={option => option.title_heb}
          style={{ width: 300, direction: "rtl", textAlign: "right" }}
          renderInput={params => (
            <TextField
              style={{ direction: "rtl" }}
              {...params}
              label="מסכת"
              variant="outlined"
            />
          )}
        />
        <Autocomplete
          classes={classes}
          onChange={(e, chapter) => {
            chapterSelected(chapter)
          }}
          onInputChange={(_, input) => {
            setChapterInput(input)
          }}
          inputValue={chapterInput}
          options={chapters}
          autoHighlight={true}
          getOptionLabel={option => option.id}
          style={{ width: 300, direction: "rtl", textAlign: "right" }}
          renderInput={params => (
            <TextField
              style={{ direction: "rtl" }}
              {...params}
              label="פרק"
              variant="outlined"
            />
          )}
        />
        <Autocomplete
          classes={classes}
          onChange={(e, mishna) => {
            mishnaSelected(mishna)
          }}
          onInputChange={(_, input) => {
            setMishnaInput(input)
          }}
          inputValue={mishnaInput}
          options={mishnaiot}
          autoHighlight={true}
          getOptionLabel={option => option.mishna}
          style={{ width: 300, direction: "rtl", textAlign: "right" }}
          renderInput={params => (
            <TextField
              style={{ direction: "rtl" }}
              {...params}
              label="משנה"
              variant="outlined"
            />
          )}
        />
      </DialogContent>
      <DialogActions >
      <Button
          onClick={() => {
            onClose(null)
            resetLink()
          }}
        >
          בטל
        </Button>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          onClick={handleSelect}
          disabled={selectButtonDisabled()}
        >
          בחר
        </Button>
      </DialogActions>
      </form>
    </Dialog>
  )
}

export default ChooseMishnaPopup
