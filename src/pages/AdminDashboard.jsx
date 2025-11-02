import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { statisticsService } from '../services/statisticsService';
import Loading from '../components/Loading';
import { toast } from 'react-toastify';

const AdminDashboard = () => {
  const [dashboardStats, setDashboardStats] = useState({
    totalPets: 0,
    availablePets: 0,
    pendingApplications: 0,
    totalApplications: 0,
    totalUsers: 0,
  });
  const [detailedStats, setDetailedStats] = useState({
    pets: null,
    applications: null,
    users: null,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const dashboardResponse = await statisticsService.getDashboardStats();
      
      if (dashboardResponse.success) {
        const statsData = dashboardResponse.data;
        setDashboardStats({
          totalPets: statsData.totalPets || statsData.pets?.total || 0,
          availablePets: statsData.availablePets || statsData.pets?.available || 0,
          pendingApplications: statsData.pendingApplications || statsData.applications?.pending || 0,
          totalApplications: statsData.totalApplications || statsData.applications?.total || 0,
          totalUsers: statsData.totalUsers || statsData.users?.total || 0,
        });
      } else {
        toast.error(dashboardResponse.message || 'Failed to fetch dashboard statistics');
      }

      const [petStatsResponse, appStatsResponse, userStatsResponse] = await Promise.all([
        statisticsService.getPetStats(),
        statisticsService.getApplicationStats(),
        statisticsService.getUserStats(),
      ]);

      if (petStatsResponse.success) {
        setDetailedStats((prev) => ({
          ...prev,
          pets: petStatsResponse.data,
        }));
      }

      if (appStatsResponse.success) {
        setDetailedStats((prev) => ({
          ...prev,
          applications: appStatsResponse.data,
        }));
      }

      if (userStatsResponse.success) {
        setDetailedStats((prev) => ({
          ...prev,
          users: userStatsResponse.data,
        }));
      }
    } catch (error) {
      toast.error('Failed to fetch statistics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading message="Loading dashboard..." />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-gray-800 mb-8">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-gray-600 text-sm font-semibold mb-2">Total Pets</h3>
          <p className="text-3xl font-bold text-blue-600">{dashboardStats.totalPets}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-gray-600 text-sm font-semibold mb-2">Available Pets</h3>
          <p className="text-3xl font-bold text-green-600">{dashboardStats.availablePets}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-gray-600 text-sm font-semibold mb-2">
            Pending Applications
          </h3>
          <p className="text-3xl font-bold text-yellow-600">
            {dashboardStats.pendingApplications}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-gray-600 text-sm font-semibold mb-2">
            Total Applications
          </h3>
          <p className="text-3xl font-bold text-purple-600">
            {dashboardStats.totalApplications}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-gray-600 text-sm font-semibold mb-2">Total Users</h3>
          <p className="text-3xl font-bold text-indigo-600">{dashboardStats.totalUsers}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link
          to="/admin/pets"
          className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Manage Pets</h2>
          <p className="text-gray-600">
            Add, edit, or remove pets from the adoption system.
          </p>
        </Link>
        <Link
          to="/admin/applications"
          className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Manage Applications
          </h2>
          <p className="text-gray-600">
            Review and approve/reject adoption applications.
          </p>
        </Link>
      </div>
    </div>
  );
};

export default AdminDashboard;

