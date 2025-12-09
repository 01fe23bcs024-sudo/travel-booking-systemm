import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import FlightSearch from './pages/FlightSearch';
import HotelSearch from './pages/HotelSearch';
import BookingPage from './pages/BookingPage';
import BookingDetails from './pages/BookingDetails';
import MyBookings from './pages/MyBookings';
import AgentDashboard from './pages/AgentDashboard';
import AgentFlights from './pages/AgentFlights';
import AgentHotels from './pages/AgentHotels';
import AdminDashboard from './pages/AdminDashboard';
import AdminUsers from './pages/AdminUsers';
import AdminAgents from './pages/AdminAgents';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/flights" element={<FlightSearch />} />
            <Route path="/hotels" element={<HotelSearch />} />
            
            <Route path="/bookings/new" element={
              <PrivateRoute>
                <BookingPage />
              </PrivateRoute>
            } />
            <Route path="/bookings/:id" element={
              <PrivateRoute>
                <BookingDetails />
              </PrivateRoute>
            } />
            <Route path="/my-bookings" element={
              <PrivateRoute>
                <MyBookings />
              </PrivateRoute>
            } />
            
            <Route path="/agent/dashboard" element={
              <PrivateRoute allowedRoles={['agent', 'admin']}>
                <AgentDashboard />
              </PrivateRoute>
            } />
            <Route path="/agent/flights" element={
              <PrivateRoute allowedRoles={['agent', 'admin']}>
                <AgentFlights />
              </PrivateRoute>
            } />
            <Route path="/agent/hotels" element={
              <PrivateRoute allowedRoles={['agent', 'admin']}>
                <AgentHotels />
              </PrivateRoute>
            } />
            
            <Route path="/admin/dashboard" element={
              <PrivateRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </PrivateRoute>
            } />
            <Route path="/admin/users" element={
              <PrivateRoute allowedRoles={['admin']}>
                <AdminUsers />
              </PrivateRoute>
            } />
            <Route path="/admin/agents" element={
              <PrivateRoute allowedRoles={['admin']}>
                <AdminAgents />
              </PrivateRoute>
            } />
            
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;

