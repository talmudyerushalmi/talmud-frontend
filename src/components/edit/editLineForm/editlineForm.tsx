import React, { useEffect, useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { useParams } from 'react-router-dom';

import { EditorState, ContentState } from 'draft-js';
import SourceButtons from '../MainLineEditor/SourceButtons';
import LineService from '../../../services/line.service';
import { iLine, iInternalLink, iSubline, iSynopsis } from '../../../types/types';
import { getTextForSynopsis } from '../../../inc/synopsisUtils';
import { Button, Snackbar, Alert } from '@mui/material';
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
      parallels: [],
    },
    mode: 'all', // Enable immediate change detection during typing
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
  const [snackbar, setSnackbar] = useState<{open: boolean, message: string, severity: 'success' | 'error'}>({
    open: false, 
    message: '', 
    severity: 'success'
  });
  const [hasChanges, setHasChanges] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  // Simple approach: Listen for any input events on the form
  useEffect(() => {
    const form = formRef.current;
    if (!form) return;

    const handleInput = () => {
      if (!hasChanges) {
        setHasChanges(true);
        console.log('🔥 Input detected - Button should turn blue!');
      }
    };

    const handleKeyDown = () => {
      if (!hasChanges) {
        setHasChanges(true);
        console.log('🔥 Keydown detected - Button should turn blue!');
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
    console.log('🔄 Navigated to new line - Button reset to gray/disabled', navigationKey);
  }, [navigationKey]); // Reset when any part of navigation changes

  const onUpdateInternalSources = (parallels: iInternalLink[]) => {
    setValue('parallels', parallels);
    setHasChanges(true); // Mark as changed when parallels are updated
  };
  const onAddExternalSource = (source: any) => {
    console.log('ADD', source);
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
      // Remove parallels from data since they're saved immediately when created
      const { parallels, ...dataWithoutParallels } = data;
      
      await LineService.saveLine(currentMishna.tractate, currentMishna.chapter, currentMishna.mishna, line!.lineNumber!, {
        ...dataWithoutParallels,
      });
      
      // Success notification
      setSnackbar({
        open: true,
        message: 'השורה נשמרה בהצלחה!',
        severity: 'success'
      });
      
      // Reset button to gray/disabled after successful save
      setHasChanges(false);
      reset(values); // Reset form dirty state with current values
      console.log('💾 Save successful - Button reset to gray/disabled');
      
    } catch (error) {
      // Error notification
      setSnackbar({
        open: true,
        message: `שגיאה בשמירת השורה: ${error instanceof Error ? error.message : 'Unknown error'}`,
        severity: 'error'
      });
      console.error('Save error:', error);
    }
  };

  
  return (
    <form ref={formRef} onSubmit={handleSubmit(onSubmit)}>
      <SourceButtons
        sources={values.sublines}
        parallels={values.parallels}
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
      
      {/* Gentle notification snackbar */}
      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={4000}
        onClose={() => setSnackbar(prev => ({...prev, open: false}))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setSnackbar(prev => ({...prev, open: false}))}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </form>
  );
};

export default EditLineForm;
