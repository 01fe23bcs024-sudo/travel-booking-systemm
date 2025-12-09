import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from '../utils/api';
import { format } from 'date-fns';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const res = await axios.get('/bookings');
      setBookings(res.data.bookings || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) {
      return;
    }

    try {
      await axios.post(`/bookings/${bookingId}/cancel`, {
        reason: 'User cancelled'
      });
      fetchBookings();
      alert('Booking cancelled successfully');
    } catch (err) {
      alert(err.response?.data?.message || 'Cancellation failed');
    }
  };

  const downloadInvoice = async (bookingId) => {
    try {
      const res = await axios.get(`/bookings/${bookingId}/invoice`, {
        responseType: 'blob'
      });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `invoice-${bookingId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      alert('Failed to download invoice');
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
      <h1 className="text-3xl font-bold mb-6">My Bookings</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="space-y-4">
        {bookings.map((booking) => (
          <div key={booking._id} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-semibold">
                  {booking.bookingType === 'flight' ? '✈️ Flight' : '🏨 Hotel'} Booking
                </h3>
                <p className="text-gray-600">Booking #: {booking.bookingNumber}</p>
                <p className="text-sm text-gray-500">
                  {format(new Date(booking.createdAt), 'MMM dd, yyyy HH:mm')}
                </p>
                <div className="mt-2">
                  <span
                    className={`px-3 py-1 rounded-full text-sm ${
                      booking.bookingStatus === 'confirmed'
                        ? 'bg-green-100 text-green-800'
                        : booking.bookingStatus === 'cancelled'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {booking.bookingStatus}
                  </span>
                </div>
                {booking.bookingType === 'flight' && booking.flight && (
                  <div className="mt-2">
                    <p>
                      {booking.flight.source} → {booking.flight.destination}
                    </p>
                    <p className="text-sm">{booking.flight.airline}</p>
                  </div>
                )}
                {booking.bookingType === 'hotel' && booking.hotel && (
                  <div className="mt-2">
                    <p>{booking.hotel.name}</p>
                    <p className="text-sm">{booking.hotel.city}</p>
                  </div>
                )}
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-blue-600">
                  ${booking.totalAmount}
                </div>
                <div className="mt-4 space-x-2">
                  <button
                    onClick={() => downloadInvoice(booking._id)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm"
                  >
                    Download Invoice
                  </button>
                  {booking.bookingStatus === 'confirmed' && (
                    <button
                      onClick={() => handleCancel(booking._id)}
                      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded text-sm"
                    >
                      Cancel
                    </button>
                  )}
                  <Link
                    to={`/bookings/${booking._id}`}
                    className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded text-sm inline-block"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {bookings.length === 0 && (
        <div className="text-center text-gray-500 py-12">
          No bookings found. Start booking flights or hotels!
        </div>
      )}
    </div>
  );
};

export default MyBookings;


