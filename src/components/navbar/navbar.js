import React, { useState } from "react";
import LeftMenu from "./leftMenu";
import RightMenu from "./rightMenu";
import { Drawer, Button } from "antd";
import "./navbar.scss";
import { AlignRightOutlined } from "@ant-design/icons";
import logo from "../../images/logo.png";
import logoSmall from "../../images/logo_small.png";

const Navbar = ({}) => {
  const [visible, setVisible] = useState(false);

  const showDrawer = () => {
    setVisible(true);
  };

  const onClose = () => {
    setVisible(false);
  };

  return (
    <nav className="menu">
      <div className="menu_horizontal">
        <div className="menu_left">
          <div className="menu__logo">
            <img src={logo} alt="logo" />
          </div>
          <LeftMenu mode="horizontal" />
        </div>
        <div className="menu_right">
          <RightMenu mode="horizontal" />
        </div>
      </div>

      <div className="menu_mobile">
        <div className="menu__logo">
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
