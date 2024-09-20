import React, { useState, useEffect } from 'react';
import axios from 'axios';

const RespondToTicket = () => {
  const [tickets, setTickets] = useState([]);
  const [selectedTicketId, setSelectedTicketId] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('No token found. Please log in again.');
          return;
        }

        const response = await axios.get('http://localhost:4000/ticket/all', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log('Response data:', response.data); 

        if (response.data && (response.data.openTickets || response.data.closedTickets)) {
          const allTickets = [...response.data.openTickets, ...response.data.closedTickets];
          setTickets(allTickets);
        } else {
          setError('No tickets available.');
        }
      } catch (error) {
        console.error('Error fetching tickets:', error);
        setError('Failed to fetch tickets. Please try again later.');
      }
    };

    fetchTickets();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!selectedTicketId) {
      setError('Please select a ticket before submitting.');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      setError('No token found. Please log in again.');
      return;
    }

    try {
      await axios.patch(
        `http://localhost:4000/ticket/respond/${selectedTicketId}`,
        { message, status },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setSuccess('Successfully responded and status updated!');
      setMessage('');
      setStatus('');
      setSelectedTicketId('');

    } catch (err) {
      console.error('Error responding to the ticket:', err);
      setError(err.response?.data?.message || 'An error occurred while submitting the response.');
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 border border-gray-200 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4">Respond to Ticket</h2>
      {error && <p className="text-red-500">{error}</p>}
      {success && <p className="text-green-500">{success}</p>}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700">Select Ticket</label>
          <select
            className="mt-1 block w-full p-2 border border-gray-300 rounded"
            value={selectedTicketId}
            onChange={(e) => setSelectedTicketId(e.target.value)}
            required
          >
            <option value="">Select a ticket</option>
            {tickets.length > 0 ? (
              tickets.map((ticket) => (
                <option key={ticket._id} value={ticket._id}>
                  {ticket.name || `Ticket ID: ${ticket._id}`}
                </option>
              ))
            ) : (
              <option value="">No tickets available</option>
            )}
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Response</label>
          <textarea
            className="mt-1 block w-full p-2 border border-gray-300 rounded"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Ticket Status</label>
          <select
            className="mt-1 block w-full p-2 border border-gray-300 rounded"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            required
          >
            <option value="">Select a status</option>
            <option value="Open">Open</option>
            <option value="In Progress">In Progress</option>
            <option value="Closed">Closed</option>
          </select>
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          disabled={!selectedTicketId}
        >
          Submit Response
        </button>
      </form>
    </div>
  );
};

export default RespondToTicket;
