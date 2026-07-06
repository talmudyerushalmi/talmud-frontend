import React, { useMemo } from 'react';
import {
  Alert,
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  Typography,
} from '@mui/material';
import { RawDraftContentState } from 'draft-js';
import { getHTMLFromRawContent } from '../../inc/editorUtils';
import { MishnaCut } from '../../services/halachaOverride.service';

interface MishnaCutPickerProps {
  richTextMishna: RawDraftContentState | null;
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

/**
 * Word-granularity cut-point picker for a halacha's Mishna text.
 *
 * Renders a read-only preview of the Mishna (via the same `getHTMLFromRawContent`
 * pipeline as the public reader) alongside a dropdown listing every valid
 * word-boundary cut point across all Draft.js blocks. Selecting an option
 * emits `{ blockKey, offset }` to the parent.
 *
 * If the halacha has no rich text (or empty blocks), renders a warning alert
 * instead of the picker — split cannot proceed without a Mishna to cut.
 *
 * The set of valid cut points is computed by `buildWordOptions` (below).
 */
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
function buildWordOptions(rich: RawDraftContentState | null): WordOption[] {
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

export default MishnaCutPicker;
