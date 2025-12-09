import { useState, useEffect } from 'react';
import axios from '../utils/api';

const AdminAgents = () => {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAgents();
  }, []);

  const fetchAgents = async () => {
    try {
      const res = await axios.get('/admin/agents');
      setAgents(res.data.agents || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (agentId) => {
    try {
      await axios.put(`/admin/agents/${agentId}/verify`);
      fetchAgents();
    } catch (err) {
      alert(err.response?.data?.message || 'Operation failed');
    }
  };

  const handleUnverify = async (agentId) => {
    try {
      await axios.put(`/admin/agents/${agentId}/unverify`);
      fetchAgents();
    } catch (err) {
      alert(err.response?.data?.message || 'Operation failed');
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
      <h1 className="text-3xl font-bold mb-6">Manage Agents</h1>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Company</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">License</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Earnings</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {agents.map((agent) => (
              <tr key={agent._id}>
                <td className="px-6 py-4 whitespace-nowrap">{agent.companyName}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{agent.licenseNumber}</td>
                <td className="px-6 py-4 whitespace-nowrap">{agent.userId?.email}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 rounded text-xs ${
                    agent.isVerified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {agent.isVerified ? 'Verified' : 'Pending'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">${agent.totalEarnings?.toFixed(2) || 0}</td>
                <td className="px-6 py-4 whitespace-nowrap space-x-2">
                  {agent.isVerified ? (
                    <button
                      onClick={() => handleUnverify(agent._id)}
                      className="text-yellow-600 hover:text-yellow-800"
                    >
                      Unverify
                    </button>
                  ) : (
                    <button
                      onClick={() => handleVerify(agent._id)}
                      className="text-green-600 hover:text-green-800"
                    >
                      Verify
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminAgents;


