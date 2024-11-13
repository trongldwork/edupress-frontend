import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userName: "",
  email: "",
  name: "",
  role: "",
  avatarUrl: "",
  accessToken: "",
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      const {
        userName = "",
        email = "",
        name = "",
        role = "",
        avatarUrl = "",
        accessToken = "",
      } = action.payload;

      state.userName = userName;
      state.email = email;
      state.name = name || "";
      state.role = role;
      state.avatarUrl = avatarUrl;
      state.accessToken = accessToken;
    },
    changeAvatar: (state, action) => {
      const { avatarUrl = "" } = action.payload;
      state.avatarUrl = avatarUrl;
    },
    updateUserProfile: (state, action) => {
      const {
        userName = "",
        email = "",
        name = "",
        role = "",
        avatarUrl = ""
      } = action.payload;

      state.userName = userName;
      state.email = email;
      state.name = name || email;
      state.role = role;
      state.avatarUrl = avatarUrl;
    },
    resetUser: (state) => {
      state.userName = "";
      state.email = "";
      state.name = "";
      state.role = "";
      state.avatarUrl = "";
      state.accessToken = "";
    },
  },
});

export const { setUser, resetUser, changeAvatar, updateUserProfile } = userSlice.actions;
export default userSlice.reducer;
