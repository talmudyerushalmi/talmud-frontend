import { CompositeDecorator, EditorState, Modifier, SelectionState } from 'draft-js';

/**
 * A display-layer projection of a rabbi mention, carrying the metadata needed to
 * render annotations next to the rabbi name in a Draft.js editor.
 */
export interface RabbiMentionDisplay {
  startIndex: number;
  endIndex: number;
  rabbiId: string;
  generation: string | null;
  isBavel: boolean;
  isEretzIsrael: boolean;
  doubt?: boolean;
}

/**
 * Builds the inline annotation string shown after a rabbi name.
 * The parts are joined without separators; visual spacing is handled by CSS
 * via the `RABBI_ANNOTATION` inline style.
 */
export const buildAnnotation = (
  generation: string | null,
  isBavel: boolean,
  isEretzIsrael: boolean,
  doubt?: boolean,
): string => {
  const parts: string[] = [];
  if (doubt) parts.push('?');
  if (generation) parts.push(generation);
  if (isBavel) parts.push('בבל');
  else if (isEretzIsrael) parts.push('א״י');
  return parts.join('');
};

/**
 * Applies highlight + annotation styles to a Draft.js editor state for each
 * provided rabbi mention. Mentions are processed right-to-left so that
 * annotation insertions don't shift the indices of subsequent mentions.
 *
 * @param editorState  Source editor state.
 * @param mentions     Display-layer mentions to render.
 * @param selectedIds  Rabbi IDs currently selected in the filter (rendered with `RABBI_SELECTED`).
 * @param decorator    Decorator to attach to the resulting `EditorState`.
 */
export const applyRabbiMentions = (
  editorState: EditorState,
  mentions: RabbiMentionDisplay[],
  selectedIds: string[],
  decorator: CompositeDecorator,
): EditorState => {
  let content = editorState.getCurrentContent();
  const blockKey = content.getFirstBlock().getKey();
  // Snapshot of the original text length; safe because we iterate right-to-left and
  // only insert text to the right of the current mention.
  const originalTextLength = content.getPlainText().length;
  const selectedIdSet = new Set(selectedIds);

  const sorted = [...mentions].sort((a, b) => b.startIndex - a.startIndex);

  for (const mention of sorted) {
    if (mention.startIndex >= originalTextLength) continue;
    if (mention.endIndex > originalTextLength) continue;
    if (mention.endIndex <= mention.startIndex) continue;

    const annotation = buildAnnotation(mention.generation, mention.isBavel, mention.isEretzIsrael, mention.doubt);
    if (annotation) {
      const insertAt = SelectionState.createEmpty(blockKey).merge({
        anchorOffset: mention.endIndex,
        focusOffset: mention.endIndex,
      });
      content = Modifier.insertText(content, insertAt, annotation);
      const annoSelection = SelectionState.createEmpty(blockKey).merge({
        anchorOffset: mention.endIndex,
        focusOffset: mention.endIndex + annotation.length,
      });
      content = Modifier.applyInlineStyle(content, annoSelection, 'RABBI_ANNOTATION');

      if (mention.doubt) {
        const doubtSelection = SelectionState.createEmpty(blockKey).merge({
          anchorOffset: mention.endIndex,
          focusOffset: mention.endIndex + 1,
        });
        content = Modifier.applyInlineStyle(content, doubtSelection, 'RABBI_DOUBT');
      }
    }

    const annoLen = annotation.length;
    const nameSelection = SelectionState.createEmpty(blockKey).merge({
      anchorOffset: mention.startIndex,
      focusOffset: mention.endIndex,
    });
    content = Modifier.applyInlineStyle(content, nameSelection, 'RABBI_HIGHLIGHT');

    if (selectedIdSet.has(mention.rabbiId)) {
      content = Modifier.applyInlineStyle(content, nameSelection, 'RABBI_SELECTED');
      if (annoLen > 0) {
        const annoSel = SelectionState.createEmpty(blockKey).merge({
          anchorOffset: mention.endIndex,
          focusOffset: mention.endIndex + annoLen,
        });
        content = Modifier.applyInlineStyle(content, annoSel, 'RABBI_SELECTED');
      }
    }
  }

  return EditorState.createWithContent(content, decorator);
};
