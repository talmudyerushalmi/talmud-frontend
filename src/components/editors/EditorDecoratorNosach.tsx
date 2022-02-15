import { Tooltip, Typography } from "@mui/material";
import { CompositeDecorator } from "draft-js";
import { NosachEntity } from "../edit/MainLineEditor/MainLineDialog";

function getFindStrategy(type) {
  return function findEntities(contentBlock, callback, contentState) {
    contentBlock.findEntityRanges((character) => {
      const entityKey = character.getEntity();
      return (
        entityKey !== null &&
        contentState.getEntity(entityKey).getType() === type
      );
    }, callback);
  };
}

const Delete = (props) => {
  const { editingComment } = props.contentState
    .getEntity(props.entityKey)
    .getData();

  return (
    <div
      style={{
        textDecoration: "line-through",
        color: "red",
        display: "inline-block",
      }}
    >
      <Tooltip title={editingComment}>
        <span>{props.children}</span>
      </Tooltip>
    </div>
  );
};
const Add = (props) => {
  const { editingComment } = props.contentState
    .getEntity(props.entityKey)
    .getData();
  return (
    <div style={{ color: "blue", display: "inline-block" }}>
      <Tooltip title={editingComment}>
        <span>{props.children}</span>
      </Tooltip>
    </div>
  );
};
const Correction = (props) => {
  const { editingComment, oldWord } = props.contentState
    .getEntity(props.entityKey)
    .getData();
  const tooltipText = `תוקן מ- "${oldWord}"`;

  const tip = (
    <>
      <Typography color="inherit" dir="rtl">
        {tooltipText}
      </Typography>
      {editingComment}
    </>
  );

  return (
    <div style={{ color: "green", display: "inline-block" }}>
      <Tooltip title={tip}>
        <span>{props.children}</span>
      </Tooltip>
    </div>
  );
};

const Quote = (props) => {
  const { linkTo } = props.contentState.getEntity(props.entityKey).getData();
  return (
    <div style={{ background: "grey", color: "blue", display: "inline-block" }}>
      <Tooltip title={linkTo}>
        <span>{props.children}</span>
      </Tooltip>
    </div>
  );
};

export const deleteDecorator = {
  strategy: getFindStrategy(NosachEntity.DELETE),
  component: Delete,
};

export const addDecorator = {
  strategy: getFindStrategy(NosachEntity.ADD),
  component: Add,
};

export const quoteDecorator = {
  strategy: getFindStrategy(NosachEntity.QUOTE),
  component: Quote,
};

export const correctionDecorator = {
  strategy: getFindStrategy(NosachEntity.CORRECTION),
  component: Correction,
};
export const compoundNosachDecorators = new CompositeDecorator([
  addDecorator,
  deleteDecorator,
  quoteDecorator,
  correctionDecorator,
]);
