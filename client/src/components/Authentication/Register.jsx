import React, { useState, useEffect } from "react";
import "./Form.css";
import { useNavigate } from "react-router-dom";
import { reset, register } from "../../Reducers/User/UserSlice";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user, usersuccess, userloading, usermessage, usererror } =
    useSelector((state) => state.UserInfo);

  const [userdata, setuserdata] = useState({
    name: "",
    email: "",
    password: "",
    pic: "",
  });

  const { name, email, password } = userdata;

  const handlechange = (e) => {
    setuserdata({ ...userdata, [e.target.name]: e.target.value });
  };
  const handleimage = async (e) => {
    const data = new FormData();
    const file = e.target.files[0];
    // setuserdata({...userdata,pic:file});
    data.append("file", file);
    data.append("upload_preset", "Chat_App");
    data.append("cloud_name", "do2yjfyfe");
    try {
      fetch("https://api.cloudinary.com/v1_1/do2yjfyfe/image/upload", {
        method: "post",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          setuserdata({ ...userdata, pic: data.url });
        })
        .catch((err) => console.log("error"));
    } catch (error) {
      console.log("Error");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(register(userdata));
  };

  useEffect(() => {
    if (usererror) {
      // console.log(usermessage);
      toast.error(usermessage);
      setTimeout(()=>{
        dispatch(reset());
    },2000);
    } else if (usersuccess && user) {
      // console.log("user success");
      toast.success("Registered...");
      setTimeout(()=>{
          dispatch(reset());
          navigate("/chat");
      },3000);
    } else {
      dispatch(reset());
    }
  }, [user, usersuccess, userloading, usermessage, usererror, dispatch]);

  return (
    <>
      <div className="register_form_div">
        <h1 className="register_form_heading">Register Form</h1>
        <form className="form_div" onSubmit={handleSubmit}>
          <div className="name_input_div">
            <label htmlFor="name">Name : </label>
            <input
              type="text"
              name="name"
              id="name"
              placeholder="Enter Your Name"
              value={name}
              onChange={handlechange}
            />
          </div>

          <div className="email_input_div">
            <label htmlFor="email">Email : </label>
            <input
              type="email"
              name="email"
              id="email"
              placeholder="Enter Your email id"
              value={email}
              onChange={handlechange}
            />
          </div>

          <div className="password_input_div">
            <label htmlFor="password">Password : </label>
            <input
              type="password"
              name="password"
              id="password"
              placeholder="Enter Your password"
              value={password}
              onChange={handlechange}
            />
          </div>

          <div className="pic_input_div">
            <label htmlFor="pic">Pic : </label>
            <input
              type="file"
              name="pic"
              id="pic"
              placeholder="Enter Your pic"
              onChange={handleimage}
            />
          </div>
          <button type="submit" className="submitbtn">
            Register
          </button>
          
        </form>
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

export default Register;
