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
      transform: 'translateX(calc(100% - 60px)) translateY(-12px)',
    }),
  },
});

/**
 * Shared styles for TextField components in ChooseMishna forms
 * Handles RTL/LTR text alignment and label positioning
 */
export const getChooseMishnaTextFieldStyles = (isHebrew: boolean) => ({
  '& .MuiInputBase-input': {
    textAlign: isHebrew ? 'left' : 'right',
    marginRight: isHebrew ? 0 : '-50px',
  },
  '& .MuiInputLabel-root': {
    left: isHebrew ? 0 : 'unset',
    right: isHebrew ? 'unset' : 30,
    transformOrigin: isHebrew ? 'top left' : 'top right',
  },
  '& .MuiOutlinedInput-notchedOutline legend': {
    textAlign: isHebrew ? 'left' : 'right',
  },
});
