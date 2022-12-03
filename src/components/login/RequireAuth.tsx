// RequireAuth.js
import { useLocation, Navigate } from 'react-router-dom';
import { useAuthenticator } from '@aws-amplify/ui-react';
import { connect } from 'react-redux';
import { UserGroup } from '../../store/reducers/authReducer';

const mapStateToProps = (state) => ({
  userGroup: state.authentication.userGroup,
});

interface Props {
  userGroup: UserGroup,
  allowedGroups: UserGroup[],
  children?: any
}

function RequireAuth({ children, userGroup, allowedGroups }: Props) {
  const location = useLocation();
  if (!allowedGroups.includes(userGroup)) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return children;
}

export default connect(mapStateToProps)(RequireAuth)

