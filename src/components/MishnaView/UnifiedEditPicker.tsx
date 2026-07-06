import React from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Stack,
} from '@mui/material';
import { hebrewMap } from '../../inc/utils';

interface Props {
  open: boolean;
  /** The 2 or 3 original source ids that compose the currently-displayed unified halacha. */
  sources: string[] | null;
  onCancel: () => void;
  /** Called with the original source id the editor picked. */
  onPick: (sourceId: string) => void;
}

/**
 * Disambiguation dialog shown when an editor tries to edit / tag a unified halacha.
 *
 * A unified halacha (e.g. ו-ז or ו-ז-ח) is presented to the user as one, but the underlying
 * data still lives on 2 or 3 distinct halachas. The editor must pick which one to open
 * in the edit page; we then redirect to the existing per-halacha edit/tagging UI.
 */
const UnifiedEditPicker: React.FC<Props> = ({ open, sources, onCancel, onPick }) => (
  <Dialog open={open} onClose={onCancel}>
    <DialogTitle>איזו הלכה לערוך?</DialogTitle>
    <DialogContent>
      <DialogContentText sx={{ mb: 2 }}>
        ההלכה הנוכחית מורכבת מהלכות מקור שאוחדו. יש לבחור איזו מהן לערוך.
      </DialogContentText>
      <Stack direction="row" spacing={2} justifyContent="center">
        {sources?.map((s) => (
          <Button
            key={s}
            variant="contained"
            size="large"
            onClick={() => onPick(s)}>
            הלכה {hebrewMap.get(s) ?? s}
          </Button>
        ))}
      </Stack>
    </DialogContent>
    <DialogActions>
      <Button onClick={onCancel}>ביטול</Button>
    </DialogActions>
  </Dialog>
);

export default UnifiedEditPicker;
