import React from 'react';
import { create } from 'jss';
import rtl from 'jss-rtl';
import StylesProvider from '@mui/styles/StylesProvider';
import jssPreset from '@mui/styles/jssPreset';

// Configure JSS
const jss = create({ plugins: [...jssPreset().plugins, rtl()] });

export function RTL(props) {
  return (
    <StylesProvider jss={jss}>
      {props.children}
    </StylesProvider>
  );
}