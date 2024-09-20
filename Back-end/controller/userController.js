const User = require('../model/User');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

async function register(req, res) {
  try {
    const { name, surname,phone,email,department,location, role,password,passwordConfirm } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    const newUser = new User({
      name,
      email,
      surname,
      phone,
      department,
      location,
      role,
      password,
      passwordConfirm
    });

    await newUser.save();
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
       user: 'cleverkidzcc@gmail.com',
        pass: 'hxva pprd rxyi juyx',
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: newUser.email,
      subject: 'Registration Successful',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px; background-color: #f9f9f9;">
  <div style="text-align: center;">
    <img src="https://vivlia.co.za/wp-content/uploads/2023/07/Vivlia-Logo.png" alt="Logo" style="max-width: 100px; margin-bottom: 20px;" />
  </div>
  <h2 style="text-align: center; color: #28a745;">Welcome to Vivlia Call Logging, ${newUser.name}!</h2>
  <p>Dear ${newUser.name},</p>
  <p>Thank you for registering with us. Below are your login details:</p>
  <p><strong>Email:</strong> ${newUser.email}</p>
  <p><strong>Password:</strong> ${newUser.passwordConfirm}</P>
  <p>To access your account, please log in using your email and your password </p>
  <p>If you have any questions, feel free to contact our support team.</p>
  <p>Best regards,</p>
  <p><strong>Vivlia Call Logging Team</strong></p>
</div>

      `,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error(error);
        return res.status(500).json({ message: 'User registered but email not sent' });
      } else {
        res.status(201).json({ message: 'User registered successfully and email sent' });
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}


async function login(req, res) {
  try {
    const { email} = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const token = jwt.sign({ userId: user._id, role: user.role }, 'order_web_2024');
    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function getUser(req, res) {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
async function logout(req, res) {
  try {
    res.clearCookie('token');
    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}


module.exports = { register, login,logout, getUser };

