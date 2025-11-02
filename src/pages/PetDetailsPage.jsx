import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { petService } from '../services/petService';
import { applicationService } from '../services/applicationService';
import { useAuth } from '../context/AuthContext';
import Loading from '../components/Loading';
import { toast } from 'react-toastify';
import { getImageUrl } from '../utils/imageUtils';

const PetDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [pet, setPet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [applicationData, setApplicationData] = useState({
    message: '',
  });

  useEffect(() => {
    fetchPetDetails();
  }, [id]);

  const fetchPetDetails = async () => {
    setLoading(true);
    try {
      const response = await petService.getPetById(id);
      if (response.success) {
        setPet(response.data);
      } else {
        toast.error(response.message || 'Pet not found');
        navigate('/');
      }
    } catch (error) {
      toast.error('Failed to load pet details');
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async () => {
    if (!isAuthenticated) {
      toast.info('Please login to apply for adoption');
      navigate('/login');
      return;
    }

    setApplying(true);
    try {
      const response = await applicationService.createApplication({
        petId: id,
        ...applicationData,
      });

      if (response.success) {
        toast.success(response.message || 'Application submitted successfully!');
        setShowApplicationForm(false);
        setApplicationData({ message: '' });
        fetchPetDetails(); // Refresh pet data
      } else {
        toast.error(response.message || 'Failed to submit application');
      }
    } catch (error) {
      toast.error('An error occurred while submitting the application');
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return <Loading message="Loading pet details..." />;
  }

  if (!pet) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 text-blue-600 hover:text-blue-700 flex items-center gap-2"
      >
        ← Back
      </button>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
          <div>
            {getImageUrl(pet.imageURL || pet.photo) ? (
              <img
                src={getImageUrl(pet.imageURL || pet.photo)}
                alt={pet.name}
                className="w-full h-96 object-cover rounded-lg"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/600x400?text=No+Image';
                }}
              />
            ) : (
              <div className="w-full h-96 bg-gray-200 rounded-lg flex items-center justify-center">
                <span className="text-9xl">🐾</span>
              </div>
            )}
          </div>

          <div>
            <div className="mb-4">
              <span
                className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                  pet.status?.toLowerCase() === 'available'
                    ? 'bg-green-100 text-green-800'
                    : pet.status?.toLowerCase() === 'pending'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                {pet.status || 'Available'}
              </span>
            </div>
            <h1 className="text-4xl font-bold text-gray-800 mb-4">{pet.name}</h1>
            <div className="space-y-3 mb-6">
              <p className="text-lg">
                <span className="font-semibold">Species:</span> {pet.species}
              </p>
              <p className="text-lg">
                <span className="font-semibold">Breed:</span> {pet.breed}
              </p>
              <p className="text-lg">
                <span className="font-semibold">Age:</span> {pet.age} years
              </p>
              {pet.gender && (
                <p className="text-lg">
                  <span className="font-semibold">Gender:</span> {pet.gender}
                </p>
              )}
              {pet.size && (
                <p className="text-lg">
                  <span className="font-semibold">Size:</span> {pet.size}
                </p>
              )}
            </div>

            {pet.description && (
              <div className="mb-6">
                <h2 className="text-2xl font-semibold mb-2">About</h2>
                <p className="text-gray-700 leading-relaxed">{pet.description}</p>
              </div>
            )}

            {(pet.status?.toLowerCase() === 'available' || pet.status === 'Available') && isAuthenticated && (
              <div className="mt-8">
                {!showApplicationForm ? (
                  <button
                    onClick={() => setShowApplicationForm(true)}
                    className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors text-lg font-semibold"
                  >
                    Apply to Adopt
                  </button>
                ) : (
                  <div className="space-y-4">
                    <textarea
                      placeholder="Tell us why you want to adopt this pet and about your experience with pets..."
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows="6"
                      value={applicationData.message}
                      onChange={(e) =>
                        setApplicationData({ ...applicationData, message: e.target.value })
                      }
                    />
                    <div className="flex gap-4">
                      <button
                        onClick={handleApply}
                        disabled={!applicationData.message.trim() || applying}
                        className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {applying ? 'Submitting...' : 'Submit Application'}
                      </button>
                      <button
                        onClick={() => {
                          setShowApplicationForm(false);
                          setApplicationData({ message: '' });
                        }}
                        className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {(pet.status?.toLowerCase() === 'available' || pet.status === 'Available') && !isAuthenticated && (
              <button
                onClick={() => navigate('/login')}
                className="mt-8 w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors text-lg font-semibold"
              >
                Login to Apply
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PetDetailsPage;

