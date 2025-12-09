import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from '../utils/api';

const AgentDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await axios.get('/agents/stats');
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
      <h1 className="text-3xl font-bold mb-6">Agent Dashboard</h1>

      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-gray-600 mb-2">Total Bookings</h3>
          <p className="text-3xl font-bold text-blue-600">{stats?.totalBookings || 0}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-gray-600 mb-2">Confirmed</h3>
          <p className="text-3xl font-bold text-green-600">{stats?.confirmedBookings || 0}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-gray-600 mb-2">Total Revenue</h3>
          <p className="text-3xl font-bold text-purple-600">${stats?.totalRevenue?.toFixed(2) || 0}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-gray-600 mb-2">Earnings</h3>
          <p className="text-3xl font-bold text-green-600">${stats?.earnings?.toFixed(2) || 0}</p>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <Link
          to="/agent/flights"
          className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition"
        >
          <h2 className="text-xl font-semibold mb-2">Manage Flights</h2>
          <p className="text-gray-600">Add, edit, or delete flight listings</p>
        </Link>
        <Link
          to="/agent/hotels"
          className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition"
        >
          <h2 className="text-xl font-semibold mb-2">Manage Hotels</h2>
          <p className="text-gray-600">Add, edit, or delete hotel listings</p>
        </Link>
        <Link
          to="/agent/bookings"
          className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition"
        >
          <h2 className="text-xl font-semibold mb-2">View Bookings</h2>
          <p className="text-gray-600">See all customer bookings</p>
        </Link>
      </div>
    </div>
  );
};

export default AgentDashboard;


