import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from '../utils/api';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await axios.get('/admin/stats');
      setStats(res.data.stats);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-gray-600 mb-2">Total Users</h3>
          <p className="text-3xl font-bold text-blue-600">{stats?.users?.total || 0}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-gray-600 mb-2">Total Bookings</h3>
          <p className="text-3xl font-bold text-green-600">{stats?.bookings?.total || 0}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-gray-600 mb-2">Total Revenue</h3>
          <p className="text-3xl font-bold text-purple-600">
            ${stats?.revenue?.total?.toFixed(2) || 0}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-gray-600 mb-2">Pending Agents</h3>
          <p className="text-3xl font-bold text-yellow-600">{stats?.users?.pendingAgents || 0}</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Popular Routes</h2>
          <ul className="space-y-2">
            {stats?.popularRoutes?.map((route, idx) => (
              <li key={idx} className="flex justify-between">
                <span>{route._id.source} → {route._id.destination}</span>
                <span className="font-semibold">{route.count} bookings</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Popular Hotels</h2>
          <ul className="space-y-2">
            {stats?.popularHotels?.map((hotel, idx) => (
              <li key={idx} className="flex justify-between">
                <span>{hotel._id}</span>
                <span className="font-semibold">{hotel.count} bookings</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <Link
          to="/admin/users"
          className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition"
        >
          <h2 className="text-xl font-semibold mb-2">Manage Users</h2>
          <p className="text-gray-600">View and manage all users</p>
        </Link>
        <Link
          to="/admin/agents"
          className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition"
        >
          <h2 className="text-xl font-semibold mb-2">Manage Agents</h2>
          <p className="text-gray-600">Approve and verify travel agents</p>
        </Link>
      </div>
    </div>
  );
};

export default AdminDashboard;


