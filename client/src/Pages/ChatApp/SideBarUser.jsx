import React, { useEffect, useState } from "react";
import { useSelector,useDispatch } from "react-redux";
import "./style.css";
import { getAllUser } from "../../config/AllUser";
import { getAllUserKeyword } from "../../config/AllUser";
import { setChatName,setChatId,selectedChat } from "../../Reducers/Chat/ChatSlice";

const SideBarUser = () => {
  const dispatch=useDispatch();
  const { user, usertoken } = useSelector((state) => state.UserInfo);
  const [getalluser, setgetalluser] = useState([]);
  const[searchuser,setsearchuser]=useState("");
  const handlesearchuser=(e)=>{
    setsearchuser(e.target.value);
    getAllUserKeyword(usertoken,e.target.value)
      .then((data) => {
        setgetalluser(data);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  const handlechatcard=(id,name,val)=>{
    localStorage.setItem("chatusername",JSON.stringify(name));
    localStorage.setItem("setChatId",JSON.stringify(id));
    localStorage.setItem("selectedChat",JSON.stringify(val));
    // console.log(name);
    // console.log("id ::: ",id);
    // console.log("val ::: ",val);
    dispatch(setChatName(name));
    dispatch(setChatId(id));
    dispatch(selectedChat(val));

  }



  useEffect(() => {
    getAllUser(usertoken)
      .then((data) => {
        setgetalluser(data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [usertoken]);

  return (
    <>
      <div className="user_side_bar">
      <div className="input_search_form">
                <input type="text" name="serachuser" id="searchuser"
                placeholder="search User"
                className="search_user_input"
                    onChange={handlesearchuser}
                    value={searchuser}
                />
            </div>
        {getalluser.length !== 0 ? (
          <>
          <div className="external_charuser_card">

            {getalluser.map((val) => {
              return (
                <div className="internal_chatuser_card" key={val._id} onClick={()=>handlechatcard(val._id,val.name,val)}>
                  <div className="internal_chatuser_div_part1">
                    <div className="chat_sidebar_username">
                        NAME : {val.name}
                    </div>
                    <div className="chat_sidebar_status">
                        STATUS : {val.status}
                    </div>
                  </div>
                  <div className="internal_chatuser_div_part2">
                    <div className="chat_sidebar_image">
                        <img src={val.pic} alt="profile" className="image_profile"/>
                    </div>
                    {/* <div className="chat_sidebar_notification">
                        NOTIFICATIONS : 0
                    </div> */}
                  </div>
                </div>
              );
            })}
            </div>
          </>
        ) : (
          <>
            <h1>NO user found!!</h1>
          </>
        )}
      </div>
    </>
  );
};

export default SideBarUser;
