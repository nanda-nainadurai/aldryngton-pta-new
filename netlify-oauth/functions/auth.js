exports.handler = async (event) => {
  const clientId = process.env.GITHUB_OAUTH_CLIENT_ID;
  const siteUrl = process.env.URL || process.env.DEPLOY_URL;
  const redirectUri = `${siteUrl}/.netlify/functions/callback`;
  const scope = event.queryStringParameters?.scope || 'repo';

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    scope: scope,
  });

  return {
    statusCode: 302,
    headers: {
      Location: `https://github.com/login/oauth/authorize?${params}`,
      'Cache-Control': 'no-cache',
    },
  };
};
