// import axios from "axios";

const setChatName=(name)=>{
    try {
        // console.log("setChatName chatservice : ",name);
        localStorage.setItem("chatusername",JSON.stringify(name));
        // console.log("enter setChatName service ",name);
        return name;
    } catch (error) {
        console.log("error while register user in user service react js");
        return Promise.reject(error.response.data);
    }
}

const setChatId=(id)=>{
    try {
        // console.log("setChatId chatservice : ",id);
        localStorage.setItem("setChatId",JSON.stringify(id));
        // console.log("enter setChatId service ",id);
        return id;
    } catch (error) {
        console.log("error while register user in user service react js");
        return Promise.reject(error.response.data);
    }
}

const selectedChat=(val)=>{
    try {
        // console.log("setChatId chatservice : ",id);
        localStorage.setItem("selectedChat",JSON.stringify(val));
        // console.log("enter selectedChat service ",val);
        return val;
    } catch (error) {
        console.log("error while register user in user service react js");
        return Promise.reject(error.response.data);
    }
}

const ChatService={
    setChatName,
    setChatId,
    selectedChat
}

export default ChatService;


