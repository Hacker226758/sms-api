const https = require('follow-redirects').https;
const fs = require('fs');

// Infobip API credentials
const baseUrl = 'api.infobip.com';
const authorization = 'App e7e83d653f91a0e544fdfebc9dbfc265-7e619abb-ad41-4694-b83a-4e176a3dcc6c'; // Replace with your actual Infobip API token

function sendSMS(phoneNumber, message) {
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
    });

    res.on('error', (error) => {
      console.error('Error:', error);
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
}

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
