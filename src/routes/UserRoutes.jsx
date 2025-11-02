import { Route } from 'react-router-dom';
import ProtectedRoute from '../components/ProtectedRoute';
import UserDashboard from '../pages/UserDashboard';
import ProfilePage from '../pages/ProfilePage';

const UserRoutes = () => {
  return (
    <>
      <Route
        path="/user/dashboard"
        element={
          <ProtectedRoute>
            <UserDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/user/profile"
        element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        }
      />
    </>
  );
};

export default UserRoutes;

