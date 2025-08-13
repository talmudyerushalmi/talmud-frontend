import React from 'react';
import { Control, useController } from 'react-hook-form';
import { connect } from 'react-redux';
import { IconButton, Paper, Tooltip } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import SynopsisField from '../SynopsisField';
import MainLineEditor from '../MainLineEditor/MainLineEditor';
import { deleteSubline, saveNosach } from '../../../store/actions/mishnaEditActions';
import { routeObject } from '../../../store/reducers/navigationReducer';
import { useParams } from 'react-router';
import { RemoveCircle } from '@mui/icons-material';
import { RawDraftContentState } from 'draft-js';

const mapStateToProps = (state: any) => ({});
const mapDispatchToProps = (dispatch: any, ownProps: any) => ({
  saveNosach: async (
    route: Partial<routeObject>,
    index: number,
    newNosach: RawDraftContentState,
    nosachText: string[]
  ) => {
    dispatch(saveNosach(route, index, newNosach, nosachText));
  },
  deleteSubline: async (route: routeObject, index: number) => {
    dispatch(deleteSubline(route, index));
  },
});

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 345,
  },
  removeButton: {
    position: 'absolute',
    left: '-2.5rem',
    top: '-0.8rem',
  },
}));

interface Props {
  name: string;
  index: number;
  control: Control<any>;
  onRemoveSource: (id: number) => void;
  saveNosach: (route: Partial<routeObject>, line: number, nosach: RawDraftContentState, nosachText: string[]) => void;
  deleteSubline: (route: routeObject, index: number) => void;
}

const SublineField = (props: Props) => {
  const route = useParams<routeObject>();
  const { name, index, control, onRemoveSource, saveNosach, deleteSubline } = props;

  const {
    field: { value, onChange },
  } = useController({ name, control });

  if (!value?.synopsis) {
    value.synopsis = [];
  }

  const updateSource = (newVal: any) => {
    const indexToUpdate = value.synopsis.findIndex((s: any) => s.id === newVal.id);
    const updatedSynopsis = [...value.synopsis];
    if (indexToUpdate >= 0) {
      updatedSynopsis[indexToUpdate] = newVal;
    }
    onChange({ ...value, synopsis: updatedSynopsis });
  };

  const deleteSublineHandler = () => {
    deleteSubline(route as unknown as routeObject, value.index);
  };

  return (
    <>
      <Paper elevation={3} style={{ marginBottom: '1rem', padding: '0.5rem' }}>
        <SublineTitle index={index} onClick={deleteSublineHandler} />
        <MainLineEditor
          control={control}
          fieldName={name}
          lines={[value.text]}
          content={value.nosach}
          onSave={(nosach: RawDraftContentState, nosachText: string[]) => {
            saveNosach(route, value.index, nosach, nosachText);
          }}
        />

        {value.synopsis.map((source: any) => {
          return (
            <div key={source.id}>
              <SynopsisField
                source={source}
                onChange={(newVal: any) => {
                  updateSource(newVal);
                }}
                onDelete={() => {
                  onRemoveSource(source.id);
                }}
              />
            </div>
          );
        })}
      </Paper>
    </>
  );
};

const SublineTitle = (props: { index: number; onClick: () => void }) => {
  const classes = useStyles();
  const { index, onClick } = props;
  const removeButton = (
    <Tooltip title="איחוד תת השורה עם תת השורה שמעליה">
      <IconButton size="small" onClick={onClick} className={classes.removeButton}>
        <RemoveCircle></RemoveCircle>
      </IconButton>
    </Tooltip>
  );

  return <div style={{ direction: 'rtl', position: 'relative' }}>{index > 0 ? removeButton : null}</div>;
};

export default connect(mapStateToProps, mapDispatchToProps)(SublineField);
