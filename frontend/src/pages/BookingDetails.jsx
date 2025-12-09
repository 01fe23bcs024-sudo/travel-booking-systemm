import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from '../utils/api';
import { format } from 'date-fns';

const BookingDetails = () => {
  const { id } = useParams();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchBooking();
  }, [id]);

  const fetchBooking = async () => {
    try {
      const res = await axios.get(`/bookings/${id}`);
      setBooking(res.data.booking);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch booking');
    } finally {
      setLoading(false);
    }
  };

  const downloadInvoice = async () => {
    try {
      const res = await axios.get(`/bookings/${id}/invoice`, {
        responseType: 'blob'
      });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `invoice-${booking.bookingNumber}.pdf`);
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

  if (error || !booking) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error || 'Booking not found'}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-md p-8">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">Booking Details</h1>
            <p className="text-gray-600">Booking #: {booking.bookingNumber}</p>
          </div>
          <button
            onClick={downloadInvoice}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded"
          >
            Download Invoice
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h2 className="text-xl font-semibold mb-4">Booking Information</h2>
            <div className="space-y-2">
              <p><span className="font-semibold">Status:</span> {booking.bookingStatus}</p>
              <p><span className="font-semibold">Payment Status:</span> {booking.paymentStatus}</p>
              <p><span className="font-semibold">Total Amount:</span> ${booking.totalAmount}</p>
              <p><span className="font-semibold">Booking Date:</span> {format(new Date(booking.createdAt), 'MMM dd, yyyy HH:mm')}</p>
            </div>
          </div>

          {booking.bookingType === 'flight' && booking.flight && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Flight Details</h2>
              <div className="space-y-2">
                <p><span className="font-semibold">Flight:</span> {booking.flight.flightNumber}</p>
                <p><span className="font-semibold">Airline:</span> {booking.flight.airline}</p>
                <p><span className="font-semibold">Route:</span> {booking.flight.source} → {booking.flight.destination}</p>
                <p><span className="font-semibold">Class:</span> {booking.flightClass}</p>
                <p><span className="font-semibold">Seats:</span> {booking.seatNumbers.join(', ')}</p>
              </div>
            </div>
          )}

          {booking.bookingType === 'hotel' && booking.hotel && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Hotel Details</h2>
              <div className="space-y-2">
                <p><span className="font-semibold">Hotel:</span> {booking.hotel.name}</p>
                <p><span className="font-semibold">Address:</span> {booking.hotel.address}</p>
                <p><span className="font-semibold">City:</span> {booking.hotel.city}</p>
                <p><span className="font-semibold">Room Type:</span> {booking.roomType}</p>
                <p><span className="font-semibold">Rooms:</span> {booking.roomNumbers.join(', ')}</p>
                <p><span className="font-semibold">Check-in:</span> {format(new Date(booking.checkIn), 'MMM dd, yyyy')}</p>
                <p><span className="font-semibold">Check-out:</span> {format(new Date(booking.checkOut), 'MMM dd, yyyy')}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingDetails;


