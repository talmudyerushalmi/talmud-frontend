import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { useTranslation } from 'react-i18next';
import RelatedService from '../../services/RelatedService';
import { ImageList, ImageListItem, ImageListItemBar } from '@mui/material';

export interface iManuscript {
  slug: string;
  imageurl: string;
  thumbnail: string;

}

interface Props {
  tractate: string;
  chapter: string;
}
const Manuscripts = (props: Props)=>{
  const { tractate, chapter } = props

  React.useEffect(()=>{
    setManuscripts([])
  }, [tractate, chapter])


  const { t } = useTranslation();

  const [open, setOpen] = React.useState(false);
  const [manuscripts, setManuscripts] = React.useState<iManuscript[]>([]);

  const handleClickOpen = () => () => {
    if (manuscripts.length===0) {
      RelatedService.getRelated(tractate, chapter)
      .then(res => {
        function compare( a: iManuscript, b:iManuscript ) {
          if ( a.slug < b.slug ){
            return -1;
          }
          if ( a.slug > b.slug ){
            return 1;
          }
          return 0;
        }
        const m = res.manuscripts.sort(compare)
        .map(manuscript => {
          return {
            ...manuscript,
            slug: manuscriptsMap.get(manuscript.slug)?.title || ""
          }
        })
        setManuscripts(m)})
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const descriptionElementRef = React.useRef<HTMLElement>(null);
  React.useEffect(() => {
    if (open) {
      const { current: descriptionElement } = descriptionElementRef;
      if (descriptionElement !== null) {
        descriptionElement.focus();
      }
    }
  }, [open]);

  return (
    <div style={{alignSelf:'center'}}>
      <Button 
          sx={{
            textDecoration: "none",
            display: "inline-flex",
            alignItems: "center",
            cursor: "pointer",
            verticalAlign: "middle",
          }}
      onClick={handleClickOpen()}>{t("Manuscripts") as string}</Button>
      <Dialog
        open={open}
        onClose={handleClose}
        scroll={'paper'}
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
      >
        <DialogTitle id="scroll-dialog-title">{t("Manuscripts") as string}</DialogTitle>
        <DialogContent dividers={true}>
          <Images manuscripts={manuscripts}/>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>{t("Close") as string}</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}


export default Manuscripts



const Images = (props:ImagesProps)=> {
  const { manuscripts } = props;
  return (
    <ImageList cols={1} sx={{ width: 300, height: 450 }}>
      {manuscripts.map((manuscript) => (
        <a 
        target="_blank"
        rel="noreferrer" 
        href={manuscript.imageurl}>
        <ImageListItem key={manuscript.imageurl}>
          <img
            src={`${manuscript.thumbnail}?w=148&fit=crop&auto=format`}
            srcSet={`${manuscript.thumbnail}?w=148&fit=crop&auto=format&dpr=2 2x`}
            alt={manuscript.slug}
            loading="lazy"
          />
          <ImageListItemBar
            title={manuscript.slug}
            position="below"
          />
        </ImageListItem>
        </a>
      ))}
    </ImageList>
  );
}
interface ImagesProps {
  manuscripts: iManuscript[]
}


export const manuscriptsMap = new Map([
  [
    "leiden-manuscript",
    {
      title: "Leiden",
    },
  ],
  [
    "jerusalem-talmud-bomberg-(venice)-pressing-(1523-ce)",
    {
      title: "Venice",
    },
  ],
])