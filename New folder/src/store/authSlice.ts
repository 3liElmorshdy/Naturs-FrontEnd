import {
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";

import { setAccessToken } from "../services/api";
import type { User } from "../types";

type AuthState = {
  user: User | null;
};

const savedUser =
  typeof window !== "undefined"
    ? localStorage.getItem("user")
    : null;

let parsedUser: User | null = null;

try {
  parsedUser = savedUser
    ? (JSON.parse(savedUser) as User)
    : null;
} catch {
  /*
    لو localStorage فيها JSON تالف،
    نمسحها بدل ما التطبيق يقع عند أول render.
  */
  localStorage.removeItem("user");
}

const initialState: AuthState = {
  user: parsedUser,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;

      /*
        نخزن بيانات المستخدم فقط.
        لا نخزن accessToken أو refreshToken هنا.
      */
      localStorage.setItem(
        "user",
        JSON.stringify(action.payload),
      );
    },

    updateUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;

      /*
        مهم عند تغيير الاسم أو email أو role:
        Redux تتحدث في اللحظة الحالية،
        localStorage تتحدث لكي لا تعود بيانات قديمة بعد refresh.
      */
      localStorage.setItem(
        "user",
        JSON.stringify(action.payload),
      );
    },

    logoutUser: (state) => {
      state.user = null;

      localStorage.removeItem("user");

      /*
        accessToken محفوظ في memory في api.ts.
        نمسحه عند logout.
      */
      setAccessToken(null);
    },
  },
});

export const {
  setUser,
  updateUser,
  logoutUser,
} = authSlice.actions;

export default authSlice.reducer;