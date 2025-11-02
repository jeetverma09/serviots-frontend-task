import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const ProfilePage = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-gray-600">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-gray-800 mb-8">My Profile</h1>
      <div className="bg-white rounded-lg shadow-md p-8 max-w-2xl">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Name
            </label>
            <p className="text-gray-900 text-lg">{user.name}</p>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Email
            </label>
            <p className="text-gray-900 text-lg">{user.email}</p>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Role
            </label>
            <p className="text-gray-900 text-lg capitalize">{user.role || 'User'}</p>
          </div>
          {user.createdAt && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Member Since
              </label>
              <p className="text-gray-900 text-lg">
                {new Date(user.createdAt).toLocaleDateString()}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;

