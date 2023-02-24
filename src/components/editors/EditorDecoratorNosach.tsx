import { Tooltip, useTheme } from '@mui/material';
import { CompositeDecorator } from 'draft-js';
import { NosachEntity } from '../edit/MainLineEditor/MainLineDialog';

function getFindStrategy(type) {
  return function findEntities(contentBlock, callback, contentState) {
    contentBlock.findEntityRanges((character) => {
      const entityKey = character.getEntity();
      return entityKey !== null && contentState.getEntity(entityKey).getType() === type;
    }, callback);
  };
}

const DeleteOriginal = (props) => {
  const { editingComment } = props.contentState.getEntity(props.entityKey).getData();

  return (
    <div
      style={{
        textDecoration: 'line-through',
        color: 'red',
        display: 'inline-block',
      }}>
      <Tooltip title={editingComment}>
        <span>{props.children}</span>
      </Tooltip>
    </div>
  );
};
const Add = (props) => {
  const theme = useTheme();
  const { editingComment } = props.contentState.getEntity(props.entityKey).getData();
  const tooltip = (
    <>
      <div dir="rtl">תוספת</div>
      <div>{editingComment}</div>
    </>
  );
  return (
    <div style={{ display: 'inline-block', ...theme.editor.decorators.add }}>
      <Tooltip title={tooltip}>
        <span>{props.children}</span>
      </Tooltip>
    </div>
  );
};
const Correction = (props) => {
  const { editingComment, oldWord } = props.contentState.getEntity(props.entityKey).getData();
  const tooltipText = `תוקן מ-  "${oldWord}"`;

  const tip = (
    <>
      <div color="inherit" dir="rtl">
        {tooltipText}
      </div>
      {editingComment}
    </>
  );

  return (
    <div style={{ color: 'green', display: 'inline-block' }}>
      <Tooltip title={tip}>
        <span>{props.children}</span>
      </Tooltip>
    </div>
  );
};
const AddOriginal = (props) => {
  const theme = useTheme();
  const { editingComment } = props.contentState.getEntity(props.entityKey).getData();
  const tooltip = (
    <>
      <div dir="rtl">תוספת: "{props.children}"</div>
      <div>{editingComment}</div>
    </>
  );
  return (
    <div style={{ display: 'inline-block', ...theme.editor.decorators.add }}>
      <Tooltip title={tooltip}>
        <span>*</span>
      </Tooltip>
    </div>
  );
};

const AddCombined = (props) => {
  const theme = useTheme();
  const { editingComment } = props.contentState.getEntity(props.entityKey).getData();

  return (
    <div style={{ display: 'inline-block',  ...theme.editor.decorators.add }}>
      <span>{'<'}</span>
      <span>{props.children}</span>
      <span>{'>'}</span>
    </div>
  );
};

const Delete = (props) => {
  const { editingComment } = props.contentState.getEntity(props.entityKey).getData();
  const tooltip = (
    <>
      <div dir="rtl">מחיקה: "{props.children}"</div>
      <div>{editingComment}</div>
    </>
  );
  return (
    <div
      style={{
        color: 'red',
        display: 'inline-block',
      }}>
      <Tooltip title={tooltip}>
        <span>*</span>
      </Tooltip>
    </div>
  );
};

const DeleteCombined = (props) => {
  return (
    <div
      style={{
        display: 'inline-block',
        color: 'red',
      }}>
      <span>{'<'}</span>
      <span>{props.children}</span>
      <span>{'>'}</span>
    </div>
  );
};

const CorrectionOriginal = (props) => {
  const { editingComment, oldWord } = props.contentState.getEntity(props.entityKey).getData();
  const { decoratedText } = props;
  const tooltipText = `צ״ל: "${decoratedText}"`;

  const tip = (
    <>
      <div color="inherit" dir="rtl">
        {tooltipText}
      </div>
      {editingComment}
    </>
  );

  return (
    <div style={{ color: 'green', display: 'inline-block' }}>
      <Tooltip title={tip}>
        <span>{oldWord}</span>
      </Tooltip>
    </div>
  );
};

const CorrectionCombined = (props) => {
  const theme = useTheme();
  const { oldWord } = props.contentState.getEntity(props.entityKey).getData();

  return (
    <>
      <div style={{ display: 'inline-block', color:'red' }}>
        <span>{'{'}</span>
        <span>{oldWord}</span>
        <span>{'}'}</span>
      </div>
      <div style={{ display: 'inline-block',   ...theme.editor.decorators.add }}>
        <span>{'<'}</span>
        <span>{props.children}</span>
        <span>{'>'}</span>
      </div>
    </>
  );
};

const Quote = (props) => {
  const { linkTo } = props.contentState.getEntity(props.entityKey).getData();
  return (
    <div style={{ display: 'inline-block' }}>
      <Tooltip title={linkTo}>
        <span>"{props.children}"</span>
      </Tooltip>
    </div>
  );
};

export const deleteDecorator = {
  strategy: getFindStrategy(NosachEntity.DELETE),
  component: Delete,
};

export const deleteOriginalDecorator = {
  strategy: getFindStrategy(NosachEntity.DELETE),
  component: DeleteOriginal,
};

export const deleteCombinedDecorator = {
  strategy: getFindStrategy(NosachEntity.DELETE),
  component: DeleteCombined,
};

export const addDecorator = {
  strategy: getFindStrategy(NosachEntity.ADD),
  component: Add,
};

export const addOriginalDecorator = {
  strategy: getFindStrategy(NosachEntity.ADD),
  component: AddOriginal,
};

export const addCombinedDecorator = {
  strategy: getFindStrategy(NosachEntity.ADD),
  component: AddCombined,
};

export const quoteDecorator = {
  strategy: getFindStrategy(NosachEntity.QUOTE),
  component: Quote,
};

export const correctionDecorator = {
  strategy: getFindStrategy(NosachEntity.CORRECTION),
  component: Correction,
};

export const correctionOriginalDecorator = {
  strategy: getFindStrategy(NosachEntity.CORRECTION),
  component: CorrectionOriginal,
};

export const correctionCombinedDecorator = {
  strategy: getFindStrategy(NosachEntity.CORRECTION),
  component: CorrectionCombined,
};

export const compoundEditedNosachDecorators = new CompositeDecorator([
  addDecorator,
  deleteDecorator,
  quoteDecorator,
  correctionDecorator,
]);

export const compoundOriginalDecorators = new CompositeDecorator([
  addOriginalDecorator,
  deleteOriginalDecorator,
  quoteDecorator,
  correctionOriginalDecorator,
]);

export const compoundCombinedDecorators = new CompositeDecorator([
  addCombinedDecorator,
  deleteCombinedDecorator,
  quoteDecorator,
  correctionCombinedDecorator,
]);

export const compoundNosachDecoratorsForEditing = new CompositeDecorator([
  addDecorator,
  deleteOriginalDecorator,
  quoteDecorator,
  correctionDecorator,
]);
