import React from 'react';
import { Button, Layout,Menu } from 'antd';
import { motion } from 'framer-motion';
import Typical from 'react-typical';
import logo from './Vivlia-Logo.png';
const{Header,Content}=Layout;
const Home = () => {

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
        style={{ textAlign: 'center' }}
      >
        <Typical
          loop={Infinity}
          steps={['Ticket', 1000, ' Management', 1000,  'System', 1000]}
        />
      </motion.h1>

      <motion.p
        className="app-description"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, ease: 'easeInOut', delay: 0.3 }}
        style={{ textAlign: 'center', margin: '20px auto', fontSize: '20px', color: '#4a4a4a', maxWidth: '600px', lineHeight: '1.6' }}
      >
        Welcome to  <strong>Tickets Management System</strong>
      </motion.p>

      
    </div>
    </Content>
    </Layout>
  );
};

export default Home;