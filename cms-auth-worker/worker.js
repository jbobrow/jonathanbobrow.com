// GitHub OAuth proxy for Sveltia/Decap CMS, deployed as a Cloudflare Worker.
//
// A static admin page (public/admin/) can't hold a GitHub OAuth client
// secret, so it can't complete the token exchange itself. This worker does
// the two steps that require the secret:
//   1. GET /auth      -> redirect the browser to GitHub's authorize screen
//   2. GET /callback  -> exchange the returned code for an access token,
//                        then hand it back to the CMS popup via postMessage
//
// Required secrets (set with `wrangler secret put <NAME>`):
//   GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET
// Required var (in wrangler.toml or dashboard):
//   ALLOWED_ORIGIN — e.g. https://jonathanbobrow.com (the site the popup is
//   opened from; the callback only postMessages back to this origin)

const GITHUB_AUTHORIZE_URL = 'https://github.com/login/oauth/authorize';
const GITHUB_TOKEN_URL = 'https://github.com/login/oauth/access_token';

function randomState() {
  return crypto.randomUUID();
}

async function handleAuth(request, env) {
  const url = new URL(request.url);
  const state = randomState();

  const authorizeUrl = new URL(GITHUB_AUTHORIZE_URL);
  authorizeUrl.searchParams.set('client_id', env.GITHUB_CLIENT_ID);
  authorizeUrl.searchParams.set('redirect_uri', `${url.origin}/callback`);
  authorizeUrl.searchParams.set('scope', 'repo,user');
  authorizeUrl.searchParams.set('state', state);

  const response = Response.redirect(authorizeUrl.toString(), 302);
  const headers = new Headers(response.headers);
  // State only needs to survive the redirect round-trip.
  headers.append(
    'Set-Cookie',
    `oauth_state=${state}; HttpOnly; Secure; SameSite=Lax; Max-Age=600; Path=/`
  );
  return new Response(response.body, { status: 302, headers });
}

function popupResponse(payload) {
  // Contract expected by Sveltia/Decap CMS: the callback page posts a
  // "authorization:github:success:<json>" (or "...:error:<message>")
  // message to the window that opened the popup, then the popup closes.
  const script = `
    (function() {
      function receiveMessage(message) {
        window.opener.postMessage(
          'authorization:github:${payload.type}:${JSON.stringify(payload.content)}',
          message.origin
        );
        window.removeEventListener('message', receiveMessage, false);
      }
      window.addEventListener('message', receiveMessage, false);
      window.opener.postMessage('authorizing:github', '*');
    })();
  `;
  return new Response(`<!DOCTYPE html><html><body><script>${script}</script></body></html>`, {
    headers: { 'Content-Type': 'text/html' },
  });
}

async function handleCallback(request, env) {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');
  const cookie = request.headers.get('Cookie') || '';
  const cookieState = cookie.match(/oauth_state=([^;]+)/)?.[1];

  if (!code || !state || state !== cookieState) {
    return popupResponse({ type: 'error', content: 'Invalid OAuth state' });
  }

  const tokenResponse = await fetch(GITHUB_TOKEN_URL, {
    method: 'POST',
    headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
    body: JSON.stringify({
      client_id: env.GITHUB_CLIENT_ID,
      client_secret: env.GITHUB_CLIENT_SECRET,
      code,
    }),
  });
  const tokenData = await tokenResponse.json();

  if (tokenData.error) {
    return popupResponse({ type: 'error', content: tokenData.error_description || tokenData.error });
  }

  return popupResponse({
    type: 'success',
    content: { token: tokenData.access_token, provider: 'github' },
  });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // Only ever redirect popups back to the one site that should be using
    // this proxy — keeps a stolen worker URL from being reusable elsewhere.
    if (env.ALLOWED_ORIGIN && request.headers.get('Origin') &&
        request.headers.get('Origin') !== env.ALLOWED_ORIGIN) {
      return new Response('Forbidden', { status: 403 });
    }

    if (url.pathname === '/auth') return handleAuth(request, env);
    if (url.pathname === '/callback') return handleCallback(request, env);
    return new Response('Not found', { status: 404 });
  },
};
