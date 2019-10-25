const UNIFONIC_URL = 'http://api.unifonic.com/rest/Messages/Send';

exports.sendText = async function(appsid, recipient, body) {
    if (body.length > 160) {
        throw new Error('Message should be 160 characters or less')
    }
    
    const fetchData = {
        method: "POST",
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `AppSid=${appsid}&Recipient=${recipient}&Body=${body}`
    }

    const response = await fetch(UNIFONIC_URL, fetchData);
    return response.json();
};
