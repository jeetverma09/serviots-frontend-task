import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { isAuthenticated, user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="text-2xl font-bold text-blue-600 hover:text-blue-700">
            🐾 Pet Adoption
          </Link>

          <div className="flex items-center gap-4">
            <Link
              to="/"
              className="text-gray-700 hover:text-blue-600 transition-colors"
            >
              Home
            </Link>

            {isAuthenticated ? (
              <>
                {isAdmin() ? (
                  <>
                    <Link
                      to="/admin/dashboard"
                      className="text-gray-700 hover:text-blue-600 transition-colors"
                    >
                      Admin Dashboard
                    </Link>
                    <Link
                      to="/admin/pets"
                      className="text-gray-700 hover:text-blue-600 transition-colors"
                    >
                      Manage Pets
                    </Link>
                    <Link
                      to="/admin/applications"
                      className="text-gray-700 hover:text-blue-600 transition-colors"
                    >
                      Applications
                    </Link>
                  </>
                ) : (
                  <Link
                    to="/user/dashboard"
                    className="text-gray-700 hover:text-blue-600 transition-colors"
                  >
                    My Applications
                  </Link>
                )}
                <Link
                  to="/user/profile"
                  className="text-gray-700 hover:text-blue-600 transition-colors"
                >
                  {user?.name || 'Profile'}
                </Link>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-blue-600 transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

