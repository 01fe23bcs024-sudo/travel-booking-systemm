import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from '../utils/api';
import { format } from 'date-fns';

const BookFlight = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const flightId = searchParams.get('id');
  const flightClass = searchParams.get('class') || 'economy';
  const passengersCount = parseInt(searchParams.get('passengers')) || 1;

  const [flight, setFlight] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    seatNumbers: [],
    passengers: Array(passengersCount).fill().map(() => ({ name: '', age: '', passport: '' })),
    paymentMethod: 'card'
  });

  useEffect(() => {
    fetchFlight();
  }, [flightId]);

  const fetchFlight = async () => {
    try {
      const res = await axios.get(`/flights/${flightId}`);
      setFlight(res.data.flight);
      
      // Get available seats
      const availableSeats = res.data.flight.seats
        .filter(s => s.class === flightClass && !s.isBooked)
        .slice(0, passengersCount);
      
      setFormData(prev => ({
        ...prev,
        seatNumbers: availableSeats.map(s => s.seatNumber)
      }));
    } catch (err) {
      setError('Failed to load flight details');
    } finally {
      setLoading(false);
    }
  };

  const handlePassengerChange = (index, field, value) => {
    const passengers = [...formData.passengers];
    passengers[index][field] = value;
    setFormData({ ...formData, passengers });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const passengers = formData.passengers.map(p => ({
        name: p.name,
        age: parseInt(p.age),
        passport: p.passport
      }));

      const res = await axios.post('/bookings/flight', {
        flightId,
        flightClass,
        passengers,
        seatNumbers: formData.seatNumbers,
        paymentMethod: formData.paymentMethod
      });

      navigate(`/bookings/${res.data.booking._id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Booking failed');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
      </div>
    );
  }

  if (!flight) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          Flight not found
        </div>
      </div>
    );
  }

  const price = flight[`${flightClass}Price`];
  const totalAmount = price * passengersCount;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Book Flight</h1>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Flight Details</h2>
        <p><strong>Flight:</strong> {flight.flightNumber} - {flight.airline}</p>
        <p><strong>Route:</strong> {flight.source} → {flight.destination}</p>
        <p><strong>Departure:</strong> {format(new Date(flight.departureTime), 'MMM dd, yyyy HH:mm')}</p>
        <p><strong>Arrival:</strong> {format(new Date(flight.arrivalTime), 'MMM dd, yyyy HH:mm')}</p>
        <p><strong>Class:</strong> {flightClass.toUpperCase()}</p>
        <p><strong>Seats:</strong> {formData.seatNumbers.join(', ')}</p>
        <p className="text-2xl font-bold text-blue-600 mt-4">Total: ${totalAmount}</p>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Passenger Details</h2>
        
        {formData.passengers.map((passenger, index) => (
          <div key={index} className="mb-6 p-4 border rounded">
            <h3 className="font-semibold mb-3">Passenger {index + 1}</h3>
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-2">Name</label>
                <input
                  type="text"
                  required
                  value={passenger.name}
                  onChange={(e) => handlePassengerChange(index, 'name', e.target.value)}
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Age</label>
                <input
                  type="number"
                  required
                  min="1"
                  value={passenger.age}
                  onChange={(e) => handlePassengerChange(index, 'age', e.target.value)}
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Passport (Optional)</label>
                <input
                  type="text"
                  value={passenger.passport}
                  onChange={(e) => handlePassengerChange(index, 'passport', e.target.value)}
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
            </div>
          </div>
        ))}

        <div className="mb-6">
          <label className="block text-sm font-semibold mb-2">Payment Method</label>
          <select
            value={formData.paymentMethod}
            onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
            className="w-full px-3 py-2 border rounded-md"
          >
            <option value="card">Card</option>
            <option value="upi">UPI</option>
            <option value="netbanking">Net Banking</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded disabled:opacity-50"
        >
          {submitting ? 'Processing...' : 'Confirm Booking'}
        </button>
      </form>
    </div>
  );
};

export default BookFlight;


