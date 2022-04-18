import React, { Component } from "react";
import { Menu } from "antd";
import { Link } from "react-router-dom";

const RightMenu = ({ mode }) => {
  return (
    <Menu mode={mode} disabledOverflow={true}>
      <Menu.Item>
        <Link to={"/login"}>Log in</Link>
      </Menu.Item>
      <Menu.Item>
        <Link to={"/signup"}>Sign up</Link>
      </Menu.Item>
    </Menu>
  );
};

export default RightMenu;
