import { getDefaultKeyBinding } from "draft-js";

  // don't allow typing in editor - used just for selection
  export const keyBindingArrowsOnly = (k) => {
    const allowed = ['ArrowLeft','ArrowRight','ArrowDown','ArrowUp'];
    if (allowed.indexOf(k.key)!==-1) {
      return getDefaultKeyBinding(k)

    }
    return 'not-handled'

  }
