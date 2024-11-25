const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const https = require('follow-redirects').https;

// Infobip API credentials
const baseUrl = 'api.infobip.com';
const authorization = 'App e7e83d653f91a0e544fdfebc9dbfc265-7e619abb-ad41-4694-b83a-4e176a3dcc6c'; // Replace with your actual Infobip API token

app.use(bodyParser.json()); // Parse JSON request bodies

app.post('/send-sms', (req, res) => {
  const { phoneNumber, message } = req.body;

  const options = {
    method: 'POST',
    hostname: baseUrl,
    path: '/sms/2/text/advanced',
    headers: {
      Authorization: authorization,
      'Content-Type': 'application/json',
      Accept: 'application/json'
    },
    maxRedirects: 20
  };

  const req = https.request(options, (res) => {
    let chunks = [];

    res.on('data', (chunk) => {
      chunks.push(chunk);
    });

    res.on('end', () => {
      const body = Buffer.concat(chunks).toString();
      console.log('Response:', body);
      res.json({ message: 'SMS sent successfully!' }); // Send success response
    });

    res.on('error', (error) => {
      console.error('Error:', error);
      res.status(500).json({ message: 'Error sending SMS' }); // Send error response
    });
  });

  const postData = JSON.stringify({
    messages: [
      {
        destinations: [
          {
            to: phoneNumber
          }
        ],
        from: '447491163443', // Replace with your sender ID
        text: message
      }
    ]
  });

  req.write(postData);
  req.end();
});

app.listen(3000, () => {
  console.log('Server listening on port 3000');
});
           
