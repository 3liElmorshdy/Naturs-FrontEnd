import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import api, { setAccessToken } from '../../services/api';
import { logoutUser } from '../../store/authSlice';

export const useLogout = () => {
  const dispatch = useDispatch();

  return useCallback(async () => {
    try {
      // 1. نادِ الـ backend عشان يبطل الـ session ويمسح الـ refreshToken cookie
      await api.post('/users/logout');
    } catch {
      // حتى لو الـ request فشل، كمّل امسح الـ state
    } finally {
      // 2. امسح الـ accessToken من الـ memory
      setAccessToken(null);
      // 3. امسح الـ user من الـ Redux وlocalStorage
      dispatch(logoutUser());
    }
  }, [dispatch]);
};