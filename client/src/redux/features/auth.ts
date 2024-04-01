import { AUTHEN_TOKENS } from "@client/libs/constants";
import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import { AuthData, TokensData } from "@server/models/auth.model";

interface AuthState {
  user?: AuthData;
}

const initialState: AuthState = {};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<AuthData | undefined>) => {
      state.user = action.payload;
    },
    setTokens: (_, action: PayloadAction<TokensData>) => {
      localStorage.setItem(AUTHEN_TOKENS.ACCESS, action.payload.access);
      localStorage.setItem(AUTHEN_TOKENS.REFRESH, action.payload.refresh);
    },
    clearTokens: () => {
      localStorage.removeItem(AUTHEN_TOKENS.ACCESS);
      localStorage.removeItem(AUTHEN_TOKENS.REFRESH);
    },
  },
});

export const { setUser, setTokens, clearTokens } = authSlice.actions;

export default authSlice.reducer;
