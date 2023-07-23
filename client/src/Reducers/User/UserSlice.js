import { createSlice,createAsyncThunk } from "@reduxjs/toolkit";
import UserService from "./UserService";
const userinfo=JSON.parse(localStorage.getItem("userinfo"));
const usertoken=JSON.parse(localStorage.getItem("usertoken"));
const initialState={
    userloading:false,
    usermessage:"",
    usersuccess:false,
    usererror:false,
    user:userinfo?userinfo:null,
    usertoken:usertoken?usertoken:"",
}

export const register=createAsyncThunk(
    "userauth/register",
    async(data,thunkAPI)=>{
        try {
            return await UserService.register(data); 
        } catch (error) {
            const message=(error.response && error.response.data && error.response.data.message) || (error.message || error.toString());
            return thunkAPI.rejectWithValue(message);
        }
    }
)

export const login=createAsyncThunk(
    "userauth/login",
    async(data,thunkAPI)=>{
        try {
            return await UserService.login(data); 
        } catch (error) {
            const message=(error.response && error.response.data && error.response.data.message) || (error.message || error.toString());
            return thunkAPI.rejectWithValue(message);
        }
    }
)

export const logout=createAsyncThunk(
    "userauth/logout",
    async(data,thunkAPI)=>{
        try {
            // console.log("data : ",data);
            return await UserService.logout(data); 
        } catch (error) {
            const message=(error.response && error.response.data && error.response.data.message) || (error.message || error.toString());
            console.log(error," error");
            return thunkAPI.rejectWithValue(message);
        }
    }
)


const UserSlice=createSlice({
    name:'UserInfo',
    initialState,
    reducers:{
        reset:(state)=>{
            state.userloading=false;
            state.usermessage="";
            state.usersuccess=false;
            state.usererror=false;
        },
    },
    extraReducers:(builder)=>{
        builder
        .addCase(register.pending,(state)=>{
            state.userloading=true;
        })
        .addCase(register.fulfilled,(state,action)=>{
            // console.log(action.payload,"fullfilled");
            localStorage.setItem("userinfo",JSON.stringify(action.payload.data));
            localStorage.setItem("usertoken",JSON.stringify(action.payload.token));
            state.userloading=false;
            state.usermessage=action.payload.message;
            state.user=action.payload.data;
            state.usertoken=action.payload.token;
            state.usersuccess=true;
            state.usererror=false;
        })
        .addCase(register.rejected,(state,action)=>{
            // console.log(action.payload,"rejected");
            state.userloading=false;
            state.usermessage=action.payload;
            state.user=null;
            state.usertoken="";
            state.usersuccess=false;
            state.usererror=true;
        })
        .addCase(login.pending,(state)=>{
            state.userloading=true;
        })
        .addCase(login.fulfilled,(state,action)=>{
            // console.log(action.payload,"fullfilled");
            localStorage.setItem("userinfo",JSON.stringify(action.payload.data));
            localStorage.setItem("usertoken",JSON.stringify(action.payload.token));
            state.userloading=false;
            state.usermessage=action.payload.message;
            state.user=action.payload.data;
            state.usertoken=action.payload.token;
            state.usersuccess=true;
            state.usererror=false;
        })
        .addCase(login.rejected,(state,action)=>{
            // console.log(action.payload,"rejected");
            state.userloading=false;
            state.usermessage=action.payload;
            state.user=null;
            state.usertoken="";
            state.usersuccess=false;
            state.usererror=true;
        })
        .addCase(logout.fulfilled,(state,action)=>{
            localStorage.removeItem("userinfo");
            localStorage.removeItem("usertoken");
            localStorage.removeItem("chatusername");
            localStorage.removeItem("setChatId");
            localStorage.removeItem("selectedChat");
            console.log("logout fullfilled");
            state.user=null;
            state.usertoken='';
        })
    }
})

export const {reset}=UserSlice.actions;
export default UserSlice.reducer;