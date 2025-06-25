// services/emailService.js
const Mailjet = require('node-mailjet');
require('dotenv').config();

// Initialize the Mailjet client
const mailjet = new Mailjet({
  apiKey: process.env.MAILJET_API_KEY,
  apiSecret: process.env.MAILJET_SECRET_KEY
});

// Reusable function to send an email using Mailjet
const sendEmail = async ({ to, subject, text, html }) => {
    if (!process.env.MAILJET_API_KEY || !process.env.MAILJET_SECRET_KEY || !process.env.MAILJET_SENDER_EMAIL) {
        console.error('Mailjet environment variables are not set. Cannot send email.');
        return { success: false, error: 'Email service is not configured.' };
    }

    const request = mailjet
        .post('send', { 'version': 'v3.1' })
        .request({
            "Messages": [
                {
                    "From": {
                        "Email": process.env.MAILJET_SENDER_EMAIL,
                        "Name": "Cherus Sportswear"
                    },
                    "To": [
                        {
                            "Email": to,
                            // "Name": "Recipient Name" // Optional
                        }
                    ],
                    "Subject": subject,
                    "TextPart": text,
                    "HTMLPart": html
                }
            ]
        });

    try {
        const result = await request;
        console.log('Mailjet response received:', JSON.stringify(result.body, null, 2));

        // Check for success status in the response
        if (result.body.Messages[0].Status === 'success') {
            console.log('Email sent successfully via Mailjet.');
            return { success: true };
        } else {
            // Log the detailed error from Mailjet
            console.error('Mailjet failed to send email:', result.body.Messages[0].Errors);
            throw new Error('Mailjet failed to send email.');
        }

    } catch (err) {
        console.error('Error sending email via Mailjet:', err.statusCode, err.message);
        return { success: false, error: 'Failed to send email.' };
    }
};

module.exports = {
    sendEmail,
};