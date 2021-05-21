
export const MUVAA = "MUVAA";
export const MAKBILA = "MAKBILA";

export const excerptsMap = new Map([
  [MUVAA, {
      title:"Citations"
  }],
  [MAKBILA, {
    title:"Talmudic Parallels"
}]
]);

export const excerptSelection = (subline, excerpt) => {
    if (!excerpt) { return null}
    let selection = {
      
    }
    if (subline.index === excerpt.selection.fromSubline) {
        selection.from = subline.text.indexOf(excerpt.selection.fromWord.trim());
        selection.to = subline.text.length
    }
    if (subline.index === excerpt.selection.toSubline) {
        selection.to = subline.text.indexOf(excerpt.selection.toWord.trim()) + excerpt.selection.toWord.trim().length;
    }
    if (subline.index > excerpt.selection.fromSubline && subline.index < excerpt.selection.toSubline) {
        selection.from = 0;
        selection.to = subline.text.length;
    }
    return selection;

}

export const getSelectionRange = (excerpt) => {
    if (!excerpt) {return null}
    return excerpt?.selection?.fromSubline === excerpt?.selection?.toSubline
    ? `${excerpt.selection.fromSubline}`
    : `${excerpt.selection.fromSubline}-${excerpt.selection.toSubline}`
}