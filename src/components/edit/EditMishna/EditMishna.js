import React, { useState, useEffect } from "react"
import Layout from "../../layout"
import { Container, Grid, makeStyles } from "@material-ui/core"
import PageService from "../../../services/pageService"
import TextEditorMishna from "./TextEditorMishna"
import {
  EditorState,
  ContentState,
  RichUtils,
  CompositeDecorator,
} from "draft-js"
import ExcerptList from "./ExcerptList"
import ExcerptDialog from "./ExcerptDialog"
import EditMishnaButtons from "./EditMishnaButtons"
import {
  clearEntityRanges,
  getSelectionObject,
  getSelectionStateFromExcerpt,
} from "../../../inc/editorUtils"
import ExcerptService from "../../../services/excerpt.service"
import { navigate } from "gatsby"
import ChooseMishnaBar from "../../shared/ChooseMishnaBar"
import { connect } from "react-redux"
import { requestCompositions, requestTractates } from "../../../store/actions"

const mapStateToProps = state => ({
   compositions: state.general.compositions
   })

// const mapStateToProps = ({ count, compositions }) => {
//   return { count,compositions }
// }
const mapDispatchToProps = (dispatch, ownProps) => ({
  getCompositions: () => {
    dispatch(requestCompositions())
  },
  getTractates: () => {
    dispatch(requestTractates())
  },
})

const useStyles = makeStyles(theme => {
  return {
    root: {
      width: "100%",
      direction: "rtl",
      background: "green",
    },
  }
})
const EditMishna = props => {
  const {
    tractate,
    chapter,
    mishna,
    compositions,
    getCompositions,
  } = props
 
  const [mishnaDoc, setMishnaDoc] = useState({})
  const [mishnaEditor, setMishnaEditor] = useState(EditorState.createEmpty())
  const [excerpt, setExcerpt] = useState({})
  const [excerpts, setExcerpts] = useState([])
  const [entities, setEntities] = useState([])
  const [selection, setSelection] = useState({
    startBlock: "",
    startOffset: null,
  })
  const [dialogOpen, setDialogOpen] = useState(false)

  function findLinkEntities(contentBlock, callback, contentState) {
    contentBlock.findEntityRanges(character => {
      const entityKey = character.getEntity()
      return (
        entityKey !== null &&
        contentState.getEntity(entityKey).getType() === "LINK"
      )
    }, callback)
  }
  function findExcerptEntities(contentBlock, callback, contentState) {
    contentBlock.findEntityRanges(character => {
      const entityKey = character.getEntity()
      return (
        entityKey !== null &&
        contentState.getEntity(entityKey).getType() === "EXCERPT"
      )
    }, callback)
  }

  const Link = props => {
    const { url } = props.contentState.getEntity(props.entityKey).getData()
    return <span style={{ color: "red" }}>{props.children}</span>
  }

  const Excerpt = props => {
    const { rawText } = props.contentState.getEntity(props.entityKey).getData()
    return (
      <span
        title={rawText}
        style={{ backgroundColor: "lightblue", color: "green" }}
      >
        {props.children}
      </span>
    )
  }
  useEffect(() => {
    getCompositions();
   // getTractates();
  }, [])
  useEffect(() => {
    async function fetch() {
      const result = await PageService.getMishnaEdit(tractate, chapter, mishna)
      const mishnaD = result.data.mishnaDoc
      setMishnaDoc(mishnaD)
      const text = mishnaD.lines.reduce(
        (carrier, a, currentIndex) => {
          return currentIndex < (mishnaD.lines.length-1) ? carrier + a.mainLine + "\n" :
        carrier + a.mainLine}
        ,
        ""
      )
      const decorator = new CompositeDecorator([
        {
          strategy: findLinkEntities,
          component: Link,
        },
        {
          strategy: findExcerptEntities,
          component: Excerpt,
        },
      ])

      setMishnaEditor(
        EditorState.createWithContent(
          ContentState.createFromText(text),
          decorator
        )
      )
      setExcerpts(mishnaD.excerpts || [])
    }
    fetch()
    return () => {}
  }, [tractate,chapter,mishna])



  useEffect(() => {
    async function clearEntities() {
      let newEditorState = EditorState.set(mishnaEditor, {
        currentContent: clearEntityRanges(mishnaEditor.getCurrentContent()),
      })
      excerpts.forEach(excerpt => {
        newEditorState = markExcerpt(excerpt, newEditorState)
      })
      setMishnaEditor(newEditorState)
    }
    clearEntities()
  }, [excerpts])

  const getSelection = editorState => {
    const selectionState = mishnaEditor.getSelection()
    //console.log('selecrion State looks like this', selectionState)
    const anchorKey = selectionState.getAnchorKey()
    const focusKey = selectionState.getFocusKey()
    const currentContent = mishnaEditor.getCurrentContent()
    const currentContentBlock = currentContent.getBlockForKey(anchorKey)
    const start = selectionState.getStartOffset()
    const end = selectionState.getEndOffset()
    return {
      startBlock: anchorKey,
      startOffset: start,
      endBlock: focusKey,
      endOffset: end,
      time: Date.now(),
    }
  }

  const onNavigateTo = link => {
    navigate(`/admin/edit/${link.tractate}/${link.chapter}/${link.mishna}`)
  }

  const getEntities = (editorState, entityType = null) => {
    const content = editorState.getCurrentContent()
    const entities = []

    content.getBlocksAsArray().forEach(block => {
      let selectedEntity = null
      block.findEntityRanges(
        character => {
          if (character.getEntity() !== null) {
            const entity = content.getEntity(character.getEntity())
            if (
              !entityType ||
              (entityType && entity.getType() === entityType)
            ) {
              selectedEntity = {
                entityKey: character.getEntity(),
                blockKey: block.getKey(),
                entity: content.getEntity(character.getEntity()),
              }
              return true
            }
          }
          return false
        },
        (start, end) => {
          entities.push({ ...selectedEntity, start, end })
        }
      )
    })
    // return _.uniqBy(entities, function (e) {
    //   return e.entityKey;
    // });

    return entities
  }


  const onSelectExcerpt = excerpt => {
    setExcerpt(excerpt)
    setDialogOpen(true)
  }

  const addExcerpt = excerpt => {
    const excerptIndex = excerpts.findIndex(e => e.key === excerpt.key)
    if (excerptIndex !== -1) {
      excerpts[excerptIndex] = excerpt
    } else {
      excerpts.push(excerpt)
    }

    setExcerpts([...excerpts])
  }
  const markExcerpt = (excerpt, editorState) => {
    const contentState = editorState.getCurrentContent()
    const contentStateWithEntity = contentState.createEntity(
      "EXCERPT",
      "MUTABLE",
      {
        type: excerpt.type,
        rawContent: excerpt.rawContent,
        rawText: excerpt.rawText,
      }
    )
    const entityKey = contentStateWithEntity.getLastCreatedEntityKey()
    const newEditorState = EditorState.set(editorState, {
      currentContent: contentStateWithEntity,
    })
    const selectionForExcerpt = getSelectionStateFromExcerpt(
      excerpt,
      contentState
    )
    return RichUtils.toggleLink(newEditorState, selectionForExcerpt, entityKey)
  }
  const deleteExcerpt = async excerptKey => {
    const afterDelete = await ExcerptService.deleteExcerpt(
      tractate,
      chapter,
      mishna,
      excerptKey
    )
    setExcerpt({})
    setExcerpts(afterDelete.excerpts)
  }

  const onUpdateSelectionForExcerpt = excerpt => {
    const newSelection = getSelectionObject(mishnaEditor)
    excerpt.selection = newSelection
    onSelectExcerpt(excerpt)
  }


  const onAddNewExcerpt = initialValues => {
    setExcerpt(initialValues)
    setDialogOpen(true)
  }


  const onMishnaSelected = link => {
    console.log('new link',link)
    if (link) {
      onNavigateTo(link)
    }
  }
  return (
    <>
      <Layout>
        <Container>
          <ChooseMishnaBar
            onNavigationSelected={onMishnaSelected}
          />
          <EditMishnaButtons
            onAddNewExcerpt={onAddNewExcerpt}
          />
          <ExcerptDialog
            mishna={{ tractate, chapter, mishna }}
            compositions={compositions}
            selection={excerpt?.selection || getSelectionObject(mishnaEditor)}
            excerpt={excerpt}
            onClose={() => {
              setDialogOpen(false)
            }}
            dialogOpen={dialogOpen}
            onAdd={addExcerpt}
          ></ExcerptDialog>
          <Grid container>
            <Grid item md={8}>
              <TextEditorMishna
                initialState={mishnaEditor}
                onChange={e => {
                  setMishnaEditor(e)
                  setSelection(getSelection(mishnaEditor))
                }}
              ></TextEditorMishna>
            </Grid>
            <Grid item md={4}>
              <div
                style={{
                  width: "100%",
                  padding: "1rem",
                }}
              >
                <ExcerptList
                  admin={true}
                  filter="MUVAA"
                  excerpts={excerpts}
                  onClick={excerpt => {
                    onSelectExcerpt(excerpt)
                  }}
                  onDelete={(excerpt)=>{deleteExcerpt(excerpt)}}
                  onUpdateSelectionForExcerpt={onUpdateSelectionForExcerpt}
                ></ExcerptList>
                <ExcerptList
                  admin={true}
                  filter="MAKBILA"
                  excerpts={excerpts}
                  onClick={excerpt => {
                    onSelectExcerpt(excerpt)
                  }}
                  onDelete={(excerpt)=>{deleteExcerpt(excerpt)}}
                  onUpdateSelectionForExcerpt={onUpdateSelectionForExcerpt}
                ></ExcerptList>
              </div>
            </Grid>
          </Grid>
        </Container>
      </Layout>
    </>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(EditMishna)
