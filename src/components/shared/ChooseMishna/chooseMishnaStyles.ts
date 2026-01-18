/**
 * Removes leading zeros from numeric strings
 * Used for displaying chapter and mishna numbers in English mode
 */
export const formatNumericId = (id: string): string => {
  return parseInt(id, 10).toString();
};

/**
 * Shared styles for Autocomplete components in ChooseMishna forms
 * Handles RTL/LTR positioning of endAdornment (dropdown arrow and clear button)
 */

export const getChooseMishnaAutocompleteStyles = (isHebrew: boolean) => ({
  minWidth: 80,
  maxWidth: 120,
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
 * Wider styles for Tractate dropdown (uses more space since it's shared between both nav methods)
 */
export const getChooseTractateAutocompleteStyles = (isHebrew: boolean) => ({
  minWidth: 120,
  maxWidth: 160,
  flex: 1.3,
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
