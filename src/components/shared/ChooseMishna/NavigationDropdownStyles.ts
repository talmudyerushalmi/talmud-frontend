/**
 * Removes leading zeros from numeric strings
 * Used for displaying chapter and mishna numbers in English mode
 */
export const formatNumericId = (id: string): string => {
  return parseInt(id, 10).toString();
};

/**
 * Base Autocomplete styles - common settings for all dropdowns
 */
const getBaseAutocompleteStyles = (isHebrew: boolean, englishTransformOffset: string) => ({
  direction: isHebrew ? 'rtl' : 'ltr',
  // Isolate from global RTL context
  ...(!isHebrew && {
    '& *': { direction: 'ltr' },
  }),
  '&.MuiAutocomplete-root .MuiOutlinedInput-root .MuiAutocomplete-input': {
    padding: 0,
  },
  '& .MuiAutocomplete-endAdornment': {
    left: 'unset',
    right: '7px',
    display: 'flex',
    flexDirection: 'row-reverse',
    ...(!isHebrew && {
      transform: `translateX(calc(-100% + ${englishTransformOffset})) translateY(-12px)`,
    }),
  },
});

/**
 * Shared styles for Autocomplete components in ChooseMishna forms
 * Handles RTL/LTR positioning of endAdornment (dropdown arrow and clear button)
 */
export const getChooseMishnaAutocompleteStyles = (isHebrew: boolean) => ({
  minWidth: 80,
  maxWidth: 120,
  flex: 1,
  ...getBaseAutocompleteStyles(isHebrew, '110px'),
});

/**
 * Wider styles for Tractate dropdown (uses more space since it's shared between both nav methods)
 */
export const getChooseTractateAutocompleteStyles = (isHebrew: boolean) => ({
  minWidth: 120,
  maxWidth: 160,
  flex: 1.3,
  ...getBaseAutocompleteStyles(isHebrew, '150px'),
});

/**
 * Narrower styles for Daf and Amud dropdowns (less important, should be compact)
 */
export const getChooseDafAmudAutocompleteStyles = (isHebrew: boolean) => ({
  minWidth: 60,
  maxWidth: 90,
  flex: 0.7,
  ...getBaseAutocompleteStyles(isHebrew, '85px'),
});

/**
 * TextField styles specifically for Daf and Amud dropdowns
 * Adjusts text positioning to fit within narrower boxes
 */
export const getChooseDafAmudTextFieldStyles = (isHebrew: boolean) => ({
  '& .MuiInputBase-input': {
    textAlign: isHebrew ? 'left' : 'right',
    marginRight: isHebrew ? '-15px' : '-50px',
    marginLeft: isHebrew ? '10px' : 0,
  },
  '& .MuiInputLabel-root': {
    left: isHebrew ? 0 : 'unset',
    right: isHebrew ? 'unset' : 30,
    transformOrigin: isHebrew ? 'top left' : 'top right',
    top: '-4px',
  },
  '& .MuiOutlinedInput-notchedOutline legend': {
    textAlign: isHebrew ? 'left' : 'right',
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
    top: '-4px',
  },
  '& .MuiOutlinedInput-notchedOutline legend': {
    textAlign: isHebrew ? 'left' : 'right',
  },
});
