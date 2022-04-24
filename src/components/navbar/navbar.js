import React, { useState, useContext } from "react";
import LeftMenu from "./leftMenu";
import RightMenu from "./rightMenu";
import { Drawer, Button } from "antd";
import "./navbar.scss";
import { AlignRightOutlined } from "@ant-design/icons";
import logo from "../../images/logo.png";
import logoSmall from "../../images/logo_small.png";
import { Routes, Navigate, Outlet, useLocation, useNavigate } from "react-router-dom";
import AuthContext from "../../context/authContext";

const Navbar = ({}) => {
  const [visible, setVisible] = useState(false);

  const showDrawer = () => {
    setVisible(true);
  };

  const onClose = () => {
    setVisible(false);
  };

  
  const Auth = useContext(AuthContext);
  const accountType = Auth.auth?.type;
  const accessToken = Auth.auth?.accessToken;

  const navigate = useNavigate();
  const onClick = () => {
    if(!accessToken || accountType=="adopter"){
      navigate("/");
    }else if(accountType=="rescuer"){
      navigate("/rescuer/pets");
    }else if(accountType=="admin"){
      navigate("/admin/dashboard")
    }else{
      navigate(-1)
    }
  }

  return (
    <nav className="menu">
      <div className="menu_horizontal">
        <div className="menu_left">
          <div className="menu__logo" onClick={onClick}>
            <img src={logo} alt="logo" />
          </div>
          <LeftMenu mode="horizontal" />
        </div>
        <div className="menu_right">
          <RightMenu mode="horizontal" />
        </div>
      </div>

      <div className="menu_mobile">
        <div className="menu__logo" onClick={onClick}>
          <img src={logoSmall} alt="logo" />
        </div>
        <Button
          className="menu__mobile-button"
          type="primary"
          onClick={showDrawer}
        >
          <AlignRightOutlined />
        </Button>
        <Drawer
          title="Rehome: Adopt a pet"
          placement="right"
          className="menu_drawer"
          closable={false}
          onClose={onClose}
          visible={visible}
        >
          <LeftMenu mode="inline" />
          <RightMenu mode="inline" />
        </Drawer>
      </div>
    </nav>
  );
};

export default Navbar;
