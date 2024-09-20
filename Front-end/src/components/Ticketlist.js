import { useState, useEffect } from 'react';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode'; 

export default function Tickets() {
  const [openTickets, setOpenTickets] = useState([]);
  const [closedTickets, setClosedTickets] = useState([]);
  const [respondedTickets, setRespondedTickets] = useState([]);
  const [userRole, setUserRole] = useState('');

  useEffect(() => {
    const fetchTickets = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await axios.get('http://localhost:4000/ticket/all', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setOpenTickets(response.data.openTickets);
          setClosedTickets(response.data.closedTickets);
          const responded = response.data.openTickets.filter(
            (ticket) => ticket.responses && ticket.responses.length > 0
          );
          setRespondedTickets(responded);
        } catch (error) {
          console.error('Error fetching tickets:', error);
        }
      }
    };

    const fetchUserRole = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const { userId } = jwtDecode(token);
          const response = await axios.get(`http://localhost:4000/user/${userId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setUserRole(response.data.role);
        } catch (error) {
          console.error('Error fetching user role:', error);
        }
      }
    };

    fetchTickets();
    fetchUserRole();
  }, []);

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return isNaN(date.getTime()) ? 'Invalid Date' : date.toLocaleString(); 
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md max-w-7xl mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-4">Tickets</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {userRole === 'admin' && (
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-2xl font-bold mb-4">Open Tickets</h3>
            {openTickets.length === 0 ? (
              <p>No open tickets found</p>
            ) : (
              openTickets.map((ticket) => (
                <div key={ticket._id} className="border p-4 mb-4">
                  <p><strong>Issue:</strong> {ticket.issue}</p>
                  <p><strong>Department:</strong> {ticket.department}</p>
                  <p><strong>Machine:</strong> {ticket.machineDescription}</p>
                </div>
              ))
            )}
          </div>
        )}
         {userRole === 'user' && (
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-2xl font-bold mb-4">My Open Tickets</h3>
            {openTickets.length === 0 ? (
              <p>No open tickets found</p>
            ) : (
              openTickets.map((ticket) => (
                <div key={ticket._id} className="border p-4 mb-4">
                  <p><strong>Issue:</strong> {ticket.issue}</p>
                  <p><strong>Department:</strong> {ticket.department}</p>
                  <p><strong>Machine:</strong> {ticket.machineDescription}</p>
                </div>
              ))
            )}
          </div>
  )}
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-2xl font-bold mb-4">
            {userRole === 'user' ? 'My Closed Tickets' : 'Closed Tickets'}
          </h3>
          {closedTickets.length === 0 ? (
            <p>No closed tickets found</p>
          ) : (
            closedTickets.map((ticket) => (
              <div key={ticket._id} className="border p-4 mb-4">
                <p><strong>Issue:</strong> {ticket.issue}</p>
                <p><strong>Department:</strong> {ticket.department}</p>
                <p><strong>Machine:</strong> {ticket.machineDescription}</p>
              </div>
            ))
          )}
        </div>

       
      
      </div>
    </div>
  );
}
