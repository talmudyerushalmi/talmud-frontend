import React from 'react';
import { useFieldArray, Control } from 'react-hook-form';
import SublineField from './SublineField';

interface Props {
  control: Control<any>;
  onRemoveSource: (i: number) => void;
  onFieldChange?: () => void;
}

const FieldSublines = (props: Props) => {
  const { control, onRemoveSource, onFieldChange } = props;
  const { fields } = useFieldArray({
    control,
    name: 'sublines',
  });

  return (
    <div>
      {fields.map((field, index: number) => (
        <div key={field.id}>
          <SublineField
            index={index}
            name={`sublines[${index}]`}
            control={control}
            onRemoveSource={(idToRemove: number) => {
              onRemoveSource(idToRemove);
            }}
            onFieldChange={onFieldChange}
          />
        </div>
      ))}
    </div>
  );
};

export default FieldSublines;
