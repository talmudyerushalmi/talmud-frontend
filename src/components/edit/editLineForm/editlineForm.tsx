import React, { useEffect, useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { useParams } from 'react-router-dom';

import { EditorState, ContentState } from 'draft-js';
import SourceButtons from '../MainLineEditor/SourceButtons';
import LineService from '../../../services/line.service';
import { iLine, iParallelLink, iSubline, iSynopsis } from '../../../types/types';
import { getTextForSynopsis } from '../../../inc/synopsisUtils';
import { getTractate, getChapter } from '../../../inc/mishnaUtils';
import { Button } from '@mui/material';
import { useSnackbar } from '../../../hooks/useSnackbar';
import NotificationSnackbar from '../../shared/NotificationSnackbar';
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
  // parallels removed - managed in separate state since they save immediately
}

const EditLineForm = (props: Props) => {
  const { line, currentMishna } = props;
  const { tractate, chapter, mishna, line: lineParam } = useParams();

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
    formState: { isSubmitting, isDirty },
  } = useForm<FormValues>({
    defaultValues: {
      mainLine: EditorState.createEmpty(),
      sublines: [],
    },
    mode: 'all', // Enable immediate change detection during typing
    // resolver: yupResolver(validationSchema),
  });

  useEffect(() => {
    if (line) {
      reset({
        mainLine: EditorState.createWithContent(ContentState.createFromText(textForEditor || '')),
        sublines: line.sublines || [],
      });
      setParallels(line.parallels || []); // Initialize parallels in separate state
    }
  }, [line, textForEditor, reset]);

  const values = watch();
  const [sources, setSources] = useState<iSynopsis[]>([]);
  const [parallels, setParallels] = useState<iParallelLink[]>([]); // Separate state for parallels
  const { snackbar, showSuccess, showError, hideSnackbar } = useSnackbar();
  const [hasChanges, setHasChanges] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  // Simple approach: Listen for any input events on the form
  useEffect(() => {
    const form = formRef.current;
    if (!form) return;

    const handleInput = () => {
      if (!hasChanges) {
        setHasChanges(true);
      }
    };

    const handleKeyDown = () => {
      if (!hasChanges) {
        setHasChanges(true);
      }
    };

    // Listen for any input events on the form
    form.addEventListener('input', handleInput, true);
    form.addEventListener('keydown', handleKeyDown, true);

    return () => {
      form.removeEventListener('input', handleInput, true);
      form.removeEventListener('keydown', handleKeyDown, true);
    };
  }, [hasChanges]);

  // Create a unique navigation key to detect any navigation change
  const navigationKey = `${tractate}-${chapter}-${mishna}-${lineParam}-${line?.lineNumber}`;
  
  // Reset changes when navigating to a different line
  useEffect(() => {
    setHasChanges(false);
  }, [navigationKey]); // Reset when any part of navigation changes

  const onUpdateInternalSources = (updatedParallels: iParallelLink[]) => {
    setParallels(updatedParallels); // Update separate parallels state
    // Note: No need to mark hasChanges since parallels save immediately
  };
  const onAddExternalSource = (source: any) => {
    setSources([...sources, source]);
    setHasChanges(true); // Mark as changed when external source is added
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
    setHasChanges(true); // Mark as changed when source is removed
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
    setHasChanges(true); // Mark as changed when source is added
  };
  const onSubmit = async (data: FormValues) => {
    try {
      // Save main line data directly (parallels are already saved separately)
      await LineService.saveLine(getTractate(currentMishna), getChapter(currentMishna), currentMishna.mishna, line!.lineNumber!, data);
      
      // Success notification
      showSuccess('השורה נשמרה בהצלחה!');
      
      // Reset button to gray/disabled after successful save
      setHasChanges(false);
      reset(values); // Reset form dirty state with current values
      
    } catch (error) {
      // Error notification
      showError(`שגיאה בשמירת השורה: ${error instanceof Error ? error.message : 'Unknown error'}`);
      console.error('Save error:', error);
    }
  };

  
  return (
    <form ref={formRef} onSubmit={handleSubmit(onSubmit)}>
      <SourceButtons
        sources={values.sublines}
        parallels={parallels}
        onAddSource={(source) => onAddSource(source)}
        onRemoveSource={(id) => onRemoveSource(id)}
        onAddExternalSource={onAddExternalSource}
        onUpdateInternalSources={onUpdateInternalSources}
        currentLineSublines={line?.sublines}
        currentMishna={currentMishna}
        currentLineNumber={line?.lineNumber}
      />
      <FieldSublines control={control} onRemoveSource={onRemoveSource} />

      <Button 
        type="submit" 
        disabled={isSubmitting || (!isDirty && !hasChanges)}
        variant={(isDirty || hasChanges) ? "contained" : "outlined"}
        color={(isDirty || hasChanges) ? "primary" : "inherit"}
      >
        שמור
      </Button>
      
      {/* Notification snackbar */}
      <NotificationSnackbar 
        snackbar={snackbar}
        onClose={hideSnackbar}
      />
    </form>
  );
};

export default EditLineForm;
