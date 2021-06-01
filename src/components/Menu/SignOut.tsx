import React from "react";
import { Button, Typography } from "@material-ui/core";
import { connect } from "react-redux";
import { signOut } from "../../store/actions/authActions";
import { Hub } from 'aws-amplify';

const mapStateToProps = (state: any) => ({
  username: state.authentication.username,
});

const mapDispatchToProps = (dispatch: any) => ({
  signOut: () => {
    dispatch(signOut());
  },
});



const SignOut = (props: any) => {
  const { username, signOut } = props;

  Hub.listen('auth', (data) => {
    const { payload } = data;
    console.log('data',payload)
    console.log('A new auth event has happened: ', data.payload.data.username + ' has ' + data.payload.event);
})

  async function handlerSignOut() {
    try {
      signOut();
    } catch (error) {
      console.log("error signing out: ", error);
    }
  }

  return (
    <>
      {username ? (
        <>
          <Button onClick={handlerSignOut}>Sign out</Button>
          <Typography>Hello, {username}</Typography>
        </>
      ) : null}
    </>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(SignOut);
