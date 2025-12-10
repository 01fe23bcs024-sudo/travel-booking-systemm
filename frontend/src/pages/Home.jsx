import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold text-gray-800 mb-4">
          Welcome to Travel Booking System
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Book your flights and hotels with ease
        </p>
        <p className="text-sm text-gray-500">
          Updated: container demo — build 2
        </p>
        <div className="flex justify-center space-x-4">
          <Link
            to="/flights"
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg text-lg font-semibold transition"
          >
            Search Flights
          </Link>
          <Link
            to="/hotels"
            className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg text-lg font-semibold transition"
          >
            Search Hotels
          </Link>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8 mt-16">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="text-4xl mb-4">✈️</div>
          <h3 className="text-xl font-semibold mb-2">Flight Bookings</h3>
          <p className="text-gray-600">
            Search and book flights to your favorite destinations. Choose from economy, business, or first class.
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="text-4xl mb-4">🏨</div>
          <h3 className="text-xl font-semibold mb-2">Hotel Reservations</h3>
          <p className="text-gray-600">
            Find the perfect hotel for your stay. Standard, deluxe, or suite rooms available.
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="text-4xl mb-4">📋</div>
          <h3 className="text-xl font-semibold mb-2">Manage Bookings</h3>
          <p className="text-gray-600">
            View all your bookings, cancel if needed, and download invoices.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;


