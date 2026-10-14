import { useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import api, { refreshAccessToken, setAccessToken } from '../../services/api';
import { setUser } from '../../store/authSlice';
import type { AppDispatch } from '../../store/store';

export const useGoogleAuth = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch<AppDispatch>();
  const hasFetched = useRef(false);

  // Track if user was signing up or logging in
  const [isSignup, setIsSignup] = useState<boolean>(() => {
    return sessionStorage.getItem('google_auth_action') === 'signup';
  });

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    const storedAction = sessionStorage.getItem('google_auth_action');

    if (searchParams.get('error')) {
      sessionStorage.removeItem('google_auth_action');
      toast.error(
        storedAction === 'signup'
          ? 'Google sign-up was cancelled or failed. Please try again.'
          : 'Google login was cancelled or failed. Please try again.',
      );
      navigate(storedAction === 'signup' ? '/signup' : '/login', {
        replace: true,
      });
      return;
    }

    (async () => {
      try {
        await refreshAccessToken(); // refreshToken cookie -> accessToken
        const res = await api.get('/users/me');
        const user = res.data?.data?.data;
        if (!user) throw new Error('No user');

        // Check if user was newly created in the last 2 minutes
        const createdTime = user.createdAt
          ? new Date(user.createdAt).getTime()
          : user._id && user._id.length === 24
            ? parseInt(user._id.substring(0, 8), 16) * 1000
            : 0;

        const isRecentlyCreated =
          createdTime > 0 && Date.now() - createdTime < 120_000;
        const wasSignup = storedAction === 'signup' || isRecentlyCreated;
        sessionStorage.removeItem('google_auth_action');

        if (wasSignup) {
          setIsSignup(true);
        }

        dispatch(setUser(user));

        const firstName = user.name ? user.name.trim().split(' ')[0] : '';
        if (wasSignup) {
          toast.success(
            firstName
              ? `Welcome to Natours, ${firstName}! Account created successfully.`
              : 'Welcome to Natours! Your account was created with Google.',
          );
        } else {
          toast.success(
            firstName
              ? `Welcome back, ${firstName}!`
              : 'Welcome back! Logged in with Google.',
          );
        }

        navigate('/', { replace: true });
      } catch (err: any) {
        console.log('GOOGLE AUTH ERROR:', err.response?.data || err.message);
        setAccessToken(null);
        sessionStorage.removeItem('google_auth_action');
        toast.error(
          storedAction === 'signup'
            ? 'Google sign-up failed. Please try again.'
            : 'Google login failed. Please try again.',
        );
        navigate(storedAction === 'signup' ? '/signup' : '/login', {
          replace: true,
        });
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { isSignup };
};