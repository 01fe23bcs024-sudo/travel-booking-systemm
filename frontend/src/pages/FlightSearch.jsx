import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { format } from 'date-fns';

const FlightSearch = () => {
  const { isAuthenticated } = useAuth();
  const [searchParams, setSearchParams] = useState({
    source: '',
    destination: '',
    date: format(new Date(), 'yyyy-MM-dd'),
    passengers: 1,
    class: 'economy'
  });
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const params = new URLSearchParams(searchParams);
      const res = await axios.get(`/flights/search?${params}`);
      setFlights(res.data.flights || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Search failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Search Flights</h1>

      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <form onSubmit={handleSearch} className="grid md:grid-cols-5 gap-4">
          <div>
            <label className="block text-sm font-semibold mb-2">From</label>
            <input
              type="text"
              value={searchParams.source}
              onChange={(e) => setSearchParams({ ...searchParams, source: e.target.value })}
              placeholder="Source"
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2">To</label>
            <input
              type="text"
              value={searchParams.destination}
              onChange={(e) => setSearchParams({ ...searchParams, destination: e.target.value })}
              placeholder="Destination"
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2">Date</label>
            <input
              type="date"
              value={searchParams.date}
              onChange={(e) => setSearchParams({ ...searchParams, date: e.target.value })}
              min={format(new Date(), 'yyyy-MM-dd')}
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2">Passengers</label>
            <input
              type="number"
              value={searchParams.passengers}
              onChange={(e) => setSearchParams({ ...searchParams, passengers: e.target.value })}
              min="1"
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2">Class</label>
            <select
              value={searchParams.class}
              onChange={(e) => setSearchParams({ ...searchParams, class: e.target.value })}
              className="w-full px-3 py-2 border rounded-md"
            >
              <option value="economy">Economy</option>
              <option value="business">Business</option>
              <option value="first">First Class</option>
            </select>
          </div>
          <div className="md:col-span-5">
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md disabled:opacity-50"
            >
              {loading ? 'Searching...' : 'Search Flights'}
            </button>
          </div>
        </form>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="space-y-4">
        {flights.map((flight) => (
          <div key={flight._id} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-semibold">{flight.airline}</h3>
                <p className="text-gray-600">{flight.flightNumber}</p>
                <div className="mt-2">
                  <span className="font-semibold">{flight.source}</span>
                  <span className="mx-2">→</span>
                  <span className="font-semibold">{flight.destination}</span>
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  {format(new Date(flight.departureTime), 'MMM dd, yyyy HH:mm')} -{' '}
                  {format(new Date(flight.arrivalTime), 'MMM dd, yyyy HH:mm')}
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-blue-600">
                  ${flight.price}
                </div>
                <div className="text-sm text-gray-500">
                  {flight.available ? 'Available' : 'Not Available'}
                </div>
                {isAuthenticated && flight.available && (
                  <Link
                    to={`/bookings/new?type=flight&id=${flight._id}&class=${searchParams.class}&passengers=${searchParams.passengers}`}
                    className="mt-2 inline-block bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                  >
                    Book Now
                  </Link>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {!loading && flights.length === 0 && (
        <div className="text-center text-gray-500 py-12">
          No flights found. Try adjusting your search criteria.
        </div>
      )}
    </div>
  );
};

export default FlightSearch;

