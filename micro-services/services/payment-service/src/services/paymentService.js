const Payment = require('../models/Payment');
const ApiError = require('../utils/ApiError');
const appointmentClient = require('./appointmentClient');
const { generateOrderId } = require('../utils/generateOrderId');
const crypto = require('crypto');

class PaymentService {
  // ─── Initiate Payment ────────────────────────────────────
  async initiatePayment(data) {
    const { appointmentId, patientId, doctorId, amount, method } = data;

    // Block duplicate paid payments
    const existingPaid = await Payment.findOne({ appointmentId, status: 'SUCCESS' });
    if (existingPaid) {
      throw new ApiError(409, 'Payment already completed for this appointment.');
    }

    const orderId = generateOrderId();

    const payment = await Payment.create({
      appointmentId,
      patientId,
      doctorId,
      orderId,
      amount,
      currency: 'LKR',
      method: method || 'CREDIT_CARD',
      status: 'PENDING'
    });

    const merchantId = process.env.PAYHERE_MERCHANT_ID || '1221190';
    const merchantSecret = process.env.PAYHERE_SECRET || '';
    const currency = 'LKR';
    const formattedAmount = parseFloat(amount).toLocaleString('en-us', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).replace(/,/g, '');
    
    // Generate PayHere Hash
    // md5sig = md5(merchant_id + order_id + payhere_amount + payhere_currency + status_code + uppercase_md5(merchant_secret)) for verification
    // For init: md5(merchant_id + order_id + amount + currency + uppercase_md5(merchant_secret))
    const hashedSecret = crypto.createHash('md5').update(merchantSecret).digest('hex').toUpperCase();
    const hash = crypto.createHash('md5')
      .update(merchantId + orderId + formattedAmount + currency + hashedSecret)
      .digest('hex').toUpperCase();

    const paymentObj = payment.toObject();
    paymentObj.payhereHash = hash;
    paymentObj.merchantId = merchantId;

    return paymentObj;
  }

  // ─── Confirm Payment (Simulated Gateway) ─────────────────
  async confirmPayment(orderId) {
    const payment = await Payment.findOne({ orderId });
    if (!payment) {
      throw new ApiError(404, 'Payment not found for this order.');
    }

    if (payment.status === 'SUCCESS') {
      throw new ApiError(409, 'Payment already confirmed.');
    }

    const transactionId = crypto.randomBytes(16).toString('hex');
    payment.status = 'SUCCESS';
    payment.transactionId = transactionId;
    payment.paidAt = new Date();
    payment.invoiceNumber = `INV-${Date.now()}`;
    await payment.save();

    // Inter-service call: update appointment to PAID + CONFIRMED
    const updated = await appointmentClient.updateAppointmentPaymentStatus(
      payment.appointmentId, 'PAID'
    );
    if (!updated) {
      console.error(`Warning: Failed to update appointment status for ${payment.appointmentId}`);
    }

    return payment;
  }

  // ─── PayHere Webhook Notify ──────────────────────────────
  async handlePayHereNotify(payload) {
    const {
      merchant_id,
      order_id,
      payhere_amount,
      payhere_currency,
      status_code,
      md5sig
    } = payload;

    const merchantSecret = process.env.PAYHERE_SECRET || '';
    const hashedSecret = crypto.createHash('md5').update(merchantSecret).digest('hex').toUpperCase();
    const localSig = crypto.createHash('md5')
      .update(merchant_id + order_id + payhere_amount + payhere_currency + status_code + hashedSecret)
      .digest('hex').toUpperCase();

    if (localSig === md5sig) {
      if (status_code === '2') {
        // Only confirm if it's not already confirmed
        const payment = await Payment.findOne({ orderId: order_id });
        if (payment && payment.status !== 'SUCCESS') {
           await this.confirmPayment(order_id);
        }
      }
      return true;
    }
    
    return false;
  }

  // ─── Get Payments (List) ─────────────────────────────────
  async getPayments(filters = {}) {
    return Payment.find(filters).sort({ createdAt: -1 });
  }

  // ─── Get Payment By ID ───────────────────────────────────
  async getPaymentById(id) {
    const payment = await Payment.findById(id);
    if (!payment) {
      throw new ApiError(404, 'Payment not found');
    }
    return payment;
  }

  // ─── Get Payment By OrderId ──────────────────────────────
  async getPaymentByOrderId(orderId) {
    const payment = await Payment.findOne({ orderId });
    if (!payment) {
      throw new ApiError(404, 'Payment not found for this order.');
    }
    return payment;
  }

  // ─── Refund ──────────────────────────────────────────────
  async processRefund(id) {
    const payment = await Payment.findById(id);
    if (!payment) {
      throw new ApiError(404, 'Payment not found');
    }

    if (payment.status !== 'SUCCESS') {
      throw new ApiError(400, 'Can only refund successful transactions');
    }

    payment.status = 'REFUNDED';
    await payment.save();

    await appointmentClient.updateAppointmentPaymentStatus(payment.appointmentId, 'REFUNDED');

    return payment;
  }

  // ─── Invoice PDF ─────────────────────────────────────────
  async generateInvoice(id, responseStream) {
    const payment = await this.getPaymentById(id);
    if (payment.status !== 'SUCCESS') {
      throw new ApiError(400, 'Invoice is only available for successful payments.');
    }

    const PDFDocument = require('pdfkit');
    const doc = new PDFDocument({ margin: 50 });

    doc.pipe(responseStream);

    // Header
    doc.fontSize(22).text('PrimeHealth', { align: 'center' });
    doc.fontSize(14).text('Appointment Invoice', { align: 'center' });
    doc.moveDown(1.5);

    // Line
    doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
    doc.moveDown();

    // Invoice details
    doc.fontSize(11);
    doc.text(`Invoice Number: ${payment.invoiceNumber || 'N/A'}`);
    doc.text(`Order ID: ${payment.orderId}`);
    doc.text(`Transaction ID: ${payment.transactionId}`);
    doc.text(`Payment Date: ${new Date(payment.paidAt).toLocaleString()}`);
    doc.text(`Payment Method: ${payment.method}`);
    doc.moveDown();

    // Patient / Appointment
    doc.text(`Appointment ID: ${payment.appointmentId}`);
    doc.text(`Patient ID: ${payment.patientId}`);
    if (payment.doctorId) doc.text(`Doctor ID: ${payment.doctorId}`);
    doc.moveDown();

    // Amount
    doc.fontSize(13).text(`Total Amount: ${payment.currency} ${payment.amount}`, { underline: true });
    doc.moveDown();

    // Line
    doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
    doc.moveDown();

    // Footer
    doc.fontSize(10).text('Thank you for choosing PrimeHealth.', { align: 'center' });
    doc.text('This is a computer-generated invoice.', { align: 'center' });

    doc.end();
  }

  }

module.exports = new PaymentService();
