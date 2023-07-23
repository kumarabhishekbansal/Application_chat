import React,{useState,useEffect} from 'react'
import "./Form.css"
import { useDispatch,useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { login,reset } from '../../Reducers/User/UserSlice';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const Login = () => {

  const dispatch=useDispatch();
  const navigate=useNavigate();
  const {user,usermessage,usererror,userloading,usersuccess}=useSelector((state)=>state.UserInfo);

  const [userdata, setuserdata] = useState({
    email: "",
    password: "",
  });

  const {email, password } = userdata;

  const handlechange = (e) => {
    setuserdata({ ...userdata, [e.target.name]: e.target.value });
  };

  const handleSubmit=(e)=>{
      e.preventDefault();
      dispatch(login(userdata));
  }

  useEffect(() => {
    if (usererror) {
      // console.log(usermessage);
      toast.error(usermessage);
      setTimeout(()=>{
        dispatch(reset());
    },2000);
    } else if (usersuccess && user) {
      // console.log("user success");
      toast.success("Login...");
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
     <div className="login_form_div">
    <h1 className="login_form_heading">Login Form</h1>
        <form className="form_div" onSubmit={handleSubmit}>
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
          <button type="submit" className="submitbtn">
            Login
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
  )
}

export default Login