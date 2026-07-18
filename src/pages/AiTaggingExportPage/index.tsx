import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Checkbox,
  CircularProgress,
  FormControl,
  FormControlLabel,
  FormGroup,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  Switch,
  Typography,
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import AiTaggingService, {
  SugyaListing,
} from '../../services/aiTagging.service';
import PageService from '../../services/pageService';
import { iTractate } from '../../types/types';
import { hebrewMap } from '../../inc/utils';

type SelectionKey = string;

const keyOf = (s: { halacha: string; sugyaIndex: number }): SelectionKey =>
  `${s.halacha}#${s.sugyaIndex}`;

/**
 * Admin-only page for exporting Sugyot as a JSONL file for downstream AI
 * training / prompting.
 *
 * URL: `/admin/ai-tagging/export[/:tractate/:chapter]`
 *
 * Flow:
 *   1. Editor picks a tractate + chapter.
 *   2. FE fetches the named-sugya list for that chapter.
 *   3. Editor checks the sugyot they want, toggles "include tags" if desired.
 *   4. Editor clicks "יצוא"; BE returns a JSONL blob and the browser downloads it.
 */
const AiTaggingExportPage: React.FC = () => {
  const navigate = useNavigate();
  const params = useParams<{ tractate?: string; chapter?: string }>();

  const [tractates, setTractates] = useState<iTractate[]>([]);
  const [tractate, setTractate] = useState<string>(params.tractate ?? '');
  const [chapter, setChapter] = useState<string>(params.chapter ?? '');

  const [sugyot, setSugyot] = useState<SugyaListing[]>([]);
  const [selected, setSelected] = useState<Set<SelectionKey>>(new Set());
  const [includeTags, setIncludeTags] = useState(true);

  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  useEffect(() => {
    PageService.getAllTractates()
      .then(setTractates)
      .catch((e) => {
        setError(formatError(e, 'טעינת רשימת המסכתות נכשלה'));
        setTractates([]);
      });
  }, []);

  useEffect(() => {
    if (!tractate || !chapter) {
      setSugyot([]);
      setSelected(new Set());
      return;
    }
    setLoading(true);
    setError(null);
    setInfo(null);
    AiTaggingService.listChapter(tractate, chapter)
      .then((rows) => {
        setSugyot(rows);
        setSelected(new Set());
      })
      .catch((e) => {
        setError(formatError(e, 'טעינת רשימת הסוגיות נכשלה'));
        setSugyot([]);
      })
      .finally(() => setLoading(false));

    navigate(`/admin/ai-tagging/export/${tractate}/${chapter}`, { replace: true });
  }, [tractate, chapter, navigate]);

  const chapterOptions = useMemo<string[]>(() => {
    const t = tractates.find((tt) => tt.id === tractate);
    return t?.chapters.map((c) => c.id) ?? [];
  }, [tractates, tractate]);

  const allSelected = sugyot.length > 0 && selected.size === sugyot.length;
  const someSelected = selected.size > 0 && !allSelected;

  const toggleAll = useCallback(() => {
    setSelected((prev) => {
      if (prev.size === sugyot.length) return new Set();
      return new Set(sugyot.map(keyOf));
    });
  }, [sugyot]);

  const toggleOne = useCallback((s: SugyaListing) => {
    const k = keyOf(s);
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(k)) next.delete(k);
      else next.add(k);
      return next;
    });
  }, []);

  const handleExport = useCallback(async () => {
    if (!tractate || !chapter || selected.size === 0) return;
    setExporting(true);
    setError(null);
    setInfo(null);
    try {
      const refs = sugyot
        .filter((s) => selected.has(keyOf(s)))
        .map((s) => ({ halacha: s.halacha, sugyaIndex: s.sugyaIndex }));
      const { blob, filename } = await AiTaggingService.exportSugyot({
        tractate,
        chapter,
        sugyot: refs,
        includeTags,
      });
      triggerBlobDownload(blob, filename);
      setInfo(
        refs.length === 1
          ? `הורדה סוגיה אחת לקובץ ${filename}`
          : `הורדו ${refs.length} סוגיות (קובץ אחד לכל סוגיה) לתוך ${filename}`,
      );
    } catch (e) {
      setError(formatError(e, 'היצוא נכשל'));
    } finally {
      setExporting(false);
    }
  }, [tractate, chapter, selected, sugyot, includeTags]);

  return (
    <Box sx={{ p: 3, maxWidth: 1100, mx: 'auto' }}>
      <Typography variant="h5" gutterBottom>
        יצוא סוגיות לאימון AI
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        בחירת סוגיות מפרק והורדתן כקובץ JSONL. כל שורה בקובץ מייצגת תת-שורה
        (subline) בסוגיה, יחד עם התיוגים הקיימים לה (קטגוריות, אזכורי חכמים,
        הערות והמשכיות) — לשימוש בהנחיית מודלים לתיוג אוטומטי.
      </Typography>

      {/* Tractate / Chapter pickers */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Stack direction="row" spacing={2} flexWrap="wrap">
          <FormControl sx={{ minWidth: 220 }} size="small">
            <InputLabel>מסכת</InputLabel>
            <Select
              label="מסכת"
              value={tractate}
              onChange={(e) => {
                setTractate(e.target.value);
                setChapter('');
              }}>
              {tractates.map((t) => (
                <MenuItem key={t.id} value={t.id}>
                  {t.title_heb ?? t.id}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl sx={{ minWidth: 160 }} size="small" disabled={!tractate}>
            <InputLabel>פרק</InputLabel>
            <Select
              label="פרק"
              value={chapter}
              onChange={(e) => setChapter(e.target.value)}>
              {chapterOptions.map((cid) => (
                <MenuItem key={cid} value={cid}>
                  {hebrewMap.get(cid) ?? cid}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>
      </Paper>

      {/* Sugya checkbox list */}
      {tractate && chapter && (
        <Paper sx={{ p: 2, mb: 3 }}>
          {loading ? (
            <CircularProgress size={20} />
          ) : sugyot.length === 0 ? (
            <Typography variant="body2" color="text.secondary">
              לא נמצאו סוגיות בעלות שם בפרק זה.
            </Typography>
          ) : (
            <>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                sx={{ mb: 1 }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={allSelected}
                      indeterminate={someSelected}
                      onChange={toggleAll}
                    />
                  }
                  label={
                    <Typography variant="subtitle2">
                      בחר הכל ({sugyot.length})
                    </Typography>
                  }
                />
                <Typography variant="body2" color="text.secondary">
                  נבחרו: {selected.size}
                </Typography>
              </Stack>

              <FormGroup sx={{ pl: 2 }}>
                {sugyot.map((s) => {
                  const k = keyOf(s);
                  return (
                    <FormControlLabel
                      key={k}
                      control={
                        <Checkbox
                          checked={selected.has(k)}
                          onChange={() => toggleOne(s)}
                        />
                      }
                      label={
                        <Typography variant="body2">
                          <b>{s.sugyaName}</b>
                          <Typography
                            component="span"
                            variant="body2"
                            color="text.secondary"
                            sx={{ ml: 1 }}>
                            (הלכה {hebrewMap.get(s.halacha) ?? s.halacha} · {s.sublineCount} תת-שורות
                            {s.taggedSublineCount > 0
                              ? ` · ${s.taggedSublineCount} מתויגות`
                              : ''}
                            )
                          </Typography>
                        </Typography>
                      }
                    />
                  );
                })}
              </FormGroup>
            </>
          )}
        </Paper>
      )}

      {/* Options + export action */}
      {tractate && chapter && sugyot.length > 0 && (
        <Paper sx={{ p: 2, mb: 3 }}>
          <Stack direction="row" spacing={3} alignItems="center" flexWrap="wrap">
            <FormControlLabel
              control={
                <Switch
                  checked={includeTags}
                  onChange={(e) => setIncludeTags(e.target.checked)}
                />
              }
              label="כלול תיוגים קיימים"
            />
            <Button
              variant="contained"
              onClick={handleExport}
              disabled={exporting || selected.size === 0}>
              {exporting ? 'מייצא…' : `יצוא (${selected.size})`}
            </Button>
          </Stack>
          {!includeTags && (
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
              היצוא יכיל את הטקסט בלבד, ללא תיוגים — שימושי כשמעוניינים לבקש
              מהמודל להציע תיוג ראשוני.
            </Typography>
          )}
        </Paper>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}
      {info && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setInfo(null)}>
          {info}
        </Alert>
      )}
    </Box>
  );
};

export default AiTaggingExportPage;

/**
 * Best-effort axios error formatter — mirrors the one in HalachaOverridesPage
 * so the two admin surfaces feel identical when things go wrong.
 */
function formatError(e: unknown, fallback: string): string {
  const err = e as {
    response?: { data?: { message?: unknown } };
    message?: unknown;
  };
  const msg = err?.response?.data?.message;
  if (Array.isArray(msg)) return msg.join('; ');
  if (typeof msg === 'string') return msg;
  if (typeof err?.message === 'string') return err.message;
  return fallback;
}

/**
 * Programmatic download of an in-memory Blob using the classic anchor-click
 * trick. We revoke the object URL on the next tick so DevTools can still
 * inspect the file if the user opens the download panel immediately.
 */
function triggerBlobDownload(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 0);
}
