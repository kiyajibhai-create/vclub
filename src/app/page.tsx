'use client';

// Original source:
// <html><head></head><body>
// <script>function login() { document.cookie="PCP=2dbac1ec46be4d4e41c893c3c095e0e8";document.location.href="/";}</script>
// <input type="submit" value="LOGIN" onclick="login();">
// </body></html>
//
// NO CSS — plain browser default styling, white background, native submit button

export default function GatePage() {
  function login() {
    document.cookie = 'PCP=2dbac1ec46be4d4e41c893c3c095e0e8; path=/; SameSite=Lax';
    document.location.href = '/';
  }

  return (
    <input
      type="submit"
      value="LOGIN"
      onClick={login}
      id="gate-login-btn"
    />
  );
}
