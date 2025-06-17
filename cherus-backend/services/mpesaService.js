const axios = require('axios');
const moment = require('moment');
require('dotenv').config();

const MPESA_ENVIRONMENT = process.env.MPESA_ENVIRONMENT || 'sandbox';
const MPESA_CONSUMER_KEY = process.env.MPESA_CONSUMER_KEY;
const MPESA_CONSUMER_SECRET = process.env.MPESA_CONSUMER_SECRET;
const MPESA_SHORTCODE = process.env.MPESA_SHORTCODE;
const MPESA_LIPA_NA_MPESA_ONLINE_PASSKEY = process.env.MPESA_LIPA_NA_MPESA_ONLINE_PASSKEY;
const MPESA_CALLBACK_URL = process.env.MPESA_CALLBACK_URL;

const MPESA_BASE_URL = MPESA_ENVIRONMENT === 'live'
    ? 'https://api.safaricom.co.ke'
    : 'https://sandbox.safaricom.co.ke';

const MPESA_AUTH_URL = `${MPESA_BASE_URL}/oauth/v1/generate?grant_type=client_credentials`;
const MPESA_STK_PUSH_URL = `${MPESA_BASE_URL}/mpesa/stkpush/v1/processrequest`;

let mpesaToken = {
    value: null,
    expiresAt: null,
};

const getAuthToken = async () => {
    if (mpesaToken.value && mpesaToken.expiresAt && mpesaToken.expiresAt > Date.now()) {
        console.log('Using cached M-Pesa token');
        return mpesaToken.value;
    }

    console.log('Requesting new M-Pesa token...');
    const auth = Buffer.from(`${MPESA_CONSUMER_KEY}:${MPESA_CONSUMER_SECRET}`).toString('base64');

    try {
        const response = await axios.get(MPESA_AUTH_URL, {
            headers: { 'Authorization': `Basic ${auth}` }
        });

        const expiresIn = response.data.expires_in;
        mpesaToken = {
            value: response.data.access_token,
            expiresAt: Date.now() + (expiresIn - 300) * 1000
        };
        console.log('New M-Pesa token obtained');
        return mpesaToken.value;

    } catch (error) {
        console.error('Error getting M-Pesa Auth Token:', error.response ? error.response.data : error.message);
        throw new Error('Failed to obtain M-Pesa authentication token.');
    }
};

const initiateSTKPush = async ({ amount, phoneNumber, orderId }) => {
    if (!MPESA_CALLBACK_URL) {
        throw new Error('MPESA_CALLBACK_URL is not defined in environment variables.');
    }
    if (!MPESA_SHORTCODE || !MPESA_LIPA_NA_MPESA_ONLINE_PASSKEY) {
        throw new Error('M-Pesa Shortcode or Passkey not defined.');
    }

    // ---LOGIC ---
    let formattedPhone = phoneNumber.trim();
    if (formattedPhone.startsWith('+')) {
        formattedPhone = formattedPhone.substring(1);
    } else if (formattedPhone.startsWith('0')) {
        formattedPhone = '254' + formattedPhone.substring(1);
    }
    // ---FIX ---

    const token = await getAuthToken();
    const timestamp = moment().format('YYYYMMDDHHmmss');
    const password = Buffer.from(`${MPESA_SHORTCODE}${MPESA_LIPA_NA_MPESA_ONLINE_PASSKEY}${timestamp}`).toString('base64');

    const payload = {
        BusinessShortCode: MPESA_SHORTCODE,
        Password: password,
        Timestamp: timestamp,
        TransactionType: 'CustomerPayBillOnline',
        Amount: Math.round(amount),
        PartyA: formattedPhone,
        PartyB: MPESA_SHORTCODE,
        PhoneNumber: formattedPhone,
        CallBackURL: MPESA_CALLBACK_URL,
        AccountReference: `CHERUS-${orderId}`,
        TransactionDesc: `Payment for Order ${orderId}`
    };

    console.log('Initiating STK Push with payload:', payload);

    try {
        const response = await axios.post(MPESA_STK_PUSH_URL, payload, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        console.log('M-Pesa STK Push Response:', response.data);

        if (response.data && response.data.ResponseCode === '0') {
            return {
                success: true,
                merchantRequestID: response.data.MerchantRequestID,
                checkoutRequestID: response.data.CheckoutRequestID,
                responseDescription: response.data.ResponseDescription,
            };
        } else {
            throw new Error(response.data.ResponseDescription || response.data.errorMessage || 'Failed to initiate M-Pesa STK push.');
        }

    } catch (error) {
        const errorMessage = error.response?.data?.errorMessage || error.message || 'An error occurred during M-Pesa request.';
        console.error('Error initiating M-Pesa STK Push:', error.response ? JSON.stringify(error.response.data) : errorMessage);
        throw new Error(`M-Pesa STK Push failed: ${errorMessage}`);
    }
};

module.exports = {
    initiateSTKPush
};