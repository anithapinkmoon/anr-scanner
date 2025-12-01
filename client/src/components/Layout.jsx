import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Layout = ({ children }) => {
  const location = useLocation();
  const { isAuthenticated, logout } = useAuth();

  const isAdminRoute = location.pathname.startsWith('/admin');

  if (isAdminRoute && !isAuthenticated && location.pathname !== '/admin/login') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {isAdminRoute && isAuthenticated && (
        <nav className="bg-white shadow-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex">
                <Link
                  to="/admin/dashboard"
                  className="flex items-center px-4 text-xl font-bold text-primary-600"
                >
                  🎉 Diamond Jubilee Admin
                </Link>
                <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                  <Link
                    to="/admin/dashboard"
                    className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                      location.pathname === '/admin/dashboard'
                        ? 'border-primary-500 text-gray-900'
                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                    }`}
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/admin/attendees"
                    className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                      location.pathname === '/admin/attendees'
                        ? 'border-primary-500 text-gray-900'
                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                    }`}
                  >
                    Attendees
                  </Link>
                </div>
              </div>
              <div className="flex items-center">
                <button
                  onClick={logout}
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </nav>
      )}

      {!isAdminRoute && (
        <nav className="bg-white shadow-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <Link to="/" className="text-xl font-bold text-primary-600">
                  🎉 Diamond Jubilee Event
                </Link>
              </div>
              <div className="flex items-center space-x-4">
                <Link
                  to="/register"
                  className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Register
                </Link>
                {/* <Link
                  to="/scan"
                  className="bg-primary-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-primary-700"
                >
                  Scan QR
                </Link> */}
              </div>
            </div>
          </div>
        </nav>
      )}

      <main>{children}</main>
    </div>
  );
};

export default Layout;

