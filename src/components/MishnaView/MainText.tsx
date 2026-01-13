import React from 'react';
import { connect } from 'react-redux';
import { iLine } from '../../types/types';
import MainLines from './MainLines';
import UndividedText from './UndividedText';

const mapStateToProps = (state) => ({
  divideToLines: state.mishnaView.divideToLines,
  showPunctuation: state.mishnaView.showPunctuation,
  showSources: state.mishnaView.showSources,
});

interface Props {
  lines: iLine[];
  divideToLines: boolean;
  showPunctuation: boolean;
  showSources: boolean;
  mishna: string;
  dafAmudMarkers?: Array<{
    line: string;
    word_pos: number;
    daf: string;
    amud: string;
  }>;
}
const MainText = (props: Props) => {
  const { lines, divideToLines, showPunctuation, showSources, mishna, dafAmudMarkers } = props;
  if (!lines) {
    return null;
  }
  return (
    <>
      {divideToLines ? (
        <MainLines lines={lines} mishna={mishna} dafAmudMarkers={dafAmudMarkers} />
      ) : (
        <UndividedText lines={lines} showPunctuation={showPunctuation} showSources={showSources} />
      )}

      {/* <SectionNosach
        nosach = {nosach}
      /> */}
    </>
  );
};

export default connect(mapStateToProps)(MainText);
