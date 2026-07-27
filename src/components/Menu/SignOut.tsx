import React, { useEffect } from 'react';
import { Button, Typography } from '@mui/material';
import { connect } from 'react-redux';
import { setUserAuth, signOut } from '../../store/actions/authActions';
import { Hub } from 'aws-amplify/utils';

const mapStateToProps = (state: any) => ({
  username: state.authentication.username,
});

const mapDispatchToProps = (dispatch: any) => ({
  signOut: () => {
    dispatch(signOut());
  },
  setUserAuth: (userAuth: any) => {
    dispatch(setUserAuth(userAuth));
  },
});

const SignOut = (props: any) => {
  const { username, signOut, setUserAuth } = props;

  useEffect(() => {
    const unsubscribe = Hub.listen('auth', ({ payload }) => {
      if (payload.event === 'signedIn' || (payload.event as string) === 'signIn') {
        setUserAuth((payload as any).data);
      }
    });

    return () => {
      unsubscribe();
    };
  }, [setUserAuth]);

  async function handlerSignOut() {
    try {
      signOut();
    } catch (error) {
      console.log('error signing out: ', error);
    }
  }

  return (
    <>
      <Button onClick={handlerSignOut}>Sign out</Button>
      <Typography>Hello, {username}</Typography>
    </>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(SignOut);