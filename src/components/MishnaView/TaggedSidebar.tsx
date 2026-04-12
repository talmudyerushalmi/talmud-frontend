import React, { useMemo, useRef } from 'react';
import { Box, Chip, Divider, List, ListItemButton, ListItemText, Typography } from '@mui/material';
import { connect } from 'react-redux';
import {
  toggleTaggedRabbi,
  toggleTaggedCategory,
  setTaggedSubline,
} from '../../store/actions/mishnaViewActions';
import {
  TaggingSubline,
  TAGGING_CATEGORIES,
  ALL_RABBIES,
  RabbiMention,
  SublineCategory,
  CategoryConnection,
  SublineComment,
} from '../../services/tagging.service';
import { iMishna, iSubline } from '../../types/types';
import { themeConstants } from '../../ui/Theme';
import { useIsSticky } from '../../hooks/useIsSticky';

const mapStateToProps = (state: any) => ({
  taggingData: state.mishnaView.taggingData,
  selectedRabbis: state.mishnaView.selectedRabbis,
  selectedCategories: state.mishnaView.selectedCategories,
  selectedTaggedSubline: state.mishnaView.selectedTaggedSubline,
  selectedSublines: state.mishnaView.selectedSublines,
  currentMishna: state.navigation.currentMishna,
});

const mapDispatchToProps = (dispatch: any) => ({
  toggleRabbi: (rabbiId: string) => dispatch(toggleTaggedRabbi(rabbiId)),
  toggleCategory: (categoryId: string) => dispatch(toggleTaggedCategory(categoryId)),
  setSelectedSubline: (sublineIndex: number | null) => dispatch(setTaggedSubline(sublineIndex)),
});

interface Props {
  taggingData: TaggingSubline[];
  selectedRabbis: string[];
  selectedCategories: string[];
  selectedTaggedSubline: number | null;
  selectedSublines: iSubline[];
  currentMishna: iMishna;
  toggleRabbi: (rabbiId: string) => void;
  toggleCategory: (categoryId: string) => void;
  setSelectedSubline: (sublineIndex: number | null) => void;
}

const TaggedSidebar: React.FC<Props> = ({
  taggingData,
  selectedRabbis,
  selectedCategories,
  selectedTaggedSubline,
  selectedSublines,
  currentMishna,
  toggleRabbi,
  toggleCategory,
  setSelectedSubline,
}) => {
  const wrapperRef = useRef(null);
  const isSticky = useIsSticky(wrapperRef, 136);
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
    const catMap = new Map<string, { id: string; label: string; count: number }>();
    for (const sub of filteredTaggingData) {
      for (const cat of sub.categories) {
        const catDef = TAGGING_CATEGORIES.find(c => c.id === cat.categoryId);
        if (!catDef) continue;
        const existing = catMap.get(cat.categoryId);
        if (existing) {
          existing.count++;
        } else {
          catMap.set(cat.categoryId, { id: cat.categoryId, label: catDef.label, count: 1 });
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
      <Box display="flex" gap={1} sx={{ minHeight: 0 }}>
        {/* חכמים column */}
        <Box flex={1} sx={{ borderLeft: '1px solid', borderColor: 'divider', pr: 0.5, pl: 0.5 }}>
          <Typography variant="subtitle2" fontWeight="bold" mb={0.5} textAlign="center">
            חכמים
          </Typography>
          {uniqueRabbis.length === 0 ? (
            <Typography variant="caption" color="text.secondary" display="block" textAlign="center">
              {selectedSublineIndices.size > 0 ? 'אין חכמים בסוגיה זו' : 'אין חכמים מתוייגים'}
            </Typography>
          ) : (
            <List dense disablePadding>
              {uniqueRabbis.map(rabbi => {
                const isSelected = selectedRabbis.includes(rabbi.id);
                const rabbiData = ALL_RABBIES.find(r => r.id === rabbi.id);
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
                          {rabbiData?.generation && (
                            <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.6rem' }}>
                              {rabbiData.generation}
                            </Typography>
                          )}
                          {rabbiData?.location === 'בבל' && (
                            <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.6rem' }}>
                              ב
                            </Typography>
                          )}
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
        <Box flex={1} sx={{ pr: 0.5, pl: 0.5 }}>
          <Typography variant="subtitle2" fontWeight="bold" mb={0.5} textAlign="center">
            קטגוריות
          </Typography>
          {uniqueCategories.length === 0 ? (
            <Typography variant="caption" color="text.secondary" display="block" textAlign="center">
              {selectedSublineIndices.size > 0 ? 'אין קטגוריות בסוגיה זו' : 'אין קטגוריות מתוייגות'}
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
                        <Box display="flex" alignItems="center" gap={0.5}>
                          <Typography variant="body2" fontWeight={isSelected ? 'bold' : 'normal'}>
                            {cat.label}
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
              return (
                <Box key={rabbiId} sx={{ mb: 1.5, p: 1, borderRadius: 1, border: '1px solid', borderColor: 'divider' }}>
                  <Typography variant="body2" fontWeight="bold" mb={0.5}>
                    {rabbiData.displayName}
                  </Typography>
                  {rabbiData.fullnameVariants.length > 0 && (
                    <Typography variant="caption" color="text.secondary" display="block" mb={0.5} sx={{ lineHeight: 1.4 }}>
                      ({rabbiData.fullnameVariants.join(' / ')})
                    </Typography>
                  )}
                  <Box display="flex" flexWrap="wrap" gap={0.5}>
                    {rabbiData.type && (
                      <Chip label={rabbiData.type} size="small" variant="outlined" sx={{ fontSize: '0.65rem', height: 18 }} />
                    )}
                    {rabbiData.generation && (
                      <Chip label={`דור ${rabbiData.generation}`} size="small" variant="outlined" sx={{ fontSize: '0.65rem', height: 18 }} />
                    )}
                    {rabbiData.location && (
                      <Chip label={rabbiData.location} size="small" variant="outlined" sx={{ fontSize: '0.65rem', height: 18 }} />
                    )}
                    {rabbiData.city && (
                      <Chip label={rabbiData.city} size="small" variant="outlined" sx={{ fontSize: '0.65rem', height: 18 }} />
                    )}
                  </Box>
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
                  קטגוריות:
                </Typography>
                {selectedSublineData.categories.map((cat: SublineCategory) => {
                  const catDef = TAGGING_CATEGORIES.find(c => c.id === cat.categoryId);
                  if (!catDef) return null;
                  const sublineConns = cat.connections.filter((c: CategoryConnection) => c.type === 'subline');
                  const externalConns = cat.connections.filter((c: CategoryConnection) => c.type === 'external');
                  return (
                    <Box key={cat.categoryId} mb={0.5}>
                      <Chip label={catDef.label} size="small" color="primary" variant="outlined"
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
                  חכמים:
                </Typography>
                {selectedSublineData.rabbiMentions.map((mention: RabbiMention, i: number) => {
                  const rabbiData = ALL_RABBIES.find(r => r.id === mention.rabbiId);
                  return (
                    <Box key={i} sx={{ mb: 1, p: 0.75, borderRadius: 1, border: '1px solid', borderColor: 'divider' }}>
                      <Box display="flex" alignItems="center" gap={0.5} mb={0.25}>
                        <Typography variant="body2" fontWeight="bold">
                          {mention.rabbiName}
                          {mention.doubt && ' (?)'}
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
                          <Box display="flex" flexWrap="wrap" gap={0.5}>
                            {rabbiData.type && (
                              <Chip label={rabbiData.type} size="small" variant="outlined" sx={{ fontSize: '0.65rem', height: 18 }} />
                            )}
                            {rabbiData.generation && (
                              <Chip label={`דור ${rabbiData.generation}`} size="small" variant="outlined" sx={{ fontSize: '0.65rem', height: 18 }} />
                            )}
                            {rabbiData.location && (
                              <Chip label={rabbiData.location} size="small" variant="outlined" sx={{ fontSize: '0.65rem', height: 18 }} />
                            )}
                            {rabbiData.city && (
                              <Chip label={rabbiData.city} size="small" variant="outlined" sx={{ fontSize: '0.65rem', height: 18 }} />
                            )}
                          </Box>
                        </>
                      )}
                    </Box>
                  );
                })}
              </Box>
            )}

            {selectedSublineData.comments.length > 0 && (
              <Box mb={1.5}>
                <Typography variant="caption" fontWeight="bold" color="text.secondary" display="block" mb={0.5}>
                  הערות:
                </Typography>
                {selectedSublineData.comments.map((comment: SublineComment, i: number) => (
                  <Box key={i} sx={{ mb: 0.5, p: 0.75, borderRadius: 1, border: '1px solid', borderColor: 'divider' }}>
                    <Typography variant="body2">{comment.text}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {comment.author} • {new Date(comment.timestamp).toLocaleDateString('he-IL')}
                    </Typography>
                  </Box>
                ))}
              </Box>
            )}

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
