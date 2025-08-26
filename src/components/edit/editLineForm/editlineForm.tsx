import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import { EditorState, ContentState } from 'draft-js';
import SourceButtons from '../MainLineEditor/SourceButtons';
import LineService from '../../../services/line.service';
import { iLine, iInternalLink, iSubline, iSynopsis, SourceType } from '../../../types/types';
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
  const onSubmit = (data: FormValues) => {
    // Filter out parallel sources before saving
    const filteredData = {
      ...data,
      sublines: data.sublines.map(subline => ({
        ...subline,
        synopsis: subline.synopsis.filter(synopsis => {
          // EXCLUDE parallel sources from save (string comparison for runtime data)
          return synopsis.type !== 'parallel_source';
        })
      }))
    };
    
    LineService.saveLine(currentMishna.tractate, currentMishna.chapter, currentMishna.mishna, line!.lineNumber!, filteredData);
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
      />
      <FieldSublines control={control} onRemoveSource={onRemoveSource} />

      <Button type="submit" disabled={isSubmitting}>
        שמור
      </Button>
    </form>
  );
};

export default EditLineForm;
