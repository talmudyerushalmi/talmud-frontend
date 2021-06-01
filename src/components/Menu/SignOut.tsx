import React from "react";
import { Button, Typography } from "@material-ui/core";
import { connect } from "react-redux";
import { setUserAuth, signOut } from "../../store/actions/authActions";
import { Hub } from "aws-amplify";

const mapStateToProps = (state: any) => ({
  username: state.authentication.username,
});

const mapDispatchToProps = (dispatch: any) => ({
  signOut: () => {
    dispatch(signOut());
  },
  setUserAuth: (userAuth:any) => {
      dispatch(setUserAuth(userAuth))
  }
});

const SignOut = (props: any) => {
  const { username, signOut, setUserAuth } = props;

  Hub.listen("auth", (data) => {
    const { payload } = data;
    if (payload.event === "signIn") {
      setUserAuth(payload.data.signInUserSession);
    }
  });

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
