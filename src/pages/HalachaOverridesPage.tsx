import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Divider,
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
import { getHTMLFromRawContent } from '../inc/editorUtils';
import HalachaOverrideService, {
  HalachaOperation,
  HalachaStructure,
  MishnaCut,
  SplitOperation,
  UnifyOperation,
} from '../services/halachaOverride.service';
import PageService from '../services/pageService';
import { iTractate } from '../types/types';
import { hebrewMap } from '../inc/utils';
import {
  formatSplitPartName,
  formatUnifiedName,
} from '../inc/halachaOverrideDisplay';

type Mode = 'split' | 'unify';

/**
 * Editor-only page for managing per-chapter halacha overrides (split / unify).
 *
 * URL: `/admin/halacha-overrides[/:tractate/:chapter]`
 *
 * Layout:
 *   - Tractate / Chapter pickers (top)
 *   - Current overlaid layout shown as chips
 *   - Mode tabs (\u05d7\u05e6\u05d9\u05d9\u05d4 / \u05d0\u05d9\u05d7\u05d5\u05d3) with their respective controls
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
    PageService.getAllTractates().then(setTractates).catch(() => setTractates([]));
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

/* ============================================================
   Unify subform
   ============================================================ */
interface UnifyControlsProps {
  eligibleSources: HalachaStructure[];
  structure: HalachaStructure[];
  onApply: (sources: string[]) => void;
}

const UnifyControls: React.FC<UnifyControlsProps> = ({
  eligibleSources,
  structure,
  onApply,
}) => {
  const [first, setFirst] = useState<string>('');
  const [count, setCount] = useState<2 | 3>(2);

  // For unify the additional sources must be the immediately following halachas in the
  // original chapter order AND each must still be a passthrough (eligible). We resolve
  // the full source list up front so the apply button only enables on a fully valid group.
  const partners = useMemo<string[] | null>(() => {
    if (!first) return null;
    const i = structure.findIndex((h) => h.source === first);
    if (i === -1) return null;
    const result: string[] = [];
    for (let offset = 1; offset < count; offset++) {
      const candidate = structure[i + offset];
      if (!candidate) return null; // past the end of the chapter
      const isEligible = eligibleSources.some((h) => h.source === candidate.source);
      if (!isEligible) return null;
      result.push(candidate.source);
    }
    return result;
  }, [first, count, structure, eligibleSources]);

  const partnerLabel = partners
    ? partners.map((p) => hebrewMap.get(p) ?? p).join(', ')
    : '—';

  return (
    <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap">
      <FormControl sx={{ minWidth: 220 }} size="small">
        <InputLabel>הלכה לאיחוד</InputLabel>
        <Select
          label="הלכה לאיחוד"
          value={first}
          onChange={(e) => setFirst(e.target.value as string)}>
          {eligibleSources.map((h) => (
            <MenuItem key={h.source} value={h.source}>
              {hebrewMap.get(h.source) ?? h.source}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl sx={{ minWidth: 140 }} size="small">
        <InputLabel>מספר הלכות</InputLabel>
        <Select
          label="מספר הלכות"
          value={count}
          onChange={(e) => setCount(Number(e.target.value) as 2 | 3)}>
          <MenuItem value={2}>2 הלכות</MenuItem>
          <MenuItem value={3}>3 הלכות</MenuItem>
        </Select>
      </FormControl>

      <Typography variant="body2" color="text.secondary">
        {partners
          ? `תאוחד עם הלכה ${partnerLabel}`
          : first
            ? 'אין מספיק הלכות זמינות לאיחוד'
            : 'בחר הלכה לאיחוד'}
      </Typography>

      <Button
        variant="contained"
        disabled={!first || !partners}
        onClick={() => {
          if (!first || !partners) return;
          onApply([first, ...partners]);
          setFirst('');
          setCount(2);
        }}>
        אחד
      </Button>
    </Stack>
  );
};

/* ============================================================
   Split subform — incl. Mishna cut picker
   ============================================================ */
interface SplitControlsProps {
  eligibleSources: HalachaStructure[];
  onApply: (op: SplitOperation) => void;
}

const SplitControls: React.FC<SplitControlsProps> = ({
  eligibleSources,
  onApply,
}) => {
  const [source, setSource] = useState<string>('');
  const [parts, setParts] = useState<2 | 3>(2);
  const [sugiaBoundaries, setSugiaBoundaries] = useState<(number | '')[]>(['']);
  const [mishnaCuts, setMishnaCuts] = useState<(MishnaCut | null)[]>([null]);
  const [localError, setLocalError] = useState<string | null>(null);

  const selected = useMemo(
    () => eligibleSources.find((h) => h.source === source),
    [eligibleSources, source],
  );
  const sugias = selected?.sugias ?? [];

  // Re-shape boundary/cut arrays whenever the number of parts changes.
  useEffect(() => {
    setSugiaBoundaries(Array(parts - 1).fill(''));
    setMishnaCuts(Array(parts - 1).fill(null));
  }, [parts, source]);

  // Boundary options for the i-th cut depend on previous cuts to enforce strictly increasing.
  const boundaryOptionsFor = (cutIdx: number): number[] => {
    const min = cutIdx === 0 ? 1 : Number(sugiaBoundaries[cutIdx - 1] || 0) + 1;
    const max =
      cutIdx === sugiaBoundaries.length - 1
        ? sugias.length - 1
        : Number(sugiaBoundaries[cutIdx + 1] || sugias.length) - 1;
    if (max < min) return [];
    const out: number[] = [];
    for (let v = min; v <= max; v++) out.push(v);
    return out;
  };

  const canApply =
    source &&
    sugiaBoundaries.every((b) => typeof b === 'number' && b > 0) &&
    mishnaCuts.every((c) => c !== null);

  const handleApply = () => {
    if (!source || !canApply) return;
    // We've ensured every boundary is a number above; assert it.
    const cleanBoundaries = sugiaBoundaries.map(Number);
    const op: SplitOperation = {
      kind: 'split',
      source,
      sugiaBoundaries: cleanBoundaries,
      mishnaCuts: mishnaCuts.map((c) => c as MishnaCut),
    };
    onApply(op);
    // Reset.
    setSource('');
    setParts(2);
    setSugiaBoundaries(['']);
    setMishnaCuts([null]);
    setLocalError(null);
  };

  return (
    <Stack spacing={2}>
      <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap">
        <FormControl sx={{ minWidth: 220 }} size="small">
          <InputLabel>הלכה לחצייה</InputLabel>
          <Select
            label="הלכה לחצייה"
            value={source}
            onChange={(e) => setSource(e.target.value as string)}>
            {eligibleSources
              .filter((h) => h.sugias.length >= 2)
              .map((h) => (
                <MenuItem key={h.source} value={h.source}>
                  {hebrewMap.get(h.source) ?? h.source} ({h.sugias.length} סוגיות)
                </MenuItem>
              ))}
          </Select>
        </FormControl>

        <FormControl sx={{ minWidth: 140 }} size="small" disabled={!source}>
          <InputLabel>חלקים</InputLabel>
          <Select
            label="חלקים"
            value={parts}
            onChange={(e) => setParts(Number(e.target.value) as 2 | 3)}>
            <MenuItem value={2} disabled={sugias.length < 2}>
              2 חלקים
            </MenuItem>
            <MenuItem value={3} disabled={sugias.length < 3}>
              3 חלקים
            </MenuItem>
          </Select>
        </FormControl>
      </Stack>

      {source && selected && (
        <>
          <Divider />
          {sugiaBoundaries.map((_b, cutIdx) => (
            <Paper variant="outlined" sx={{ p: 2 }} key={cutIdx}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                נקודת חצייה {cutIdx + 1}
              </Typography>

              {/* Sugia boundary picker */}
              <FormControl sx={{ minWidth: 320, mb: 2 }} size="small">
                <InputLabel>גבול סוגיא (תחילת חלק {cutIdx + 2})</InputLabel>
                <Select
                  label={`גבול סוגיא (תחילת חלק ${cutIdx + 2})`}
                  value={sugiaBoundaries[cutIdx]}
                  onChange={(e) => {
                    const v = e.target.value === '' ? '' : Number(e.target.value);
                    setSugiaBoundaries((prev) =>
                      prev.map((p, i) => (i === cutIdx ? v : p)),
                    );
                  }}>
                  {boundaryOptionsFor(cutIdx).map((b) => {
                    const sug = sugias[b];
                    const label = sug?.sugiaName
                      ? `לפני סוגיא "${sug.sugiaName}" (שורה ${sug.firstLineNumber})`
                      : `לפני שורה ${sug?.firstLineNumber ?? b}`;
                    return (
                      <MenuItem key={b} value={b}>
                        {label}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>

              {/* Mishna cut picker */}
              <MishnaCutPicker
                richTextMishna={selected.richTextMishna}
                value={mishnaCuts[cutIdx]}
                onChange={(c) =>
                  setMishnaCuts((prev) =>
                    prev.map((p, i) => (i === cutIdx ? c : p)),
                  )
                }
              />
            </Paper>
          ))}

          {localError && <Alert severity="error">{localError}</Alert>}

          <Box>
            <Button
              variant="contained"
              onClick={handleApply}
              disabled={!canApply}>
              חצה
            </Button>
          </Box>
        </>
      )}
    </Stack>
  );
};

/* ============================================================
   Mishna cut picker
   ------------------------------------------------------------
   The editor sees the Mishna's rich text and picks the cut point at
   word granularity. We list every word boundary across all blocks of
   `richTextMishna` and let the editor select one from a dropdown.
   ============================================================ */
interface MishnaCutPickerProps {
  richTextMishna: any | null;
  value: MishnaCut | null;
  onChange: (cut: MishnaCut | null) => void;
}

interface WordOption {
  blockKey: string;
  offset: number;
  /** Short preview of the text around the cut, for the dropdown label. */
  preview: string;
}

const PREVIEW_WINDOW = 30;

const MishnaCutPicker: React.FC<MishnaCutPickerProps> = ({
  richTextMishna,
  value,
  onChange,
}) => {
  const options = useMemo<WordOption[]>(
    () => buildWordOptions(richTextMishna),
    [richTextMishna],
  );

  // Render the Mishna read-only using the same HTML pipeline the public MishnaText uses.
  const mishnaHtml = useMemo(
    () => getHTMLFromRawContent(richTextMishna) ?? '',
    [richTextMishna],
  );

  if (!richTextMishna || !richTextMishna.blocks?.length) {
    return (
      <Alert severity="warning">
        להלכה זו אין טקסט משנה לחתוך — לא ניתן לבצע חצייה.
      </Alert>
    );
  }

  return (
    <Stack spacing={1}>
      <Typography variant="body2" color="text.secondary">
        חיתוך טקסט המשנה: בחר את הגבול בין שני החלקים. הטקסט שלפני הגבול יישאר עם החלק הקודם, ולאחריו עם הבא.
      </Typography>

      {/* Read-only preview of the Mishna text */}
      <Paper
        variant="outlined"
        sx={{
          p: 1.5,
          backgroundColor: 'rgba(0,0,0,0.02)',
          maxHeight: 240,
          overflowY: 'auto',
        }}>
        <Box
          sx={{ '& p': { m: 0 } }}
          dangerouslySetInnerHTML={{ __html: mishnaHtml }}
        />
      </Paper>

      <FormControl sx={{ minWidth: 320 }} size="small">
        <InputLabel>גבול החיתוך (לפי מילה)</InputLabel>
        <Select
          label="גבול החיתוך (לפי מילה)"
          value={
            value ? `${value.blockKey}:${value.offset}` : ''
          }
          onChange={(e) => {
            const raw = e.target.value as string;
            if (!raw) {
              onChange(null);
              return;
            }
            const [blockKey, offsetStr] = raw.split(':');
            onChange({ blockKey, offset: Number(offsetStr) });
          }}>
          {options.map((o) => (
            <MenuItem
              key={`${o.blockKey}:${o.offset}`}
              value={`${o.blockKey}:${o.offset}`}>
              {o.preview}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Stack>
  );
};

/**
 * Build a flat list of word-boundary cut points across every block of the rich text.
 * A cut option points at the position immediately AFTER a word — so the text up to
 * and including that word lands on the left half, and the next whitespace + remaining
 * text lands on the right.
 *
 * Both mid-line and end-of-line word boundaries are valid cut points (the BE slicer
 * treats `offset >= text.length` as "entire block goes left, next block starts the
 * right side"). The only boundary we skip is the very end of the LAST block — that
 * would leave the right side empty.
 *
 * The preview shows up to `PREVIEW_WINDOW` chars on either side of the cut. For
 * end-of-line cuts we pull the right-side preview from the start of the next block,
 * so the chip reads `…<line N tail> ✂ <line N+1 head>…` — much easier to locate
 * than `…<tail> ✂ …` with an empty right context.
 */
function buildWordOptions(rich: any | null): WordOption[] {
  if (!rich?.blocks?.length) return [];
  const out: WordOption[] = [];
  const blocks = rich.blocks;
  for (let blockIdx = 0; blockIdx < blocks.length; blockIdx++) {
    const blk = blocks[blockIdx];
    const text: string = blk.text ?? '';
    if (!text) continue;
    const isLastBlock = blockIdx === blocks.length - 1;
    // Match word boundaries: position immediately after each non-whitespace run.
    const re = /\S+/g;
    let m: RegExpExecArray | null;
    while ((m = re.exec(text)) !== null) {
      const wordEnd = m.index + m[0].length;
      const atBlockEnd = wordEnd >= text.length;
      // Drop the no-op cut at the end of the entire Mishna (nothing for the right half).
      if (atBlockEnd && isLastBlock) continue;
      const left = text.slice(Math.max(0, wordEnd - PREVIEW_WINDOW), wordEnd);
      // For end-of-line cuts, peek into the next block so the editor still sees context
      // on the right. Falls back to in-block text for mid-line cuts.
      const right = atBlockEnd
        ? (blocks[blockIdx + 1]?.text ?? '').slice(0, PREVIEW_WINDOW)
        : text.slice(wordEnd, wordEnd + PREVIEW_WINDOW);
      out.push({
        blockKey: blk.key,
        offset: wordEnd,
        preview: `…${left} ✂ ${right}…`,
      });
    }
  }
  return out;
}

/* ============================================================
   Chip builder
   ============================================================ */

interface LayoutChip {
  key: string;
  label: string;
  color: 'default' | 'primary' | 'secondary';
  variant: 'filled' | 'outlined';
  /** Only set on operation-derived chips so the user can revert them via the chip's delete icon. */
  operationIdx?: number;
}

function buildLayoutChips(
  structure: { source: string }[],
  operations: HalachaOperation[],
): LayoutChip[] {
  // Map each source to the operation that claims it (if any).
  const opIdxBySource = new Map<string, number>();
  for (let i = 0; i < operations.length; i++) {
    const op = operations[i];
    if (op.kind === 'unify') {
      op.sources.forEach((s) => opIdxBySource.set(s, i));
    } else {
      opIdxBySource.set(op.source, i);
    }
  }

  const seenOps = new Set<number>();
  const chips: LayoutChip[] = [];
  for (const h of structure) {
    const opIdx = opIdxBySource.get(h.source);
    if (opIdx === undefined) {
      chips.push({
        key: `pass-${h.source}`,
        label: hebrewMap.get(h.source) ?? h.source,
        color: 'default',
        variant: 'outlined',
      });
      continue;
    }
    if (seenOps.has(opIdx)) continue; // subsequent unify sources already rendered as one chip
    seenOps.add(opIdx);
    const op = operations[opIdx];
    if (op.kind === 'unify') {
      chips.push({
        key: `unify-${opIdx}`,
        label: formatUnifiedName(op.sources),
        color: 'primary',
        variant: 'filled',
        operationIdx: opIdx,
      });
    } else {
      const parts = op.sugiaBoundaries.length + 1;
      const labels = Array.from({ length: parts }, (_, i) =>
        formatSplitPartName(op.source, i + 1),
      );
      chips.push({
        key: `split-${opIdx}`,
        label: labels.join(' | '),
        color: 'secondary',
        variant: 'filled',
        operationIdx: opIdx,
      });
    }
  }
  return chips;
}

/**
 * Best-effort axios error formatter — surfaces server-side validation messages
 * (e.g. "Split operation 0: source halacha 003 has only 1 sugia(s)…").
 */
function formatError(e: any, fallback: string): string {
  const msg = e?.response?.data?.message;
  if (Array.isArray(msg)) return msg.join('; ');
  if (typeof msg === 'string') return msg;
  return e?.message ?? fallback;
}
