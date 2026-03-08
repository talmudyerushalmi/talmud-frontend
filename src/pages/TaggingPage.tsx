import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Alert,
  Box,
  Chip,
  CircularProgress,
  Divider,
  Drawer,
  IconButton,
  Paper,
  Snackbar,
  Tooltip,
  Typography,
} from '@mui/material';
import LabelIcon from '@mui/icons-material/Label';
import LinkIcon from '@mui/icons-material/Link';
import PersonIcon from '@mui/icons-material/Person';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import {
  TAGGING_CATEGORIES,
  Rabbi,
  RabbiMention,
  TaggingSubline,
  taggingService,
} from '../services/tagging.service';
import { PageWithNavigation, PageContent } from '../layout/PageWithNavigation';
import { hebrewMap } from '../inc/utils';
import PageService from '../services/pageService';

type EditMode = 'none' | 'categories' | 'connections' | 'rabbies';

interface TextSelection {
  sublineIndex: number;
  startIndex: number;
  endIndex: number;
  text: string;
}

const SIDEBAR_WIDTH = 320;

const TaggingPage: React.FC = () => {
  const { tractate, chapter, mishna } = useParams<{
    tractate: string;
    chapter: string;
    mishna: string;
  }>();

  const [sublines, setSublines] = useState<TaggingSubline[]>([]);
  const [rabbies, setRabbies] = useState<Rabbi[]>([]);
  const [tractateHebName, setTractateHebName] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const [activeSublineIndex, setActiveSublineIndex] = useState<number | null>(null);
  const [editMode, setEditMode] = useState<EditMode>('none');

  const [pendingCategories, setPendingCategories] = useState<string[]>([]);
  const [pendingConnections, setPendingConnections] = useState<string[]>([]);

  const [pendingRabbiMentions, setPendingRabbiMentions] = useState<RabbiMention[]>([]);
  const [textSelection, setTextSelection] = useState<TextSelection | null>(null);

  const sublineRefs = useRef<Record<number, HTMLElement | null>>({});

  const loadData = useCallback(async () => {
    if (!tractate || !chapter || !mishna) return;
    setLoading(true);
    setError(null);
    try {
      const [sublinesData, rabbiesData, allTractates] = await Promise.all([
        taggingService.getSublines(tractate, chapter, mishna),
        taggingService.getRabbies(),
        PageService.getAllTractates(),
      ]);
      setSublines(sublinesData);
      setRabbies(rabbiesData);
      const found = allTractates.find((t: any) => t.id === tractate);
      setTractateHebName(found?.title_heb || tractate);
    } catch (e: any) {
      setError(e.message || 'שגיאה בטעינת הנתונים');
    } finally {
      setLoading(false);
    }
  }, [tractate, chapter, mishna]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const openEdit = (sublineIndex: number, mode: EditMode) => {
    const subline = sublines.find(s => s.index === sublineIndex);
    if (!subline) return;
    setActiveSublineIndex(sublineIndex);
    setEditMode(mode);
    if (mode === 'categories') {
      setPendingCategories([...subline.categories]);
    } else if (mode === 'connections') {
      setPendingConnections([...subline.connections]);
    } else if (mode === 'rabbies') {
      setPendingRabbiMentions([...subline.rabbiMentions]);
      setTextSelection(null);
    }
  };

  const cancelEdit = () => {
    setActiveSublineIndex(null);
    setEditMode('none');
    setPendingCategories([]);
    setPendingConnections([]);
    setPendingRabbiMentions([]);
    setTextSelection(null);
  };

  const saveEdit = async () => {
    if (activeSublineIndex === null || !tractate || !chapter || !mishna) return;
    setSaving(true);
    setError(null);
    try {
      const dto: any = {};
      if (editMode === 'categories') dto.categories = pendingCategories;
      else if (editMode === 'connections') dto.connections = pendingConnections;
      else if (editMode === 'rabbies') dto.rabbiMentions = pendingRabbiMentions;

      await taggingService.updateSublineTags(tractate, chapter, mishna, activeSublineIndex, dto);

      setSublines(prev =>
        prev.map(s => {
          if (s.index !== activeSublineIndex) return s;
          return {
            ...s,
            ...(editMode === 'categories' ? { categories: pendingCategories } : {}),
            ...(editMode === 'connections' ? { connections: pendingConnections } : {}),
            ...(editMode === 'rabbies' ? { rabbiMentions: pendingRabbiMentions } : {}),
          };
        })
      );
      setSuccessMsg('נשמר בהצלחה');
      cancelEdit();
    } catch (e: any) {
      const msg = e.response?.data?.message || e.message || 'שגיאה בשמירה';
      setError(msg);
    } finally {
      setSaving(false);
    }
  };

  const toggleCategory = (categoryId: string) => {
    setPendingCategories(prev =>
      prev.includes(categoryId) ? prev.filter(c => c !== categoryId) : [...prev, categoryId]
    );
  };

  const toggleConnection = (sublineIndex: number) => {
    const key = String(sublineIndex);
    setPendingConnections(prev =>
      prev.includes(key) ? prev.filter(c => c !== key) : [...prev, key]
    );
  };

  const handleTextSelectionOnSubline = (sublineIndex: number) => {
    if (editMode !== 'rabbies' || activeSublineIndex !== sublineIndex) return;
    const selection = window.getSelection();
    if (!selection || selection.isCollapsed) return;
    const selectedText = selection.toString().trim();
    if (!selectedText) return;

    const range = selection.getRangeAt(0);
    const container = sublineRefs.current[sublineIndex];
    if (!container || !container.contains(range.commonAncestorContainer)) return;

    const subline = sublines.find(s => s.index === sublineIndex);
    if (!subline) return;
    const startIndex = subline.text.indexOf(selectedText);
    if (startIndex === -1) return;

    setTextSelection({
      sublineIndex,
      startIndex,
      endIndex: startIndex + selectedText.length,
      text: selectedText,
    });
    selection.removeAllRanges();
  };

  const assignRabbiToSelection = (rabbi: Rabbi) => {
    if (!textSelection) return;
    const mention: RabbiMention = {
      rabbiId: rabbi._id,
      rabbiName: rabbi.name,
      startIndex: textSelection.startIndex,
      endIndex: textSelection.endIndex,
      text: textSelection.text,
    };
    setPendingRabbiMentions(prev => [
      ...prev.filter(
        m => !(m.startIndex === mention.startIndex && m.endIndex === mention.endIndex)
      ),
      mention,
    ]);
    setTextSelection(null);
  };

  const removeRabbiMention = (mention: RabbiMention) => {
    setPendingRabbiMentions(prev =>
      prev.filter(m => !(m.startIndex === mention.startIndex && m.endIndex === mention.endIndex))
    );
  };

  const renderSublineText = (subline: TaggingSubline) => {
    const mentions = editMode === 'rabbies' && activeSublineIndex === subline.index
      ? pendingRabbiMentions
      : subline.rabbiMentions;

    if (!mentions || mentions.length === 0) {
      return <span>{subline.text}</span>;
    }

    const sorted = [...mentions].sort((a, b) => a.startIndex - b.startIndex);
    const parts: React.ReactNode[] = [];
    let cursor = 0;
    for (const mention of sorted) {
      if (mention.startIndex > cursor) {
        parts.push(
          <span key={`text-${cursor}`}>{subline.text.slice(cursor, mention.startIndex)}</span>
        );
      }
      parts.push(
        <Tooltip key={`mention-${mention.startIndex}`} title={mention.rabbiName} arrow>
          <span
            style={{
              backgroundColor: '#bbdefb',
              borderRadius: '3px',
              padding: '1px 2px',
              cursor: 'pointer',
              fontWeight: 'bold',
            }}>
            {subline.text.slice(mention.startIndex, mention.endIndex)}
          </span>
        </Tooltip>
      );
      cursor = mention.endIndex;
    }
    if (cursor < subline.text.length) {
      parts.push(<span key={`text-end`}>{subline.text.slice(cursor)}</span>);
    }
    return <>{parts}</>;
  };

  const isActiveSubline = (index: number) => activeSublineIndex === index;
  const isConnectionTarget = (index: number) =>
    editMode === 'connections' &&
    activeSublineIndex !== null &&
    activeSublineIndex !== index;

  if (!tractate || !chapter || !mishna) {
    return (
      <Box p={4}>
        <Alert severity="warning">חסרים פרמטרים בכתובת</Alert>
      </Box>
    );
  }

  return (
    <PageWithNavigation linkPrefix="/admin/tagging" showSearchBar={false}>
      <PageContent>
        <Box display="flex" dir="rtl" sx={{ minHeight: '80vh' }}>
          {/* Main sublines area */}
          <Box flex={1} ml={`${SIDEBAR_WIDTH + 16}px`} p={2}>
            <Typography variant="h6" mb={2} sx={{ fontWeight: 'bold', color: 'text.primary' }}>
              עורך תגיות — מסכת {tractateHebName} פרק {hebrewMap.get(chapter)} הלכה {hebrewMap.get(mishna)}
            </Typography>

            {loading && (
              <Box display="flex" justifyContent="center" mt={4}>
                <CircularProgress />
              </Box>
            )}

            {!loading && sublines.map(subline => {
              const active = isActiveSubline(subline.index);
              const connectionTarget = isConnectionTarget(subline.index);
              const isConnected =
                editMode === 'connections' &&
                activeSublineIndex !== null &&
                pendingConnections.includes(String(subline.index));

              return (
                <Paper
                  key={subline.index}
                  ref={el => { sublineRefs.current[subline.index] = el; }}
                  elevation={active ? 4 : 1}
                  onMouseUp={() => handleTextSelectionOnSubline(subline.index)}
                  onClick={() => {
                    if (connectionTarget) toggleConnection(subline.index);
                  }}
                  sx={{
                    mb: 1.5,
                    p: 1.5,
                    borderRadius: 2,
                    border: active
                      ? '2px solid #1976d2'
                      : isConnected
                      ? '2px solid #9c27b0'
                      : connectionTarget
                      ? '2px dashed #9c27b0'
                      : '1px solid transparent',
                    cursor: connectionTarget ? 'pointer' : 'default',
                    transition: 'border 0.15s',
                    '&:hover': connectionTarget
                      ? { borderColor: '#7b1fa2' }
                      : {},
                  }}>
                  <Box display="flex" alignItems="flex-start" gap={1}>
                    {/* Index */}
                    <Typography
                      variant="caption"
                      sx={{
                        minWidth: 28,
                        color: 'text.secondary',
                        mt: 0.3,
                        fontWeight: 'bold',
                      }}>
                      {subline.index}
                    </Typography>

                    {/* Text */}
                    <Typography
                      variant="body2"
                      flex={1}
                      sx={{
                        lineHeight: 1.8,
                        userSelect: editMode === 'rabbies' && active ? 'text' : 'none',
                        direction: 'rtl',
                      }}>
                      {renderSublineText(subline)}
                    </Typography>

                    {/* Action icons (only when not in active edit) */}
                    {!active && (
                      <Box display="flex" gap={0.5} ml={1}>
                        <Tooltip title="קטגוריות">
                          <IconButton
                            size="small"
                            color={subline.categories.length > 0 ? 'primary' : 'default'}
                            onClick={() => openEdit(subline.index, 'categories')}>
                            <LabelIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="קישורים">
                          <IconButton
                            size="small"
                            color={subline.connections.length > 0 ? 'secondary' : 'default'}
                            onClick={() => openEdit(subline.index, 'connections')}>
                            <LinkIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="חכמים">
                          <IconButton
                            size="small"
                            color={subline.rabbiMentions.length > 0 ? 'warning' : 'default'}
                            onClick={() => openEdit(subline.index, 'rabbies')}>
                            <PersonIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    )}

                    {/* Save/Cancel for active edit */}
                    {active && (
                      <Box display="flex" gap={0.5} ml={1}>
                        <Tooltip title="שמור">
                          <IconButton
                            size="small"
                            color="success"
                            onClick={saveEdit}
                            disabled={saving}>
                            {saving ? <CircularProgress size={16} /> : <CheckIcon fontSize="small" />}
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="בטל">
                          <IconButton size="small" onClick={cancelEdit}>
                            <CloseIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    )}
                  </Box>

                  {/* Existing tags display (not in active edit) */}
                  {!active && (
                    <Box mt={0.5} display="flex" flexWrap="wrap" gap={0.5} pr={4}>
                      {subline.categories.map(catId => {
                        const cat = TAGGING_CATEGORIES.find(c => c.id === catId);
                        return cat ? (
                          <Chip
                            key={catId}
                            label={cat.label}
                            size="small"
                            color="primary"
                            variant="outlined"
                            sx={{ fontSize: '0.7rem', height: 20 }}
                          />
                        ) : null;
                      })}
                      {subline.connections.map(connIdx => (
                        <Chip
                          key={connIdx}
                          label={`→ ${connIdx}`}
                          size="small"
                          color="secondary"
                          variant="outlined"
                          sx={{ fontSize: '0.7rem', height: 20 }}
                        />
                      ))}
                      {subline.rabbiMentions.map((m, i) => (
                        <Chip
                          key={i}
                          label={m.rabbiName}
                          size="small"
                          color="warning"
                          variant="outlined"
                          sx={{ fontSize: '0.7rem', height: 20 }}
                        />
                      ))}
                    </Box>
                  )}

                  {/* Active edit: categories */}
                  {active && editMode === 'categories' && (
                    <Box mt={1.5} pr={4}>
                      <Typography variant="caption" color="text.secondary" mb={1} display="block">
                        בחר קטגוריות:
                      </Typography>
                      <Box display="flex" flexWrap="wrap" gap={0.75}>
                        {TAGGING_CATEGORIES.map(cat => (
                          <Chip
                            key={cat.id}
                            label={cat.label}
                            size="small"
                            color={pendingCategories.includes(cat.id) ? 'primary' : 'default'}
                            variant={pendingCategories.includes(cat.id) ? 'filled' : 'outlined'}
                            onClick={() => toggleCategory(cat.id)}
                            sx={{ cursor: 'pointer', fontSize: '0.75rem' }}
                          />
                        ))}
                      </Box>
                    </Box>
                  )}

                  {/* Active edit: rabbi mentions */}
                  {active && editMode === 'rabbies' && (
                    <Box mt={1.5} pr={4}>
                      {textSelection ? (
                        <Alert severity="info" sx={{ mb: 1, py: 0.5 }}>
                          סימנת: "<strong>{textSelection.text}</strong>" — בחר חכם מהרשימה
                        </Alert>
                      ) : (
                        <Typography variant="caption" color="text.secondary" mb={1} display="block">
                          סמן טקסט בשורה למעלה ואז בחר חכם
                        </Typography>
                      )}
                      {pendingRabbiMentions.length > 0 && (
                        <Box display="flex" flexWrap="wrap" gap={0.5} mb={1}>
                          {pendingRabbiMentions.map((m, i) => (
                            <Chip
                              key={i}
                              label={`${m.rabbiName}: "${m.text}"`}
                              size="small"
                              color="warning"
                              onDelete={() => removeRabbiMention(m)}
                              sx={{ fontSize: '0.7rem' }}
                            />
                          ))}
                        </Box>
                      )}
                    </Box>
                  )}
                </Paper>
              );
            })}
          </Box>

          {/* Sidebar */}
          <Drawer
            variant="permanent"
            anchor="right"
            sx={{
              width: SIDEBAR_WIDTH,
              flexShrink: 0,
              '& .MuiDrawer-paper': {
                width: SIDEBAR_WIDTH,
                boxSizing: 'border-box',
                top: 'auto',
                position: 'fixed',
                right: 0,
                height: 'calc(100vh - 64px)',
                overflowY: 'auto',
                borderLeft: '1px solid',
                borderColor: 'divider',
                p: 2,
              },
            }}>
            <Box dir="rtl">
              {editMode === 'none' && (
                <>
                  <Typography variant="subtitle1" fontWeight="bold" mb={1}>
                    קטגוריות
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    לחץ על אייקון הקטגוריה על גבי שורה כדי לתייג
                  </Typography>
                  <Divider sx={{ my: 2 }} />
                  <Box display="flex" flexWrap="wrap" gap={0.5}>
                    {TAGGING_CATEGORIES.map(cat => {
                      const count = sublines.filter(s => s.categories.includes(cat.id)).length;
                      return (
                        <Chip
                          key={cat.id}
                          label={`${cat.label} (${count})`}
                          size="small"
                          variant="outlined"
                          color={count > 0 ? 'primary' : 'default'}
                          sx={{ fontSize: '0.7rem' }}
                        />
                      );
                    })}
                  </Box>

                  <Divider sx={{ my: 2 }} />
                  <Typography variant="subtitle1" fontWeight="bold" mb={1}>
                    חכמים
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    לחץ על אייקון החכם על גבי שורה כדי לסמן
                  </Typography>
                  <Divider sx={{ my: 1 }} />
                  {rabbies.map(r => (
                    <Box
                      key={r._id}
                      sx={{
                        mb: 1,
                        p: 1,
                        borderRadius: 1,
                        border: '1px solid',
                        borderColor: 'divider',
                      }}>
                      <Typography variant="body2" fontWeight="bold">
                        {r.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {r.description}
                      </Typography>
                    </Box>
                  ))}
                </>
              )}

              {editMode === 'categories' && activeSublineIndex !== null && (
                <>
                  <Typography variant="subtitle1" fontWeight="bold" mb={1}>
                    עריכת קטגוריות — שורה {activeSublineIndex}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    לחץ על קטגוריה לבחירה / ביטול
                  </Typography>
                  <Divider sx={{ my: 1.5 }} />
                  <Box display="flex" flexWrap="wrap" gap={0.75}>
                    {TAGGING_CATEGORIES.map(cat => (
                      <Chip
                        key={cat.id}
                        label={cat.label}
                        size="small"
                        color={pendingCategories.includes(cat.id) ? 'primary' : 'default'}
                        variant={pendingCategories.includes(cat.id) ? 'filled' : 'outlined'}
                        onClick={() => toggleCategory(cat.id)}
                        sx={{ cursor: 'pointer', fontSize: '0.75rem' }}
                      />
                    ))}
                  </Box>
                </>
              )}

              {editMode === 'connections' && activeSublineIndex !== null && (
                <>
                  <Typography variant="subtitle1" fontWeight="bold" mb={1}>
                    עריכת קישורים — שורה {activeSublineIndex}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    לחץ על שורות אחרות ברשימה כדי לקשר אליהן
                  </Typography>
                  <Divider sx={{ my: 1.5 }} />
                  {pendingConnections.length === 0 ? (
                    <Typography variant="caption" color="text.secondary">
                      אין קישורים עדיין
                    </Typography>
                  ) : (
                    <Box display="flex" flexWrap="wrap" gap={0.5}>
                      {pendingConnections.map(idx => {
                        const connected = sublines.find(s => String(s.index) === idx);
                        return (
                          <Chip
                            key={idx}
                            label={`שורה ${idx}${connected ? ': ' + connected.text.slice(0, 20) + '...' : ''}`}
                            size="small"
                            color="secondary"
                            onDelete={() => toggleConnection(Number(idx))}
                            sx={{ fontSize: '0.7rem' }}
                          />
                        );
                      })}
                    </Box>
                  )}
                </>
              )}

              {editMode === 'rabbies' && activeSublineIndex !== null && (
                <>
                  <Typography variant="subtitle1" fontWeight="bold" mb={1}>
                    סימון חכמים — שורה {activeSublineIndex}
                  </Typography>
                  {textSelection ? (
                    <>
                      <Alert severity="info" sx={{ mb: 1, py: 0.5, fontSize: '0.75rem' }}>
                        בחור: "<strong>{textSelection.text}</strong>"
                      </Alert>
                      <Typography variant="caption" color="text.secondary" display="block" mb={1}>
                        לחץ על חכם לשיוך:
                      </Typography>
                    </>
                  ) : (
                    <Typography variant="caption" color="text.secondary" display="block" mb={1}>
                      סמן טקסט בשורה ואז בחר חכם:
                    </Typography>
                  )}
                  <Divider sx={{ my: 1 }} />
                  {rabbies.map(r => (
                    <Box
                      key={r._id}
                      onClick={() => textSelection && assignRabbiToSelection(r)}
                      sx={{
                        mb: 1,
                        p: 1,
                        borderRadius: 1,
                        border: '1px solid',
                        borderColor: textSelection ? 'primary.main' : 'divider',
                        cursor: textSelection ? 'pointer' : 'default',
                        '&:hover': textSelection ? { backgroundColor: 'action.hover' } : {},
                      }}>
                      <Typography variant="body2" fontWeight="bold">
                        {r.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {r.description}
                      </Typography>
                    </Box>
                  ))}
                </>
              )}
            </Box>
          </Drawer>
        </Box>

        <Snackbar
          open={!!error}
          autoHideDuration={6000}
          onClose={() => setError(null)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
          <Alert severity="error" onClose={() => setError(null)}>
            {error}
          </Alert>
        </Snackbar>

        <Snackbar
          open={!!successMsg}
          autoHideDuration={3000}
          onClose={() => setSuccessMsg(null)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
          <Alert severity="success" onClose={() => setSuccessMsg(null)}>
            {successMsg}
          </Alert>
        </Snackbar>
      </PageContent>
    </PageWithNavigation>
  );
};

export default TaggingPage;
