import { Button, TextField, Grid, IconButton } from "@mui/material";

import makeStyles from '@mui/styles/makeStyles';

import { Autocomplete } from '@mui/material';
import React, { useEffect, useState } from "react"
import {
  requestTractates,
} from "../../store/actions"
import { connect } from "react-redux"
import { editorInEventPath } from "../../inc/editorUtils"
import { getNextLine, getPreviousLine, hebrewMap } from "../../inc/utils"
import { useParams } from "react-router"
import { ArrowBack, ArrowForward } from "@mui/icons-material"
import { useTranslation } from "react-i18next"
import { routeObject } from "../../routes/AdminRoutes";
import { iMarker,  iMishna, iTractate } from "../../types/types";
import NavigationService from "../../services/NavigationService";

export interface iMishnaForNavigation {
  lines: string[];
  previous?: iMarker;
  next?: iMarker;
}

const mapStateToProps = state => ({
  tractates: state.general.tractates,
})

const mapDispatchToProps = (dispatch) => ({
  getTractates: () => {
    dispatch(requestTractates())
  },
})

const useStyles = makeStyles({
  option: {
    direction: "rtl",
  },
  root: {
    minWidth: 100, flex:'auto',
    '&.MuiAutocomplete-root  .MuiOutlinedInput-root .MuiAutocomplete-input':{ 
      padding:0},
  },

})

export interface leanChapter {
  id: string;
  mishnaiot: Pick<iMishna, "id" | "mishna">[]
}

export const ALL_CHAPTER = {
  id: 'all',
  mishna: '000',
  mishnaRef: ''
}

interface Props {
  tractates: iTractate[];
  getTractates: Function;
  allChapterAllowed?: boolean;
  onNavigationSelected: Function;
}
const ChooseMishnaBar = (props:Props) => {
  const { t } = useTranslation();
  const { tractate, chapter, mishna, line } = useParams<routeObject>();
  const classes = useStyles()
  const {
    tractates,
    onNavigationSelected,
    allChapterAllowed,
    getTractates,
  } = props

  const [selectedTractate, setSelectedTractate] = useState<iTractate|null>(null)
  const [selectedChapter, setSelectedChapter] = useState<leanChapter|null>(null)
  const [selectedMishna, setSelectedMishna] = useState<iMishna|null>(null)
  const [mishnaNavigation, setMishnaNavigation] = useState<iMishnaForNavigation|null>(null)

  const [selectedLine, setSelectedLine] = useState<string|null>(null)


  const setNavigation = async (tractate, chapter, mishna, line)=>{
    const tractateData = tractates.find((t: iTractate)=>t.id === tractate)
    if (tractateData) {
      setSelectedTractate(tractateData)
      const matchChapter = tractateData.chapters.find(c => c.id === chapter);
      if (matchChapter) {
        setSelectedChapter(matchChapter)
        const matchMishna = matchChapter.mishnaiot.find(m => m.mishna === mishna)
        if (matchMishna) {
          setSelectedMishna(matchMishna)
          // update lines
          if (line) {
            setSelectedLine(line)
          }
        } else if (mishna === undefined) {
          //@ts-ignore
          setSelectedMishna(ALL_CHAPTER)
        }
      }

    }

    

  }


  useEffect(()=>{
    getTractates();
  },[]);




useEffect(() => {
  const fetchLines =  (mishna: string) => {
    return NavigationService.getMishnaForNavigation(tractate, selectedChapter?.id, mishna);
  }
  if (selectedMishna) {
    const mishna = selectedMishna.mishna
    fetchLines(mishna)
    .then(mishnaForNavigation => {
      setMishnaNavigation(mishnaForNavigation)
    })
    // make sure to catch any error
    .catch(error => {
      console.log('error looking for mishna', error,tractate, chapter, mishna )
    });

  }
  
}, [selectedMishna])




  useEffect(() => {
    setNavigation(tractate, chapter, mishna, line)
  }, [tractate, chapter, mishna, line, tractates])

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
  }, [mishnaNavigation])


  const handleNavigate = () => {
    let navigation;
    if (selectedTractate && selectedChapter && selectedMishna) {
      if (selectedLine) {
        navigation = {
          tractate: selectedTractate?.id,
          chapter: selectedChapter.id,
          mishna: selectedMishna.mishna,
          line: selectedLine,
        }
      } else {
        navigation = {
          tractate: selectedTractate?.id,
          chapter: selectedChapter.id,
          mishna: selectedMishna.mishna,
        }
      }
      onNavigationSelected(navigation)
    }
  }

 

  const onNavigateForward = () => {
    let next;
    if (line) {
      next = getNextLine(tractate,chapter,mishna, line, mishnaNavigation);
    } else {
      next = mishnaNavigation?.next
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
      previous = getPreviousLine(tractate,chapter,mishna, line, mishnaNavigation);
    } else {
      previous = mishnaNavigation?.previous
    }

    if (previous) {
      onNavigationSelected({
        tractate: previous?.tractate,
        chapter: previous.chapter,
        mishna: previous.mishna,
        line: previous?.line,
      })
    }
  }
  
  
  const renderMishna = ()=>{
    let options;
    if (allChapterAllowed) {
      options = selectedChapter?.mishnaiot ? [...selectedChapter?.mishnaiot,ALL_CHAPTER] : [ALL_CHAPTER];
    } else {
      options = selectedChapter?.mishnaiot ? selectedChapter?.mishnaiot : [];
    }
    return (
      <Autocomplete
      classes={classes}
      onChange={(e, value) => {
        //@ts-ignore
        setSelectedMishna(value)
      }}
      value={selectedMishna}
      options={options}
      autoHighlight={true}
      getOptionLabel={option =>
        hebrewMap.get(parseInt(option.mishna)) as string}
      isOptionEqualToValue={(option, value) => option.mishna === value.mishna}
      renderInput={params => (
        <TextField
          {...params}
          label={t("Halakha")}
          variant="outlined"
        />
      )}
    />
    )

  }

  const renderLine = ()=>{
    if (!line) {
      return null;
    }
    return (
      <Autocomplete
            classes={classes}
            onChange={(e, value) => {
             // selectLine(value)
            }}
            value={selectedLine}
            options={ mishnaNavigation ? mishnaNavigation.lines : [] }
            autoHighlight={true}
            //getOptionLabel={option => option.lineNumber}
            renderInput={params => (
              <TextField
                {...params}
                label="שורה"
                variant="outlined"
              />
            )}
          />
    );
  }
  const selectButtonDisabled = () => {
    return !selectedTractate
  }

  return <>
    <form
      onSubmit={e => {
        e.preventDefault()
        handleNavigate()
      }}
    >
      <Grid container>  
      <IconButton onClick={()=>{onNavigateBack()}} size="small">
        <ArrowForward></ArrowForward>
          </IconButton> 
        <Autocomplete
          classes={classes}
          onChange={(e, value) => {
            setSelectedTractate(value)
            const first = value?.chapters[0]
            if (first) {
              setSelectedChapter(first)
            }
          }}
          value={selectedTractate}
          options={tractates || []}
          autoHighlight={true}
          getOptionLabel={option => option.title_heb}
          isOptionEqualToValue={(option, value) => option?.id === value?.id}
          renderInput={params => (
            <TextField
              {...params}
              label={t("Tractate")}
              variant="outlined"
            />
          )}
        />
         <Autocomplete
          classes={classes}
          onChange={(e, value) => {
            setSelectedChapter(value)
          }}
          value={selectedChapter}
          options={selectedTractate?.chapters || []}
          autoHighlight={true}
          getOptionLabel={option => hebrewMap.get(parseInt(option.id)) as string}
          isOptionEqualToValue={(option, value) => option.id === value.id}
          renderInput={params => (
            <TextField
              {...params}
              label={t("Chapter")}
              variant="outlined"
            />
          )}
        />

               
        { renderMishna() }
        { renderLine() }


        <IconButton onClick={()=>onNavigateForward()} size="small">
          <ArrowBack></ArrowBack>
          </IconButton>
   
        <div style={{display:'flex'}}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            onClick={handleNavigate}
            disabled={selectButtonDisabled()}
          >
          {t("Go")}
          </Button>
        </div>
      </Grid>
    </form>
  </>;
}

export default connect(mapStateToProps, mapDispatchToProps)(ChooseMishnaBar)
