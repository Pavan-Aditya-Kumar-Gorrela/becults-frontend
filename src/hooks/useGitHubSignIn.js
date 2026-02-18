import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { oauthAPI } from '../services/api';

const API_BASE_URL = import.meta.env.VITE_API_URL;
export const useGitHubSignIn = () => {
  const navigate = useNavigate();

  const initiateGitHubAuth = useCallback(() => {
    const clientId = import.meta.env.VITE_GITHUB_CLIENT_ID;
    const redirectUri = encodeURIComponent(
      `${window.location.origin}/auth/github/callback`
    );
    const scope = encodeURIComponent('user:email');

    const authUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}`;
    window.location.href = authUrl;
  }, []);

  const handleGitHubCallback = useCallback(async (code) => {
    try {
      // Get user info from GitHub (requires backend to exchange code for token)
      const response = await fetch(
        `${API_BASE_URL}/oauth/github/callback`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ code }),
        }
      );

      const data = await response.json();

      if (data.success) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        navigate('/');
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      console.error('GitHub Sign-In error:', error);
      navigate('/login');
    }
  }, [navigate]);

  return { initiateGitHubAuth, handleGitHubCallback };
};

export default useGitHubSignIn;
