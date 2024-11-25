const form = document.getElementById('sms-form');
const responseDiv = document.getElementById('response');

form.addEventListener('submit', async (event) => {
    event.preventDefault(); // Prevent default form submission

    const phoneNumber = document.getElementById('phone').value;
    const message = document.getElementById('message').value;

    try {
        const response = await fetch('/send-sms', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ phoneNumber, message })
        });

        const data = await response.json();

        if (response.ok) {
            responseDiv.textContent = 'SMS sent successfully!';
        } else {
            responseDiv.textContent = 'Error: ' + data.message;
        }
    } catch (error) {
        responseDiv.textContent = 'Error: ' + error.message;
    }
});
          
