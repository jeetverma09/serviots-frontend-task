import { Link } from 'react-router-dom';
import { getImageUrl } from '../utils/imageUtils';

const PetCard = ({ pet }) => {
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'available':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'adopted':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  return (
    <Link
      to={`/pets/${pet._id || pet.id}`}
      className="block bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300"
    >
      <div className="relative h-48 bg-gray-200 overflow-hidden">
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
        <div className="absolute top-2 right-2">
          <span
            className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(
              pet.status
            )}`}
          >
            {pet.status || 'Available'}
          </span>
        </div>
      </div>
      <div className="p-4">
        <h3 className="text-xl font-bold text-gray-800 mb-1">{pet.name}</h3>
        <p className="text-sm text-gray-600 mb-2">
          {pet.breed} • {pet.species}
        </p>
        <div className="flex justify-between items-center text-sm text-gray-500">
          <span>Age: {pet.age || 'N/A'} years</span>
          <span className="font-semibold text-blue-600">View Details →</span>
        </div>
      </div>
    </Link>
  );
};

export default PetCard;

