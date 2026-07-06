// Shareable /about/ URL: redirects home with a flag that opens the About
// section (same stub the 11ty site generated).
export function GET() {
  const html = `<!DOCTYPE html><html><head>
<meta charset="utf-8">
<title>About — Jonathan Bobrow</title>
<script>
  sessionStorage.setItem('openAbout', '1');
  window.location.replace('/');
</script>
<meta http-equiv="refresh" content="0;url=/">
</head></html>`;
  return new Response(html, { headers: { 'Content-Type': 'text/html; charset=utf-8' } });
}
