import React, { useMemo, useRef } from 'react';
import { Box, Chip, Divider, FormControlLabel, List, ListItemButton, ListItemText, Switch, Typography } from '@mui/material';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';
import {
  toggleTaggedRabbi,
  toggleTaggedCategory,
  setTaggedSubline,
  toggleTaggedDetailed,
} from '../../store/actions/mishnaViewActions';
import {
  TaggingSubline,
  TAGGING_CATEGORIES,
  ALL_RABBIES,
  RabbiMention,
  RabbiAlternative,
  SublineCategory,
  CategoryConnection,
} from '../../services/tagging.service';
import { iMishna, iSubline } from '../../types/types';
import { themeConstants } from '../../ui/Theme';
import { useIsSticky } from '../../hooks/useIsSticky';
import { RabbiInfoChips } from '../tagging/RabbiInfoChips';

const mapStateToProps = (state: any) => ({
  taggingData: state.mishnaView.taggingData,
  selectedRabbis: state.mishnaView.selectedRabbis,
  selectedCategories: state.mishnaView.selectedCategories,
  selectedTaggedSubline: state.mishnaView.selectedTaggedSubline,
  selectedSublines: state.mishnaView.selectedSublines,
  currentMishna: state.navigation.currentMishna,
  taggedDetailedView: state.mishnaView.taggedDetailedView,
});

const mapDispatchToProps = (dispatch: any) => ({
  toggleRabbi: (rabbiId: string) => dispatch(toggleTaggedRabbi(rabbiId)),
  toggleCategory: (categoryId: string) => dispatch(toggleTaggedCategory(categoryId)),
  setSelectedSubline: (sublineIndex: number | null) => dispatch(setTaggedSubline(sublineIndex)),
  dispatchToggleDetailed: () => dispatch(toggleTaggedDetailed()),
});

interface Props {
  taggingData: TaggingSubline[];
  selectedRabbis: string[];
  selectedCategories: string[];
  selectedTaggedSubline: number | null;
  selectedSublines: iSubline[];
  currentMishna: iMishna;
  taggedDetailedView: boolean;
  toggleRabbi: (rabbiId: string) => void;
  toggleCategory: (categoryId: string) => void;
  setSelectedSubline: (sublineIndex: number | null) => void;
  dispatchToggleDetailed: () => void;
}

const RabbiAlternativesList: React.FC<{ alternatives: RabbiAlternative[]; isHebrew: boolean }> = ({
  alternatives,
  isHebrew,
}) => {
  if (alternatives.length === 0) return null;
  return (
    <Box
      mt={0.75}
      pt={0.5}
      sx={{ borderTopWidth: 1, borderTopStyle: 'dashed', borderTopColor: 'error.main' }}>
      <Typography variant="caption" fontWeight="bold" color="error.dark" display="block" mb={0.25}>
        {isHebrew ? 'חלופות:' : 'Alternatives:'}
      </Typography>
      {alternatives.map(alt => {
        const altData = ALL_RABBIES.find(r => r.id === alt.rabbiId);
        return (
          <Box key={alt.rabbiId} mb={0.25}>
            <Typography variant="body2" sx={{ fontSize: '0.8rem' }}>
              {alt.rabbiName}
            </Typography>
            {altData && (
              <Box display="flex" flexWrap="wrap" gap={0.3}>
                {altData.generation && (
                  <Chip label={`דור ${altData.generation}`} size="small" variant="outlined" sx={{ fontSize: '0.6rem', height: 16 }} />
                )}
                {altData.location && (
                  <Chip label={altData.location} size="small" variant="outlined" sx={{ fontSize: '0.6rem', height: 16 }} />
                )}
              </Box>
            )}
          </Box>
        );
      })}
    </Box>
  );
};

const TaggedSidebar: React.FC<Props> = ({
  taggingData,
  selectedRabbis,
  selectedCategories,
  selectedTaggedSubline,
  selectedSublines,
  currentMishna,
  taggedDetailedView,
  toggleRabbi,
  toggleCategory,
  setSelectedSubline,
  dispatchToggleDetailed,
}) => {
  const { i18n } = useTranslation();
  const isHebrew = i18n.language === 'he';
  const wrapperRef = useRef<HTMLDivElement>(null);
  const isSticky = useIsSticky(wrapperRef as React.RefObject<HTMLElement>, 136);  
  const divHeight = isSticky ? 'calc(100vh - 170px)' : 'calc(100vh - 270px)';

  const selectedSublineIndices = useMemo(
    () => new Set(selectedSublines.map(s => s.index)),
    [selectedSublines]
  );

  const filteredTaggingData = useMemo(() => {
    if (selectedSublineIndices.size === 0) return taggingData;
    return taggingData.filter(t => selectedSublineIndices.has(t.index));
  }, [taggingData, selectedSublineIndices]);

  const uniqueRabbis = useMemo(() => {
    const rabbiMap = new Map<string, { id: string; name: string; count: number }>();
    for (const sub of filteredTaggingData) {
      for (const mention of sub.rabbiMentions) {
        const existing = rabbiMap.get(mention.rabbiId);
        if (existing) {
          existing.count++;
        } else {
          rabbiMap.set(mention.rabbiId, { id: mention.rabbiId, name: mention.rabbiName, count: 1 });
        }
      }
    }
    return Array.from(rabbiMap.values());
  }, [filteredTaggingData]);

  const uniqueCategories = useMemo(() => {
    const catMap = new Map<string, { id: string; label: string; labelEn: string; count: number }>();
    for (const sub of filteredTaggingData) {
      for (const cat of sub.categories) {
        const catDef = TAGGING_CATEGORIES.find(c => c.id === cat.categoryId);
        if (!catDef) continue;
        const existing = catMap.get(cat.categoryId);
        if (existing) {
          existing.count++;
        } else {
          catMap.set(cat.categoryId, { id: cat.categoryId, label: catDef.label, labelEn: catDef.labelEn, count: 1 });
        }
      }
    }
    return Array.from(catMap.values());
  }, [filteredTaggingData]);

  const selectedSublineData = useMemo(() => {
    if (selectedTaggedSubline === null) return null;
    return taggingData.find(t => t.index === selectedTaggedSubline) || null;
  }, [taggingData, selectedTaggedSubline]);

  return (
    <div
      ref={wrapperRef}
      style={{
        position: 'sticky',
        top: themeConstants.fixedTopPadding,
        height: divHeight,
        transition: 'height 0.5s',
        overflowY: 'auto',
        direction: 'rtl',
      }}>
      <Box display="flex" justifyContent="center" mb={0.5}>
        <FormControlLabel
          control={<Switch size="small" checked={taggedDetailedView} onChange={dispatchToggleDetailed} />}
          label={<Typography variant="caption">{isHebrew ? 'תצוגה מפורטת' : 'Detailed view'}</Typography>}
          sx={{ margin: 0 }}
        />
      </Box>
      <Box display="flex" gap={1} sx={{ minHeight: 0 }}>
        {/* חכמים column */}
        <Box flex={1} sx={{ borderLeft: '1px solid', borderColor: 'divider', pr: 0.5, pl: 0.5 }}>
          <Typography variant="subtitle2" fontWeight="bold" mb={0.5} textAlign="center">
            {isHebrew ? 'מבט כרונולוגי (חכמים)' : 'Chronological View (Sages)'}
          </Typography>
          {uniqueRabbis.length === 0 ? (
            <Typography variant="caption" color="text.secondary" display="block" textAlign="center">
              {selectedSublineIndices.size > 0
                ? (isHebrew ? 'אין חכמים בסוגיה זו' : 'No sages in this sugia')
                : (isHebrew ? 'אין חכמים מתוייגים' : 'No tagged sages')}
            </Typography>
          ) : (
            <List dense disablePadding>
              {uniqueRabbis.map(rabbi => {
                const isSelected = selectedRabbis.includes(rabbi.id);
                return (
                  <ListItemButton
                    key={rabbi.id}
                    selected={isSelected}
                    onClick={() => toggleRabbi(rabbi.id)}
                    sx={{
                      borderRadius: 1,
                      mb: 0.25,
                      py: 0.25,
                      px: 0.5,
                      minHeight: 0,
                    }}>
                    <ListItemText
                      primary={
                        <Box display="flex" alignItems="center" gap={0.5}>
                          <Typography variant="body2" fontWeight={isSelected ? 'bold' : 'normal'}>
                            {rabbi.name}
                          </Typography>
                          <Typography variant="caption" color="text.disabled" sx={{ fontSize: '0.6rem' }}>
                            ({rabbi.count})
                          </Typography>
                        </Box>
                      }
                    />
                  </ListItemButton>
                );
              })}
            </List>
          )}
        </Box>

        {/* קטגוריות column */}
        <Box flex={1} sx={{ pr: 0.5, pl: 0.5, direction: 'ltr', textAlign: 'left' }}>
          <Typography variant="subtitle2" fontWeight="bold" mb={0.5} textAlign="center">
            {isHebrew ? 'קטגוריות שיח' : 'Discourse Categories'}
          </Typography>
          {uniqueCategories.length === 0 ? (
            <Typography variant="caption" color="text.secondary" display="block" textAlign="center">
              {selectedSublineIndices.size > 0
                ? (isHebrew ? 'אין קטגוריות בסוגיה זו' : 'No categories in this sugia')
                : (isHebrew ? 'אין קטגוריות מתוייגות' : 'No tagged categories')}
            </Typography>
          ) : (
            <List dense disablePadding>
              {uniqueCategories.map(cat => {
                const isSelected = selectedCategories.includes(cat.id);
                return (
                  <ListItemButton
                    key={cat.id}
                    selected={isSelected}
                    onClick={() => toggleCategory(cat.id)}
                    sx={{
                      borderRadius: 1,
                      mb: 0.25,
                      py: 0.25,
                      px: 0.5,
                      minHeight: 0,
                    }}>
                    <ListItemText
                      primary={
                        <Box display="flex" alignItems="center" gap={0.5} justifyContent={isHebrew ? 'flex-start' : 'flex-end'}>
                          <Typography variant="body2" fontWeight={isSelected ? 'bold' : 'normal'}>
                            {isHebrew ? cat.label : cat.labelEn}
                          </Typography>
                          <Typography variant="caption" color="text.disabled" sx={{ fontSize: '0.6rem' }}>
                            ({cat.count})
                          </Typography>
                        </Box>
                      }
                    />
                  </ListItemButton>
                );
              })}
            </List>
          )}
        </Box>
      </Box>

      {/* Lower section: rabbi details OR subline details */}
      {selectedRabbis.length > 0 && (
        <>
          <Divider sx={{ my: 1.5 }} />
          <Box px={0.5}>
            {selectedRabbis.map(rabbiId => {
              const rabbiData = ALL_RABBIES.find(r => r.id === rabbiId);
              if (!rabbiData) return null;
              const mentionsWithAlternatives = taggingData
                .flatMap(t => t.rabbiMentions)
                .filter(m => m.rabbiId === rabbiId && m.doubt && m.alternatives && m.alternatives.length > 0);
              const allAlternatives = mentionsWithAlternatives.flatMap(m => m.alternatives!);
              const uniqueAlternatives = allAlternatives.filter((a, i, arr) => arr.findIndex(x => x.rabbiId === a.rabbiId) === i);
              return (
                <Box
                  key={rabbiId}
                  sx={{
                    mb: 1.5,
                    p: 1,
                    borderRadius: 1,
                    border: '1px solid',
                    borderColor: uniqueAlternatives.length > 0 ? 'error.main' : 'divider',
                  }}>
                  <Typography variant="body2" fontWeight="bold" mb={0.5}>
                    {rabbiData.displayName}
                    {mentionsWithAlternatives.length > 0 && (
                      <Typography component="span" sx={{ color: 'error.dark', fontWeight: 'bold' }}> (?)</Typography>
                    )}
                  </Typography>
                  {rabbiData.fullnameVariants.length > 0 && (
                    <Typography variant="caption" color="text.secondary" display="block" mb={0.5} sx={{ lineHeight: 1.4 }}>
                      ({rabbiData.fullnameVariants.join(' / ')})
                    </Typography>
                  )}
                  <RabbiInfoChips rabbi={rabbiData} />
                  <RabbiAlternativesList alternatives={uniqueAlternatives} isHebrew={isHebrew} />
                </Box>
              );
            })}
          </Box>
        </>
      )}

      {selectedRabbis.length === 0 && selectedSublineData && (
        <>
          <Divider sx={{ my: 1.5 }} />
          <Box px={0.5}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
              <Typography variant="subtitle2" fontWeight="bold">
                פרטי שורה {selectedSublineData.index}
              </Typography>
              <Chip
                label="✕"
                size="small"
                onClick={() => setSelectedSubline(null)}
                sx={{ cursor: 'pointer', height: 20, fontSize: '0.7rem' }}
              />
            </Box>

            {selectedSublineData.categories.length > 0 && (
              <Box mb={1.5}>
                <Typography variant="caption" fontWeight="bold" color="text.secondary" display="block" mb={0.5}>
                  {isHebrew ? 'קטגוריות:' : 'Categories:'}
                </Typography>
                {selectedSublineData.categories.map((cat: SublineCategory) => {
                  const catDef = TAGGING_CATEGORIES.find(c => c.id === cat.categoryId);
                  if (!catDef) return null;
                  const sublineConns = cat.connections.filter((c: CategoryConnection) => c.type === 'subline');
                  const externalConns = cat.connections.filter((c: CategoryConnection) => c.type === 'external');
                  return (
                    <Box key={cat.categoryId} mb={0.5}>
                      <Chip label={isHebrew ? catDef.label : catDef.labelEn} size="small" color="primary" variant="outlined"
                        sx={{ fontSize: '0.7rem', height: 20, mb: 0.25 }} />
                      {sublineConns.length > 0 && (
                        <Typography variant="caption" color="text.secondary" display="block" sx={{ mr: 2 }}>
                          ← {sublineConns.map((c: CategoryConnection) => `שורה ${c.sublineIndex}`).join(', ')}
                        </Typography>
                      )}
                      {externalConns.length > 0 && (
                        <Typography variant="caption" color="text.secondary" display="block" sx={{ mr: 2, fontStyle: 'italic' }}>
                          {externalConns.map((c: CategoryConnection) => c.text).join(', ')}
                        </Typography>
                      )}
                    </Box>
                  );
                })}
              </Box>
            )}

            {selectedSublineData.rabbiMentions.length > 0 && (
              <Box mb={1.5}>
                <Typography variant="caption" fontWeight="bold" color="text.secondary" display="block" mb={0.5}>
                  {isHebrew ? 'חכמים:' : 'Sages:'}
                </Typography>
                {selectedSublineData.rabbiMentions.map((mention: RabbiMention, i: number) => {
                  const rabbiData = ALL_RABBIES.find(r => r.id === mention.rabbiId);
                  return (
                    <Box
                      key={i}
                      sx={{
                        mb: 1,
                        p: 0.75,
                        borderRadius: 1,
                        border: '1px solid',
                        borderColor: mention.doubt ? 'error.main' : 'divider',
                      }}>
                      <Box display="flex" alignItems="center" gap={0.5} mb={0.25}>
                        <Typography variant="body2" fontWeight="bold">
                          {mention.rabbiName}
                          {mention.doubt && (
                            <Typography component="span" sx={{ color: 'error.dark', fontWeight: 'bold' }}> (?)</Typography>
                          )}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          "{mention.text}"
                        </Typography>
                      </Box>
                      {rabbiData && (
                        <>
                          {rabbiData.fullnameVariants.length > 0 && (
                            <Typography variant="caption" color="text.secondary" display="block" mb={0.5} sx={{ lineHeight: 1.4 }}>
                              ({rabbiData.fullnameVariants.join(' / ')})
                            </Typography>
                          )}
                          <RabbiInfoChips rabbi={rabbiData} />
                        </>
                      )}
                      {mention.doubt && mention.alternatives && (
                        <RabbiAlternativesList alternatives={mention.alternatives} isHebrew={isHebrew} />
                      )}
                    </Box>
                  );
                })}
              </Box>
            )}

            {/* Tagging comments are now surfaced directly on the subline via the
                CommentOutlined chip + popover in SublineDisplay, so the per-subline
                sidebar block no longer lists them. The empty-state below still
                counts comments as tagging data — a comments-only subline keeps the
                panel quiet rather than falsely claiming there's no tagging. */}

            {selectedSublineData.categories.length === 0 &&
             selectedSublineData.rabbiMentions.length === 0 &&
             selectedSublineData.comments.length === 0 && (
              <Typography variant="caption" color="text.secondary">
                אין נתוני תיוג לשורה זו
              </Typography>
            )}
          </Box>
        </>
      )}
    </div>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(TaggedSidebar);
