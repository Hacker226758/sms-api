const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const https = require('follow-redirects').https;

// Infobip API Credentials (REPLACE THESE!)
const baseUrl = 'api.infobip.com';
const authorization = 'App e7e83d653f91a0e544fdfebc9dbfc265-7e619abb-ad41-4694-b83a-4e176a3dcc6c'; // Replace with your actual Infobip API token


app.use(express.static('public')); // Serve static files from 'public' directory
app.use(bodyParser.json());

app.post('/send-sms', (req, res) => {
  const { phoneNumber, message } = req.body;

  const options = {
    method: 'POST',
    hostname: baseUrl,
    path: '/sms/2/text/advanced',
    headers: {
      Authorization: authorization,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    maxRedirects: 20,
  };

  const reqInfobip = https.request(options, (resInfobip) => {
    let data = '';

    resInfobip.on('data', (chunk) => {
      data += chunk;
    });

    resInfobip.on('end', () => {
      try {
        const response = JSON.parse(data);
        console.log('Infobip Response:', response);
        if (response.messages && response.messages[0].status.groupId) {
          res.json({ message: 'SMS sent successfully!' });
        } else {
          res.status(500).json({ message: 'Error sending SMS: ' + response.messages[0].status.description });
        }
      } catch (error) {
        console.error('Error parsing Infobip response:', error);
        res.status(500).json({ message: 'Error sending SMS' });
      }
    });

    resInfobip.on('error', (error) => {
      console.error('Infobip Request error:', error);
      res.status(500).json({ message: 'Error sending SMS' });
    });
  });

  reqInfobip.on('error', (error) => {
    console.error('Infobip Request error:', error);
    res.status(500).json({ message: 'Error sending SMS' });
  });

  const postData = JSON.stringify({
    messages: [
      {
        destinations: [{ to: phoneNumber }],
        from: 'YOUR_SENDER_ID', // Put your sender ID here.
        text: message,
      },
    ],
  });

  reqInfobip.write(postData);
  reqInfobip.end();
});

app.listen(3000, () => {
  console.log('Server listening on port 3000');
});
      
