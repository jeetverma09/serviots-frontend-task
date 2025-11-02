import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { applicationService } from '../services/applicationService';
import Loading from '../components/Loading';
import { toast } from 'react-toastify';

const UserDashboard = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const response = await applicationService.getUserApplications();
      if (response.success) {
        const appsData = response.data;
        setApplications(Array.isArray(appsData) ? appsData : []);
      } else {
        toast.error(response.message || 'Failed to fetch applications');
      }
    } catch (error) {
      toast.error('An error occurred while fetching applications');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this application?')) {
      return;
    }

    try {
      const response = await applicationService.deleteApplication(id);
      if (response.success) {
        toast.success(response.message || 'Application deleted successfully');
        fetchApplications();
      } else {
        toast.error(response.message || 'Failed to delete application');
      }
    } catch (error) {
      toast.error('An error occurred while deleting application');
    }
  };

  const getStatusBadge = (status) => {
    const statusStyles = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
    };

    return (
      <span
        className={`px-3 py-1 rounded-full text-sm font-semibold ${
          statusStyles[status?.toLowerCase()] || 'bg-gray-100 text-gray-800'
        }`}
      >
        {status || 'Pending'}
      </span>
    );
  };

  if (loading) {
    return <Loading message="Loading your applications..." />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-gray-800 mb-8">My Adoption Applications</h1>

      {applications.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <p className="text-gray-600 text-lg mb-4">
            You haven't submitted any adoption applications yet.
          </p>
          <Link
            to="/"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Browse Available Pets
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {applications.map((application) => (
            <div
              key={application._id || application.id}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-2">
                    <Link
                      to={`/pets/${application.pet?._id || application.petId}`}
                      className="text-xl font-semibold text-blue-600 hover:text-blue-700"
                    >
                      {application.pet?.name || 'Pet'}
                    </Link>
                    {getStatusBadge(application.status)}
                  </div>
                  <p className="text-gray-600 mb-2">
                    <span className="font-semibold">Applied on:</span>{' '}
                    {new Date(application.createdAt || application.created_at).toLocaleDateString()}
                  </p>
                  {application.message && (
                    <p className="text-gray-700">
                      <span className="font-semibold">Message:</span> {application.message}
                    </p>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleDelete(application._id || application.id)}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserDashboard;

