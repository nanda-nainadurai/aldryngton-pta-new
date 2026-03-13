exports.handler = async (event) => {
  const code = event.queryStringParameters?.code;

  if (!code) {
    return {
      statusCode: 400,
      body: 'Missing code parameter',
    };
  }

  const clientId = process.env.GITHUB_OAUTH_CLIENT_ID;
  const clientSecret = process.env.GITHUB_OAUTH_CLIENT_SECRET;

  // Exchange the code for an access token
  const response = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      client_id: clientId,
      client_secret: clientSecret,
      code: code,
    }),
  });

  const data = await response.json();

  if (data.error) {
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'text/html' },
      body: renderMessage('error', data),
    };
  }

  // Check if the user is in the allowlist
  const allowedUsers = (process.env.ALLOWED_GITHUB_USERS || '').split(',').map(u => u.trim().toLowerCase()).filter(Boolean);

  if (allowedUsers.length > 0) {
    const userResponse = await fetch('https://api.github.com/user', {
      headers: {
        Authorization: `Bearer ${data.access_token}`,
        Accept: 'application/vnd.github.v3+json',
      },
    });
    const userData = await userResponse.json();
    const username = (userData.login || '').toLowerCase();

    if (!allowedUsers.includes(username)) {
      return {
        statusCode: 200,
        headers: { 'Content-Type': 'text/html' },
        body: renderMessage('error', { error: 'access_denied', error_description: 'Your GitHub account is not authorized to use this CMS.' }),
      };
    }
  }

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'text/html' },
    body: renderMessage('success', { token: data.access_token, provider: 'github' }),
  };
};

function renderMessage(status, content) {
  const contentStr = JSON.stringify(content);
  return `<!DOCTYPE html>
<html>
<head><title>OAuth Callback</title></head>
<body>
<script>
(function() {
  function receiveMessage(e) {
    console.log("receiveMessage", e);
    window.removeEventListener("message", receiveMessage, false);
    window.opener.postMessage(
      "authorization:github:${status}:" + JSON.stringify(${contentStr}),
      e.origin
    );
    window.close();
  }
  window.addEventListener("message", receiveMessage, false);
  window.opener.postMessage("authorizing:github", "*");
})();
</script>
</body>
</html>`;
}
