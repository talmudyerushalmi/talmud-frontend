import React, { useMemo, useState } from 'react';
import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Typography,
} from '@mui/material';
import { hebrewMap } from '../../inc/utils';
import { HalachaStructure } from '../../services/halachaOverride.service';

interface UnifyControlsProps {
  eligibleSources: HalachaStructure[];
  structure: HalachaStructure[];
  onApply: (sources: string[]) => void;
}

/**
 * Editor subform for creating a new UNIFY operation.
 *
 * Interaction flow:
 *   1. Pick the leading halacha to unify (from `eligibleSources`).
 *   2. Pick how many halachas to unify (2 or 3).
 *   3. Partners are auto-resolved: the immediately following halachas in
 *      chapter order. Every partner must still be a passthrough (i.e.
 *      present in `eligibleSources`) — otherwise apply stays disabled.
 *
 * Enforcing adjacent-only partners here matches the BE constraint that
 * `UnifyOperation.sources` must be contiguous in the original chapter order.
 *
 * On apply, emits `onApply([first, ...partners])` and resets local state.
 */
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

export default UnifyControls;
