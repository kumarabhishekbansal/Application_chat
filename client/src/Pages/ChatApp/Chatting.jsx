import React, { useState, useEffect,useRef } from "react";
import {io} from "socket.io-client";
import { useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

const ENDPOINT = "https://chatting-91mt.onrender.com";
var socket, selectedChatCompare;
const Chatting = (props) => {
  const socket = useRef();
  const [chatwrite, setchatwrite] = useState("");
  // const [SocketConnected, setSocketConnected] = useState(false);
  const [IsTyping, setIsTyping] = useState(false);
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const [Messages, setMessages] = useState([]);
  const [NewMessage, setNewMessage] = useState("");
  const [typing, settyping] = useState(false);
  const [Loading, setLoading] = useState(false);
  const [chatfound, setchatfound] = useState(false);
  const handlechatwrite = (e) => {
    setchatwrite(e.target.value);
  };

  const { user, usertoken } = useSelector((state) => state.UserInfo);
  const { selectedChatUser } = useSelector((state) => state.ChatUserName);

  const fetchMessages = async () => {
    if (!selectedChatUser) return;

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${usertoken}`,
        },
      };

      setLoading(true);

      const { data } = await axios.get(
        `/api/message/${selectedChatUser._id}`,
        config
      );
      if (
        data.data &&
        data.data.length > 0 &&
        data.data[0].MessageSender.length > 0
      ) {
        console.log(data.data[0].MessageSender);
        setMessages(data.data[0].MessageSender);
        setchatfound(true);
      } else {
        console.log("Data :::: ", data);
        setchatfound(false);
      }
      setLoading(false);

      // socket.emit("join chat", selectedChatUser._id);
    } catch (error) {
      console.log("error :: ", error);
      setchatfound(false);
      toast.error("Failed to load messages");
    }
  };

  const sendMessage = async (event) => {
    event.preventDefault();
    // console.log(event.key," ",NewMessage);
    if (NewMessage) {
      try {
        const config = {
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${usertoken}`,
          },
        };
        // setNewMessage("");
        const { data } = await axios.post(
          "/api/message",
          {
            content: NewMessage,
            chaterId: selectedChatUser._id,
          },
          config
        );
        socket.current.emit("sendMessage", {
          senderId: user._id,
          receiverId:selectedChatUser._id,
          text: NewMessage,
        });
        toast.success("Message sent");
        fetchMessages();
        console.log("After fetching.. ",Messages);
        setNewMessage("");
        setMessages([...Messages, data]);
      } catch (error) {
        toast.error("Failed to send the Message");
      }
    }
  };

  const typingHandler = (e) => {
    // console.log("enter typingHandler ",e.target.value);
    setNewMessage(e.target.value);

    if (!socket) return;

    if (!typing) {
      settyping(true);
    }
    let lastTypingTime = new Date().getTime();
    var timerLength = 3000;
    setTimeout(() => {
      var timeNow = new Date().getTime();
      var timeDiff = timeNow - lastTypingTime;
      if (timeDiff >= timerLength && typing) {
        settyping(false);
      }
    }, timerLength);
  };

  useEffect(() => {
    socket.current = io("ws://https://chatting-91mt.onrender.com",
    { autoConnect: false, transports: ['websocket'] })
    
    socket.current.on("getMessage", (data) => {
      console.log("data :: ",data);
      setArrivalMessage({
        sender: data.senderId,
        text: data.text,
        createdAt: Date.now(),
      });
    });
  }, []);

  useEffect(() => {
    socket.current.emit("addUser", user._id);
    // socket.current.on("getUsers", (users) => {
    //     // console.log(users," :::::: ");
    // });
  }, [user]);


  useEffect(() => {
    fetchMessages();
    // console.log(arrivalMessage);
  }, [selectedChatUser,arrivalMessage]);

// console.log("arrivalMessage ",arrivalMessage);
  

  return (
    <>
      <div className="chatting_main_div">
        <div className="chat_write_box">
          {chatfound ? (
            <>
              {Messages.map((val) => {
                return (
                  <div key={val._id} className="chatbox_insidechat">
                    {val.SenderId !== user._id ? (
                      <>
                        <div className="sender_head">
                          <h3 className="content_head">{val.content}</h3>
                          <div className="time_Stamp">
                            {" "}
                            {} {val.date}
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        <h3 className="recieve_head">
                        <h3 className="content_head">{val.content}</h3>
                          <div className="time_Stamp">
                            {" "}
                            {} {val.date}
                          </div>
                        </h3>
                      </>
                    )}
                  </div>
                );
              })}
            </>
          ) : (
            <>
              <h3 className="no_chat_found_heading">Chat Not Found</h3>
            </>
          )}
        </div>
        <div className="chat_search_bar">
          <form onSubmit={sendMessage}>
            <input
              type="text"
              name="NewMessage"
              id="NewMessage"
              onChange={typingHandler}
              value={NewMessage}
              placeholder="Enter Message"
            />
            <input type="submit" value="Send" />
          </form>
        </div>
      </div>
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </>
  );
};

export default Chatting;
