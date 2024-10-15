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
  reducers: {},
});

export const {  } = userSlice.actions;
export default userSlice.reducer;
