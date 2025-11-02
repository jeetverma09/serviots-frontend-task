import { useState, useEffect } from 'react';
import { petService } from '../services/petService';
import PetCard from '../components/PetCard';
import Loading from '../components/Loading';
import { toast } from 'react-toastify';

const HomePage = () => {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    species: '',
    breed: '',
    age: '',
    status: 'available',
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 0,
  });

  useEffect(() => {
    fetchPets();
  }, [filters, pagination.page]);

  const fetchPets = async () => {
    setLoading(true);
    try {
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        ...Object.fromEntries(
          Object.entries(filters).filter(([_, v]) => v !== '')
        ),
      };

      const response = await petService.getPets(params);
      
      if (response.success) {
        const petsData = response.data.data || response.data;
        const paginationData = response.data;
        
        if (Array.isArray(petsData)) {
          setPets(petsData);
          if (paginationData.total && paginationData.limit) {
            const totalPages = Math.ceil(paginationData.total / paginationData.limit);
            setPagination((prev) => ({
              ...prev,
              page: paginationData.page || prev.page,
              limit: paginationData.limit || prev.limit,
              total: paginationData.total,
              totalPages: totalPages,
            }));
          }
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

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handlePageChange = (newPage) => {
    setPagination((prev) => ({ ...prev, page: newPage }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading && pets.length === 0) {
    return <Loading message="Loading pets..." />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Find Your Perfect Companion
        </h1>
        <p className="text-gray-600 text-lg">
          Browse through our available pets waiting for a loving home
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <input
            type="text"
            placeholder="Search by name or breed..."
            className="col-span-1 md:col-span-2 lg:col-span-2 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
          />
          <select
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={filters.species}
            onChange={(e) => handleFilterChange('species', e.target.value)}
          >
            <option value="">All Species</option>
            <option value="dog">Dog</option>
            <option value="cat">Cat</option>
            <option value="bird">Bird</option>
            <option value="rabbit">Rabbit</option>
            <option value="other">Other</option>
          </select>
          <select
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={filters.age}
            onChange={(e) => handleFilterChange('age', e.target.value)}
          >
            <option value="">All Ages</option>
            <option value="0-1">0-1 years</option>
            <option value="1-3">1-3 years</option>
            <option value="3-5">3-5 years</option>
            <option value="5+">5+ years</option>
          </select>
          <select
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
          >
            <option value="">All Status</option>
            <option value="available">Available</option>
            <option value="pending">Pending</option>
            <option value="adopted">Adopted</option>
          </select>
        </div>
      </div>

      {pets.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 text-xl">No pets found matching your criteria.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
            {pets?.map((pet) => (
              <PetCard key={pet._id || pet.id} pet={pet} />
            ))}
          </div>

          {pagination.totalPages > 1 && (
            <div className="flex justify-center items-center gap-2">
              <button
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page === 1}
                className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Previous
              </button>
              <span className="px-4 py-2 text-gray-700">
                Page {pagination.page} of {pagination.totalPages}
              </span>
              <button
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page >= pagination.totalPages}
                className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default HomePage;

