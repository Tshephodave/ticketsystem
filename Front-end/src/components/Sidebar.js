import React, { useState, useEffect } from 'react';
import { Layout, Menu, message, Badge } from 'antd';
import { NavLink, useLocation, useNavigate, Outlet } from 'react-router-dom';
import {
  DashboardOutlined,
  PlusSquareOutlined,
  LogoutOutlined,
  HomeOutlined,
  SendOutlined,
  BellOutlined
} from '@ant-design/icons';
import { AiOutlineTable } from 'react-icons/ai';
import axios from 'axios'; 
import {jwtDecode} from 'jwt-decode'; 
import S from './style'; 

const { Sider, Content, Footer } = Layout;

const MainLayout = ({ user, setUser }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0); 
  const [userRole, setUserRole] = useState(null); 
  const location = useLocation();
  const currentPath = location.pathname;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNotificationCount = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:4000/ticket/notifications', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const newCount = response.data.unreadNotificationCount || 0;
        
        
        if (newCount !== notificationCount) {
          setNotificationCount(newCount);
        }
        
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };
  
  
    fetchNotificationCount();
  
    
    const interval = setInterval(fetchNotificationCount, 60000);
  
    return () => clearInterval(interval);
  }, []); 
  
  
   
  
  

  useEffect(() => {
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

    fetchUserRole();
  }, []);

  const onCollapse = (collapsed) => {
    setCollapsed(collapsed);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    message.success('Logged out successfully.');
    navigate('/login');
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={onCollapse}
        breakpoint="lg"
        style={{
          overflow: 'auto',
          height: '100vh',
          position: 'fixed',
          left: 0,
        }}
      >
        <Menu theme="dark" mode="inline" selectedKeys={[currentPath]}>
          <Menu.Item key="/app/home" icon={<HomeOutlined />}>
            <NavLink to="/app/home">Home</NavLink>
          </Menu.Item>
          <Menu.Item key="/app/dashboard" icon={<DashboardOutlined />}>
            <NavLink to="/app/dashboard">Dashboard</NavLink>
          </Menu.Item>
          <Menu.Item key="/app/notification" icon={
  <Badge count={notificationCount} overflowCount={99} style={{ margin: '0 10px' }}>
    <BellOutlined style={{ fontSize: '18px' }} />
  </Badge>
}>
  <NavLink to="/app/notification">Notification</NavLink>
</Menu.Item>



          
          {userRole !== 'user' && (
            <Menu.Item key="/app/respond" icon={<SendOutlined />}>
              <NavLink to="/app/respond">Respond to Tickets</NavLink>
            </Menu.Item>
          )}
          <Menu.Item key="/app/Ticketlist" icon={<AiOutlineTable />}>
            <NavLink to="/app/Ticketlist">Tickets</NavLink>
          </Menu.Item>
          {userRole !== 'admin' && (
          <Menu.Item key="/app/create-ticket" icon={<PlusSquareOutlined />}>
            <NavLink to="/app/create-ticket">Create Ticket</NavLink>
          </Menu.Item>
           )}
          <Menu.Item key="/app/logout" icon={<LogoutOutlined />} onClick={handleLogout}>
            Logout
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout className="site-layout" style={{ marginLeft: collapsed ? 80 : 200 }}>
        <Content style={{ margin: '0 16px' }}>
          <div style={{ padding: 24, background: '#fff', minHeight: 360 }}>
            <Outlet />
          </div>
        </Content>
        <S.Footer>Copyright ©2024 </S.Footer>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
