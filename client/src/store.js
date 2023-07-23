import { configureStore } from "@reduxjs/toolkit";

import UserReducer from "./Reducers/User/UserSlice";
import ChatReducer from "./Reducers/Chat/ChatSlice"
export const store=configureStore({
    reducer:{
        UserInfo:UserReducer,
        ChatUserName:ChatReducer
    },
});