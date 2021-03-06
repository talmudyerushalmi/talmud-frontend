import { Button, makeStyles, TextField, Grid } from "@material-ui/core"

import { Autocomplete } from "@material-ui/lab"
import React, { useEffect, useState } from "react"
import {
  requestTractates,
  setNavigationToRoute,
  selectTractate,
  selectChapter,
  selectMishna,
  selectLine
} from "../../store/actions"
import { connect } from "react-redux"
import { editorInEventPath } from "../../inc/editorUtils"
import { getNextLine, getPreviousLine, hebrewMap } from "../../inc/utils"
import { useParams } from "react-router"

const mapStateToProps = state => ({
  tractates: state.general.tractates,
  selectedTractate: state.general.selectedTractate,
  selectedChapter: state.general.selectedChapter,
  selectedMishna: state.general.selectedMishna,
  selectedLine: state.general.selectedLine,
  currentMishna: state.general.currentMishna
})

const mapDispatchToProps = (dispatch) => ({
  setNavigationToRoute: (tractate, chapter, mishna, line)=>{
    dispatch(setNavigationToRoute(tractate, chapter, mishna, line))
  },
  selectTractate: (selectedTractate) => {
    dispatch(selectTractate(selectedTractate))
  },
  selectChapter: (selectedChapter) => {
    dispatch(selectChapter(selectedChapter))
  },
  selectMishna: (selectedMishna,line) => {
    dispatch(selectMishna(selectedMishna,line))
  },
  selectLine: (selectedLine) => {
    dispatch(selectLine(selectedLine))
  },
  getTractates: () => {
    dispatch(requestTractates())
  },
})

const useStyles = makeStyles({
  // need to specifiy direction for flex -
  // wanted direction is rtl but RTL function switches it to ltr, so we put ltr..
  option: {
    direction: "ltr",
  },
  root: {
    minWidth: 100, flex:'auto', direction: "rtl", textAlign: "right"
  },

})

const ChooseMishnaBar = props => {
  const { tractate, chapter, mishna, line } = useParams();
  const classes = useStyles()
  const {
    tractates,
    onNavigationSelected,
    currentMishna,
    selectedTractate,
    selectedChapter,
    selectedMishna,
    selectedLine,
    getTractates,
    setNavigationToRoute,
    selectTractate,
    selectChapter,
    selectMishna,
    selectLine
  } = props

  const [tractateInput, setTractateInput] = useState("")
  const [chapterInput, setChapterInput] = useState("")
  const [mishnaInput, setMishnaInput] = useState("")
  const [lineInput, setLineInput] = useState("")


  useEffect(()=>{
    getTractates();
  },[]);

   useEffect(() => {
    if (selectedTractate) {
      setTractateInput(selectedTractate.title_heb)
    } else {
      setTractateInput("")
    }
   }, [selectedTractate])

   useEffect(() => {
    if (selectedChapter) {
       setChapterInput(hebrewMap.get(parseInt(selectedChapter.id)))
    } else {
      setChapterInput("")
    }
   }, [selectedChapter])

   useEffect(() => {
    if (selectedMishna) {
      setMishnaInput(hebrewMap.get(parseInt(selectedMishna.mishna)))
    } else {
      setMishnaInput("")
    }
   }, [selectedMishna])

  useEffect(() => {
  if (selectedLine) {
    setLineInput(selectedLine.lineNumber)
  } else {
    setLineInput("")
  }
 }, [selectedLine])

  useEffect(() => {
    setNavigationToRoute(tractate, chapter, mishna, line)
  }, [tractate, chapter, mishna, line])

  const dialogPopupOpen = () => {
    return document.querySelector(".MuiDialog-root") !== null
  }
  useEffect(() => {
    let keyPressHandler
    keyPressHandler = event => {
      if (event.key === "ArrowLeft" && !editorInEventPath(event) && !dialogPopupOpen()) {
        onNavigateForward()
      }
      if (event.key === "ArrowRight" && !editorInEventPath(event) && !dialogPopupOpen()) {
        onNavigateBack()
      }
    }
    window.addEventListener("keydown", keyPressHandler)
    return () => {
      window.removeEventListener("keydown", keyPressHandler)
    }
  }, [currentMishna, line])


  const handleNavigate = () => {
    if (selectedTractate && selectedChapter && selectedMishna) {
      if (selectedLine) {
        onNavigationSelected({
          tractate: selectedTractate?.id,
          chapter: selectedChapter.id,
          mishna: selectedMishna.mishna,
          line: selectedLine.lineNumber,
        })
      } else {
        onNavigationSelected({
          tractate: selectedTractate?.id,
          chapter: selectedChapter.id,
          mishna: selectedMishna.mishna,
        })
      }
    }
  }

 

  const onNavigateForward = () => {
    let next;
    if (line) {
      next = getNextLine(tractate,chapter,mishna, line, currentMishna);
    } else {
      next = currentMishna.next
    }

    if (next) {
      onNavigationSelected({
        tractate: next?.tractate,
        chapter: next.chapter,
        mishna: next.mishna,
        line: next?.line,
      })
    }
  }
  const onNavigateBack = () => {
    let previous;
    if (line) {
      previous = getPreviousLine(tractate,chapter,mishna, line, currentMishna);
    } else {
      previous = currentMishna.previous
    }
    console.log("back", previous)

    if (previous) {
      onNavigationSelected({
        tractate: previous?.tractate,
        chapter: previous.chapter,
        mishna: previous.mishna,
        line: previous?.line,
      })
    }
  }



  const renderLine = ()=>{
    if (!line) {
      return null;
    }
    return (
      <Autocomplete
            classes={classes}
            onChange={(e, value) => {
              selectLine(value)
            }}
            onInputChange={(_, input) => {
              setLineInput(input)
            }}
            value={selectedLine}
            inputValue={lineInput}
            options={selectedMishna?.lines || []}
            autoHighlight={true}
            getOptionLabel={option => option.lineNumber}
            renderInput={params => (
              <TextField
                style={{ direction: "rtl" }}
                {...params}
                label="????????"
                variant="outlined"
              />
            )}
          />
    );
  }
  const selectButtonDisabled = () => {
    return !selectedTractate
  }

  return (
    <>
      <form
        onSubmit={e => {
          e.preventDefault()
          handleNavigate()
        }}
      >
        <Grid container>   
          <Autocomplete
            classes={classes}
            onChange={(e, value) => {
              selectTractate(value)
            }}
            onInputChange={(_, input) => {
              setTractateInput(input)
            }}
            value={selectedTractate}
            inputValue={tractateInput}
            options={tractates || []}
            autoHighlight={true}
            getOptionLabel={option => option.title_heb}
            getOptionSelected={(option, value) => option?.id === value?.id}
            renderInput={params => (
              <TextField
                style={{ direction: "rtl" }}
                {...params}
                label="????????"
                variant="outlined"
              />
            )}
          />
           <Autocomplete
            classes={classes}
            onChange={(e, value) => {
              selectChapter(value)
            }}
            onInputChange={(_, input) => {
              setChapterInput(input)
            }}
            value={selectedChapter}
            inputValue={chapterInput}
            options={selectedTractate?.chapters || []}
            autoHighlight={true}
            getOptionLabel={option => hebrewMap.get(parseInt(option.id))}
            getOptionSelected={(option, value) => option.id === value.id}
            renderInput={params => (
              <TextField
                style={{ direction: "rtl" }}
                {...params}
                label="??????"
                variant="outlined"
              />
            )}
          />
           <Autocomplete
            classes={classes}
            onChange={(e, value) => {
              console.log("now")
              selectMishna(value,line)
            }}
            onInputChange={(_, input) => {
              setMishnaInput(input)
            }}
            value={selectedMishna}
            inputValue={mishnaInput}
            options={selectedChapter?.mishnaiot || []}
            autoHighlight={true}
            getOptionLabel={option =>
              hebrewMap.get(parseInt(option.mishna))}
            getOptionSelected={(option, value) => option.mishna === value.mishna}
            renderInput={params => (
              <TextField
                style={{ direction: "rtl" }}
                {...params}
                label="????????"
                variant="outlined"
              />
            )}
          />
         
          {renderLine()}

          <div style={{display:'flex'}}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              onClick={handleNavigate}
              disabled={selectButtonDisabled()}
            >
              ????????
            </Button>
          </div>
        </Grid>
      </form>
    </>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(ChooseMishnaBar)
