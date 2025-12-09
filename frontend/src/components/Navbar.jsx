import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { isAuthenticated, user, logout, isAgent, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-xl font-bold">
            ✈️ Travel Booking
          </Link>

          <div className="flex items-center space-x-4">
            <Link to="/flights" className="hover:text-blue-200 transition">
              Flights
            </Link>
            <Link to="/hotels" className="hover:text-blue-200 transition">
              Hotels
            </Link>

            {isAuthenticated ? (
              <>
                {user.role === 'user' && (
                  <Link to="/my-bookings" className="hover:text-blue-200 transition">
                    My Bookings
                  </Link>
                )}

                {isAgent && (
                  <Link to="/agent/dashboard" className="hover:text-blue-200 transition">
                    Agent Dashboard
                  </Link>
                )}

                {isAdmin && (
                  <Link to="/admin/dashboard" className="hover:text-blue-200 transition">
                    Admin
                  </Link>
                )}

                <div className="flex items-center space-x-2">
                  <span className="text-sm">Hi, {user.name}</span>
                  <button
                    onClick={handleLogout}
                    className="bg-blue-700 hover:bg-blue-800 px-4 py-2 rounded transition"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <div className="flex space-x-2">
                <Link
                  to="/login"
                  className="bg-blue-700 hover:bg-blue-800 px-4 py-2 rounded transition"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded transition"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;


