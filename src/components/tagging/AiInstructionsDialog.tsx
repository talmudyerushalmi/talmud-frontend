import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Typography,
} from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import DownloadIcon from '@mui/icons-material/Download';
import SaveIcon from '@mui/icons-material/Save';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { taggingService } from '../../services/tagging.service';

interface Props {
  open: boolean;
  onClose: () => void;
}

/**
 * Handles the single global AI "instruction file": load from the server, edit
 * it in a deliberately bare text area (with a live Markdown preview), upload a
 * local file into the editor, download the current text, and save back to the
 * server so the document is shared across editors.
 */
export const AiInstructionsDialog: React.FC<Props> = ({ open, onClose }) => {
  const [content, setContent] = useState('');
  const [savedContent, setSavedContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load once, the first time the dialog is opened.
  useEffect(() => {
    if (!open || loaded) return;
    setLoading(true);
    setError(null);
    taggingService
      .getAiInstructions()
      .then((res) => {
        setContent(res.content ?? '');
        setSavedContent(res.content ?? '');
        setLoaded(true);
      })
      .catch((e) => setError(formatErr(e, 'טעינת קובץ ההנחיות נכשלה')))
      .finally(() => setLoading(false));
  }, [open, loaded]);

  const dirty = content !== savedContent;

  const handleUpload = useCallback((file: File | undefined) => {
    if (!file) return;
    setError(null);
    const reader = new FileReader();
    reader.onload = () => {
      setContent(String(reader.result ?? ''));
      setInfo(`נטען הקובץ "${file.name}" לעריכה (עדיין לא נשמר)`);
    };
    reader.onerror = () => setError('קריאת הקובץ נכשלה');
    reader.readAsText(file);
  }, []);

  const handleDownload = useCallback(() => {
    const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ai-instructions.md';
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 0);
  }, [content]);

  const handleSave = useCallback(async () => {
    setSaving(true);
    setError(null);
    setInfo(null);
    try {
      const res = await taggingService.saveAiInstructions(content);
      setSavedContent(res.content);
      setInfo('קובץ ההנחיות נשמר');
    } catch (e) {
      setError(formatErr(e, 'שמירת קובץ ההנחיות נכשלה'));
    } finally {
      setSaving(false);
    }
  }, [content]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth dir="rtl">
      <DialogTitle>קובץ הנחיות ל-AI</DialogTitle>
      <DialogContent dividers>
        {/* Toolbar */}
        <Box display="flex" gap={1} flexWrap="wrap" alignItems="center" mb={1.5}>
          <Button
            size="small"
            variant="outlined"
            startIcon={<UploadFileIcon />}
            onClick={() => fileInputRef.current?.click()}>
            העלאת קובץ
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".md,.txt,text/plain,text/markdown"
            hidden
            onChange={(e) => {
              handleUpload(e.target.files?.[0]);
              e.target.value = '';
            }}
          />
          <Button
            size="small"
            variant="outlined"
            startIcon={<DownloadIcon />}
            onClick={handleDownload}>
            הורדה
          </Button>
          <Box flex={1} />
          <Button
            size="small"
            variant="contained"
            startIcon={saving ? <CircularProgress size={16} /> : <SaveIcon />}
            disabled={saving || loading || !dirty}
            onClick={handleSave}>
            {saving ? 'שומר…' : dirty ? 'שמירה' : 'נשמר'}
          </Button>
        </Box>

        {error && <Alert severity="error" sx={{ mb: 1 }} onClose={() => setError(null)}>{error}</Alert>}
        {info && <Alert severity="success" sx={{ mb: 1 }} onClose={() => setInfo(null)}>{info}</Alert>}

        {loading ? (
          <Box display="flex" justifyContent="center" py={6}><CircularProgress /></Box>
        ) : (
          <Box display="flex" gap={2} sx={{ height: '60vh' }}>
            {/* Raw editor */}
            <Box flex={1} display="flex" flexDirection="column" minWidth={0}>
              <Typography variant="caption" color="text.secondary" mb={0.5}>עריכה</Typography>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                dir="rtl"
                spellCheck={false}
                style={{
                  flex: 1, width: '100%', resize: 'none',
                  fontFamily: 'monospace', fontSize: '0.85rem', lineHeight: 1.6,
                  padding: '12px', borderRadius: 8,
                  border: '1px solid #ccc', boxSizing: 'border-box',
                }}
              />
            </Box>

            <Divider orientation="vertical" flexItem />

            {/* Live preview */}
            <Box flex={1} display="flex" flexDirection="column" minWidth={0}>
              <Typography variant="caption" color="text.secondary" mb={0.5}>תצוגה מקדימה</Typography>
              <Box
                sx={{
                  flex: 1, overflow: 'auto', p: 1.5,
                  border: '1px solid', borderColor: 'divider', borderRadius: 2,
                  backgroundColor: 'grey.50',
                  '& h1, & h2, & h3': { mt: 1.5, mb: 0.75 },
                  '& ul, & ol': { pr: 3, my: 0.5 },
                  '& code': { backgroundColor: 'grey.200', px: 0.5, borderRadius: 0.5 },
                  '& table': { borderCollapse: 'collapse' },
                  '& th, & td': { border: '1px solid #ccc', p: 0.5 },
                  '& hr': { my: 1.5 },
                }}>
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
              </Box>
            </Box>
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>סגירה</Button>
      </DialogActions>
    </Dialog>
  );
};

function formatErr(e: any, fallback: string): string {
  const msg = e?.response?.data?.message ?? e?.message;
  if (Array.isArray(msg)) return msg.join('; ');
  return typeof msg === 'string' ? msg : fallback;
}

export default AiInstructionsDialog;
