export async function POST(request) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return new Response(JSON.stringify({ error: 'Username and password are required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const validUsername = process.env.HOST_USERNAME;
    const validPassword = process.env.HOST_PASSWORD;

    if (username === validUsername && password === validPassword) {
      const sessionToken = Buffer.from(`${username}:${Date.now()}`).toString('base64');
      
      return new Response(JSON.stringify({ 
        success: true, 
        message: 'Login successful',
        sessionToken 
      }), {
        status: 200,
        headers: { 
          'Content-Type': 'application/json',
          'Set-Cookie': `session=${sessionToken}; HttpOnly; Path=/; Max-Age=86400`
        }
      });
    } else {
      return new Response(JSON.stringify({ error: 'Invalid username or password' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

  } catch (error) {
    console.error('Login error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
