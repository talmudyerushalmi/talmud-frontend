import { Button, Grid } from '@mui/material';
import { ToggleButton, ToggleButtonGroup } from '@mui/material';
import React from 'react';
import ExternalSourceDetails from '../ExternalSourceDetails';
import { connect } from 'react-redux';
import { iInternalLink, iSubline } from '../../../types/types';
import { MakbilaMenu } from '../editLineForm/MakbilaList';

const mapStateToProps = (state) => ({
  tractateSettings: state.mishnaEdit.tractateSettings,
});

interface Props {
  tractateSettings: any;
  onAddSource: Function;
  onRemoveSource: Function;
  sources: iSubline[];
  parallels: iInternalLink[];
  onAddExternalSource: (source: string) => void;
  onUpdateInternalSources: (parallels: iInternalLink[]) => void;
}
const SourceButtons = (props: Props) => {
  const { tractateSettings, onAddSource, onRemoveSource, sources, parallels, onUpdateInternalSources } = props;
  let selected: string[] = [];
  if (sources.length && sources[0].synopsis) {
    selected = sources[0]?.synopsis.filter((s) => (s.type === 'direct_sources' || s.type === 'translation')).map((s) => s.id);
  }
  const { synopsisAllowed, synopsisList } = tractateSettings;

  const onAddExternalSource = (composition) => {
    const add = {
      id: Date.now(),
      type: 'indirect_sources',
      name: `${composition.composition.title}`,
      location: `${composition.compositionLocation}`,
      composition: {
        ...composition,
      },
    };
    onAddSource(add);
  };
  const updateSynopsis = (button: string) => {
    // add
    if (!selected.includes(button)) {
      const add = {
        id: button,
        ...synopsisList[button],
      };
      onAddSource(add);
    } else {
      onRemoveSource(button);
    }
  };

  return (
    <>
      <Grid container>
        <Grid item>
          <ToggleButtonGroup value={selected}>
            {synopsisAllowed.map((button) => {
              return (
                <ToggleButton key={button} onClick={(e) => updateSynopsis(button)} value={button} aria-label={button}>
                  {synopsisList[button].name}
                </ToggleButton>
              );
            })}
          </ToggleButtonGroup>
        </Grid>
        <Grid item>
          <ExternalSourceDetails
            onAddExternalSource={(composition) => {
              onAddExternalSource(composition);
            }}
          />
        </Grid>
        <Grid item>
          <MakbilaMenu parallels={parallels} onUpdateInternalSources={onUpdateInternalSources} />
        </Grid>
      </Grid>
    </>
  );
};
export default connect(mapStateToProps)(SourceButtons);
