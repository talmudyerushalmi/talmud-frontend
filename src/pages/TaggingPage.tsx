import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Alert,
  Box,
  Button,
  ButtonGroup,
  Chip,
  CircularProgress,
  Divider,
  Drawer,
  IconButton,
  Paper,
  Snackbar,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import LabelIcon from '@mui/icons-material/Label';
import PersonIcon from '@mui/icons-material/Person';
import CommentIcon from '@mui/icons-material/Comment';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import {
  TAGGING_CATEGORIES,
  Rabbi,
  RabbiMention,
  SublineCategory,
  SublineComment,
  CategoryConnection,
  TaggingSubline,
  taggingService,
  searchRabbies,
} from '../services/tagging.service';
import { RabbiCard } from '../components/tagging/RabbiCard';
import { RabbiSearchBox } from '../components/tagging/RabbiSearchBox';
import { MentionAlternativesEditor } from '../components/tagging/MentionAlternativesEditor';
import { PageWithNavigation, PageContent } from '../layout/PageWithNavigation';
import { hebrewMap } from '../inc/utils';
import PageService from '../services/pageService';
import { useAppSelector } from '../app/hooks';

type EditMode = 'none' | 'categories' | 'rabbies' | 'comments';

interface TextSelection {
  sublineIndex: number;
  startIndex: number;
  endIndex: number;
  text: string;
}

const SIDEBAR_WIDTH = 360;

type ResultLimit = 10 | 50 | 0;

const TaggingPage: React.FC = () => {
  const { tractate, chapter, mishna } = useParams<{
    tractate: string;
    chapter: string;
    mishna: string;
  }>();
  const username = useAppSelector((state: any) => state.authentication?.username) || 'עורך';

  const [sublines, setSublines] = useState<TaggingSubline[]>([]);
  const [tractateHebName, setTractateHebName] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const [activeSublineIndex, setActiveSublineIndex] = useState<number | null>(null);
  const [editMode, setEditMode] = useState<EditMode>('none');

  // Categories state
  const [pendingCategories, setPendingCategories] = useState<SublineCategory[]>([]);
  const [connectingCategoryId, setConnectingCategoryId] = useState<string | null>(null);

  // Rabbi state
  const [pendingRabbiMentions, setPendingRabbiMentions] = useState<RabbiMention[]>([]);
  const [textSelection, setTextSelection] = useState<TextSelection | null>(null);
  const [rabbiSearchQuery, setRabbiSearchQuery] = useState('');
  const [showPredictions, setShowPredictions] = useState(false);
  const [resultLimit, setResultLimit] = useState<ResultLimit>(10);
  const [editingMentionKey, setEditingMentionKey] = useState<string | null>(null);

  // Comments state
  const [pendingComments, setPendingComments] = useState<SublineComment[]>([]);
  const [newCommentText, setNewCommentText] = useState('');

  const sublineRefs = useRef<Record<number, HTMLElement | null>>({});

  const loadData = useCallback(async () => {
    if (!tractate || !chapter || !mishna) return;
    setLoading(true);
    setError(null);
    try {
      const [sublinesData, allTractates] = await Promise.all([
        taggingService.getSublines(tractate, chapter, mishna),
        PageService.getAllTractates(),
      ]);
      setSublines(sublinesData);
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

  const predictedRabbies = useMemo(() => {
    if (!showPredictions || !textSelection) return [];
    return searchRabbies(textSelection.text, resultLimit);
  }, [showPredictions, textSelection, resultLimit]);

  const searchedRabbies = useMemo(() => {
    return searchRabbies(rabbiSearchQuery, resultLimit);
  }, [rabbiSearchQuery, resultLimit]);

  const openEdit = (sublineIndex: number, mode: EditMode) => {
    const subline = sublines.find(s => s.index === sublineIndex);
    if (!subline) return;
    setActiveSublineIndex(sublineIndex);
    setEditMode(mode);
    setConnectingCategoryId(null);
    if (mode === 'categories') {
      setPendingCategories(JSON.parse(JSON.stringify(subline.categories)));
    } else if (mode === 'rabbies') {
      setPendingRabbiMentions(JSON.parse(JSON.stringify(subline.rabbiMentions)));
      setTextSelection(null);
      setShowPredictions(false);
      setRabbiSearchQuery('');
      setResultLimit(10);
      setEditingMentionKey(null);
    } else if (mode === 'comments') {
      setPendingComments(JSON.parse(JSON.stringify(subline.comments)));
      setNewCommentText('');
    }
  };

  const cancelEdit = () => {
    setActiveSublineIndex(null);
    setEditMode('none');
    setPendingCategories([]);
    setConnectingCategoryId(null);
    setPendingRabbiMentions([]);
    setTextSelection(null);
    setShowPredictions(false);
    setRabbiSearchQuery('');
    setEditingMentionKey(null);
    setPendingComments([]);
    setNewCommentText('');
  };

  const saveEdit = async () => {
    if (activeSublineIndex === null || !tractate || !chapter || !mishna) return;
    setSaving(true);
    setError(null);
    try {
      const dto: any = {};
      if (editMode === 'categories') dto.categories = pendingCategories;
      else if (editMode === 'rabbies') dto.rabbiMentions = pendingRabbiMentions;
      else if (editMode === 'comments') dto.comments = pendingComments;

      await taggingService.updateSublineTags(tractate, chapter, mishna, activeSublineIndex, dto);

      setSublines(prev =>
        prev.map(s => {
          if (s.index !== activeSublineIndex) return s;
          return {
            ...s,
            ...(editMode === 'categories' ? { categories: pendingCategories } : {}),
            ...(editMode === 'rabbies' ? { rabbiMentions: pendingRabbiMentions } : {}),
            ...(editMode === 'comments' ? { comments: pendingComments } : {}),
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

  // ─── Category helpers ───

  const toggleCategory = (categoryId: string) => {
    setPendingCategories(prev => {
      const existing = prev.find(c => c.categoryId === categoryId);
      if (existing) {
        if (connectingCategoryId === categoryId) setConnectingCategoryId(null);
        return prev.filter(c => c.categoryId !== categoryId);
      }
      return [...prev, { categoryId, connections: [] }];
    });
  };

  const addSublineConnection = (categoryId: string, sublineIdx: number) => {
    setPendingCategories(prev =>
      prev.map(cat => {
        if (cat.categoryId !== categoryId) return cat;
        const already = cat.connections.some(c => c.type === 'subline' && c.sublineIndex === sublineIdx);
        if (already) return cat;
        return { ...cat, connections: [...cat.connections, { type: 'subline' as const, sublineIndex: sublineIdx }] };
      })
    );
  };

  const addExternalConnection = (categoryId: string, text: string) => {
    if (!text.trim()) return;
    setPendingCategories(prev =>
      prev.map(cat => {
        if (cat.categoryId !== categoryId) return cat;
        return { ...cat, connections: [...cat.connections, { type: 'external' as const, text: text.trim() }] };
      })
    );
  };

  const removeConnection = (categoryId: string, connIndex: number) => {
    setPendingCategories(prev =>
      prev.map(cat => {
        if (cat.categoryId !== categoryId) return cat;
        return { ...cat, connections: cat.connections.filter((_, i) => i !== connIndex) };
      })
    );
  };

  // ─── Rabbi helpers ───

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

    setTextSelection({ sublineIndex, startIndex, endIndex: startIndex + selectedText.length, text: selectedText });
    setShowPredictions(false);
    setEditingMentionKey(null);
    selection.removeAllRanges();
  };

  const assignRabbiToSelection = (rabbi: Rabbi) => {
    if (!textSelection) return;
    const key = `${textSelection.startIndex}-${textSelection.endIndex}`;
    const mention: RabbiMention = {
      rabbiId: rabbi.id,
      rabbiName: rabbi.displayName,
      startIndex: textSelection.startIndex,
      endIndex: textSelection.endIndex,
      text: textSelection.text,
      doubt: false,
    };
    setPendingRabbiMentions(prev => [
      ...prev.filter(m => !(m.startIndex === mention.startIndex && m.endIndex === mention.endIndex)),
      mention,
    ]);
    setTextSelection(null);
    setShowPredictions(false);
    setRabbiSearchQuery('');
    setEditingMentionKey(key);
  };

  const removeRabbiMention = (mention: RabbiMention) => {
    setPendingRabbiMentions(prev =>
      prev.filter(m => !(m.startIndex === mention.startIndex && m.endIndex === mention.endIndex))
    );
  };

  const editingMention = useMemo(() => {
    if (!editingMentionKey) return null;
    return pendingRabbiMentions.find(m => `${m.startIndex}-${m.endIndex}` === editingMentionKey) ?? null;
  }, [editingMentionKey, pendingRabbiMentions]);

  const updateEditingMention = useCallback((updates: Partial<RabbiMention>) => {
    if (!editingMentionKey) return;
    setPendingRabbiMentions(prev => prev.map(m =>
      `${m.startIndex}-${m.endIndex}` === editingMentionKey ? { ...m, ...updates } : m
    ));
  }, [editingMentionKey]);

  // ─── Comment helpers ───

  const addComment = () => {
    if (!newCommentText.trim()) return;
    const comment: SublineComment = {
      text: newCommentText.trim(),
      author: username,
      timestamp: new Date().toISOString(),
    };
    setPendingComments(prev => [...prev, comment]);
    setNewCommentText('');
  };

  const deleteComment = (index: number) => {
    setPendingComments(prev => prev.filter((_, i) => i !== index));
  };

  // ─── Rendering ───

  const renderSublineText = (subline: TaggingSubline) => {
    const mentions = editMode === 'rabbies' && activeSublineIndex === subline.index
      ? pendingRabbiMentions
      : subline.rabbiMentions;

    if (!mentions || mentions.length === 0) return <span>{subline.text}</span>;

    const sorted = [...mentions].sort((a, b) => a.startIndex - b.startIndex);
    const parts: React.ReactNode[] = [];
    let cursor = 0;
    for (const mention of sorted) {
      if (mention.startIndex > cursor) {
        parts.push(<span key={`t-${cursor}`}>{subline.text.slice(cursor, mention.startIndex)}</span>);
      }
      parts.push(
        <Tooltip key={`m-${mention.startIndex}`} title={`${mention.rabbiName}${mention.doubt ? ' (?)' : ''}${mention.alternatives?.length ? ` — ${mention.alternatives.map(a => a.rabbiName).join(' / ')}` : ''}`} arrow>
          <span style={{
            backgroundColor: mention.doubt ? '#fff9c4' : '#bbdefb',
            borderRadius: '3px',
            padding: '1px 2px',
            cursor: 'pointer',
            fontWeight: 'bold',
          }}>
            {subline.text.slice(mention.startIndex, mention.endIndex)}
            {mention.doubt && <HelpOutlineIcon sx={{ fontSize: 12, ml: 0.25, verticalAlign: 'text-top', color: '#f57f17' }} />}
          </span>
        </Tooltip>
      );
      cursor = mention.endIndex;
    }
    if (cursor < subline.text.length) {
      parts.push(<span key="t-end">{subline.text.slice(cursor)}</span>);
    }
    return <>{parts}</>;
  };

  const isActiveSubline = (index: number) => activeSublineIndex === index;
  const isConnectingSubline = connectingCategoryId !== null && editMode === 'categories';

  if (!tractate || !chapter || !mishna) {
    return (
      <Box p={4}><Alert severity="warning">חסרים פרמטרים בכתובת</Alert></Box>
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
              <Box display="flex" justifyContent="center" mt={4}><CircularProgress /></Box>
            )}

            {!loading && sublines.map(subline => {
              const active = isActiveSubline(subline.index);
              const isConnectionTarget = isConnectingSubline && !active && activeSublineIndex !== subline.index;
              const isConnectedTarget = isConnectingSubline && connectingCategoryId &&
                pendingCategories.find(c => c.categoryId === connectingCategoryId)?.connections
                  .some(conn => conn.type === 'subline' && conn.sublineIndex === subline.index);

              return (
                <Paper
                  key={subline.index}
                  ref={el => { sublineRefs.current[subline.index] = el; }}
                  elevation={active ? 4 : 1}
                  onMouseUp={() => handleTextSelectionOnSubline(subline.index)}
                  onClick={() => {
                    if (isConnectionTarget && connectingCategoryId) {
                      addSublineConnection(connectingCategoryId, subline.index);
                    }
                  }}
                  sx={{
                    mb: 1.5, p: 1.5, borderRadius: 2,
                    border: active ? '2px solid #1976d2'
                      : isConnectedTarget ? '2px solid #9c27b0'
                      : isConnectionTarget ? '2px dashed #9c27b0'
                      : '1px solid transparent',
                    cursor: isConnectionTarget ? 'pointer' : 'default',
                    transition: 'border 0.15s',
                    '&:hover': isConnectionTarget ? { borderColor: '#7b1fa2' } : {},
                  }}>
                  <Box display="flex" alignItems="flex-start" gap={1}>
                    <Typography variant="caption" sx={{ minWidth: 28, color: 'text.secondary', mt: 0.3, fontWeight: 'bold' }}>
                      {subline.index}
                    </Typography>

                    <Typography variant="body2" flex={1} sx={{
                      lineHeight: 1.8,
                      userSelect: editMode === 'rabbies' && active ? 'text' : 'none',
                      direction: 'rtl',
                    }}>
                      {renderSublineText(subline)}
                    </Typography>

                    {!active && (
                      <Box display="flex" gap={0.5} ml={1}>
                        <Tooltip title="קטגוריות וקישורים">
                          <IconButton size="small" color={subline.categories.length > 0 ? 'primary' : 'default'}
                            onClick={() => openEdit(subline.index, 'categories')}>
                            <LabelIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="חכמים">
                          <IconButton size="small" color={subline.rabbiMentions.length > 0 ? 'warning' : 'default'}
                            onClick={() => openEdit(subline.index, 'rabbies')}>
                            <PersonIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="הערות">
                          <IconButton size="small" color={subline.comments.length > 0 ? 'info' : 'default'}
                            onClick={() => openEdit(subline.index, 'comments')}>
                            <CommentIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    )}

                    {active && (
                      <Box display="flex" gap={0.5} ml={1}>
                        <Tooltip title="שמור">
                          <IconButton size="small" color="success" onClick={saveEdit} disabled={saving}>
                            {saving ? <CircularProgress size={16} /> : <CheckIcon fontSize="small" />}
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="בטל">
                          <IconButton size="small" onClick={cancelEdit}><CloseIcon fontSize="small" /></IconButton>
                        </Tooltip>
                      </Box>
                    )}
                  </Box>

                  {/* Tags summary */}
                  {!active && (
                    <Box mt={0.5} pr={4}>
                      {subline.categories.map(cat => {
                        const catDef = TAGGING_CATEGORIES.find(c => c.id === cat.categoryId);
                        if (!catDef) return null;
                        const sublineConns = cat.connections.filter(c => c.type === 'subline');
                        const externalConns = cat.connections.filter(c => c.type === 'external');
                        return (
                          <Box key={cat.categoryId} display="flex" alignItems="baseline" gap={0.5} mb={0.3}>
                            <Chip label={catDef.label} size="small" color="primary" variant="outlined"
                              sx={{ fontSize: '0.7rem', height: 20 }} />
                            {sublineConns.length > 0 && (
                              <Typography variant="caption" color="text.secondary">
                                ← {sublineConns.map(c => `שורה ${c.sublineIndex}`).join(', ')}
                              </Typography>
                            )}
                            {externalConns.length > 0 && (
                              <Typography variant="caption" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                                {sublineConns.length > 0 ? ' | ' : '← '}
                                {externalConns.map(c => c.text).join(', ')}
                              </Typography>
                            )}
                          </Box>
                        );
                      })}
                      <Box mt={subline.categories.length > 0 ? 0.5 : 0}>
                        {subline.rabbiMentions.map((m, i) => (
                          <Box key={i} mb={0.25}>
                            <Chip
                              label={`${m.rabbiName}${m.doubt ? ' ?' : ''}`}
                              size="small" color="warning" variant="outlined"
                              sx={{ fontSize: '0.7rem', height: 20 }}
                            />
                            {m.alternatives && m.alternatives.length > 0 && (
                              <Box mr={2}>
                                {m.alternatives.map((alt, j) => (
                                  <Typography key={j} variant="caption" color="text.secondary" display="block" sx={{ fontSize: '0.6rem' }}>
                                    ↳ {alt.rabbiName}
                                  </Typography>
                                ))}
                              </Box>
                            )}
                          </Box>
                        ))}
                      </Box>
                      {subline.comments.map((comment, i) => (
                        <Box key={i} display="flex" alignItems="baseline" gap={0.5} mb={0.3}>
                          <Chip label="הערה" size="small" color="info" variant="outlined"
                            sx={{ fontSize: '0.7rem', height: 20 }} />
                          <Typography variant="caption" color="text.secondary">
                            {comment.text}
                          </Typography>
                          <Typography variant="caption" color="text.disabled" sx={{ fontSize: '0.65rem' }}>
                            ({comment.author} • {new Date(comment.timestamp).toLocaleDateString('he-IL')})
                          </Typography>
                        </Box>
                      ))}
                    </Box>
                  )}

                  {/* Inline category edit: show selected categories */}
                  {active && editMode === 'categories' && (
                    <Box mt={1.5} pr={4}>
                      <Typography variant="caption" color="text.secondary" mb={1} display="block">
                        בחר קטגוריות (בסרגל הצד ניתן לנהל קישורים):
                      </Typography>
                      <Box display="flex" flexWrap="wrap" gap={0.75}>
                        {TAGGING_CATEGORIES.map(cat => (
                          <Chip key={cat.id} label={cat.label} size="small"
                            color={pendingCategories.some(c => c.categoryId === cat.id) ? 'primary' : 'default'}
                            variant={pendingCategories.some(c => c.categoryId === cat.id) ? 'filled' : 'outlined'}
                            onClick={() => toggleCategory(cat.id)}
                            sx={{ cursor: 'pointer', fontSize: '0.75rem' }}
                          />
                        ))}
                      </Box>
                    </Box>
                  )}

                  {/* Inline rabbi edit */}
                  {active && editMode === 'rabbies' && (
                    <Box mt={1.5} pr={4}>
                      {textSelection ? (
                        <Box display="flex" alignItems="center" gap={1} mb={1}>
                          <Alert severity="info" sx={{ py: 0.25, flex: 1 }}>
                            סימנת: "<strong>{textSelection.text}</strong>"
                          </Alert>
                          {!showPredictions && (
                            <Button variant="contained" size="small" startIcon={<SearchIcon />}
                              onClick={() => setShowPredictions(true)} sx={{ whiteSpace: 'nowrap' }}>
                              חפש חכם
                            </Button>
                          )}
                        </Box>
                      ) : (
                        <Typography variant="caption" color="text.secondary" mb={1} display="block">
                          סמן טקסט בשורה ולחץ "חפש חכם"
                        </Typography>
                      )}
                      {pendingRabbiMentions.length > 0 && (
                        <Box mb={1}>
                          {pendingRabbiMentions.map((m, i) => (
                            <Box key={i} mb={0.5}>
                              <Chip
                                label={`${m.rabbiName}${m.doubt ? ' ?' : ''}: "${m.text}"`}
                                size="small" color="warning"
                                onDelete={() => removeRabbiMention(m)}
                                sx={{ fontSize: '0.7rem' }}
                              />
                              {m.alternatives && m.alternatives.length > 0 && (
                                <Box mr={2} mt={0.25}>
                                  {m.alternatives.map((alt, j) => (
                                    <Typography key={j} variant="caption" color="text.secondary" display="block" sx={{ fontSize: '0.65rem' }}>
                                      ↳ {alt.rabbiName}
                                    </Typography>
                                  ))}
                                </Box>
                              )}
                            </Box>
                          ))}
                        </Box>
                      )}
                    </Box>
                  )}

                  {/* Inline comments */}
                  {active && editMode === 'comments' && (
                    <Box mt={1.5} pr={4}>
                      <Typography variant="caption" color="text.secondary" mb={1} display="block">
                        הערות לשורה זו:
                      </Typography>
                    </Box>
                  )}
                </Paper>
              );
            })}
          </Box>

          {/* ═══ Sidebar ═══ */}
          <Drawer variant="permanent" anchor="right" sx={{
            width: SIDEBAR_WIDTH, flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: SIDEBAR_WIDTH, boxSizing: 'border-box',
              top: 'auto', position: 'fixed', right: 0,
              height: 'calc(100vh - 250px)', maxHeight: 'calc(100vh - 250px)',
              overflowY: 'auto', borderLeft: '1px solid', borderColor: 'divider', p: 2,
            },
          }}>
            <Box dir="rtl">
              {/* ─── Idle ─── */}
              {editMode === 'none' && (
                <>
                  <Typography variant="subtitle1" fontWeight="bold" mb={1}>עורך תגיות</Typography>
                  <Typography variant="caption" color="text.secondary" display="block">
                    לחץ על אחד מהאייקונים בכל שורה כדי להתחיל:
                  </Typography>
                  <Box mt={2} display="flex" flexDirection="column" gap={1.5}>
                    <Box display="flex" alignItems="center" gap={1}>
                      <LabelIcon fontSize="small" color="primary" />
                      <Typography variant="body2">קטגוריות וקישורים</Typography>
                    </Box>
                    <Box display="flex" alignItems="center" gap={1}>
                      <PersonIcon fontSize="small" color="warning" />
                      <Typography variant="body2">תיוג חכמים</Typography>
                    </Box>
                    <Box display="flex" alignItems="center" gap={1}>
                      <CommentIcon fontSize="small" color="info" />
                      <Typography variant="body2">הערות</Typography>
                    </Box>
                  </Box>
                </>
              )}

              {/* ─── Categories sidebar ─── */}
              {editMode === 'categories' && activeSublineIndex !== null && (
                <>
                  <Typography variant="subtitle1" fontWeight="bold" mb={1}>
                    קישורי קטגוריות — שורה {activeSublineIndex}
                  </Typography>

                  {pendingCategories.length === 0 ? (
                    <Typography variant="caption" color="text.secondary">
                      בחר קטגוריות בשורה כדי לנהל קישורים
                    </Typography>
                  ) : (
                    pendingCategories.map(cat => {
                      const catDef = TAGGING_CATEGORIES.find(c => c.id === cat.categoryId);
                      if (!catDef) return null;
                      const isConnecting = connectingCategoryId === cat.categoryId;
                      return (
                        <Box key={cat.categoryId} sx={{
                          mb: 2, p: 1.5, borderRadius: 1,
                          border: '1px solid', borderColor: isConnecting ? 'primary.main' : 'divider',
                          backgroundColor: isConnecting ? 'action.selected' : 'transparent',
                        }}>
                          <Typography variant="body2" fontWeight="bold" mb={0.5}>
                            {catDef.label}
                          </Typography>

                          {/* Existing connections */}
                          {cat.connections.map((conn, ci) => (
                            <Box key={ci} display="flex" alignItems="center" gap={0.5} mb={0.5}>
                              <Chip
                                label={conn.type === 'subline' ? `שורה ${conn.sublineIndex}` : conn.text}
                                size="small"
                                color={conn.type === 'subline' ? 'secondary' : 'default'}
                                variant="outlined"
                                onDelete={() => removeConnection(cat.categoryId, ci)}
                                sx={{ fontSize: '0.7rem' }}
                              />
                            </Box>
                          ))}

                          {/* Action buttons */}
                          <Box display="flex" gap={0.5} mt={1} flexWrap="wrap">
                            <Button size="small" variant={isConnecting ? 'contained' : 'outlined'}
                              onClick={() => setConnectingCategoryId(isConnecting ? null : cat.categoryId)}>
                              {isConnecting ? 'סיום בחירת שורות' : 'קשר לשורה'}
                            </Button>
                            <ExternalSourceInput onAdd={(text) => addExternalConnection(cat.categoryId, text)} />
                          </Box>
                        </Box>
                      );
                    })
                  )}
                </>
              )}

              {/* ─── Rabbies sidebar ─── */}
              {editMode === 'rabbies' && activeSublineIndex !== null && (
                <>
                  <Typography variant="subtitle1" fontWeight="bold" mb={1}>
                    תיוג חכמים — שורה {activeSublineIndex}
                  </Typography>

                  {/* Doubt + alternatives editor — shown only after a rabbi has been assigned */}
                  {editingMention && (
                    <MentionAlternativesEditor
                      key={editingMentionKey!}
                      mention={editingMention}
                      onUpdate={updateEditingMention}
                    />
                  )}

                  {/* Result limit toggle */}
                  <Box display="flex" alignItems="center" gap={1} mb={1.5}>
                    <Typography variant="caption" color="text.secondary">תוצאות:</Typography>
                    <ButtonGroup size="small" variant="outlined">
                      <Button variant={resultLimit === 10 ? 'contained' : 'outlined'} onClick={() => setResultLimit(10)}>10</Button>
                      <Button variant={resultLimit === 50 ? 'contained' : 'outlined'} onClick={() => setResultLimit(50)}>50</Button>
                      <Button variant={resultLimit === 0 ? 'contained' : 'outlined'} onClick={() => setResultLimit(0)}>הכל</Button>
                    </ButtonGroup>
                  </Box>

                  {!textSelection && !showPredictions && (
                    <Typography variant="caption" color="text.secondary" display="block" mb={1}>
                      סמן טקסט בשורה ולחץ "חפש חכם"
                    </Typography>
                  )}

                  {textSelection && !showPredictions && (
                    <Alert severity="info" sx={{ mb: 1, py: 0.5, fontSize: '0.75rem' }}>
                      סימנת: "<strong>{textSelection.text}</strong>"<br />לחץ "חפש חכם"
                    </Alert>
                  )}

                  {showPredictions && textSelection && (
                    <>
                      <Alert severity="success" sx={{ mb: 1.5, py: 0.5, fontSize: '0.75rem' }}>
                        התאמות עבור: "<strong>{textSelection.text}</strong>"
                      </Alert>
                      {predictedRabbies.length > 0 ? (
                        <>
                          <Typography variant="caption" color="text.secondary" display="block" mb={1}>
                            לחץ על חכם לשיוך ({predictedRabbies.length} תוצאות):
                          </Typography>
                          {predictedRabbies.map(r => (
                            <RabbiCard key={r.id} rabbi={r} clickable onClick={() => assignRabbiToSelection(r)} />
                          ))}
                        </>
                      ) : (
                        <Typography variant="caption" color="text.secondary" display="block" mb={1}>
                          לא נמצאו התאמות אוטומטיות
                        </Typography>
                      )}
                      <Divider sx={{ my: 1.5 }} />
                    </>
                  )}

                  <Typography variant="caption" color="text.secondary" display="block" mb={0.5}>
                    {showPredictions ? 'לא מצאת? חפש ידנית:' : 'או חפש ידנית:'}
                  </Typography>
                  <RabbiSearchBox value={rabbiSearchQuery} onChange={setRabbiSearchQuery} />
                  {rabbiSearchQuery && searchedRabbies.length === 0 && (
                    <Typography variant="caption" color="text.secondary">לא נמצאו תוצאות</Typography>
                  )}
                  {searchedRabbies.map(r => (
                    <RabbiCard key={r.id} rabbi={r} clickable={!!textSelection} onClick={() => assignRabbiToSelection(r)} />
                  ))}
                </>
              )}

              {/* ─── Comments sidebar ─── */}
              {editMode === 'comments' && activeSublineIndex !== null && (
                <>
                  <Typography variant="subtitle1" fontWeight="bold" mb={1}>
                    הערות — שורה {activeSublineIndex}
                  </Typography>

                  {pendingComments.length === 0 && (
                    <Typography variant="caption" color="text.secondary" display="block" mb={1}>
                      אין הערות עדיין
                    </Typography>
                  )}

                  {pendingComments.map((comment, i) => (
                    <Paper key={i} elevation={0} sx={{ p: 1, mb: 1, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
                      <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                        <Box>
                          <Typography variant="body2">{comment.text}</Typography>
                          <Typography variant="caption" color="text.secondary">
                            {comment.author} • {new Date(comment.timestamp).toLocaleDateString('he-IL')}
                          </Typography>
                        </Box>
                        <IconButton size="small" onClick={() => deleteComment(i)}>
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </Paper>
                  ))}

                  <Divider sx={{ my: 1.5 }} />
                  <Typography variant="caption" color="text.secondary" display="block" mb={0.5}>
                    הוסף הערה חדשה:
                  </Typography>
                  <TextField
                    fullWidth
                    size="small"
                    multiline
                    rows={3}
                    placeholder="כתוב הערה..."
                    value={newCommentText}
                    onChange={e => setNewCommentText(e.target.value)}
                    sx={{ mb: 1 }}
                  />
                  <Button
                    variant="contained"
                    size="small"
                    startIcon={<AddIcon />}
                    onClick={addComment}
                    disabled={!newCommentText.trim()}>
                    הוסף
                  </Button>
                </>
              )}
            </Box>
          </Drawer>
        </Box>

        <Snackbar open={!!error} autoHideDuration={6000} onClose={() => setError(null)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
          <Alert severity="error" onClose={() => setError(null)}>{error}</Alert>
        </Snackbar>
        <Snackbar open={!!successMsg} autoHideDuration={3000} onClose={() => setSuccessMsg(null)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
          <Alert severity="success" onClose={() => setSuccessMsg(null)}>{successMsg}</Alert>
        </Snackbar>
      </PageContent>
    </PageWithNavigation>
  );
};

// Small inline component for adding external source text
const ExternalSourceInput = React.memo(({ onAdd }: { onAdd: (text: string) => void }) => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState('');
  if (!open) {
    return (
      <Button size="small" variant="outlined" onClick={() => setOpen(true)}>
        מקור חיצוני
      </Button>
    );
  }
  return (
    <Box display="flex" gap={0.5} alignItems="center" mt={0.5} width="100%">
      <TextField size="small" placeholder="מקור חיצוני..." value={value}
        onChange={e => setValue(e.target.value)} sx={{ flex: 1 }} />
      <IconButton size="small" color="primary" onClick={() => { onAdd(value); setValue(''); setOpen(false); }}
        disabled={!value.trim()}>
        <CheckIcon fontSize="small" />
      </IconButton>
      <IconButton size="small" onClick={() => { setOpen(false); setValue(''); }}>
        <CloseIcon fontSize="small" />
      </IconButton>
    </Box>
  );
});

export default TaggingPage;
