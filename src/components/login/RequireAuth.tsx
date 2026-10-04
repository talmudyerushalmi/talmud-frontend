// RequireAuth.js
import { useLocation, Navigate } from 'react-router-dom';
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
  // Auth is still being probed (initial mount / page refresh). Returning `null`
  // here is intentional: redirecting to /login during this window would kick
  // signed-in editors off admin pages every time they refresh. The blank frame
  // lasts only until `getUserAuth` resolves (~hundreds of ms).
  if (userGroup === UserGroup.Unknown) {
    return null;
  }
  if (!allowedGroups.includes(userGroup)) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return children;
}

export default connect(mapStateToProps)(RequireAuth)

