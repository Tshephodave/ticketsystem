const jwt = require('jsonwebtoken');
const User = require('../model/User');
const Ticket = require('../model/Ticket');
const Notification = require('../model/Notification');

const secret = 'order_web_2024'; 

async function createTicket(req, res) {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    if (!token) return res.status(401).json({ message: 'Authentication required' });

    const decoded = jwt.verify(token, secret);
    const user = await User.findById(decoded.userId);
    if (!user) return res.status(401).json({ message: 'User not found' });

    const { issue, machineDescription, priority } = req.body;
    if (!issue || !machineDescription || !priority) {
      return res.status(400).json({ message: 'Incomplete ticket details' });
    }

    const newTicket = new Ticket({
      user: decoded.userId,
      name: user.name,
      phone: user.phone,
      department: user.department,
      email: user.email,
      issue,
      machineDescription,
      priority,
    });

    await newTicket.save();
    const admins = await User.find({ role: 'admin' });
    for (const admin of admins) {
      const adminNotification = new Notification({
        message: `New ticket created by ${user.name}: ${issue}`,
        user: admin._id,
      });
      await adminNotification.save();
    }

    
    const unreadCount = await Notification.countDocuments({ user: decoded.userId, read: false });

    res.status(201).json({
      message: 'Ticket created successfully',
      ticket: newTicket,
      unreadNotificationCount: unreadCount 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}


async function getTickets(req, res) {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    if (!token) return res.status(401).json({ message: 'Authentication required' });

    const decoded = jwt.verify(token, secret);
    const user = await User.findById(decoded.userId);
    if (!user) return res.status(401).json({ message: 'User not found' });

    let openTickets, closedTickets;

    if (user.role === 'admin') {
      openTickets = await Ticket.find({ status: 'Open' });
      closedTickets = await Ticket.find({ status: 'Closed' });
    } else {
      openTickets = await Ticket.find({ user: user._id, status: 'Open' });
      closedTickets = await Ticket.find({ user: user._id, status: 'Closed' });
    }

    res.status(200).json({ openTickets, closedTickets });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function respondToTicket(req, res) {
  try {
    const { ticketId } = req.params;
    const { message, status } = req.body; 
    const token = req.header('Authorization').replace('Bearer ', '');

    if (!token) return res.status(401).json({ message: 'Authentication required' });

    const decoded = jwt.verify(token, secret);
    const admin = await User.findById(decoded.userId);

    if (!admin || admin.role !== 'admin') return res.status(403).json({ message: 'Admin privileges required' });

    const ticket = await Ticket.findById(ticketId);
    if (!ticket) return res.status(404).json({ message: 'Ticket not found' });

    
    ticket.responses.push({
      admin: admin._id,
      message
    });

    
    if (status && ['Open', 'In Progress', 'Closed'].includes(status)) {
      ticket.status = status;
    }

    await ticket.save();

    
    const user = await User.findById(ticket.user);
    if (user) {
      const userNotification = new Notification({
        message: `Admin ${admin.name} has responded to your ticket: ${message}`,
        user: user._id,
      });
      await userNotification.save();
    }

    
    const unreadCount = await Notification.countDocuments({ user: decoded.userId, read: false });

    res.status(200).json({
      message: 'Response added and ticket updated successfully',
      ticket,
      unreadNotificationCount: unreadCount
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}


async function getNotifications(req, res) {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    if (!token) return res.status(401).json({ message: 'Authentication required' });

    const decoded = jwt.verify(token, secret);
    const notifications = await Notification.find({ user: decoded.userId }).sort({ createdAt: -1 });

    // Count unread notifications
    const unreadCount = await Notification.countDocuments({ user: decoded.userId, read: false });

    // Mark notifications as read (optional)
    await Notification.updateMany({ user: decoded.userId, read: false }, { $set: { read: true } });

    res.status(200).json({
      notifications,
      unreadNotificationCount: unreadCount
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}



module.exports = { createTicket, getTickets, respondToTicket, getNotifications };



