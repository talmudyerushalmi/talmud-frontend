import React, { useMemo, useState } from 'react';
import { Box, Typography, Chip, FormControlLabel, Checkbox, Button, Alert, Divider } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { Rabbi, RabbiMention, searchRabbies } from '../../services/tagging.service';
import { RabbiCard } from './RabbiCard';
import { RabbiSearchBox } from './RabbiSearchBox';

interface MentionAlternativesEditorProps {
  mention: RabbiMention;
  onUpdate: (updates: Partial<RabbiMention>) => void;
}

/**
 * Per-mention editor for marking a rabbi mention as "questionable" (doubt) and
 * managing its list of alternative rabbi candidates. Internal UI state
 * (search query, predictions toggle) resets automatically when this component
 * remounts via a different `key` (see usage in TaggingPage).
 */
export const MentionAlternativesEditor: React.FC<MentionAlternativesEditorProps> = ({ mention, onUpdate }) => {
  const [alternativeSearchQuery, setAlternativeSearchQuery] = useState('');
  const [showAltPredictions, setShowAltPredictions] = useState(false);

  const isDoubt = !!mention.doubt;
  const alternatives = useMemo(() => mention.alternatives || [], [mention.alternatives]);

  const isCandidate = (r: Rabbi) =>
    r.id !== mention.rabbiId && !alternatives.some(a => a.rabbiId === r.id);

  const altPredicted = useMemo(() => {
    if (!showAltPredictions) return [];
    return searchRabbies(mention.text, 10).filter(isCandidate);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showAltPredictions, mention.text, mention.rabbiId, alternatives]);

  const manualSearchResults = useMemo(() => {
    if (!alternativeSearchQuery) return [];
    return searchRabbies(alternativeSearchQuery, 10).filter(isCandidate);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [alternativeSearchQuery, mention.rabbiId, alternatives]);

  const handleDoubtChange = (checked: boolean) => {
    onUpdate({ doubt: checked, alternatives: checked ? mention.alternatives : undefined });
    setAlternativeSearchQuery('');
    setShowAltPredictions(false);
  };

  const handleAddAlternative = (rabbi: Rabbi) => {
    onUpdate({ alternatives: [...alternatives, { rabbiId: rabbi.id, rabbiName: rabbi.displayName }] });
    setAlternativeSearchQuery('');
  };

  const handleRemoveAlternative = (idx: number) => {
    onUpdate({ alternatives: alternatives.filter((_, i) => i !== idx) });
  };

  return (
    <>
      <Typography variant="caption" color="primary" display="block" mb={0.5}>
        עריכת: {mention.rabbiName} — "{mention.text}"
      </Typography>
      <FormControlLabel
        control={<Checkbox size="small" checked={isDoubt} onChange={e => handleDoubtChange(e.target.checked)} />}
        label={<Typography variant="caption">לא בטוח</Typography>}
        sx={{ mb: 0.5, ml: 0 }}
      />
      {isDoubt && (
        <Box sx={{ mb: 1.5, p: 1, border: '1px dashed #f57f17', borderRadius: 1, backgroundColor: '#fffde7' }}>
          <Typography variant="caption" fontWeight="bold" display="block" mb={0.5}>
            חכמים חלופיים:
          </Typography>
          {alternatives.length > 0 && (
            <Box display="flex" flexWrap="wrap" gap={0.5} mb={1}>
              {alternatives.map((alt, i) => (
                <Chip
                  key={i}
                  label={alt.rabbiName}
                  size="small"
                  color="warning"
                  onDelete={() => handleRemoveAlternative(i)}
                  sx={{ fontSize: '0.7rem' }}
                />
              ))}
            </Box>
          )}

          {!showAltPredictions && (
            <Button variant="contained" size="small" startIcon={<SearchIcon />}
              onClick={() => setShowAltPredictions(true)} sx={{ mb: 1, whiteSpace: 'nowrap' }}>
              חפש חכם
            </Button>
          )}

          {showAltPredictions && (
            <>
              <Alert severity="success" sx={{ mb: 1, py: 0.5, fontSize: '0.75rem' }}>
                התאמות עבור: "<strong>{mention.text}</strong>"
              </Alert>
              {altPredicted.length > 0 ? (
                <>
                  <Typography variant="caption" color="text.secondary" display="block" mb={0.5}>
                    לחץ על חכם להוספה ({altPredicted.length} תוצאות):
                  </Typography>
                  {altPredicted.map(r => (
                    <RabbiCard key={r.id} rabbi={r} clickable onClick={() => handleAddAlternative(r)} />
                  ))}
                </>
              ) : (
                <Typography variant="caption" color="text.secondary" display="block" mb={0.5}>
                  לא נמצאו התאמות אוטומטיות
                </Typography>
              )}
              <Divider sx={{ my: 1 }} />
            </>
          )}

          <Typography variant="caption" color="text.secondary" display="block" mb={0.5}>
            {showAltPredictions ? 'לא מצאת? חפש ידנית:' : 'או חפש ידנית:'}
          </Typography>
          <RabbiSearchBox value={alternativeSearchQuery} onChange={setAlternativeSearchQuery} />
          {manualSearchResults.map(rabbi => (
            <RabbiCard key={rabbi.id} rabbi={rabbi} clickable onClick={() => handleAddAlternative(rabbi)} />
          ))}
        </Box>
      )}
    </>
  );
};
