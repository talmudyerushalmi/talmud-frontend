import { Controller, Control } from 'react-hook-form';
import RichTextEditor from './RichTextEditor';

interface Props {
  name: string;
  control: Control<any>;
  label: string;
}

const RichTextEditorField = ({ name, control, label }: Props) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, value } }) => (
        <div>
          <label>{label}</label>
          <RichTextEditor editorState={value} onChange={onChange} />
        </div>
      )}
    />
  );
};

export default RichTextEditorField;