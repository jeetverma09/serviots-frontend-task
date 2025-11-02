import { Route } from 'react-router-dom';
import ProtectedRoute from '../components/ProtectedRoute';
import AdminDashboard from '../pages/AdminDashboard';
import ManagePets from '../pages/ManagePets';
import ManageApplications from '../pages/ManageApplications';

const AdminRoutes = () => {
  return (
    <>
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute adminOnly={true}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/pets"
        element={
          <ProtectedRoute adminOnly={true}>
            <ManagePets />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/applications"
        element={
          <ProtectedRoute adminOnly={true}>
            <ManageApplications />
          </ProtectedRoute>
        }
      />
    </>
  );
};

export default AdminRoutes;

