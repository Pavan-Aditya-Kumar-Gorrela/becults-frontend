import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { oauthAPI } from '../services/api';
const API_BASE_URL = import.meta.env.VITE_API_URL;
export const useGoogleSignIn = () => {
  const navigate = useNavigate();

  const initializeGoogleSignIn = useCallback((onError) => {
    // Load Google Sign-In script
    const script = document.createElement('script');
    script.async = true;
    script.defer = true;
    script.src = 'https://accounts.google.com/gsi/client';
    script.onload = () => {
      window.google?.accounts?.id?.initialize({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
        callback: handleCredentialResponse,
      });
    };
    document.body.appendChild(script);
  }, []);

  const handleCredentialResponse = async (response) => {
    try {

      // Send to backend
      const response_data = await oauthAPI.googleCallback({
        credential: response.credential,
      });

      if (response_data.success) {
        localStorage.setItem('token', response_data.token);
        localStorage.setItem('user', JSON.stringify(response_data.user));
        navigate('/home');
      }
    } catch (error) {
      console.error('Google Sign-In error:', error);
    }
  };

  const renderGoogleSignInButton = (containerId) => {
    window.google?.accounts?.id?.renderButton(
      document.getElementById(containerId),
      {
        theme: 'outline',
        size: 'large',
        width: '100%',
      }
    );
  };

  return { initializeGoogleSignIn, renderGoogleSignInButton };
};

export default useGoogleSignIn;
