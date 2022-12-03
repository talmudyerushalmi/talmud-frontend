// RequireAuth.js
import { useLocation, Navigate } from 'react-router-dom';
import { useAuthenticator } from '@aws-amplify/ui-react';
import { connect } from 'react-redux';

const mapStateToProps = (state) => ({
  username: state.authentication.username,
});

function RequireAuth({ children,username }) {
  const location = useLocation();
  if (!username) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return children;
}

export default connect(mapStateToProps)(RequireAuth)

