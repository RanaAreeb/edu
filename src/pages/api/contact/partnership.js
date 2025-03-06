import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { name, email, organization, message } = req.body;

  if (!name || !email || !organization || !message) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  // Create a transporter using SMTP
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  // Email content
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: 'ranaareeb1029@gmail.com',
    subject: `New Partnership Request from ${organization}`,
    html: `
      <h2>New Partnership Request</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Organization:</strong> ${organization}</p>
      <p><strong>Message:</strong></p>
      <p>${message}</p>
    `,
  };

  try {
    // Send email
    await transporter.sendMail(mailOptions);

    // Send confirmation email to the sender
    const confirmationMailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Partnership Request Received - EFG Games',
      html: `
        <h2>Thank you for your partnership request!</h2>
        <p>Dear ${name},</p>
        <p>We have received your partnership request and will review it shortly. We will get back to you as soon as possible.</p>
        <p>Best regards,<br>EFG Games Team</p>
      `,
    };

    await transporter.sendMail(confirmationMailOptions);

    return res.status(200).json({ message: 'Partnership request sent successfully' });
  } catch (error) {
    console.error('Email error:', error);
    return res.status(500).json({ message: 'Failed to send partnership request. Please try again later.' });
  }
} 