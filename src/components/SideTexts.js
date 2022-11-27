import React from 'react';
import Muvaot2 from './Muvaot2';
import Mishna from './Mishna';

const SideTexts = (props) => {
  console.log('side texts sg', props);
  const { sugia } = props;

  return (
    <>
      <div>
        <Mishna text={sugia.mishna.text} />
        <Muvaot2 title="מובאות" short={sugia.muvaot.short} long={sugia.muvaot.long} />
        <Muvaot2 title="מקבילות" short={sugia.muvaot.short} long={sugia.muvaot.long} />
        {/*
        <Muvaot/>
*/}
      </div>
    </>
  );
};

export default SideTexts;
