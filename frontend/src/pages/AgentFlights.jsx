import { useState, useEffect } from 'react';
import axios from '../utils/api';
import { format } from 'date-fns';

const AgentFlights = () => {
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingFlight, setEditingFlight] = useState(null);
  const [formData, setFormData] = useState({
    flightNumber: '',
    airline: '',
    source: '',
    destination: '',
    departureTime: '',
    arrivalTime: '',
    economyPrice: 0,
    businessPrice: 0,
    firstClassPrice: 0,
    economySeats: { total: 0 },
    businessSeats: { total: 0 },
    firstClassSeats: { total: 0 },
    isRefundable: true,
    cancellationFee: 0
  });

  useEffect(() => {
    fetchFlights();
  }, []);

  const fetchFlights = async () => {
    try {
      const res = await axios.get('/flights');
      setFlights(res.data.flights || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingFlight) {
        await axios.put(`/flights/${editingFlight._id}`, formData);
      } else {
        await axios.post('/flights', formData);
      }
      fetchFlights();
      setShowForm(false);
      setEditingFlight(null);
      resetForm();
    } catch (err) {
      alert(err.response?.data?.message || 'Operation failed');
    }
  };

  const handleEdit = (flight) => {
    setEditingFlight(flight);
    setFormData({
      flightNumber: flight.flightNumber,
      airline: flight.airline,
      source: flight.source,
      destination: flight.destination,
      departureTime: format(new Date(flight.departureTime), "yyyy-MM-dd'T'HH:mm"),
      arrivalTime: format(new Date(flight.arrivalTime), "yyyy-MM-dd'T'HH:mm"),
      economyPrice: flight.economyPrice,
      businessPrice: flight.businessPrice,
      firstClassPrice: flight.firstClassPrice,
      economySeats: { total: flight.economySeats.total },
      businessSeats: { total: flight.businessSeats.total },
      firstClassSeats: { total: flight.firstClassSeats.total },
      isRefundable: flight.isRefundable,
      cancellationFee: flight.cancellationFee || 0
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this flight?')) return;
    try {
      await axios.delete(`/flights/${id}`);
      fetchFlights();
    } catch (err) {
      alert(err.response?.data?.message || 'Delete failed');
    }
  };

  const resetForm = () => {
    setFormData({
      flightNumber: '',
      airline: '',
      source: '',
      destination: '',
      departureTime: '',
      arrivalTime: '',
      economyPrice: 0,
      businessPrice: 0,
      firstClassPrice: 0,
      economySeats: { total: 0 },
      businessSeats: { total: 0 },
      firstClassSeats: { total: 0 },
      isRefundable: true,
      cancellationFee: 0
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Manage Flights</h1>
        <button
          onClick={() => {
            setShowForm(!showForm);
            setEditingFlight(null);
            resetForm();
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded"
        >
          {showForm ? 'Cancel' : 'Add Flight'}
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">
            {editingFlight ? 'Edit Flight' : 'Add New Flight'}
          </h2>
          <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Flight Number"
              value={formData.flightNumber}
              onChange={(e) => setFormData({ ...formData, flightNumber: e.target.value })}
              required
              className="px-3 py-2 border rounded-md"
            />
            <input
              type="text"
              placeholder="Airline"
              value={formData.airline}
              onChange={(e) => setFormData({ ...formData, airline: e.target.value })}
              required
              className="px-3 py-2 border rounded-md"
            />
            <input
              type="text"
              placeholder="Source"
              value={formData.source}
              onChange={(e) => setFormData({ ...formData, source: e.target.value })}
              required
              className="px-3 py-2 border rounded-md"
            />
            <input
              type="text"
              placeholder="Destination"
              value={formData.destination}
              onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
              required
              className="px-3 py-2 border rounded-md"
            />
            <input
              type="datetime-local"
              value={formData.departureTime}
              onChange={(e) => setFormData({ ...formData, departureTime: e.target.value })}
              required
              className="px-3 py-2 border rounded-md"
            />
            <input
              type="datetime-local"
              value={formData.arrivalTime}
              onChange={(e) => setFormData({ ...formData, arrivalTime: e.target.value })}
              required
              className="px-3 py-2 border rounded-md"
            />
            <input
              type="number"
              placeholder="Economy Price"
              value={formData.economyPrice}
              onChange={(e) => setFormData({ ...formData, economyPrice: e.target.value })}
              required
              min="0"
              className="px-3 py-2 border rounded-md"
            />
            <input
              type="number"
              placeholder="Business Price"
              value={formData.businessPrice}
              onChange={(e) => setFormData({ ...formData, businessPrice: e.target.value })}
              required
              min="0"
              className="px-3 py-2 border rounded-md"
            />
            <input
              type="number"
              placeholder="First Class Price"
              value={formData.firstClassPrice}
              onChange={(e) => setFormData({ ...formData, firstClassPrice: e.target.value })}
              required
              min="0"
              className="px-3 py-2 border rounded-md"
            />
            <input
              type="number"
              placeholder="Economy Seats"
              value={formData.economySeats.total}
              onChange={(e) => setFormData({ ...formData, economySeats: { total: e.target.value } })}
              required
              min="0"
              className="px-3 py-2 border rounded-md"
            />
            <input
              type="number"
              placeholder="Business Seats"
              value={formData.businessSeats.total}
              onChange={(e) => setFormData({ ...formData, businessSeats: { total: e.target.value } })}
              required
              min="0"
              className="px-3 py-2 border rounded-md"
            />
            <input
              type="number"
              placeholder="First Class Seats"
              value={formData.firstClassSeats.total}
              onChange={(e) => setFormData({ ...formData, firstClassSeats: { total: e.target.value } })}
              required
              min="0"
              className="px-3 py-2 border rounded-md"
            />
            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.isRefundable}
                  onChange={(e) => setFormData({ ...formData, isRefundable: e.target.checked })}
                  className="mr-2"
                />
                Refundable
              </label>
            </div>
            <input
              type="number"
              placeholder="Cancellation Fee"
              value={formData.cancellationFee}
              onChange={(e) => setFormData({ ...formData, cancellationFee: e.target.value })}
              min="0"
              className="px-3 py-2 border rounded-md"
            />
            <div className="md:col-span-2">
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded"
              >
                {editingFlight ? 'Update Flight' : 'Create Flight'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="space-y-4">
        {flights.map((flight) => (
          <div key={flight._id} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-semibold">{flight.airline}</h3>
                <p className="text-gray-600">{flight.flightNumber}</p>
                <p>{flight.source} → {flight.destination}</p>
                <p className="text-sm text-gray-500">
                  {format(new Date(flight.departureTime), 'MMM dd, yyyy HH:mm')}
                </p>
              </div>
              <div className="space-x-2">
                <button
                  onClick={() => handleEdit(flight)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(flight._id)}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AgentFlights;


