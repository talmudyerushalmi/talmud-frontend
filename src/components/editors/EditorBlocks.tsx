import makeStyles from '@mui/styles/makeStyles';

const numberStyle = makeStyles({
  root: {
    position: 'relative',
    marginBottom: '0.4rem',
    '> span': {
      color: 'red',
    },
  },
});

export const NumberedBlock = (props) => {
  const classes = numberStyle();
  return props.children.map((block, index) => {
    return (
      <div key={index} className={classes.root}>
        <span style={{ userSelect: 'none', position: 'absolute', right: '-1rem', background: 'yellow' }}>{index}</span>
        {block}
      </div>
    );
  });
};
