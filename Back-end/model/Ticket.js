const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  name: { type: String, required: true },
  phone: { type: String, required: true },
  department: { type: String, required: true },
  email: { type: String, required: true },
  issue: { type: String, enum: ['Printer', 'Internet/Network', 'Screen(second Screen)', 'Pastel(Application)', 'Email', 'Office(microsoft W,E,P)', 'Laptop Hardware', 'Updates', 'Pc Performance', 'Anti-Virus', 'Data & Recovery Backup', 'Other HardWare/Software Components--Mouse,Keyboard,HDMI,etc'], required: true },
  machineDescription: { type: String, enum: ['Dell', 'Hp', 'Mac', 'Asus'], required: true },
  priority: { type: String, enum: ['Low', 'Medium', 'High'], required: true },
  status: { type: String, enum: ['Open', 'In Progress', 'Closed'], default: 'Open' },
  createdAt: { type: Date, default: Date.now },
  responses: [{
    admin: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    message: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
  }]
});

module.exports = mongoose.model('Ticket', ticketSchema);
