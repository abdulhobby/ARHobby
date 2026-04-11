// emailService.js
import SibApiV3Sdk from 'sib-api-v3-sdk';
import dotenv from 'dotenv';

dotenv.config();

console.log('Brevo API Key status:', process.env.BREVO_API_KEY ? '✅ Set' : '❌ Missing');

// Configure Brevo API
const defaultClient = SibApiV3Sdk.ApiClient.instance;
const apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = process.env.BREVO_API_KEY;

const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

console.log('✅ Brevo API configured successfully');

class EmailService {
  constructor() {
    this.sender = {
      email: process.env.BREVO_FROM_EMAIL || 'noreply@yourdomain.com',
      name: process.env.BREVO_FROM_NAME || 'Your Store'
    };
    this.apiInstance = apiInstance;
    this.brandColor = '#10b981'; // Emerald Green
    this.accentColor = '#1f2937'; // Dark Gray
    this.lightBg = '#f0fdf4'; // Light Green
    // Store payment details from environment variables
    this.upiId = process.env.STORE_UPI || '6388870150@ptyes';
    this.phoneNumber = process.env.STORE_PHONE || '6388870150';
    this.whatsappNumber = process.env.STORE_WHATSAPP || '7081434589';
  }

  async sendEmail({ to, subject, html, attachment = [] }) {
    try {
      const email = new SibApiV3Sdk.SendSmtpEmail();
      email.sender = this.sender;
      email.to = [{ email: to.email, name: to.name || "User" }];
      email.subject = subject;
      email.htmlContent = html;

      if (attachment.length > 0) {
        email.attachment = attachment;
      }

      const response = await this.apiInstance.sendTransacEmail(email);
      console.log("✅ Email sent:", response.messageId || "Success");
      return response;
    } catch (error) {
      console.error("❌ FULL BREVO ERROR:", error.response?.body || error.message);
      throw error;
    }
  }

  getBaseTemplate(content) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Email</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #1f2937;
            background: linear-gradient(135deg, #f0fdf4 0%, #f3f4f6 100%);
            padding: 20px;
          }
          .email-container {
            max-width: 600px;
            margin: 0 auto;
            background: white;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 10px 40px rgba(16, 185, 129, 0.1);
          }
          .email-header {
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
            color: white;
            padding: 40px 30px;
            text-align: center;
            position: relative;
            overflow: hidden;
          }
          .email-header::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120"><path d="M0,50 Q300,0 600,50 T1200,50 L1200,120 L0,120 Z" fill="rgba(255,255,255,0.1)"/></svg>');
            background-size: cover;
            pointer-events: none;
          }
          .email-header-content { position: relative; z-index: 1; }
          .email-header h1 {
            font-size: 32px;
            margin-bottom: 10px;
            font-weight: 700;
            letter-spacing: -0.5px;
          }
          .email-header p {
            font-size: 16px;
            opacity: 0.95;
            font-weight: 300;
          }
          .email-body {
            padding: 40px 30px;
          }
          .email-footer {
            background: linear-gradient(135deg, #1f2937 0%, #111827 100%);
            color: white;
            padding: 30px;
            text-align: center;
            font-size: 13px;
            border-top: 3px solid #10b981;
          }
          .email-footer a {
            color: #10b981;
            text-decoration: none;
            font-weight: 600;
          }
          .email-footer a:hover {
            text-decoration: underline;
          }
          .section-title {
            color: #10b981;
            font-size: 20px;
            font-weight: 700;
            margin-bottom: 20px;
            padding-bottom: 10px;
            border-bottom: 2px solid #10b981;
            display: inline-block;
          }
          .info-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            margin: 20px 0;
          }
          .info-card {
            background: linear-gradient(135deg, #f0fdf4 0%, #f3f4f6 100%);
            padding: 15px;
            border-radius: 8px;
            border-left: 4px solid #10b981;
          }
          .info-card strong {
            color: #1f2937;
            display: block;
            margin-bottom: 5px;
            font-size: 14px;
          }
          .info-card span {
            color: #10b981;
            font-size: 16px;
            font-weight: 600;
          }
          .btn {
            display: inline-block;
            padding: 14px 32px;
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
            color: white;
            text-decoration: none;
            border-radius: 8px;
            font-weight: 600;
            font-size: 16px;
            transition: all 0.3s ease;
            box-shadow: 0 4px 15px rgba(16, 185, 129, 0.3);
            border: none;
            cursor: pointer;
          }
          .btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(16, 185, 129, 0.4);
          }
          .btn-secondary {
            background: linear-gradient(135deg, #1f2937 0%, #111827 100%);
            box-shadow: 0 4px 15px rgba(31, 41, 55, 0.3);
          }
          .btn-secondary:hover {
            box-shadow: 0 6px 20px rgba(31, 41, 55, 0.4);
          }
          .btn-group {
            text-align: center;
            margin: 30px 0;
          }
          .table-container {
            overflow-x: auto;
            margin: 20px 0;
          }
          table {
            width: 100%;
            border-collapse: collapse;
          }
          table th {
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
            color: white;
            padding: 15px;
            text-align: left;
            font-weight: 600;
          }
          table td {
            padding: 12px 15px;
            border-bottom: 1px solid #e5e7eb;
          }
          table tr:last-child td {
            border-bottom: none;
          }
          table tr:hover {
            background: #f0fdf4;
          }
          .highlight-box {
            background: linear-gradient(135deg, #dcfce7 0%, #ccfbf1 100%);
            border: 2px solid #10b981;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
          }
          .highlight-box h3 {
            color: #10b981;
            margin-bottom: 10px;
          }
          .warning-box {
            background: linear-gradient(135deg, #fef3c7 0%, #fecaca 100%);
            border: 2px solid #f59e0b;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
          }
          .warning-box h3 {
            color: #d97706;
            margin-bottom: 10px;
          }
          .list-item {
            margin: 12px 0;
            padding-left: 25px;
            position: relative;
          }
          .list-item::before {
            content: '✓';
            position: absolute;
            left: 0;
            color: #10b981;
            font-weight: bold;
            font-size: 18px;
          }
          .divider {
            border: none;
            border-top: 2px dashed #e5e7eb;
            margin: 30px 0;
          }
          .text-center { text-align: center; }
          .text-muted { color: #6b7280; }
          .mt-20 { margin-top: 20px; }
          .mb-20 { margin-bottom: 20px; }
          .payment-card {
            background: white;
            padding: 20px;
            border-radius: 12px;
            margin: 15px 0;
            border: 2px solid #e5e7eb;
            transition: all 0.3s ease;
          }
          .payment-card:hover {
            border-color: #10b981;
            box-shadow: 0 4px 12px rgba(16, 185, 129, 0.1);
          }
          .payment-label {
            display: inline-block;
            background: #10b981;
            color: white;
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 600;
            margin-bottom: 12px;
          }
          .payment-value {
            font-size: 20px;
            font-weight: 700;
            color: #1f2937;
            font-family: monospace;
            letter-spacing: 1px;
            background: #f3f4f6;
            padding: 12px;
            border-radius: 8px;
            display: inline-block;
            margin-top: 8px;
          }
          @media only screen and (max-width: 600px) {
            .email-header { padding: 30px 20px; }
            .email-header h1 { font-size: 24px; }
            .email-body { padding: 20px; }
            .info-grid { grid-template-columns: 1fr; }
            table { font-size: 14px; }
            table th, table td { padding: 10px; }
          }
        </style>
      </head>
      <body>
        <div class="email-container">
          ${content}
        </div>
      </body>
      </html>
    `;
  }

  async sendOrderConfirmation(order, user, invoiceBuffer) {
    const attachments = [];
    if (invoiceBuffer) {
      attachments.push({
        content: invoiceBuffer.toString('base64'),
        name: `Invoice-${order.orderNumber}.pdf`,
        type: 'application/pdf'
      });
    }

    return this.sendEmail({
      to: { email: user.email, name: user.name },
      subject: `🎉 Order Confirmed - ${order.orderNumber}`,
      html: this.getOrderConfirmationHTML(order, user),
      attachment: attachments
    });
  }

  async sendPasswordResetEmail(user, resetUrl) {
    return this.sendEmail({
      to: { email: user.email, name: user.name },
      subject: "🔐 Password Reset Request",
      html: this.getPasswordResetHTML(user, resetUrl)
    });
  }

  async sendOrderStatusUpdate(order, user) {
    return this.sendEmail({
      to: { email: user.email, name: user.name },
      subject: `📦 Order ${order.orderStatus} - ${order.orderNumber}`,
      html: this.getOrderStatusUpdateHTML(order, user)
    });
  }

  async sendWelcomeEmail(user) {
    return this.sendEmail({
      to: { email: user.email, name: user.name },
      subject: "👋 Welcome to AR Hobby!",
      html: this.getWelcomeHTML(user)
    });
  }

  async sendContactFormEmail(contactData) {
    return this.sendEmail({
      to: { email: process.env.BREVO_FROM_EMAIL },
      subject: `📧 New Contact Form - ${contactData.name}`,
      html: this.getContactFormHTML(contactData)
    });
  }

  async sendCampaignEmail(subscriber, campaign, products) {
    try {
      if (!subscriber || !subscriber.email) {
        throw new Error('Invalid subscriber data: email is required');
      }
      if (!campaign) {
        throw new Error('Invalid campaign data');
      }
      if (!this.apiInstance) {
        throw new Error('Brevo API not initialized');
      }

      console.log(`📧 Preparing to send email to: ${subscriber.email}`);
      console.log(`📧 Campaign subject: ${campaign.subject}`);

      const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
      sendSmtpEmail.sender = this.sender;
      sendSmtpEmail.to = [{ email: subscriber.email, name: subscriber.name || 'Valued Customer' }];
      sendSmtpEmail.subject = campaign.subject;
      sendSmtpEmail.htmlContent = this.getCampaignHTML(subscriber, campaign, products || []);

      const response = await this.apiInstance.sendTransacEmail(sendSmtpEmail);
      console.log(`✅ Campaign email sent successfully to: ${subscriber.email}`);
      return response;
    } catch (error) {
      console.error('❌ Campaign email error:', error.message || error);
      throw error;
    }
  }

  getOrderConfirmationHTML(order, user) {
    const itemsHTML = order.items
      .map(
        (item) =>
          `<tr>
             <td><strong>${item.name}</strong></td>
            <td style="text-align: center;">${item.quantity}</td>
            <td style="text-align: right;">Rs. ${item.price}</td>
            <td style="text-align: right;"><strong>Rs. ${item.price * item.quantity}</strong></td>
           </tr>`
      )
      .join('');

    const content = `
      <div class="email-header">
        <div class="email-header-content">
          <h1>🎉 Order Confirmed!</h1>
          <p>Thank you for your purchase</p>
        </div>
      </div>

      <div class="email-body">
        <p>Dear <strong>${user.name}</strong>,</p>
        <p>We're excited to process your order! Your items are being carefully prepared for shipment.</p>

        <div style="background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%); padding: 20px; border-radius: 8px; margin: 25px 0;">
          <div class="info-grid">
            <div class="info-card">
              <strong>Order Number</strong>
              <span style="font-size: 20px;">#${order.orderNumber}</span>
            </div>
            <div class="info-card">
              <strong>Order Date</strong>
              <span style="font-size: 16px;">${new Date(order.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
            </div>
            <div class="info-card">
              <strong>Status</strong>
              <span style="font-size: 16px; background: #10b981; color: white; padding: 4px 8px; border-radius: 4px; display: inline-block;">✓ ${order.orderStatus}</span>
            </div>
            <div class="info-card">
              <strong>Estimated Delivery</strong>
              <span style="font-size: 16px;">5-7 Business Days</span>
            </div>
          </div>
        </div>

        <h2 class="section-title">📦 Order Items</h2>
        <div class="table-container">
          <table>
            <thead>
              <tr>
                <th>Item</th>
                <th style="text-align: center;">Qty</th>
                <th style="text-align: right;">Price</th>
                <th style="text-align: right;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHTML}
            </tbody>
          </table>
        </div>

        <div style="background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%); padding: 20px; border-radius: 8px; margin: 20px 0;">
          <div style="display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #d1d5db;">
            <span>Subtotal</span>
            <strong>Rs. ${order.subtotal}</strong>
          </div>
          ${order.discount > 0 ? `
            <div style="display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #d1d5db; color: #10b981;">
              <span>Discount</span>
              <strong>-Rs. ${order.discount}</strong>
            </div>
          ` : ''}
          <div style="display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #d1d5db;">
            <span>Shipping Charge</span>
            <strong>Rs. ${order.shippingCharge}</strong>
          </div>
          <div style="display: flex; justify-content: space-between; padding: 15px 0; font-size: 18px;">
            <span style="color: #10b981; font-weight: 700;">Total Amount</span>
            <strong style="color: #10b981;">Rs. ${order.totalAmount}</strong>
          </div>
        </div>

        <div class="highlight-box">
          <h3>💳 Complete Your Payment</h3>
          <p style="margin: 10px 0;">Please complete the payment using UPI or Mobile number:</p>
          
          <!-- UPI Payment Section -->
          <div class="payment-card">
            <div class="payment-label">📱 UPI ID</div>
            <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px;">
              <code class="payment-value" style="font-size: 18px;">${this.upiId}</code>
              <span style="background: #f3f4f6; padding: 8px 12px; border-radius: 6px; font-size: 12px; color: #6b7280;">Copy to pay</span>
            </div>
            <p style="margin-top: 12px; font-size: 13px; color: #6b7280;">Use this UPI ID in any UPI app (Google Pay, PhonePe, Paytm)</p>
          </div>

          <!-- Mobile Number Section -->
          <div class="payment-card">
            <div class="payment-label">📞 Mobile Number</div>
            <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px;">
              <span class="payment-value" style="font-size: 18px;">${this.phoneNumber}</span>
              <span style="background: #f3f4f6; padding: 8px 12px; border-radius: 6px; font-size: 12px; color: #6b7280;">GPay | PhonePe | Paytm</span>
            </div>
            <p style="margin-top: 12px; font-size: 13px; color: #6b7280;">Send payment directly to this number using any UPI app</p>
          </div>

          <div style="margin-top: 20px; padding: 15px; background: #f0fdf4; border-radius: 8px; border-left: 3px solid #25D366;">
            <p style="margin: 0; font-size: 14px;">
              <strong>✅ After payment:</strong> Please share the payment screenshot on WhatsApp to: 
              <strong style="color: #25D366;">${this.whatsappNumber}</strong>
            </p>
          </div>
        </div>

        <div class="btn-group">
          <a href="${process.env.FRONTEND_URL || 'https://currencycorner.com'}/orders/${order._id}" class="btn">View Order Details</a>
          <a href="${process.env.FRONTEND_URL || 'https://currencycorner.com'}/shop" class="btn btn-secondary" style="margin-left: 10px;">Continue Shopping</a>
        </div>

        <hr class="divider">

        <p style="color: #6b7280; font-size: 14px;">
          Questions? Reach out to us on WhatsApp: <strong>${this.whatsappNumber}</strong> or Email: <strong>${process.env.STORE_EMAIL}</strong>
        </p>
      </div>

      <div class="email-footer">
        <p>© 2024 AR Hobby. All rights reserved.</p>
        <p style="margin-top: 10px; font-size: 12px;">${process.env.STORE_ADDRESS || ''}</p>
      </div>
    `;

    return this.getBaseTemplate(content);
  }

  getPasswordResetHTML(user, resetUrl) {
    const content = `
      <div class="email-header">
        <div class="email-header-content">
          <h1>🔐 Password Reset</h1>
          <p>Secure your account now</p>
        </div>
      </div>

      <div class="email-body">
        <p>Hello <strong>${user.name}</strong>,</p>
        <p>We received a request to reset your password. Click the button below to create a new password:</p>

        <div class="btn-group">
          <a href="${resetUrl}" class="btn">Reset Password</a>
        </div>

        <div class="warning-box">
          <h3>⚠️ Important Security Information</h3>
          <ul style="margin: 0; padding-left: 20px;">
            <li class="list-item">This link expires in <strong>30 minutes</strong></li>
            <li class="list-item">Can only be used <strong>once</strong></li>
            <li class="list-item">Never share this link with anyone</li>
            <li class="list-item">If you didn't request this, ignore this email</li>
          </ul>
        </div>

        <p style="color: #6b7280; font-size: 13px; margin-top: 20px;">
          If the button doesn't work, copy and paste this link:<br>
          <code style="background: #f3f4f6; padding: 8px 12px; border-radius: 4px; display: block; margin-top: 10px; word-break: break-all; font-size: 12px;">${resetUrl}</code>
        </p>
      </div>

      <div class="email-footer">
        <p>© 2024 AR Hobby. All rights reserved.</p>
      </div>
    `;

    return this.getBaseTemplate(content);
  }

  getOrderStatusUpdateHTML(order, user) {
    const statusEmojis = {
      'Placed': '📋',
      'Confirmed': '✅',
      'Processing': '⚙️',
      'Shipped': '🚚',
      'Delivered': '📦',
      'Cancelled': '❌'
    };

    const content = `
      <div class="email-header">
        <div class="email-header-content">
          <h1>📦 Order Update</h1>
          <p>Your order is on its way</p>
        </div>
      </div>

      <div class="email-body">
        <p>Hello <strong>${user.name}</strong>,</p>
        <p>Great news! Here's an update on your order:</p>

        <div style="background: linear-gradient(135deg, #dcfce7 0%, #ccfbf1 100%); padding: 25px; border-radius: 8px; margin: 25px 0; border: 2px solid #10b981;">
          <div style="display: flex; align-items: center; gap: 15px; margin-bottom: 15px;">
            <span style="font-size: 40px;">${statusEmojis[order.orderStatus] || '📦'}</span>
            <div>
              <p style="margin: 0; color: #6b7280; font-size: 14px;">Order Status</p>
              <h2 style="margin: 0; color: #10b981; font-size: 24px;">${order.orderStatus}</h2>
            </div>
          </div>
          <p style="margin: 15px 0 0 0; padding-top: 15px; border-top: 1px solid #10b981;">
            <strong>Order Number:</strong> #${order.orderNumber}
          </p>
        </div>

        ${order.trackingNumber ? `
          <div class="highlight-box">
            <h3>📍 Tracking Information</h3>
            <p style="margin: 10px 0;">Your shipment is on the way! Track it in real-time:</p>
            <p style="background: white; padding: 12px; border-radius: 6px; margin: 10px 0;">
              <strong>Tracking Number:</strong><br>
              <code style="background: #f3f4f6; padding: 6px 10px; border-radius: 4px; display: block; margin-top: 5px; font-weight: 600;">${order.trackingNumber}</code>
            </p>
            <a href="https://www.indiapost.gov.in/_layouts/15/DOP.Portal.Tracking/TrackConsignment.aspx" class="btn" style="margin-top: 10px;">Track Your Package</a>
          </div>
        ` : ''}

        <div class="btn-group">
          <a href="${process.env.FRONTEND_URL || 'https://currencycorner.com'}/orders/${order._id}" class="btn">View Full Order</a>
        </div>

        <p style="color: #6b7280; font-size: 14px; margin-top: 20px;">
          Questions? Contact us on WhatsApp: <strong>${this.whatsappNumber}</strong>
        </p>
      </div>

      <div class="email-footer">
        <p>© 2024 AR Hobby. All rights reserved.</p>
      </div>
    `;

    return this.getBaseTemplate(content);
  }

  getWelcomeHTML(user) {
    const content = `
      <div class="email-header">
        <div class="email-header-content">
          <h1>👋 Welcome Aboard!</h1>
          <p>Glad to have you join our community</p>
        </div>
      </div>

      <div class="email-body">
        <p>Hi <strong>${user.name}</strong>,</p>
        <p>Your account is all set up and ready to go! We're thrilled to welcome you to AR Hobby.</p>

        <div class="highlight-box">
          <h3>🎁 What You Can Do Now</h3>
          <div style="margin-top: 15px;">
            <div class="list-item">Explore our curated collection of currencies and collectibles</div>
            <div class="list-item">Get exclusive access to member-only deals and discounts</div>
            <div class="list-item">Track your orders in real-time from your dashboard</div>
            <div class="list-item">Subscribe to our newsletter for latest updates</div>
            <div class="list-item">Enjoy priority customer support</div>
          </div>
        </div>

        <div class="info-grid" style="margin: 25px 0;">
          <div style="background: linear-gradient(135deg, #f0fdf4 0%, #e0f2fe 100%); padding: 20px; border-radius: 8px; border-left: 3px solid #10b981;">
            <h3 style="color: #10b981; margin-bottom: 10px;">🏆 First Purchase Deal</h3>
            <p style="margin: 0; font-size: 14px;">Use code <strong>WELCOME10</strong> for <strong>10% off</strong> your first order!</p>
          </div>
          <div style="background: linear-gradient(135deg, #fef3c7 0%, #fed7aa 100%); padding: 20px; border-radius: 8px; border-left: 3px solid #f59e0b;">
            <h3 style="color: #d97706; margin-bottom: 10px;">📱 Need Help?</h3>
            <p style="margin: 0; font-size: 14px;">WhatsApp: <strong>${this.whatsappNumber}</strong></p>
          </div>
        </div>

        <div class="btn-group">
          <a href="${process.env.FRONTEND_URL || 'https://currencycorner.com'}/shop" class="btn">Start Shopping</a>
          <a href="${process.env.FRONTEND_URL || 'https://currencycorner.com'}/account" class="btn btn-secondary" style="margin-left: 10px;">View Profile</a>
        </div>

        <p style="color: #6b7280; font-size: 14px; margin-top: 20px;">
          Welcome gift valid for 7 days on first purchase. Some restrictions may apply.
        </p>
      </div>

      <div class="email-footer">
        <p>© 2024 AR Hobby. All rights reserved.</p>
        <p style="margin-top: 10px; font-size: 12px;">${process.env.STORE_ADDRESS || ''}</p>
      </div>
    `;

    return this.getBaseTemplate(content);
  }

  getContactFormHTML(contactData) {
    const content = `
      <div class="email-header">
        <div class="email-header-content">
          <h1>📧 New Contact Request</h1>
          <p>Someone reached out to you</p>
        </div>
      </div>

      <div class="email-body">
        <p>You have received a new contact form submission:</p>

        <div style="background: linear-gradient(135deg, #f0fdf4 0%, #f3f4f6 100%); padding: 20px; border-radius: 8px; margin: 20px 0;">
          <div class="info-grid">
            <div class="info-card">
              <strong>Name</strong>
              <span>${contactData.name}</span>
            </div>
            <div class="info-card">
              <strong>Email</strong>
              <span style="word-break: break-all;">${contactData.email}</span>
            </div>
            <div class="info-card">
              <strong>Phone</strong>
              <span>${contactData.phone || 'Not provided'}</span>
            </div>
            <div class="info-card">
              <strong>Subject</strong>
              <span>${contactData.subject || 'General'}</span>
            </div>
          </div>
        </div>

        <h3 class="section-title">💬 Message</h3>
        <div style="background: #f9fafb; padding: 20px; border-radius: 8px; border-left: 3px solid #10b981; margin: 20px 0;">
          <p style="margin: 0; white-space: pre-wrap; line-height: 1.8;">${contactData.message}</p>
        </div>

        <div class="btn-group">
          <a href="mailto:${contactData.email}" class="btn">Reply via Email</a>
        </div>

        <p style="color: #6b7280; font-size: 12px; margin-top: 20px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
          This is a forwarded contact form submission from your website.
        </p>
      </div>

      <div class="email-footer">
        <p>© 2024 AR Hobby. All rights reserved.</p>
      </div>
    `;

    return this.getBaseTemplate(content);
  }

  getCampaignHTML(subscriber, campaign, products) {
    const productList = Array.isArray(products) ? products : [];
    
    const productsHTML = productList.slice(0, 6).map(product => `
      <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/product/${product._id}" style="text-decoration: none; color: inherit;">
        <div style="background: white; padding: 16px; border-radius: 10px; margin-bottom: 16px; border: 2px solid #e5e7eb; transition: all 0.3s ease; overflow: hidden;">
          <div style="height: 200px; background: #f3f4f6; border-radius: 8px; margin-bottom: 12px; overflow: hidden;">
            ${product.images && product.images.length > 0 && product.images[0].url 
              ? `<img src="${product.images[0].url}" style="width: 100%; height: 100%; object-fit: cover;" />` 
              : '<div style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; background: #e5e7eb; color: #9ca3af;">No Image</div>'}
          </div>
          <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: 700; color: #1f2937;">${this.escapeHtml(product.name || 'Product')}</h3>
          <p style="margin: 0 0 12px 0; color: #6b7280; font-size: 13px; line-height: 1.5;">${this.escapeHtml((product.description || '').substring(0, 80))}...</p>
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <span style="font-size: 20px; font-weight: 700; color: #10b981;">Rs. ${product.price || 0}</span>
            <span style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 8px 14px; border-radius: 6px; font-weight: 600; font-size: 13px;">View →</span>
          </div>
        </div>
      </a>
    `).join('');

    const unsubscribeLink = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/unsubscribe?email=${encodeURIComponent(subscriber.email)}`;
    const preferencesLink = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/newsletter-preferences?email=${encodeURIComponent(subscriber.email)}`;

    const content = `
      <div class="email-header">
        <div class="email-header-content">
          <h1>${this.escapeHtml(campaign.title)}</h1>
          <p>${this.escapeHtml(campaign.description)}</p>
        </div>
      </div>

      ${campaign.bannerImage && campaign.bannerImage.url ? `
        <div style="margin: 0; overflow: hidden;">
          <img src="${campaign.bannerImage.url}" style="width: 100%; height: auto; display: block;" alt="Campaign Banner" />
        </div>
      ` : ''}

      <div class="email-body">
        <h2 class="section-title">✨ Featured Products</h2>
        
        <div style="display: grid; gap: 8px;">
          ${productsHTML || '<p style="text-align: center; color: #9ca3af; padding: 20px;">No featured products available</p>'}
        </div>

        <div class="btn-group">
          <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/shop" class="btn">Shop All Products</a>
        </div>

        <hr class="divider">

        <div style="background: linear-gradient(135deg, #f0fdf4 0%, #f3f4f6 100%); padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #10b981; margin-bottom: 15px;">🎯 Why Choose Us?</h3>
          <div class="list-item">Authentic and verified currency collections</div>
          <div class="list-item">Competitive pricing with transparent information</div>
          <div class="list-item">Fast and secure delivery</div>
          <div class="list-item">Expert customer support</div>
        </div>
      </div>

      <div class="email-footer">
        <p>Visit our website for more products!</p>
        <p style="margin: 10px 0 0 0;">&copy; ${new Date().getFullYear()} AR Hobby. All rights reserved.</p>
      </div>
    `;

    return this.getBaseTemplate(content);
  }

  escapeHtml(text) {
    if (!text) return '';
    return String(text)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }
}

export default new EmailService();