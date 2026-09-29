import React, { useEffect, useMemo, useState } from 'react';
import {
  Box,
  Button,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  Typography,
} from '@mui/material';
import { hebrewMap } from '../../inc/utils';
import {
  HalachaStructure,
  MishnaCut,
  SplitOperation,
} from '../../services/halachaOverride.service';
import MishnaCutPicker from './MishnaCutPicker';

interface SplitControlsProps {
  eligibleSources: HalachaStructure[];
  onApply: (op: SplitOperation) => void;
}

/**
 * Editor subform for creating a new SPLIT operation.
 *
 * Interaction flow:
 *   1. Pick the source halacha (must have >= 2 sugias — the outer dropdown
 *      already filters non-splittable ones out).
 *   2. Pick the number of parts (2 or 3). Selecting 3 requires >= 3 sugias.
 *   3. For each cut point, pick a sugia boundary (strictly increasing, see
 *      `boundaryOptionsFor`) and a word-level mishna cut via `<MishnaCutPicker>`.
 *
 * On apply, emits a fully-formed `SplitOperation` via `onApply` and resets
 * the local form state. The parent owns the operations list and persistence.
 */
const SplitControls: React.FC<SplitControlsProps> = ({
  eligibleSources,
  onApply,
}) => {
  const [source, setSource] = useState<string>('');
  const [parts, setParts] = useState<2 | 3>(2);
  const [sugiaBoundaries, setSugiaBoundaries] = useState<(number | '')[]>(['']);
  const [mishnaCuts, setMishnaCuts] = useState<(MishnaCut | null)[]>([null]);

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
            <MenuItem value={2}>2 חלקים</MenuItem>
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

export default SplitControls;
