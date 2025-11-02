import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { petService } from '../services/petService';
import { toast } from 'react-toastify';

const schema = yup.object({
  name: yup.string().required('Name is required'),
  species: yup.string().required('Species is required'),
  breed: yup.string().required('Breed is required'),
  age: yup.number().positive('Age must be positive').required('Age is required'),
  description: yup.string(),
  status: yup.string().required('Status is required'),
  photo: yup.mixed(),
  photoUrl: yup.string().url('Must be a valid URL'),
  gender: yup.string(),
  size: yup.string(),
});

const PetForm = ({ pet, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [useFileUpload, setUseFileUpload] = useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: pet || {
      status: 'available',
    },
  });

  useEffect(() => {
    if (pet) {
      reset(pet);
      setUseFileUpload(false);
    }
  }, [pet, reset]);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      let response;

      if (useFileUpload && data.photo && data.photo.length > 0) {
        const formData = new FormData();
        Object.keys(data).forEach((key) => {
          if (key === 'photo' && data.photo[0]) {
            formData.append('photo', data.photo[0]);
          } else if (key !== 'photo' && key !== 'photoUrl') {
            formData.append(key, data[key]);
          }
        });

        if (pet) {
          response = await petService.updatePet(pet._id || pet.id, formData);
        } else {
          response = await petService.createPet(formData);
        }
      } else {
        const petData = { ...data };
        delete petData.photo;

        if (data.photoUrl) {
          petData.photo = data.photoUrl;
        }

        if (pet) {
          response = await petService.updatePet(pet._id || pet.id, petData);
        } else {
          response = await petService.createPet(petData);
        }
      }

      if (response.success) {
        toast.success(response.message || (pet ? 'Pet updated successfully!' : 'Pet created successfully!'));
        onSuccess();
      } else {
        toast.error(response.message || 'Failed to save pet');
      }
    } catch (error) {
      toast.error('An error occurred while saving pet');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              {pet ? 'Edit Pet' : 'Add New Pet'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl"
            >
              ×
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Name *
              </label>
              <input
                {...register('name')}
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Species *
                </label>
                <select
                  {...register('species')}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Species</option>
                  <option value="dog">Dog</option>
                  <option value="cat">Cat</option>
                  <option value="bird">Bird</option>
                  <option value="rabbit">Rabbit</option>
                  <option value="other">Other</option>
                </select>
                {errors.species && (
                  <p className="mt-1 text-sm text-red-600">{errors.species.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Breed *
                </label>
                <input
                  {...register('breed')}
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.breed && (
                  <p className="mt-1 text-sm text-red-600">{errors.breed.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Age (years) *
                </label>
                <input
                  {...register('age', { valueAsNumber: true })}
                  type="number"
                  step="0.1"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.age && (
                  <p className="mt-1 text-sm text-red-600">{errors.age.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Status *
                </label>
                <select
                  {...register('status')}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="available">Available</option>
                  <option value="pending">Pending</option>
                  <option value="adopted">Adopted</option>
                </select>
                {errors.status && (
                  <p className="mt-1 text-sm text-red-600">{errors.status.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Gender
                </label>
                <select
                  {...register('gender')}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Size
                </label>
                <select
                  {...register('size')}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Size</option>
                  <option value="small">Small</option>
                  <option value="medium">Medium</option>
                  <option value="large">Large</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Description
              </label>
              <textarea
                {...register('description')}
                rows="4"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <div className="flex gap-4 mb-2">
                <button
                  type="button"
                  onClick={() => setUseFileUpload(true)}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    useFileUpload
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Upload File
                </button>
                <button
                  type="button"
                  onClick={() => setUseFileUpload(false)}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    !useFileUpload
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Use URL
                </button>
              </div>

              {useFileUpload ? (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Photo (File)
                  </label>
                  <input
                    {...register('photo')}
                    type="file"
                    accept="image/*"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Photo (URL)
                  </label>
                  <input
                    {...register('photoUrl')}
                    type="url"
                    placeholder="https://example.com/photo.jpg"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {errors.photoUrl && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.photoUrl.message}
                    </p>
                  )}
                </div>
              )}
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Saving...' : pet ? 'Update Pet' : 'Create Pet'}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PetForm;

