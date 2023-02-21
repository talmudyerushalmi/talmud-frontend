import React from 'react';

const SettingsContext = React.createContext({
    mode: 'dark',
    toggleMode: ()=>{console.log('toggle mode')}
});

export default SettingsContext;