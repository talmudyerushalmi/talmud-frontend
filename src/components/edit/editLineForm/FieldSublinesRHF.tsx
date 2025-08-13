import React from 'react';
import { useFieldArray, Control } from 'react-hook-form';
import SublineFieldRHF from './SublineFieldRHF';

interface Props {
  control: Control<any>;
  onRemoveSource: (i: number) => void;
}

const FieldSublinesRHF = (props: Props) => {
  const { control, onRemoveSource } = props;
  const { fields } = useFieldArray({
    control,
    name: 'sublines',
  });

  return (
    <div>
      {fields.map((field, index: number) => (
        <div key={field.id}>
          <SublineFieldRHF
            index={index}
            name={`sublines[${index}]`}
            control={control}
            onRemoveSource={(idToRemove: number) => {
              onRemoveSource(idToRemove);
            }}
          />
        </div>
      ))}
    </div>
  );
};

export default FieldSublinesRHF;
