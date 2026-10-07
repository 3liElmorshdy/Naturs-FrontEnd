import { useEffect, useRef } from 'react';
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

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    if (searchParams.get('error')) {
      toast.error('Google login failed. Please try again.');
      navigate('/login', { replace: true });
      return;
    }

    (async () => {
      try {
        await refreshAccessToken(); // refreshToken cookie -> accessToken
        const res = await api.get('/users/me');
        const user = res.data?.data?.data;
        if (!user) throw new Error('No user');
        dispatch(setUser(user));
        toast.success('Welcome! Logged in with Google.');
        navigate('/', { replace: true });
      } catch (err: any) {
        console.log('GOOGLE AUTH ERROR:', err.response?.data || err.message);
        setAccessToken(null);
        toast.error('Something went wrong. Please try again.');
        navigate('/login', { replace: true });
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};