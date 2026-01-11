/**
 * Shared styles for Autocomplete components in ChooseMishna forms
 * Handles RTL/LTR positioning of endAdornment (dropdown arrow and clear button)
 */

export const getChooseMishnaAutocompleteStyles = (isHebrew: boolean) => ({
  minWidth: 100,
  flex: 1,
  direction: isHebrew ? 'rtl' : 'ltr',
  // Isolate from global RTL context
  ...(!isHebrew && {
    '& *': { direction: 'ltr' },
  }),
  '&.MuiAutocomplete-root .MuiOutlinedInput-root .MuiAutocomplete-input': {
    padding: 0,
  },
  '& .MuiAutocomplete-endAdornment': {
    left: isHebrew ? 'unset' : '7px',
    right: isHebrew ? '7px' : 'unset',
    display: 'flex',
    flexDirection: 'row-reverse',
    ...(!isHebrew && {
      transform: 'translateX(-290px) translateY(-12px)',
    }),
  },
});
