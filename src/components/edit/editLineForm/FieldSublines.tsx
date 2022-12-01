import { FieldArray } from 'formik';
import React from 'react';
import { iSubline } from '../../../types/types';
import SublineField from './SublineField';

interface Props {
    sublines: iSubline[];
    onRemoveSource: (i: number)=>void
}
const FieldSublines = (props: Props) => {
  const { sublines,onRemoveSource } = props  
  console.log(sublines)
  return (
    <FieldArray
      name="sublines"
      render={(arrayHelpers) => (
        <div>
          {sublines.map((_, index: number) => (
            <div key={index}>
              <SublineField
                index={index}
                name={`sublines[${index}]`}
                onRemoveSource={(idToRemove: number) => {
                  onRemoveSource(idToRemove);
                }}
              />
            </div>
          ))}
        </div>
      )}
    />
  );
};

export default FieldSublines