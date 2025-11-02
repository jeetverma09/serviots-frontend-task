import { useState, useEffect } from 'react';
import { petService } from '../services/petService';
import Loading from '../components/Loading';
import { toast } from 'react-toastify';
import PetForm from '../components/PetForm';
import { getImageUrl } from '../utils/imageUtils';

const ManagePets = () => {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingPet, setEditingPet] = useState(null);

  useEffect(() => {
    fetchPets();
  }, []);

  const fetchPets = async () => {
    setLoading(true);
    try {
      const response = await petService.getPets({ limit: 1000 });
      if (response.success) {
        const petsData = response.data;
        if (Array.isArray(petsData)) {
          setPets(petsData);
        } else if (petsData?.pets && Array.isArray(petsData.pets)) {
          setPets(petsData.pets);
        } else {
          setPets([]);
        }
      } else {
        toast.error(response.message || 'Failed to fetch pets');
      }
    } catch (error) {
      toast.error('An error occurred while fetching pets');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this pet?')) {
      return;
    }

    try {
      const response = await petService.deletePet(id);
      if (response.success) {
        toast.success(response.message || 'Pet deleted successfully');
        fetchPets();
      } else {
        toast.error(response.message || 'Failed to delete pet');
      }
    } catch (error) {
      toast.error('An error occurred while deleting pet');
    }
  };

  const handleEdit = (pet) => {
    setEditingPet(pet);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingPet(null);
    fetchPets();
  };

  if (loading) {
    return <Loading message="Loading pets..." />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800">Manage Pets</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Add New Pet
        </button>
      </div>

      {showForm && (
        <PetForm
          pet={editingPet}
          onClose={handleFormClose}
          onSuccess={handleFormClose}
        />
      )}

      {pets?.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <p className="text-gray-600 text-lg mb-4">No pets found.</p>
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Add Your First Pet
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pets?.map((pet) => (
            <div
              key={pet._id || pet.id}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              <div className="relative h-48 bg-gray-200">
                {getImageUrl(pet.imageURL || pet.photo) ? (
                  <img
                    src={getImageUrl(pet.imageURL || pet.photo)}
                    alt={pet.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/400x300?text=No+Image';
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <span className="text-6xl">🐾</span>
                  </div>
                )}
                <span
                  className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-semibold ${
                    pet.status?.toLowerCase() === 'available'
                      ? 'bg-green-100 text-green-800'
                      : pet.status?.toLowerCase() === 'pending'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {pet.status}
                </span>
              </div>
              <div className="p-4">
                <h3 className="text-xl font-bold text-gray-800 mb-1">{pet.name}</h3>
                <p className="text-sm text-gray-600 mb-4">
                  {pet.breed} • {pet.species} • {pet.age} years
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(pet)}
                    className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(pet._id || pet.id)}
                    className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm"
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

export default ManagePets;

