import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, Layout, List, Button, notification, Spin } from 'antd';
import { FileTextOutlined, CheckCircleOutlined, ExclamationCircleOutlined, CloseCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';

const API_URL = 'http://localhost:4000';
const { Header, Content } = Layout;

const Dashboard = () => {
  const [openTickets, setOpenTickets] = useState([]);
  const [closedTickets, setClosedTickets] = useState([]);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        await fetchTickets();
        await fetchUserRole();
      } catch (error) {
        notification.error({ message: 'Failed to fetch data' });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const fetchTickets = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const response = await axios.get(`${API_URL}/ticket/all`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const { openTickets, closedTickets } = response.data;
        
        if (Array.isArray(openTickets) && Array.isArray(closedTickets)) {
          setOpenTickets(openTickets);
          setClosedTickets(closedTickets);
        } else {
          notification.error({ message: 'Unexpected response format for tickets' });
        }
      } catch (error) {
        notification.error({ message: 'Failed to fetch tickets' });
      }
    }
  };

  const fetchUserRole = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const { userId } = jwtDecode(token);
        const response = await axios.get(`${API_URL}/user/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserRole(response.data.role);
      } catch (error) {
        console.error('Error fetching user role:', error);
      }
    }
  };

  // Calculate counts
  const pendingTickets = openTickets.length;
  const respondedTickets = closedTickets.length;


  if (loading) return <Spin size="large" className="flex justify-center items-center h-screen" />;

  return (
    <Layout>
      <Header className="bg-gray-800">
        <div className="text-white text-xl p-4">Dashboard</div>
      </Header>
      <Content className="p-6 md:p-12 lg:p-16">
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="p-4">
              <Card.Meta
                title="Total Tickets"
                description={<div className="text-2xl"><FileTextOutlined /> {openTickets.length + closedTickets.length}</div>}
              />
            </Card>
            <Card className="p-4">
              <Card.Meta
                title="Pending Tickets"
                description={<div className="text-2xl"><ExclamationCircleOutlined /> {pendingTickets}</div>}
              />
            </Card>
            <Card className="p-4">
              <Card.Meta
                title="Resolved Tickets"
                description={<div className="text-2xl"><CheckCircleOutlined /> {respondedTickets}</div>}
              />
            </Card>
           
          </div>

          <div className="mt-6">
            <Card title="Recent Tickets" className="w-full">
              <List
                dataSource={openTickets.slice(0, 5)}
                renderItem={item => (
                  <List.Item>
                    {item.subject} - {item.responded ? 'Responded' : 'Pending'}
                  </List.Item>
                )}
              />
            </Card>
          </div>

          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            <div>
              {userRole !== 'admin' && (
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  className="w-full"
                  onClick={() => navigate('/app/create-ticket')}
                >
                  Create New Ticket
                </Button>
              )}
            </div>
            <div>
              {userRole !== 'user' && (
                <Button
                  type="primary"
                  icon={<FileTextOutlined />}
                  className="w-full"
                  onClick={() => navigate('/app/respond')}
                >
                  Respond Ticket
                </Button>
              )}
            </div>
            <div>
              <Button
                type="primary"
                icon={<FileTextOutlined />}
                className="w-full"
                onClick={() => navigate('/app/ticketlist')}
              >
                View All Tickets
              </Button>
            </div>
          </div>
        </div>
      </Content>
    </Layout>
  );
};

export default Dashboard;
