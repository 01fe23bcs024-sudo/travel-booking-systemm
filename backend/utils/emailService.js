import nodemailer from 'nodemailer';

// Create transporter (configure with your email service)
const createTransporter = () => {
  if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST || 'smtp.gmail.com',
      port: process.env.EMAIL_PORT || 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
  }
  
  // If no email config, create a test account (for development)
  console.warn('⚠️  Email not configured. Using console output for emails.');
  return null;
};

export const sendBookingConfirmation = async (booking, user, flight = null, hotel = null) => {
  try {
    const transporter = createTransporter();
    
    if (!transporter) {
      // Console output for development
      console.log('\n📧 BOOKING CONFIRMATION EMAIL');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log(`To: ${user.email}`);
      console.log(`Subject: Booking Confirmation - ${booking.bookingNumber}`);
      console.log(`\nDear ${user.name},\n`);
      console.log(`Your booking has been confirmed!\n`);
      console.log(`Booking Number: ${booking.bookingNumber}`);
      console.log(`Booking Type: ${booking.bookingType}`);
      if (flight) {
        console.log(`Flight: ${flight.flightNumber} from ${flight.source} to ${flight.destination}`);
      }
      if (hotel) {
        console.log(`Hotel: ${hotel.name} in ${hotel.city}`);
      }
      console.log(`Total Amount: $${booking.totalAmount}`);
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
      return { success: true, message: 'Email logged to console (not configured)' };
    }

    const bookingDetails = booking.bookingType === 'flight' && flight
      ? `
        <h3>Flight Details</h3>
        <p><strong>Flight Number:</strong> ${flight.flightNumber}</p>
        <p><strong>Airline:</strong> ${flight.airline}</p>
        <p><strong>Route:</strong> ${flight.source} → ${flight.destination}</p>
        <p><strong>Departure:</strong> ${new Date(flight.departureTime).toLocaleString()}</p>
        <p><strong>Arrival:</strong> ${new Date(flight.arrivalTime).toLocaleString()}</p>
        <p><strong>Class:</strong> ${booking.flightClass}</p>
        <p><strong>Seats:</strong> ${booking.seatNumbers.join(', ')}</p>
      `
      : booking.bookingType === 'hotel' && hotel
      ? `
        <h3>Hotel Details</h3>
        <p><strong>Hotel:</strong> ${hotel.name}</p>
        <p><strong>Address:</strong> ${hotel.address}, ${hotel.city}</p>
        <p><strong>Check-in:</strong> ${new Date(booking.checkIn).toLocaleDateString()}</p>
        <p><strong>Check-out:</strong> ${new Date(booking.checkOut).toLocaleDateString()}</p>
        <p><strong>Room Type:</strong> ${booking.roomType}</p>
        <p><strong>Rooms:</strong> ${booking.roomNumbers.join(', ')}</p>
      `
      : '';

    const mailOptions = {
      from: `"Travel Booking System" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: `Booking Confirmation - ${booking.bookingNumber}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #4CAF50; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background-color: #f9f9f9; }
            .details { background-color: white; padding: 15px; margin: 10px 0; border-radius: 5px; }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Booking Confirmed!</h1>
            </div>
            <div class="content">
              <p>Dear ${user.name},</p>
              <p>Your booking has been successfully confirmed.</p>
              
              <div class="details">
                <h2>Booking Information</h2>
                <p><strong>Booking Number:</strong> ${booking.bookingNumber}</p>
                <p><strong>Booking Date:</strong> ${new Date(booking.createdAt).toLocaleString()}</p>
                <p><strong>Status:</strong> ${booking.bookingStatus.toUpperCase()}</p>
                ${bookingDetails}
                <p><strong>Total Amount:</strong> $${booking.totalAmount.toFixed(2)}</p>
                <p><strong>Payment Status:</strong> ${booking.paymentStatus.toUpperCase()}</p>
              </div>
              
              <p>Thank you for choosing our travel booking service!</p>
              <p>If you have any questions, please contact our support team.</p>
            </div>
            <div class="footer">
              <p>This is an automated email. Please do not reply.</p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    await transporter.sendMail(mailOptions);
    return { success: true, message: 'Confirmation email sent successfully' };
  } catch (error) {
    console.error('Email sending error:', error);
    return { success: false, message: error.message };
  }
};


