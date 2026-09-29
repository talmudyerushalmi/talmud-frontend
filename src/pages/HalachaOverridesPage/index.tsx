import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  Tab,
  Tabs,
  Typography,
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import HalachaOverrideService, {
  HalachaOperation,
  HalachaStructure,
  SplitOperation,
  UnifyOperation,
} from '../../services/halachaOverride.service';
import PageService from '../../services/pageService';
import { iTractate } from '../../types/types';
import { hebrewMap } from '../../inc/utils';
import UnifyControls from './UnifyControls';
import SplitControls from './SplitControls';
import { buildLayoutChips } from './buildLayoutChips';

type Mode = 'split' | 'unify';

/**
 * Editor-only page for managing per-chapter halacha overrides (split / unify).
 *
 * URL: `/admin/halacha-overrides[/:tractate/:chapter]`
 *
 * Layout:
 *   - Tractate / Chapter pickers (top)
 *   - Current overlaid layout shown as chips
 *   - Mode tabs (חצייה / איחוד) with their respective controls
 *   - Save / Delete-all actions
 */
const HalachaOverridesPage: React.FC = () => {
  const navigate = useNavigate();
  const params = useParams<{ tractate?: string; chapter?: string }>();

  const [tractates, setTractates] = useState<iTractate[]>([]);
  const [tractate, setTractate] = useState<string>(params.tractate ?? '');
  const [chapter, setChapter] = useState<string>(params.chapter ?? '');

  const [structure, setStructure] = useState<HalachaStructure[]>([]);
  // The "working" operations list — what would be persisted if the editor clicks save.
  const [operations, setOperations] = useState<HalachaOperation[]>([]);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  const [mode, setMode] = useState<Mode>('split');

  // Load tractates list once.
  useEffect(() => {
    PageService.getAllTractates()
      .then(setTractates)
      .catch((e) => {
        setError(formatError(e, 'טעינת רשימת המסכתות נכשלה'));
        setTractates([]);
      });
  }, []);

  // When tractate/chapter changes, load the override + chapter structure and reflect to URL.
  useEffect(() => {
    if (!tractate || !chapter) {
      setStructure([]);
      setOperations([]);
      return;
    }
    setLoading(true);
    setError(null);
    HalachaOverrideService.get(tractate, chapter)
      .then((res) => {
        setStructure(res.chapterStructure ?? []);
        setOperations(res.override?.operations ?? []);
      })
      .catch((e) => {
        setError(formatError(e, 'טעינת המבנה של הפרק נכשלה'));
        setStructure([]);
        setOperations([]);
      })
      .finally(() => setLoading(false));

    // Reflect selection in URL so reload preserves context.
    navigate(`/admin/halacha-overrides/${tractate}/${chapter}`, { replace: true });
  }, [tractate, chapter, navigate]);

  // Chapter dropdown options come from the selected tractate.
  const chapterOptions = useMemo<string[]>(() => {
    const t = tractates.find((tt) => tt.id === tractate);
    return t?.chapters.map((c) => c.id) ?? [];
  }, [tractates, tractate]);

  // Render the chapter as an overlaid list: each operation becomes one chip; passthrough
  // sources become single chips. This is what the user sees as the "current layout".
  const layoutChips = useMemo(() => buildLayoutChips(structure, operations), [structure, operations]);

  // -------- Mode logic helpers --------

  /** Halachas eligible for a NEW operation (passthrough only — not already split/unified). */
  const eligibleSources = useMemo(() => {
    const claimed = new Set<string>();
    for (const op of operations) {
      if (op.kind === 'unify') {
        op.sources.forEach((s) => claimed.add(s));
      } else {
        claimed.add(op.source);
      }
    }
    return structure.filter((h) => !claimed.has(h.source));
  }, [structure, operations]);

  // -------- Actions --------

  const handleApplyUnify = useCallback(
    (sources: string[]) => {
      const next: UnifyOperation = { kind: 'unify', sources };
      setOperations((prev) => [...prev, next]);
      setInfo(null);
      setError(null);
    },
    [],
  );

  const handleApplySplit = useCallback((op: SplitOperation) => {
    setOperations((prev) => [...prev, op]);
    setInfo(null);
    setError(null);
  }, []);

  const handleRemoveOperation = useCallback((idx: number) => {
    setOperations((prev) => prev.filter((_, i) => i !== idx));
  }, []);

  const handleSave = useCallback(async () => {
    if (!tractate || !chapter) return;
    setSaving(true);
    setError(null);
    setInfo(null);
    try {
      await HalachaOverrideService.upsert(tractate, chapter, { operations });
      setInfo('נשמר בהצלחה');
    } catch (e) {
      setError(formatError(e, 'השמירה נכשלה'));
    } finally {
      setSaving(false);
    }
  }, [tractate, chapter, operations]);

  const handleDeleteAll = useCallback(async () => {
    if (!tractate || !chapter) return;
    if (!window.confirm('האם למחוק את כל ההגדרות עבור פרק זה?')) return;
    setSaving(true);
    setError(null);
    setInfo(null);
    try {
      await HalachaOverrideService.remove(tractate, chapter);
      setOperations([]);
      setInfo('כל ההגדרות נמחקו');
    } catch (e) {
      setError(formatError(e, 'המחיקה נכשלה'));
    } finally {
      setSaving(false);
    }
  }, [tractate, chapter]);

  return (
    <Box sx={{ p: 3, maxWidth: 1100, mx: 'auto' }}>
      <Typography variant="h5" gutterBottom>
        עריכת מבנה הפרק
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        חלוקה ואיחוד של הלכות בתוך פרק. המבנה המוצג לגולש הוא תוצר של שכבת הגדרה זו על גבי הנתונים המקוריים.
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

      {/* Layout chips */}
      {tractate && chapter && (
        <Paper sx={{ p: 2, mb: 3 }}>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            המבנה הנוכחי
          </Typography>
          {loading ? (
            <CircularProgress size={20} />
          ) : layoutChips.length === 0 ? (
            <Typography variant="body2" color="text.secondary">
              אין הלכות בפרק זה.
            </Typography>
          ) : (
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              {layoutChips.map((chip) => (
                <Chip
                  key={chip.key}
                  label={chip.label}
                  color={chip.color}
                  variant={chip.variant}
                  onDelete={
                    chip.operationIdx !== undefined
                      ? () => handleRemoveOperation(chip.operationIdx!)
                      : undefined
                  }
                />
              ))}
            </Stack>
          )}
        </Paper>
      )}

      {/* Mode tabs + controls */}
      {tractate && chapter && !loading && (
        <Paper sx={{ p: 2, mb: 3 }}>
          <Tabs
            value={mode}
            onChange={(_e, v) => setMode(v as Mode)}
            sx={{ mb: 2 }}>
            <Tab value="split" label="חצייה" />
            <Tab value="unify" label="איחוד" />
          </Tabs>

          {mode === 'unify' && (
            <UnifyControls
              eligibleSources={eligibleSources}
              structure={structure}
              onApply={handleApplyUnify}
            />
          )}
          {mode === 'split' && (
            <SplitControls
              eligibleSources={eligibleSources}
              onApply={handleApplySplit}
            />
          )}
        </Paper>
      )}

      {/* Errors / info */}
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

      {/* Save / delete */}
      {tractate && chapter && (
        <Stack direction="row" spacing={2}>
          <Button
            variant="contained"
            onClick={handleSave}
            disabled={saving || loading}>
            שמור
          </Button>
          <Button
            variant="outlined"
            color="error"
            onClick={handleDeleteAll}
            disabled={saving || loading}>
            מחק את כל ההגדרות לפרק
          </Button>
        </Stack>
      )}
    </Box>
  );
};

export default HalachaOverridesPage;

/**
 * Best-effort axios error formatter — surfaces server-side validation messages
 * (e.g. "Split operation 0: source halacha 003 has only 1 sugia(s)…").
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
