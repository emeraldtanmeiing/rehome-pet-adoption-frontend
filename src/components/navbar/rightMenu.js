import React, { Component, useContext } from "react";
import { Menu } from "antd";
import { Link } from "react-router-dom";
import AuthContext from "../../context/authContext";
import Cookies from "js-cookie";

const RightMenu = ({ mode }) => {
  const Auth = useContext(AuthContext);
  const accessToken = Auth.auth?.accessToken;

  const handleLogout = () => {
    Auth.setAuth({});
    Cookies.remove("accessToken");
    Cookies.remove("refreshToken");
    Cookies.remove("type");
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

  return (
    <Menu mode={mode} disabledOverflow={true}>
      {!accessToken ? MenuForPublic : MenuForLoginUser}
    </Menu>
  );
};

export default RightMenu;
