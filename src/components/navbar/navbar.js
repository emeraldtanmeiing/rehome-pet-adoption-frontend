import React, { useState } from "react";
import useAuthContext from "../../hooks/useAuthContext";
import { useNavigate } from "react-router-dom";

import { Drawer, Button } from "antd";
import { AlignRightOutlined } from "@ant-design/icons";
import LeftMenu from "./leftMenu";
import RightMenu from "./rightMenu";
import logo from "../../images/logo.png";
import logoSmall from "../../images/logo_small.png";

import "./navbar.scss";

const Navbar = () => {
  const [visible, setVisible] = useState(false);

  const showDrawer = () => {
    setVisible(true);
  };

  const onClose = () => {
    setVisible(false);
  };

  
  const { accountType, accountID } = useAuthContext();

  const navigate = useNavigate();
  const onClick = () => {
    if(!accountID || accountType === "adopter"){
      navigate("/");
    }else if(accountType === "rescuer"){
      navigate(`/rescuer/pets-listing?rescuerID=${accountID}`);
    }else if(accountType === "admin"){
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
          closable={true}
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
