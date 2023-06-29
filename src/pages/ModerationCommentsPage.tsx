import React, { FC, useEffect } from 'react';
import { Box, Button, IconButton, Typography } from '@mui/material';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { approveComment, getCommentsForModeration, rejectComment } from '../store/actions/commentsActions';
import { iComment } from '../types/types';
import { DataGrid, GridRenderCellParams } from '@mui/x-data-grid';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { renderCellExpand } from '../components/shared/GridCellExpand';

interface IProps {}

const ModerationCommentsPage: FC<IProps> = () => {
  const dispatch = useAppDispatch();
  const commentsForModeration = useAppSelector((state: any) => state.comments.commentsForModeration as iComment[]);

  useEffect(() => {
    dispatch(getCommentsForModeration());
  }, [dispatch]);

  const rows = commentsForModeration.map((item) => ({
    id: item.commentID,
    title: item.title,
    text: item.text,
    source: {
      path: `${item.tractate}/${item.chapter}/${item.mishna}`,
      sublines: `${item.fromSubline} - ${item.toSubline}`,
    },
    actions: {
      commentID: item.commentID,
      userID: item.userID,
    },
  }));

  const columns = [
    { field: 'id', headerName: 'מזהה הערה', width: 150 },
    { field: 'title', headerName: 'כותרת', width: 150, renderCell: renderCellExpand },
    { field: 'text', headerName: 'תוכן הערה', flex: 1, minWidth: 150, renderCell: renderCellExpand },
    {
      field: 'source',
      headerName: 'מקור',
      width: 150,
      renderCell: (params: GridRenderCellParams<any>) => (
        <>
          <IconButton
            onClick={() => {
              window.open(`https://www.talmudyerushalmi.com/talmud/${params.value.path}`, '_blank');
            }}>
            <OpenInNewIcon />
          </IconButton>
          <Typography variant="body1">{params.value.sublines}</Typography>
        </>
      ),
    },
    {
      field: 'actions',
      headerName: 'פעולות',
      width: 150,
      renderCell: (params: GridRenderCellParams<any>) => (
        <>
          <Button
            variant="contained"
            color="primary"
            size="small"
            onClick={() => {
              dispatch(approveComment(params.value.userID, params.value.commentID));
            }}>
            אשר
          </Button>
          &nbsp;
          <Button
            variant="contained"
            color="error"
            size="small"
            onClick={() => {
              dispatch(rejectComment(params.value.userID, params.value.commentID));
            }}>
            דחה
          </Button>
        </>
      ),
    },
  ];

  return (
    <DataGrid
      rows={rows}
      columns={columns}
      sx={{
        '*': { fontFamily: 'system-ui !important' },
      }}
      slots={{
        footer: () => (
          <Box borderTop="1px solid #e0e0e0" p="10px">
            סה"כ {commentsForModeration.length} הערות ממתינות לאישור
          </Box>
        ),
      }}
    />
  );
};

export default ModerationCommentsPage;
