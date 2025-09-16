import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import { EditorState, ContentState } from 'draft-js';
import SourceButtons from '../MainLineEditor/SourceButtons';
import LineService from '../../../services/line.service';
import { iLine, iInternalLink, iSubline, iSynopsis } from '../../../types/types';
import { getTextForSynopsis } from '../../../inc/synopsisUtils';
import { Button } from '@mui/material';
import FieldSublines from './FieldSublines';

interface Props {
  line: iLine | null;
  currentMishna: any;
}

const allowedSourcesForInitialText = ['leiden', 'dfus_rishon'];

// const validationSchema = Yup.object().shape({
//   // email: Yup.string().email("That's not an email").required("Required!"),
// });

// Shape of form values
interface FormValues {
  mainLine: any;
  sublines: iSubline[];
  parallels: iInternalLink[];
}

const EditLineForm = (props: Props) => {
  const { line, currentMishna } = props;

  const textForEditor = line?.sublines
    ? line.sublines
        .map((s) => s.text)
        .join('\n')
        .replace(/^\s+|\s+$/g, '') // trim new lines
    : line?.mainLine;

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { isSubmitting },
  } = useForm<FormValues>({
    defaultValues: {
      mainLine: EditorState.createEmpty(),
      sublines: [],
      parallels: [],
    },
    // resolver: yupResolver(validationSchema),
  });

  useEffect(() => {
    if (line) {
      reset({
        mainLine: EditorState.createWithContent(ContentState.createFromText(textForEditor || '')),
        parallels: line.parallels || [],
        sublines: line.sublines || [],
      });
    }
  }, [line, textForEditor, reset]);

  const values = watch();
  const [sources, setSources] = useState<iSynopsis[]>([]);

  const onUpdateInternalSources = (parallels: iInternalLink[]) => {
    setValue('parallels', parallels);
  };
  const onAddExternalSource = (source: any) => {
    console.log('ADD', source);
    setSources([...sources, source]);
  };
  const onRemoveSource = (id: any) => {
    const index = sources.findIndex((s) => s.id === id);
    sources.splice(index, 1);
    setSources([...sources]);
    const updatedSublines = values.sublines.map((subline) => {
      const updatedSynopsis = subline.synopsis.filter((s) => s.id !== id);
      return { ...subline, synopsis: updatedSynopsis };
    });
    setValue('sublines', updatedSublines);
  };
  const onAddSource = (source: iSynopsis) => {
    const updatedSublines = values.sublines.map((subline: iSubline) => {
      let addedSynopsis: iSynopsis = {
        ...source,
      };
      if (allowedSourcesForInitialText.includes(source.id)) {
        addedSynopsis.text = { simpleText: getTextForSynopsis(subline.text, source) };
      } else {
        addedSynopsis.text = { simpleText: '' };
      }
      return {
        ...subline,
        synopsis: [...subline.synopsis, addedSynopsis],
      };
    });
    setValue('sublines', updatedSublines);
  };
  const onSubmit = async (data: FormValues) => {
    try {
      await LineService.saveLine(currentMishna.tractate, currentMishna.chapter, currentMishna.mishna, line!.lineNumber!, {
        ...data,
      });
      
      // Success notification
      alert('✅ השורה נשמרה בהצלחה!\n(Line saved successfully!)');
      
    } catch (error) {
      // Error notification
      alert('❌ שגיאה בשמירת השורה\n(Error saving line)\n\n' + error.message);
      console.error('Save error:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <SourceButtons
        sources={values.sublines}
        parallels={values.parallels}
        onAddSource={(source) => onAddSource(source)}
        onRemoveSource={(id) => onRemoveSource(id)}
        onAddExternalSource={onAddExternalSource}
        onUpdateInternalSources={onUpdateInternalSources}
        currentLineSublines={line?.sublines}
      />
      <FieldSublines control={control} onRemoveSource={onRemoveSource} />

      <Button type="submit" disabled={isSubmitting}>
        שמור
      </Button>
    </form>
  );
};

export default EditLineForm;
