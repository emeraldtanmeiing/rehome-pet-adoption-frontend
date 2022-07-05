import React, { useContext } from "react";
import { Menu } from "antd";
import { Link, useLocation } from "react-router-dom";
import AuthContext from "../../context/authContext";
import { logout } from "../../services/auth.services";

const RightMenu = ({ mode }) => {
  const Auth = useContext(AuthContext);
  const accountID = Auth.auth?.accountID;
  const accountType = Auth.auth?.type;

  const location = useLocation();
  const { pathname } = location;

  const handleLogout = () => {
    logout();
    Auth.setAuth({});
  };

  const MenuForPublic = (
    <>
      <Menu.Item>
        <Link to={"/login"}>Log in</Link>
      </Menu.Item>
      <Menu.Item>
        <Link to={"/signup"}>Sign up</Link>
      </Menu.Item>
    </>
  );

  const MenuForLoginUser = (
    <>
      <Menu.Item>
        <Link to={"/profile"}>My Profile</Link>
      </Menu.Item>
      <Menu.Item onClick={handleLogout}>Logout</Menu.Item>
    </>
  );

  const MenuForAdmin = (
    <>
      <Menu.Item onClick={handleLogout}>Logout</Menu.Item>
    </>
  );

  return (
    <Menu mode={mode} disabledOverflow={true} selectedKeys={[pathname]}>

      {!accountID
        ? MenuForPublic
        : accountType === "admin"
        ? MenuForAdmin
        : MenuForLoginUser}

    </Menu>
  );
};

export default RightMenu;
