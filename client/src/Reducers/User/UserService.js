import axios from "axios";
let API_URI='/api/user/';

const register=async(data)=>{
    try {
        const config={
            headers:{
                "Content-type":"application/json"
            },
        };
        // console.log("data : ",data);
        const response=await axios.post(API_URI,data,config);
        return response.data;

    } catch (error) {
        // console.log(error);
        // console.log("error response : ",error.response.data);
        console.log("error while register user in user service react js");
        return Promise.reject(error.response.data);
    }
}

const login=async(data)=>{
    try {
        const config={
            headers:{
                "Content-type":"application/json"
            },
        };
        const response=await axios.post(API_URI+"login",data,config);
        return response.data;
    } catch (error) {
        console.log("error while login user in user service react js");
        return Promise.reject(error.response.data);
    }
}

const logout=async(access_token)=>{
    console.log("logout userservice ",access_token);
    localStorage.removeItem("userinfo");
    localStorage.removeItem("usertoken");
    localStorage.removeItem("chatusername");
    localStorage.removeItem("setChatId");
    localStorage.removeItem("selectedChat");
}

const UserService={
    register,
    login,
    logout
}

export default UserService;


