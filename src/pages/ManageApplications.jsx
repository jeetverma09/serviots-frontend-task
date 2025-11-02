import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { applicationService } from '../services/applicationService';
import Loading from '../components/Loading';
import { toast } from 'react-toastify';

const ManageApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const response = await applicationService.getAllApplications({ limit: 1000 });
      if (response.success) {
        const appsData = response.data;
        if (Array.isArray(appsData)) {
          setApplications(appsData);
        } else if (appsData?.applications && Array.isArray(appsData.applications)) {
          setApplications(appsData.applications);
        } else {
          setApplications([]);
        }
      } else {
        toast.error(response.message || 'Failed to fetch applications');
      }
    } catch (error) {
      toast.error('An error occurred while fetching applications');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      const response = await applicationService.updateApplicationStatus(id, status);
      if (response.success) {
        toast.success(response.message || `Application ${status} successfully`);
        fetchApplications();
      } else {
        toast.error(response.message || 'Failed to update application');
      }
    } catch (error) {
      toast.error('An error occurred while updating application');
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

  const filteredApplications =
    filter === 'all'
      ? applications
      : applications.filter((app) => app.status?.toLowerCase() === filter);

  if (loading) {
    return <Loading message="Loading applications..." />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-gray-800 mb-8">Manage Applications</h1>

      <div className="mb-6">
        <div className="flex gap-4">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filter === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filter === 'pending'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Pending
          </button>
          <button
            onClick={() => setFilter('approved')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filter === 'approved'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Approved
          </button>
          <button
            onClick={() => setFilter('rejected')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filter === 'rejected'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Rejected
          </button>
        </div>
      </div>

      {filteredApplications.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <p className="text-gray-600 text-lg">No applications found.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredApplications.map((application) => (
            <div
              key={application._id || application.id}
              className="bg-white rounded-lg shadow-md p-6"
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
                  <p className="text-gray-600 mb-1">
                    <span className="font-semibold">Applicant:</span>{' '}
                    {application.user?.name || application.userId || 'Unknown'}
                  </p>
                  <p className="text-gray-600 mb-2">
                    <span className="font-semibold">Applied on:</span>{' '}
                    {new Date(
                      application.createdAt || application.created_at
                    ).toLocaleDateString()}
                  </p>
                  {application.message && (
                    <p className="text-gray-700">
                      <span className="font-semibold">Message:</span> {application.message}
                    </p>
                  )}
                </div>
                {application.status?.toLowerCase() === 'pending' && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleStatusUpdate(application._id || application.id, 'Approved')}
                      className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleStatusUpdate(application._id || application.id, 'Rejected')}
                      className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                    >
                      Reject
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManageApplications;

