import * as React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, LinearProgress, FormControlLabel, Radio, TextField, RadioGroup, Checkbox } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import makeStyles from '@mui/styles/makeStyles';
import RichTextEditorField from '../../editors/RichTextEditorField';
import { convertFromRaw, EditorState } from 'draft-js';
import { getContentRaw } from '../../../inc/editorUtils';
import * as Yup from 'yup';
import { connect } from 'react-redux';
import { closeExcerptDialog, saveExcerpt } from '../../../store/actions/mishnaEditActions';
import { getTractate, getChapter } from '../../../inc/mishnaUtils';
import AddComposition from '../addComposition/AddComposition';
import { Box } from '@mui/system';
import { CompositionType } from '../../../types/types';
import { requestCompositions } from '../../../store/actions';

const mapDispatchToProps = (dispatch: any, ownProps: any) => ({
  saveExcerpt: (tractate, chapter, mishna, excerpt) => {
    dispatch(saveExcerpt(tractate, chapter, mishna, excerpt));
  },
  closeExcerptDialog: () => {
    dispatch(closeExcerptDialog);
  },
  requestCompositions: () => {
    dispatch(requestCompositions());
  },
});
const mapStateToProps = (state: any) => ({
  isSubmitting: state.mishnaEdit.isSubmitting,
});

const useStyles = makeStyles({
  // need to specifiy direction for flex -
  // wanted direction is rtl but RTL function switches it to ltr, so we put ltr..
  option: {
    direction: 'rtl',
  },
  root: {
    marginBottom: '0.5rem',
  },
});
const excerptSchema = Yup.object().shape({
  source: Yup.object().required('Required'),
  sourceLocation: Yup.string().default(''),
  editorStateFullQuote: Yup.object().default(EditorState.createEmpty()),
  short: Yup.string().default(''),
  synopsis: Yup.string().default(''),
  editorStateComments: Yup.object().default(EditorState.createEmpty()),
  link: Yup.string().default(''),
  type: Yup.string().default('MUVAA'),
  seeReference: Yup.boolean().default(false),
  key: Yup.number().nullable().default(null),
  addingNew: Yup.boolean().default(true),
});

interface FormValues {
  key: number | null;
  addingNew: boolean;
  type: string;
  seeReference: boolean;
  source: any;
  sourceLocation: string;
  editorStateFullQuote: any;
  short: string;
  synopsis: string;
  editorStateComments: any;
  link: string;
}

const FormExcerpt = (props: any) => {
  const classes = useStyles();
  const { saveExcerpt, closeExcerptDialog, excerpt, selection, mishna, compositions, requestCompositions } = props;

  const {
    control,
    handleSubmit,
    watch,
    register,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      key: excerpt.key || null,
      addingNew: excerpt.key ? false : true,
      type: excerpt?.type || 'MUVAA',
      seeReference: excerpt.key ? excerpt.seeReference : false,
      source: excerpt.key ? excerpt.source : null,
      sourceLocation: excerpt.key ? excerpt.sourceLocation : '',
      editorStateFullQuote: excerpt.key
        ? EditorState.createWithContent(convertFromRaw(excerpt.editorStateFullQuote))
        : EditorState.createEmpty(),
      short: excerpt?.short || '',
      synopsis: excerpt.key ? excerpt.synopsis : '',
      editorStateComments: excerpt.key
        ? EditorState.createWithContent(convertFromRaw(excerpt.editorStateComments))
        : EditorState.createEmpty(),
      link: excerpt?.link || '',
    },
    resolver: yupResolver(excerptSchema),
  });

  const values = watch();

  const onSubmit = (data: FormValues) => {
    const excerptToSave = {
      ...data,
      selection,
      editorStateFullQuote: getContentRaw(data.editorStateFullQuote),
      editorStateComments: getContentRaw(data.editorStateComments),
    };
    saveExcerpt(mishna.tractate, mishna.chapter, mishna.mishna, excerptToSave);
  };
  const allowedTypes =
    values?.type === 'MUVAA' ? [CompositionType.YALKUT, CompositionType.EXCERPT] : [CompositionType.PARALLEL];
  const filteredCompositions = compositions.filter((f: any) => {
    return allowedTypes.some((allowed) => allowed === f.type);
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} style={{ direction: 'rtl' }}>
      <Controller
        name="type"
        control={control}
        render={({ field }) => (
          <RadioGroup {...field}>
            <FormControlLabel value="MUVAA" control={<Radio disabled={props.isSubmitting} />} label="מובאה" />
            <FormControlLabel
              value="MAKBILA"
              control={<Radio disabled={props.isSubmitting} />}
              label="מקבילה"
              disabled={props.isSubmitting}
            />
          </RadioGroup>
        )}
      />
      <Controller
        name="seeReference"
        control={control}
        render={({ field }) => <FormControlLabel control={<Checkbox {...field} checked={field.value} />} label="ראו" />}
      />

      <Box display="flex">
        <Controller
          name="source"
          control={control}
          render={({ field }) => (
            <Autocomplete
              {...field}
              classes={classes}
              options={filteredCompositions}
              noOptionsText="אין אפשרויות"
              getOptionLabel={(option: any) => {
                return option.title || '';
              }}
              style={{ width: 300 }}
              renderInput={(params) => <TextField {...params} label="שם החיבור" variant="outlined" />}
              onChange={(_, value) => field.onChange(value)}
            />
          )}
        />
        <AddComposition onAdd={requestCompositions} />
      </Box>
      <TextField {...register('sourceLocation')} type="text" label="מיקום בחיבור" fullWidth margin="normal" />
      <RichTextEditorField name="editorStateFullQuote" control={control} label="ציטוט מלא" />
      <TextField
        {...register('short')}
        type="text"
        label="תצוגה קצרה"
        fullWidth={true}
        multiline
        rows={2}
        margin="normal"
      />
      <TextField {...register('synopsis')} type="text" label="סינופסיס" fullWidth multiline margin="normal" />
      <RichTextEditorField name="editorStateComments" control={control} label="הערות" />
      <TextField
        {...register('link')}
        type="url"
        label="קישור"
        fullWidth={true}
        sx={{
          direction: 'rtl',
        }}
        margin="normal"
      />
      <br />

      {props.isSubmitting && <LinearProgress />}
      <br />
      {errors.source ? <p>יש להזין מקור</p> : null}

      <Button
        onClick={() => {
          closeExcerptDialog();
        }}>
        בטל
      </Button>
      <Button type="submit" variant="contained" color="primary" disabled={props.isSubmitting}>
        {excerpt.key ? 'עדכן' : 'הוסף'}
      </Button>
    </form>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(FormExcerpt);
