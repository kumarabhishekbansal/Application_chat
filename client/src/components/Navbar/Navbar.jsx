import React from "react";
import "./Navbar.css";
import { Link, useNavigate} from "react-router-dom";
import { useSelector } from "react-redux";
import Badge from "@mui/material/Badge";
import MailIcon from "@mui/icons-material/Mail";
import { useDispatch } from "react-redux";
import { logout } from "../../Reducers/User/UserSlice";
const Navbar = () => {
  const dispatch=useDispatch();
  const navigate=useNavigate();
  const { user, usertoken } = useSelector((state) => state.UserInfo);
  const handleLogout=()=>{
    dispatch(logout(usertoken));
    navigate("/login");
    console.log("logout succcess");
    console.log("user ",user);
    console.log("usertoken ",usertoken);
  }
  return (
    <>
      <div className="main_navbar_div">
        <div className="logo_navbar">
          <h1 className="logo_heading">LOGO</h1>
        </div>
        <div className="navbar_content">
          <ul className="navbar_content_lists">
            <li className="navbar_content_list">
              <Link to="/" className="nav_link">
                Home
              </Link>
            </li>
            {user && usertoken !== "" ? (
              <>
                <li className="navbar_content_list">
                  <Link to="/chat" className="nav_link">
                    <Badge badgeContent={6} color="primary">
                      <MailIcon color="action" className="mail_icon" onClick={()=>navigate("/chat")} />
                    </Badge>
                  </Link>
                </li>
                <li className="navbar_content_list">
                  <Link className="nav_link" onClick={handleLogout}>
                    {user.name}
                  </Link>
                </li>
                <li className="navbar_content_list">
                  <Link className="nav_link" onClick={handleLogout}>
                    Logout
                  </Link>
                </li>
              </>
            ) : (
              <>
                <li className="navbar_content_list">
                  <Link to="/register" className="nav_link">
                    Register
                  </Link>
                </li>
                <li className="navbar_content_list">
                  <Link to="/login" className="nav_link">
                    Login
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </>
  );
};

export default Navbar;
