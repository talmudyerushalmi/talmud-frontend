import { CompositeDecorator } from "draft-js";
import { NosachEntity } from "../edit/MainLineEditor/MainLineDialog";

function getFindStrategy(type){
  return function findEntities(contentBlock, callback, contentState) {
    contentBlock.findEntityRanges((character) => {
      const entityKey = character.getEntity();
      return (
        entityKey !== null &&
        contentState.getEntity(entityKey).getType() === type
      );
    }, callback);
  }
}


const Delete = (props) => {
  const { rawText } = props.contentState.getEntity(props.entityKey).getData();
  return (
    <span
      title={rawText}
      style={{ textDecoration:'line-through', color: "green" }}
    >
      {props.children}
    </span>
  );
};
const Add = (props) => {
  const { rawText } = props.contentState.getEntity(props.entityKey).getData();
  return (
    <span
      title={rawText}
      style={{  color: "blue" }}
    >
      {props.children}
    </span>
  );
};

const Quote = (props) => {
  const { rawText } = props.contentState.getEntity(props.entityKey).getData();
  return (
    <span
      title={rawText}
      style={{ background: 'grey', color: "blue" }}
    >
      {props.children}
    </span>
  );
};

export const deleteDecorator = 
  {
    strategy: getFindStrategy(NosachEntity.DELETE),
    component: Delete,
  };

export const addDecorator = 
  {
    strategy: getFindStrategy(NosachEntity.ADD),
    component: Add,
  };

export const quoteDecorator = 
  {
    strategy: getFindStrategy(NosachEntity.QUOTE),
    component: Quote,
  };

export const compoundNosachDecorators = new CompositeDecorator([addDecorator, deleteDecorator, quoteDecorator]);  
