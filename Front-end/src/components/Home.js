import React from 'react';
import { Layout, Menu, Button } from 'antd';
import { motion } from 'framer-motion';
import logo from './Vivlia-Logo.png';
import { useNavigate } from 'react-router-dom';

const { Header, Content } = Layout;

const Home = () => {
  const navigate = useNavigate();
  return (
    <Layout>
      <Header>
        <Menu theme="dark" mode="horizontal">
          <Menu.Item key="1">Home</Menu.Item>
        </Menu>
      </Header>
      <Content style={{ padding: '50px' }}>
        <div className="app-container">
          <img src={logo} alt="Logo" className="app-logo" />

          <motion.h1
            className="app-title"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: 'easeInOut', delay: 0.1 }}
            style={{ textAlign: 'center', fontSize: '2.5rem', margin: '20px 0' }}
          >
            Ticket Management System
          </motion.h1>

          <motion.p
            className="app-description"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, ease: 'easeInOut', delay: 0.3 }}
            style={{
              textAlign: 'center',
              margin: '20px auto',
              fontSize: '20px',
              color: '#4a4a4a',
              maxWidth: '600px',
              lineHeight: '1.6',
            }}
          >
            Welcome to <strong>Tickets Management System</strong>. Here you can create, manage, and track your tickets efficiently.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: 'easeInOut', delay: 0.5 }}
            style={{ textAlign: 'center', marginTop: '30px' }}
          >
            <Button type="primary" size="large" style={{ padding: '10px 20px' }}
             onClick={() => navigate('/app/create-ticket')}>
              Get Started
            </Button>
          </motion.div>
        </div>
      </Content>
    </Layout>
  );
};

export default Home;
