import React, { useState } from 'react';
import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';

function Home() {
  const [user, setUser] = useState(null);

  const handleLoginSuccess = (response) => {
    // Here, response contains the authentication token from Google
    console.log('Google login success:', response);
    // Send this token to your back-end for validation and user authentication
    const token = response.credential;

    // Example: Send token to the back-end for user verification and session creation
    fetch('http://localhost:3001/auth/google', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ token }),
    })
      .then((res) => res.json())
      .then((data) => {
        setUser(data.user); // Store user data in state
        console.log('Authenticated user:', data.user);
      })
      .catch((err) => console.error('Authentication failed:', err));
  };

  const handleLoginFailure = (error) => {
    console.error('Google login failed:', error);
  };

  return (
    <div className="App">
      <h1>Google OAuth Authentication</h1>

      {!user ? (
        <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
            <GoogleLogin
            onSuccess={handleLoginSuccess}
            onError={handleLoginFailure}
            />
        </GoogleOAuthProvider>
      ) : (
        <div>
          <h3>Welcome, {user.name}</h3>
          <p>Email: {user.email}</p>
        </div>
      )}
    </div>
  );
}

export default Home;