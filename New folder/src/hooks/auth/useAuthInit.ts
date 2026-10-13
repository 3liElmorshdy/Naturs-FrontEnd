import { useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import api, { refreshAccessToken, setAccessToken } from '../../services/api';
import { setUser, logoutUser } from '../../store/authSlice';
import type { AppDispatch } from '../../store/store';

export const useAuthInit = () => {
  const dispatch = useDispatch<AppDispatch>();
  const hasFetched = useRef(false);

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    (async () => {
      try {
        // 1. استرجع الـ accessToken من الـ refreshToken cookie
        await refreshAccessToken();
        // 2. هات بيانات اليوزر
        const res = await api.get('/users/me');
        const user = res.data?.data?.data;
        if (user) dispatch(setUser(user));
        else throw new Error('No user');
      } catch {
        setAccessToken(null);
        dispatch(logoutUser());
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};