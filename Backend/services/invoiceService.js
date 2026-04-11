import PDFDocument from 'pdfkit';
import { Readable } from 'stream';
import cloudinary from '../config/cloudinary.js';

class InvoiceService {
  async generateInvoice(order, user) {
    return new Promise((resolve, reject) => {
      try {
        const doc = new PDFDocument({ margin: 50, size: 'A4' });
        const buffers = [];

        doc.on('data', (chunk) => buffers.push(chunk));
        doc.on('end', () => resolve(Buffer.concat(buffers)));
        doc.on('error', (err) => reject(err));

        // Header
        doc.fontSize(20).text('AR Hobby', { align: 'center' });
        doc.fontSize(10).text('Collectible Currencies & Coins', { align: 'center' });
        doc.moveDown(0.5);
        doc.fontSize(8).text(process.env.STORE_ADDRESS || '', { align: 'center' });
        doc.text(`Email: ${process.env.STORE_EMAIL || ''} | Phone: ${process.env.STORE_PHONE || '6388870150'}`, { align: 'center' });
        doc.moveDown();
        doc.moveTo(50, doc.y).lineTo(545, doc.y).stroke();
        doc.moveDown();
        
        // Invoice Title
        doc.fontSize(16).text('INVOICE', { align: 'center' });
        doc.moveDown();

        // Invoice Details
        doc.fontSize(10);
        doc.text(`Invoice No: ${order.orderNumber || 'N/A'}`);
        doc.text(`Date: ${new Date(order.createdAt).toLocaleDateString('en-IN')}`);
        doc.text(`Order Status: ${order.orderStatus || 'Pending'}`);
        doc.text(`Payment Status: ${order.paymentStatus || 'Pending'}`);
        doc.moveDown();

        // Shipping Address
        doc.fontSize(12).text('Ship To:', { underline: true });
        doc.fontSize(10);
        doc.text(order.shippingAddress?.fullName || '');
        doc.text(order.shippingAddress?.addressLine1 || '');
        if (order.shippingAddress?.addressLine2) doc.text(order.shippingAddress.addressLine2);
        doc.text(`${order.shippingAddress?.city || ''}, ${order.shippingAddress?.state || ''} - ${order.shippingAddress?.pincode || ''}`);
        doc.text(`Phone: ${order.shippingAddress?.phone || ''}`);
        doc.moveDown();
        doc.moveTo(50, doc.y).lineTo(545, doc.y).stroke();
        doc.moveDown(0.5);

        // Order Items Table Header
        const tableTop = doc.y;
        doc.fontSize(9).font('Helvetica-Bold');
        doc.text('#', 50, tableTop);
        doc.text('Item', 70, tableTop);
        doc.text('Qty', 340, tableTop);
        doc.text('Price', 400, tableTop);
        doc.text('Total', 480, tableTop);
        doc.moveTo(50, tableTop + 15).lineTo(545, tableTop + 15).stroke();
        doc.font('Helvetica');

        // Order Items
        let y = tableTop + 25;
        if (order.items && order.items.length > 0) {
          order.items.forEach((item, index) => {
            if (y > 700) { 
              doc.addPage(); 
              y = 50; 
            }
            doc.fontSize(9);
            doc.text(String(index + 1), 50, y);
            doc.text((item.name || '').substring(0, 45), 70, y, { width: 260 });
            doc.text(String(item.quantity || 0), 340, y);
            doc.text(`Rs.${item.price || 0}`, 400, y);
            doc.text(`Rs.${(item.price || 0) * (item.quantity || 0)}`, 480, y);
            y += 20;
          });
        }

        // Totals
        doc.moveTo(50, y).lineTo(545, y).stroke();
        y += 15;
        doc.fontSize(10);
        doc.text('Subtotal:', 400, y); 
        doc.text(`Rs.${order.subtotal || 0}`, 480, y); 
        y += 15;
        
        if (order.discount > 0) { 
          doc.text('Discount:', 400, y); 
          doc.text(`-Rs.${order.discount}`, 480, y); 
          y += 15; 
        }
        
        doc.text('Shipping:', 400, y); 
        doc.text(order.shippingCharge === 0 ? 'Free' : `Rs.${order.shippingCharge || 0}`, 480, y); 
        y += 15;
        
        doc.font('Helvetica-Bold');
        doc.text('Total:', 400, y); 
        doc.text(`Rs.${order.totalAmount || 0}`, 480, y);
        y += 30;

        // Payment Instructions Section
        doc.font('Helvetica');
        doc.moveTo(50, y).lineTo(545, y).stroke();
        y += 15;
        
        if (y > 680) { 
          doc.addPage(); 
          y = 50; 
        }

        // Payment Header
        doc.fontSize(11).font('Helvetica-Bold').text('Payment Instructions:', 50, y);
        y += 15;
        
        // UPI Payment Details
        doc.fontSize(10).font('Helvetica-Bold').fillColor('#10b981').text('📱 UPI Payment:', 50, y);
        y += 15;
        doc.fontSize(9).font('Helvetica').fillColor('#1f2937');
        doc.text(`UPI ID: ${process.env.STORE_UPI || '6388870150@ptyes'}`, 50, y);
        y += 12;
        doc.text(`Mobile Number: ${process.env.STORE_PHONE || '6388870150'} (Google Pay / PhonePe / Paytm)`, 50, y);
        y += 20;
        
        // WhatsApp Instructions
        doc.fontSize(10).font('Helvetica-Bold').fillColor('#25D366').text('📱 After Payment:', 50, y);
        y += 15;
        doc.fontSize(9).font('Helvetica').fillColor('#1f2937');
        doc.text(`Please send the payment screenshot on WhatsApp: ${process.env.STORE_WHATSAPP || '6388870150'}`, 50, y);
        y += 12;
        doc.text(`Your order will be processed within 24 hours after payment verification.`, 50, y);
        y += 20;
        
        // Notes Section
        doc.fontSize(8).fillColor('#6b7280');
        doc.text('Note: Please use your order number as reference when sending payment screenshot.', 50, y, { align: 'center', width: 495 });
        y += 15;
        
        // Footer
        doc.fontSize(9).fillColor('#1f2937');
        doc.text('Thank you for shopping with AR Hobby!', 50, y + 10, { align: 'center', width: 495 });
        
        // Add QR Code Box (Optional)
        y += 30;
        if (y < 750) {
          doc.rect(50, y, 495, 80).stroke();
          doc.fontSize(8).fillColor('#6b7280').text('Scan QR code to pay:', 60, y + 5);
          
          // Draw a placeholder QR code box
          doc.rect(420, y + 5, 60, 60).stroke();
          doc.fontSize(7).text('QR Code', 435, y + 30, { align: 'center' });
          doc.text('Space', 445, y + 40, { align: 'center' });
        }
        
        doc.end();
      } catch (err) {
        reject(err);
      }
    });
  }

  async uploadInvoiceToCloudinary(pdfBuffer, orderNumber) {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          resource_type: 'raw',
          folder: 'currency-corner/invoices',
          public_id: `invoice-${orderNumber}`,
          format: 'pdf'
        },
        (error, result) => {
          if (error) reject(error);
          else resolve({ public_id: result.public_id, url: result.secure_url });
        }
      );

      const readable = new Readable();
      readable.push(pdfBuffer);
      readable.push(null);
      readable.pipe(uploadStream);
    });
  }
}

export default new InvoiceService();