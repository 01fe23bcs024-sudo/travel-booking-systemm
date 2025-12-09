import PDFDocument from 'pdfkit';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const generateBookingInvoice = (booking, user, flight = null, hotel = null) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 50 });
      const chunks = [];

      doc.on('data', chunk => chunks.push(chunk));
      doc.on('end', () => {
        const pdfBuffer = Buffer.concat(chunks);
        resolve(pdfBuffer);
      });
      doc.on('error', reject);

      // Header
      doc.fontSize(20).text('Travel Booking Invoice', { align: 'center' });
      doc.moveDown();

      // Booking Details
      doc.fontSize(14).text('Booking Details', { underline: true });
      doc.fontSize(10);
      doc.text(`Booking Number: ${booking.bookingNumber}`);
      doc.text(`Booking Date: ${new Date(booking.createdAt).toLocaleDateString()}`);
      doc.text(`Status: ${booking.bookingStatus.toUpperCase()}`);
      doc.moveDown();

      // Customer Details
      doc.fontSize(14).text('Customer Information', { underline: true });
      doc.fontSize(10);
      doc.text(`Name: ${user.name}`);
      doc.text(`Email: ${user.email}`);
      if (user.phone) doc.text(`Phone: ${user.phone}`);
      doc.moveDown();

      // Booking Type Specific Details
      if (booking.bookingType === 'flight' && flight) {
        doc.fontSize(14).text('Flight Details', { underline: true });
        doc.fontSize(10);
        doc.text(`Flight Number: ${flight.flightNumber}`);
        doc.text(`Airline: ${flight.airline}`);
        doc.text(`Route: ${flight.source} → ${flight.destination}`);
        doc.text(`Departure: ${new Date(flight.departureTime).toLocaleString()}`);
        doc.text(`Arrival: ${new Date(flight.arrivalTime).toLocaleString()}`);
        doc.text(`Class: ${booking.flightClass.toUpperCase()}`);
        doc.text(`Seats: ${booking.seatNumbers.join(', ')}`);
        if (booking.passengers && booking.passengers.length > 0) {
          doc.moveDown(0.5);
          doc.text('Passengers:');
          booking.passengers.forEach((p, i) => {
            doc.text(`  ${i + 1}. ${p.name} (Age: ${p.age})`);
          });
        }
      } else if (booking.bookingType === 'hotel' && hotel) {
        doc.fontSize(14).text('Hotel Details', { underline: true });
        doc.fontSize(10);
        doc.text(`Hotel: ${hotel.name}`);
        doc.text(`Address: ${hotel.address}, ${hotel.city}`);
        doc.text(`Check-in: ${new Date(booking.checkIn).toLocaleDateString()}`);
        doc.text(`Check-out: ${new Date(booking.checkOut).toLocaleDateString()}`);
        doc.text(`Room Type: ${booking.roomType.toUpperCase()}`);
        doc.text(`Rooms: ${booking.roomNumbers.join(', ')}`);
        doc.text(`Guests: ${booking.guests.adults} Adults, ${booking.guests.children} Children`);
      }

      doc.moveDown();

      // Payment Details
      doc.fontSize(14).text('Payment Details', { underline: true });
      doc.fontSize(10);
      doc.text(`Total Amount: $${booking.totalAmount.toFixed(2)}`);
      if (booking.commission > 0) {
        doc.text(`Commission: $${booking.commission.toFixed(2)}`);
      }
      if (booking.refundAmount > 0) {
        doc.text(`Refund Amount: $${booking.refundAmount.toFixed(2)}`);
      }
      doc.text(`Payment Status: ${booking.paymentStatus.toUpperCase()}`);
      doc.text(`Payment Method: ${booking.paymentMethod.toUpperCase()}`);
      if (booking.paymentId) {
        doc.text(`Payment ID: ${booking.paymentId}`);
      }
      doc.moveDown();

      // Footer
      doc.fontSize(8)
        .text('Thank you for choosing our travel booking service!', { align: 'center' })
        .text('This is a computer-generated invoice.', { align: 'center' });

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
};


