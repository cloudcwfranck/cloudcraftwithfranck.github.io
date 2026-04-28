import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const redirect = request.nextUrl.searchParams.get('redirect') ?? '/dashboard';
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Dashboard Login</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { background: #0a0a0a; color: #d4d4d4; font-family: Inter, sans-serif; display: flex; align-items: center; justify-content: center; min-height: 100vh; }
    form { background: #141414; border: 1px solid #262626; border-radius: 12px; padding: 40px; width: 100%; max-width: 380px; display: flex; flex-direction: column; gap: 16px; }
    h1 { color: #fff; font-size: 20px; font-weight: 700; }
    input[type=password] { background: #0a0a0a; border: 1px solid #404040; border-radius: 8px; color: #fff; font-size: 14px; padding: 12px 16px; outline: none; width: 100%; }
    input[type=password]:focus { border-color: #10b981; }
    button { background: #10b981; border: none; border-radius: 8px; color: #fff; cursor: pointer; font-size: 14px; font-weight: 600; padding: 12px; width: 100%; }
    .error { color: #ef4444; font-size: 13px; }
  </style>
</head>
<body>
  <form method="POST" action="/api/dashboard-login">
    <h1>Dashboard</h1>
    <input type="hidden" name="redirect" value="${redirect}">
    <input type="password" name="password" placeholder="Password" autofocus required>
    <button type="submit">Unlock</button>
  </form>
</body>
</html>`;
  return new NextResponse(html, { headers: { 'Content-Type': 'text/html' } });
}

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const password = formData.get('password') as string;
  const redirect = (formData.get('redirect') as string) || '/dashboard';

  const correctPassword = process.env.DASHBOARD_PASSWORD;

  if (!correctPassword || password !== correctPassword) {
    const loginUrl = new URL('/api/dashboard-login', request.url);
    loginUrl.searchParams.set('redirect', redirect);
    return NextResponse.redirect(loginUrl, 303);
  }

  const response = NextResponse.redirect(new URL(redirect, request.url), 303);
  response.cookies.set('dashboard_auth', correctPassword, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 8, // 8 hours
    sameSite: 'strict',
    path: '/',
  });
  return response;
}
