import React from 'react';
import FormGroup from '@mui/material/FormGroup';
import { connect } from 'react-redux';
import { toggleEditType } from '../../store/actions/mishnaViewActions';
import { useTranslation } from 'react-i18next';
import { Link, MenuItem, Select, IconButton, Box } from '@mui/material';
import { useParams } from 'react-router-dom';
import { routeObject } from '../../store/reducers/navigationReducer';
import { ShowEditType } from '../../store/reducers/mishnaViewReducer';
import PrintIcon from '@mui/icons-material/Print';

const mapStateToProps = (state) => ({
  showEditType: state.mishnaView.showEditType,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  toggleEditType: (e) => {
    dispatch(toggleEditType(e.target.value));
  },
});

const MishnaViewOptions = (props) => {
  const {
    showEditType,
    toggleEditType,
  } = props;
  const { t, i18n } = useTranslation();
  const isHebrew = i18n.language === 'he';
  const route = useParams<routeObject>();

  return (
    <FormGroup row sx={{ 
      alignItems: 'center', 
      flexDirection: isHebrew ? 'row' : 'row-reverse',
      marginTop: '-18px',
      marginBottom: '-4px',
    }}>
      <Select
        sx={{
          '.MuiOutlinedInput-notchedOutline': { border: 'none' },
          direction: isHebrew ? 'rtl' : 'ltr',
          // Isolate from global RTL context
          ...(!isHebrew && {
            '& *': { direction: 'ltr' },
          }),
          minWidth: isHebrew ? 'auto' : '120px',
          '& .MuiSelect-select': {
            paddingRight: isHebrew ? '14px' : '24px',
            paddingLeft: isHebrew ? '32px' : '14px',
          },
          '& .MuiSvgIcon-root': {
            right: isHebrew ? '7px' : '105px',
          },
        }}
        value={showEditType}
        label=""
        onChange={toggleEditType}>
        <MenuItem sx={{ direction: 'ltr' }} value={ShowEditType.ORIGINAL}>
          {t('Original') as string}
        </MenuItem>
        <MenuItem sx={{ direction: 'ltr' }} value={ShowEditType.EDITED}>
          {t('Edited') as string}
        </MenuItem>
        <MenuItem sx={{ direction: 'ltr' }} value={ShowEditType.COMBINED}>
          {t('Combined') as string}
        </MenuItem>
      </Select>

      <Link
        sx={{
          textDecoration: 'none',
          display: 'inline-flex',
          alignItems: 'center',
          cursor: 'pointer',
          verticalAlign: 'middle',
          marginLeft: isHebrew ? '16px' : '15px',
          marginRight: isHebrew ? '15px' : 0,
        }}
        target="_blank"
        href={`${process.env.REACT_APP_DB_HOST}/mishna/${route.tractate}/${route.chapter}/${route.mishna}/tei`}
        download>
        [TEI]
      </Link>
      <Box marginLeft={isHebrew ? 10 : 0} marginRight={isHebrew ? 0 : 10}>
        <IconButton onClick={() => window.print()} size="small" aria-label={t('Print')}>
          <PrintIcon />
        </IconButton>
      </Box>
    </FormGroup>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(MishnaViewOptions);
