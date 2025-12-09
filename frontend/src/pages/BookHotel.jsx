import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from '../utils/api';
import { format, differenceInDays } from 'date-fns';

const BookHotel = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const hotelId = searchParams.get('id');
  const checkIn = searchParams.get('checkIn');
  const checkOut = searchParams.get('checkOut');
  const roomsCount = parseInt(searchParams.get('rooms')) || 1;
  const roomType = searchParams.get('roomType') || 'standard';

  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    roomNumbers: [],
    guests: { adults: 1, children: 0 },
    paymentMethod: 'card'
  });

  useEffect(() => {
    fetchHotel();
  }, [hotelId]);

  const fetchHotel = async () => {
    try {
      const res = await axios.get(`/hotels/${hotelId}`);
      setHotel(res.data.hotel);
      
      // Get available rooms
      const availableRooms = res.data.hotel.rooms
        .filter(r => r.roomType === roomType && !r.isBooked)
        .slice(0, roomsCount);
      
      setFormData(prev => ({
        ...prev,
        roomNumbers: availableRooms.map(r => r.roomNumber)
      }));
    } catch (err) {
      setError('Failed to load hotel details');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const res = await axios.post('/bookings/hotel', {
        hotelId,
        roomType,
        checkIn,
        checkOut,
        roomNumbers: formData.roomNumbers,
        guests: formData.guests,
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

  if (!hotel) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          Hotel not found
        </div>
      </div>
    );
  }

  const nights = differenceInDays(new Date(checkOut), new Date(checkIn));
  const pricePerNight = hotel[`${roomType}Price`];
  const totalAmount = pricePerNight * nights * roomsCount;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Book Hotel</h1>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Hotel Details</h2>
        <p><strong>Hotel:</strong> {hotel.name}</p>
        <p><strong>Address:</strong> {hotel.address}, {hotel.city}</p>
        <p><strong>Check-in:</strong> {format(new Date(checkIn), 'MMM dd, yyyy')}</p>
        <p><strong>Check-out:</strong> {format(new Date(checkOut), 'MMM dd, yyyy')}</p>
        <p><strong>Nights:</strong> {nights}</p>
        <p><strong>Room Type:</strong> {roomType.toUpperCase()}</p>
        <p><strong>Rooms:</strong> {formData.roomNumbers.join(', ')}</p>
        <p className="text-2xl font-bold text-green-600 mt-4">Total: ${totalAmount}</p>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Guest Information</h2>
        
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-semibold mb-2">Adults</label>
            <input
              type="number"
              required
              min="1"
              value={formData.guests.adults}
              onChange={(e) => setFormData({
                ...formData,
                guests: { ...formData.guests, adults: parseInt(e.target.value) }
              })}
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2">Children</label>
            <input
              type="number"
              min="0"
              value={formData.guests.children}
              onChange={(e) => setFormData({
                ...formData,
                guests: { ...formData.guests, children: parseInt(e.target.value) }
              })}
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>
        </div>

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
          className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded disabled:opacity-50"
        >
          {submitting ? 'Processing...' : 'Confirm Booking'}
        </button>
      </form>
    </div>
  );
};

export default BookHotel;


