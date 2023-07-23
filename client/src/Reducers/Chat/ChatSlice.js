import { createSlice,createAsyncThunk } from "@reduxjs/toolkit";
import ChatService from "./ChatService";
const chatusername=JSON.parse(localStorage.getItem("chatusername"));
const chatuserid=JSON.parse(localStorage.getItem("setChatId"));
const selectedChatUser=JSON.parse(localStorage.getItem("selectedChat"));
const initialState={
    chatusername:chatusername?chatusername:"",
    chatuserid:chatuserid?chatuserid:"",
    selectedChatUser:selectedChatUser?selectedChatUser:""
}

export const setChatName=createAsyncThunk(
    "chatname/setChatName",
    async(data,thunkAPI)=>{
        try {
            // console.log("setChatName chatslice : ",data);
            return await ChatService.setChatName(data); 
        } catch (error) {
            const message=(error.response && error.response.data && error.response.data.message) || (error.message || error.toString());
            return thunkAPI.rejectWithValue(message);
        }
    }
)

export const setChatId=createAsyncThunk(
    "chatname/setChatId",
    async(id,thunkAPI)=>{
        try {
            // console.log("setChatId chatslice : ",id);
            return await ChatService.setChatId(id); 
        } catch (error) {
            const message=(error.response && error.response.data && error.response.data.message) || (error.message || error.toString());
            return thunkAPI.rejectWithValue(message);
        }
    }
)

export const selectedChat=createAsyncThunk(
    "chatname/selectedChat",
    async(val,thunkAPI)=>{
        try {
            // console.log("selectedChat chatslice : ",val);
            return await ChatService.selectedChat(val); 
        } catch (error) {
            const message=(error.response && error.response.data && error.response.data.message) || (error.message || error.toString());
            return thunkAPI.rejectWithValue(message);
        }
    }
)



const ChatSlice=createSlice({
    name:'ChatUserName',
    initialState,
    reducers:{
        chatreset:(state)=>{
            state.chatusername="";
        },
    },
    extraReducers:(builder)=>{
        builder
        .addCase(setChatName.pending,(state)=>{
            state.chatusername="";
        })
        .addCase(setChatName.fulfilled,(state,action)=>{
            // console.log(action.payload,"fullfilled");
            localStorage.setItem("chatusername",JSON.stringify(action.payload));
            state.chatusername=action.payload;
        })
        .addCase(setChatName.rejected,(state,action)=>{
            state.chatusername="";
        })
        .addCase(setChatId.pending,(state)=>{
            state.chatuserid="";
        })
        .addCase(setChatId.fulfilled,(state,action)=>{
            // console.log(action.payload,"fullfilled");
            localStorage.setItem("setChatId",JSON.stringify(action.payload));
            state.chatuserid=action.payload;
        })
        .addCase(setChatId.rejected,(state,action)=>{
            state.chatuserid="";
        })

        .addCase(selectedChat.pending,(state)=>{
            state.selectedChatUser="";
        })
        .addCase(selectedChat.fulfilled,(state,action)=>{
            // console.log(action.payload,"fullfilled");
            localStorage.setItem("selectedChat",JSON.stringify(action.payload));
            state.selectedChatUser=action.payload;
        })
        .addCase(selectedChat.rejected,(state,action)=>{
            state.selectedChatUser  ="";
        })
        
    }
})

export const {chatreset}=ChatSlice.actions;
export default ChatSlice.reducer;