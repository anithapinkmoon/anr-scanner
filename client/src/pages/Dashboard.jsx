import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import api from '../utils/api';

const Dashboard = () => {
  const navigate = useNavigate();
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/admin/login');
    }
  }, [isAuthenticated, authLoading, navigate]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchStats();
    }
  }, [isAuthenticated]);

  const fetchStats = async () => {
    try {
      const response = await api.get('/admin/stats');
      setStats(response.data.data);
    } catch (error) {
      toast.error('Failed to fetch statistics');
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  const StatCard = ({ title, value, icon, color }) => (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm font-medium">{title}</p>
          <p className={`text-3xl font-bold mt-2 ${color}`}>{value}</p>
        </div>
        <div className="text-4xl">{icon}</div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Dashboard</h1>

        {stats && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <StatCard
                title="Total Registrations"
                value={stats.totalRegistrations}
                icon="📊"
                color="text-blue-600"
              />
              <StatCard
                title="Total Scanned"
                value={stats.totalScanned}
                icon="✅"
                color="text-green-600"
              />
              <StatCard
                title="Total Pending"
                value={stats.totalPending}
                icon="⏳"
                color="text-yellow-600"
              />
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                Category-wise Statistics
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                {Object.entries(stats.categoryStats).map(([category, data]) => (
                  <div
                    key={category}
                    className="border border-gray-200 rounded-lg p-4"
                  >
                    <h3 className="font-semibold text-gray-700 mb-2">{category}</h3>
                    <div className="space-y-1 text-sm">
                      <p>
                        <span className="text-gray-600">Total:</span>{' '}
                        <span className="font-bold">{data.total}</span>
                      </p>
                      <p>
                        <span className="text-green-600">Scanned:</span>{' '}
                        <span className="font-bold">{data.scanned}</span>
                      </p>
                      <p>
                        <span className="text-yellow-600">Pending:</span>{' '}
                        <span className="font-bold">{data.pending}</span>
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;

