import { useState, useEffect } from 'react';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode'; 

export default function Tickets() {
  const [tickets, setTickets] = useState([]);
  const [userRole, setUserRole] = useState('');
  const [userId, setUserId] = useState(''); 

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:4000/ticket/all', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setTickets(response.data.tickets);
      } catch (error) {
        console.error(error);
      }
    };

    const fetchUserRoleAndId = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const decodedToken = jwtDecode(token);
          setUserId(decodedToken.userId); 
          
          const response = await axios.get(`http://localhost:4000/user/${decodedToken.userId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setUserRole(response.data.role);
        } catch (error) {
          console.error('Error fetching user role or ID:', error);
        }
      }
    };

    fetchTickets();
    fetchUserRoleAndId();
  }, []);

  
  const userTickets = tickets.filter((ticket) => ticket.userId === userId);
  const userRespondedTickets = userTickets.filter((ticket) => ticket.responses.length > 0);

  
  const respondedTickets = tickets.filter((ticket) => ticket.responses.length > 0);
  
  const unrespondedTickets = tickets.filter((ticket) => ticket.responses.length === 0);

  return (
    <div className="max-w-7xl mx-auto mt-10">
      {/* If the user is an admin */}
      {userRole === 'admin' && (
        <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0">
          {/* Card for All Tickets */}
          <div className="flex-1 bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4">All Tickets</h2>
            {tickets.length === 0 ? (
              <p>No tickets found</p>
            ) : (
              <ul className="space-y-2">
                {tickets.map((ticket, index) => (
                  <li key={index} className="p-4 bg-gray-100 rounded-md shadow-sm">
                    <h3 className="text-xl font-bold">{ticket.issue}</h3>
                    <p>{ticket.machineDescription}</p>
                    <p className="text-sm text-gray-500">Priority: {ticket.priority}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Card for Responded Tickets */}
          <div className="flex-1 bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4">Responded Tickets</h2>
            {respondedTickets.length === 0 ? (
              <p>No responded tickets found</p>
            ) : (
              <ul className="space-y-2">
                {respondedTickets.map((ticket, index) => (
                  <li key={index} className="p-4 bg-gray-100 rounded-md shadow-sm">
                    <h3 className="text-xl font-bold">{ticket.issue}</h3>
                    <p>{ticket.machineDescription}</p>
                    <p className="text-sm text-gray-500">Priority: {ticket.priority}</p>
                    <div className="mt-4">
                      <h4 className="font-semibold">Responses:</h4>
                      <ul className="space-y-2">
                        {ticket.responses.map((response, responseIndex) => (
                          <li key={responseIndex} className="p-2 bg-gray-200 rounded-md">
                            <p className="font-semibold">Admin:</p>
                            <p>{response.message}</p>
                            <p className="text-sm text-gray-500">
                              Responded on: {new Date(response.createdAt).toLocaleString()}
                            </p>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Card for Tickets Without Response */}
          <div className="flex-1 bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4">Tickets Without Response</h2>
            {unrespondedTickets.length === 0 ? (
              <p>All tickets have responses</p>
            ) : (
              <ul className="space-y-2">
                {unrespondedTickets.map((ticket, index) => (
                  <li key={index} className="p-4 bg-gray-100 rounded-md shadow-sm">
                    <h3 className="text-xl font-bold">{ticket.issue}</h3>
                    <p>{ticket.machineDescription}</p>
                    <p className="text-sm text-gray-500">Priority: {ticket.priority}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}

      {/* If the user is a regular user */}
      {userRole === 'user' && (
        <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0">
          {/* Card for All User's Tickets */}
          <div className="flex-1 bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4">My Tickets</h2>
            {userTickets.length === 0 ? (
              <p>You have not submitted any tickets</p>
            ) : (
              <ul className="space-y-2">
                {userTickets.map((ticket, index) => (
                  <li key={index} className="p-4 bg-gray-100 rounded-md shadow-sm">
                    <h3 className="text-xl font-bold">{ticket.issue}</h3>
                    <p>{ticket.machineDescription}</p>
                    <p className="text-sm text-gray-500">Priority: {ticket.priority}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Card for User's Responded Tickets */}
          <div className="flex-1 bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4">Responded Tickets</h2>
            {userRespondedTickets.length === 0 ? (
              <p>No responded tickets found</p>
            ) : (
              <ul className="space-y-2">
                {userRespondedTickets.map((ticket, index) => (
                  <li key={index} className="p-4 bg-gray-100 rounded-md shadow-sm">
                    <h3 className="text-xl font-bold">{ticket.issue}</h3>
                    <p>{ticket.machineDescription}</p>
                    <p className="text-sm text-gray-500">Priority: {ticket.priority}</p>
                    <div className="mt-4">
                      <h4 className="font-semibold">Responses:</h4>
                      <ul className="space-y-2">
                        {ticket.responses.map((response, responseIndex) => (
                          <li key={responseIndex} className="p-2 bg-gray-200 rounded-md">
                            <p className="font-semibold">Admin:</p>
                            <p>{response.message}</p>
                            <p className="text-sm text-gray-500">
                              Responded on: {new Date(response.createdAt).toLocaleString()}
                            </p>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
