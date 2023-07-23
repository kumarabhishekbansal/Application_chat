import React,{useEffect,useState} from 'react'
import "./style.css"
import SideBarUser from './SideBarUser'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import Chatting from './Chatting'
const ChatPage = () => {
  const navigate=useNavigate();
  const {user,usertoken}=useSelector((state)=>state.UserInfo);
  const {chatusername,chatuserid}=useSelector((state)=>state.ChatUserName);
  const [chatname,setchatname]=useState("");
  const [selectchatid,setselectchatid]=useState("");
  const [userid,setuserid]=useState("");
  useEffect(()=>{
    if(!usertoken)
    {
        console.log("token not found");
        navigate("/");
    }
    setchatname(chatusername);
    setselectchatid(chatuserid);
    // console.log(" chatname ",chatname);
    // console.log(" selectchatid  :: ",selectchatid);
    setuserid(user._id);
  },[usertoken,chatusername,selectchatid,user])

  return (
   <>
    <div className="chatpage_div">
    <h1 className='chat_head_center'>{(chatname==="")?"Start a Chat  with selected User ":" chat with  "+chatname}</h1>
    <div className="main_chatPage_div">
    <div className="sidebar_chat_users">
    <SideBarUser />
    </div>
    <div className="sidebar_real_chat">
      <Chatting selectuserid={selectchatid} selectusername={chatname} currentuserid={userid}/>
    </div>
    </div>
    </div>
   </>
  )
}

export default ChatPage
