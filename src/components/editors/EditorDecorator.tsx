import { useTheme } from "@mui/material";

function findExcerptEntities(contentBlock, callback, contentState) {
  contentBlock.findEntityRanges((character) => {
    const entityKey = character.getEntity();
    return entityKey !== null && contentState.getEntity(entityKey).getType() === 'EXCERPT';
  }, callback);
}

const Excerpt = (props) => {
  const theme = useTheme();
  
  const { rawText } = props.contentState.getEntity(props.entityKey).getData();
  return (
    <span title={rawText} style={{...theme.editor.excerpt}}>
      {props.children}
    </span>
  );
};

export const excerptDecorator = {
  strategy: findExcerptEntities,
  component: Excerpt,
};
