import { useState, useEffect } from 'react';
import axios from '../utils/api';

const AgentHotels = () => {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingHotel, setEditingHotel] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    city: '',
    address: '',
    description: '',
    rating: 0,
    amenities: '',
    standardPrice: 0,
    deluxePrice: 0,
    suitePrice: 0,
    standardRooms: { total: 0 },
    deluxeRooms: { total: 0 },
    suiteRooms: { total: 0 },
    isRefundable: true,
    cancellationFee: 0
  });

  useEffect(() => {
    fetchHotels();
  }, []);

  const fetchHotels = async () => {
    try {
      const res = await axios.get('/hotels');
      setHotels(res.data.hotels || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const submitData = {
        ...formData,
        amenities: formData.amenities.split(',').map(a => a.trim()).filter(a => a)
      };
      
      if (editingHotel) {
        await axios.put(`/hotels/${editingHotel._id}`, submitData);
      } else {
        await axios.post('/hotels', submitData);
      }
      fetchHotels();
      setShowForm(false);
      setEditingHotel(null);
      resetForm();
    } catch (err) {
      alert(err.response?.data?.message || 'Operation failed');
    }
  };

  const handleEdit = (hotel) => {
    setEditingHotel(hotel);
    setFormData({
      name: hotel.name,
      city: hotel.city,
      address: hotel.address,
      description: hotel.description || '',
      rating: hotel.rating || 0,
      amenities: hotel.amenities?.join(', ') || '',
      standardPrice: hotel.standardPrice,
      deluxePrice: hotel.deluxePrice,
      suitePrice: hotel.suitePrice,
      standardRooms: { total: hotel.standardRooms.total },
      deluxeRooms: { total: hotel.deluxeRooms.total },
      suiteRooms: { total: hotel.suiteRooms.total },
      isRefundable: hotel.isRefundable,
      cancellationFee: hotel.cancellationFee || 0
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this hotel?')) return;
    try {
      await axios.delete(`/hotels/${id}`);
      fetchHotels();
    } catch (err) {
      alert(err.response?.data?.message || 'Delete failed');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      city: '',
      address: '',
      description: '',
      rating: 0,
      amenities: '',
      standardPrice: 0,
      deluxePrice: 0,
      suitePrice: 0,
      standardRooms: { total: 0 },
      deluxeRooms: { total: 0 },
      suiteRooms: { total: 0 },
      isRefundable: true,
      cancellationFee: 0
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Manage Hotels</h1>
        <button
          onClick={() => {
            setShowForm(!showForm);
            setEditingHotel(null);
            resetForm();
          }}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded"
        >
          {showForm ? 'Cancel' : 'Add Hotel'}
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">
            {editingHotel ? 'Edit Hotel' : 'Add New Hotel'}
          </h2>
          <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Hotel Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              className="px-3 py-2 border rounded-md"
            />
            <input
              type="text"
              placeholder="City"
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              required
              className="px-3 py-2 border rounded-md"
            />
            <input
              type="text"
              placeholder="Address"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              required
              className="px-3 py-2 border rounded-md md:col-span-2"
            />
            <textarea
              placeholder="Description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="px-3 py-2 border rounded-md md:col-span-2"
            />
            <input
              type="number"
              placeholder="Rating (0-5)"
              value={formData.rating}
              onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
              min="0"
              max="5"
              step="0.1"
              className="px-3 py-2 border rounded-md"
            />
            <input
              type="text"
              placeholder="Amenities (comma separated)"
              value={formData.amenities}
              onChange={(e) => setFormData({ ...formData, amenities: e.target.value })}
              className="px-3 py-2 border rounded-md"
            />
            <input
              type="number"
              placeholder="Standard Price"
              value={formData.standardPrice}
              onChange={(e) => setFormData({ ...formData, standardPrice: e.target.value })}
              required
              min="0"
              className="px-3 py-2 border rounded-md"
            />
            <input
              type="number"
              placeholder="Deluxe Price"
              value={formData.deluxePrice}
              onChange={(e) => setFormData({ ...formData, deluxePrice: e.target.value })}
              required
              min="0"
              className="px-3 py-2 border rounded-md"
            />
            <input
              type="number"
              placeholder="Suite Price"
              value={formData.suitePrice}
              onChange={(e) => setFormData({ ...formData, suitePrice: e.target.value })}
              required
              min="0"
              className="px-3 py-2 border rounded-md"
            />
            <input
              type="number"
              placeholder="Standard Rooms"
              value={formData.standardRooms.total}
              onChange={(e) => setFormData({ ...formData, standardRooms: { total: e.target.value } })}
              required
              min="0"
              className="px-3 py-2 border rounded-md"
            />
            <input
              type="number"
              placeholder="Deluxe Rooms"
              value={formData.deluxeRooms.total}
              onChange={(e) => setFormData({ ...formData, deluxeRooms: { total: e.target.value } })}
              required
              min="0"
              className="px-3 py-2 border rounded-md"
            />
            <input
              type="number"
              placeholder="Suite Rooms"
              value={formData.suiteRooms.total}
              onChange={(e) => setFormData({ ...formData, suiteRooms: { total: e.target.value } })}
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
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded"
              >
                {editingHotel ? 'Update Hotel' : 'Create Hotel'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        {hotels.map((hotel) => (
          <div key={hotel._id} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-semibold">{hotel.name}</h3>
                <p className="text-gray-600">{hotel.city}</p>
                <p className="text-sm text-gray-500">{hotel.address}</p>
              </div>
              <div className="space-x-2">
                <button
                  onClick={() => handleEdit(hotel)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(hotel._id)}
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

export default AgentHotels;


