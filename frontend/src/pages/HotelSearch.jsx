import { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { format } from 'date-fns';

const HotelSearch = () => {
  const { isAuthenticated } = useAuth();
  const [searchParams, setSearchParams] = useState({
    city: '',
    checkIn: format(new Date(), 'yyyy-MM-dd'),
    checkOut: format(new Date(Date.now() + 86400000), 'yyyy-MM-dd'),
    rooms: 1,
    guests: 1,
    roomType: 'standard'
  });
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const params = new URLSearchParams(searchParams);
      const res = await axios.get(`/hotels/search?${params}`);
      setHotels(res.data.hotels || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Search failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Search Hotels</h1>

      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <form onSubmit={handleSearch} className="grid md:grid-cols-5 gap-4">
          <div>
            <label className="block text-sm font-semibold mb-2">City</label>
            <input
              type="text"
              value={searchParams.city}
              onChange={(e) => setSearchParams({ ...searchParams, city: e.target.value })}
              placeholder="City"
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2">Check-in</label>
            <input
              type="date"
              value={searchParams.checkIn}
              onChange={(e) => setSearchParams({ ...searchParams, checkIn: e.target.value })}
              min={format(new Date(), 'yyyy-MM-dd')}
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2">Check-out</label>
            <input
              type="date"
              value={searchParams.checkOut}
              onChange={(e) => setSearchParams({ ...searchParams, checkOut: e.target.value })}
              min={searchParams.checkIn}
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2">Rooms</label>
            <input
              type="number"
              value={searchParams.rooms}
              onChange={(e) => setSearchParams({ ...searchParams, rooms: e.target.value })}
              min="1"
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2">Room Type</label>
            <select
              value={searchParams.roomType}
              onChange={(e) => setSearchParams({ ...searchParams, roomType: e.target.value })}
              className="w-full px-3 py-2 border rounded-md"
            >
              <option value="standard">Standard</option>
              <option value="deluxe">Deluxe</option>
              <option value="suite">Suite</option>
            </select>
          </div>
          <div className="md:col-span-5">
            <button
              type="submit"
              disabled={loading}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md disabled:opacity-50"
            >
              {loading ? 'Searching...' : 'Search Hotels'}
            </button>
          </div>
        </form>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        {hotels.map((hotel) => (
          <div key={hotel._id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2">{hotel.name}</h3>
              <p className="text-gray-600 mb-2">{hotel.address}, {hotel.city}</p>
              <div className="flex items-center mb-2">
                <span className="text-yellow-500">⭐</span>
                <span className="ml-1">{hotel.rating || 'N/A'}</span>
              </div>
              <div className="text-2xl font-bold text-green-600 mb-4">
                ${hotel.price}/night
              </div>
              {isAuthenticated && hotel.available && (
                <Link
                  to={`/bookings/new?type=hotel&id=${hotel._id}&checkIn=${searchParams.checkIn}&checkOut=${searchParams.checkOut}&rooms=${searchParams.rooms}&roomType=${searchParams.roomType}`}
                  className="inline-block bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
                >
                  Book Now
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>

      {!loading && hotels.length === 0 && (
        <div className="text-center text-gray-500 py-12">
          No hotels found. Try adjusting your search criteria.
        </div>
      )}
    </div>
  );
};

export default HotelSearch;


