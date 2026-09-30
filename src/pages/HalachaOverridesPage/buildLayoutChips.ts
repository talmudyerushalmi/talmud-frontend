import { hebrewMap } from '../../inc/utils';
import {
  formatSplitPartName,
  formatUnifiedName,
} from '../../inc/halachaOverrideDisplay';
import {
  HalachaOperation,
  HalachaStructure,
} from '../../services/halachaOverride.service';

export interface LayoutChip {
  key: string;
  label: string;
  color: 'default' | 'primary' | 'secondary';
  variant: 'filled' | 'outlined';
  /** Only set on operation-derived chips so the user can revert them via the chip's delete icon. */
  operationIdx?: number;
}

/**
 * Build the "current layout" chip list shown to the editor for a chapter.
 *
 * Walks `structure` in original chapter order and emits one chip per visible
 * unit:
 *   - Passthrough halachas → grey outlined chip with the Hebrew id.
 *   - Unify operations → one primary filled chip covering all members
 *     (e.g. `ו-ז`); subsequent unify members are skipped.
 *   - Split operations → one secondary filled chip listing all parts
 *     (e.g. `ג1 | ג2`).
 *
 * Operation chips carry `operationIdx` so the caller can render a delete
 * icon that reverts the operation.
 */
export function buildLayoutChips(
  structure: HalachaStructure[],
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
