import React from 'react';
import { Tabs, Tab, Box } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import { formatSplitPartName } from '../../inc/halachaOverrideDisplay';

interface Props {
  /** Original (pre-split) halacha id, e.g. '003'. Used to label tabs like \u05d31, \u05d32, \u05d33. */
  source: string;
  /** Total number of parts the original halacha is split into (2 or 3). */
  parts: number;
  /** 1-based index of the part currently displayed. */
  currentPart: number;
}

/**
 * In-page tab strip shown at the top of a split halacha. Switching tabs updates the
 * `?part=N` query parameter so URLs are shareable; the path itself stays anchored on
 * the original halacha's id (e.g. `/talmud/chala/001/003?part=2`).
 *
 * Only renders when there are 2+ parts.
 */
const SplitPartTabs: React.FC<Props> = ({ source, parts, currentPart }) => {
  const location = useLocation();
  const navigate = useNavigate();

  if (!parts || parts < 2) return null;

  const handleChange = (_e: React.SyntheticEvent, newPart: number) => {
    if (newPart === currentPart) return;
    const sp = new URLSearchParams(location.search);
    // Part 1 is the default — drop the query param entirely so the URL stays clean.
    if (newPart <= 1) sp.delete('part');
    else sp.set('part', String(newPart));
    const qs = sp.toString();
    navigate(`${location.pathname}${qs ? `?${qs}` : ''}`, { replace: false });
  };

  return (
    <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
      <Tabs
        value={currentPart}
        onChange={handleChange}
        aria-label="חלקי ההלכה"
        variant="standard">
        {Array.from({ length: parts }, (_, i) => i + 1).map((p) => (
          <Tab key={p} value={p} label={formatSplitPartName(source, p)} />
        ))}
      </Tabs>
    </Box>
  );
};

export default SplitPartTabs;
