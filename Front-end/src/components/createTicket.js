import { useState } from 'react';
import axios from 'axios';

export default function CreateTicket() {
  const [ticketData, setTicketData] = useState({
    issue: 'Internet/Network', 
    machineDescription: 'Dell',
    priority: 'Low',
  });

  const handleChange = (e) => {
    setTicketData({ ...ticketData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:4000/ticket/create', ticketData, {
        headers: {
          'Authorization': `Bearer ${token}` 
        }
      });
      alert(response.data.message);
    } catch (error) {
      alert(error.response?.data?.message || 'An error occurred');
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
        <h2 className="text-2xl font-bold mb-6 text-center">Create Ticket</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Issue</label>
            <select
              name="issue"
              value={ticketData.issue}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="Printer">Printer</option>
              <option value="Internet/Network">Internet/Network</option>
              <option value="Screen(second Screen)">Screen(second Screen)</option>
              <option value="Pastel(Application)">Pastel(Application)</option>
              <option value="Email">Email</option>
              <option value="Laptop Hardware">Laptop Hardware</option>
              <option value="Updates">Updates</option>
              <option value="Pc Performance">Pc Performance</option>
              <option value="Anti-Virus">Anti-Virus</option>
              <option value="Data & Recovery Backup">Data & Recovery Backup</option>
              <option value="Other HardWare/Software Components--Mouse,Keyboard,HDMI,etc">Other HardWare/Software Components--Mouse,Keyboard,HDMI,etc</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Machine Description</label>
            <select
              name="machineDescription"
              value={ticketData.machineDescription}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="Dell">Dell</option>
              <option value="Hp">Hp</option>
              <option value="Mac">Mac</option>
              <option value="Asus">Asus</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Priority</label>
            <select
              name="priority"
              value={ticketData.priority}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Create Ticket
          </button>
        </form>
      </div>
    </div>
  );
}
