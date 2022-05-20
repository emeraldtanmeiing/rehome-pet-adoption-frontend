import React from "react";
import { Menu } from "antd";
import { Link, useLocation } from "react-router-dom";
import useAuthContext from "../../hooks/useAuthContext";


const LeftMenu = ({ mode }) => {
  const { accountType, accountID } = useAuthContext();

  const location = useLocation();
  const { pathname } = location;

  const MenuForPublic = (
    <>
      <Menu.Item>
        <Link to={"/adopt"}>Adopt pet</Link>
      </Menu.Item>
      <Menu.Item disabled={true}>
        <Link to={"/event"}>Local events</Link>
      </Menu.Item>
    </>
  );

  const MenuForAdopter = (
    <>
      <Menu.Item>
        <Link to={"/adopt"}>Adopt pet</Link>
      </Menu.Item>
      <Menu.Item disabled={true}>
        <Link to={"/events"}>Local events</Link>
      </Menu.Item>
      <Menu.Item disabled={true}>
        <Link to={"/applications"}>My applications</Link>
      </Menu.Item>
    </>
  );

  const MenuForRescuer = (
    <>
      <Menu.Item>
        <Link to={"/rescuer/pets/upload"}>Upload a pet</Link>
      </Menu.Item>
      <Menu.Item>
        <Link to={`/rescuer/pets?rescuerID=${accountID}`}>My pets</Link>
      </Menu.Item>
      <Menu.Item>
        <Link to={"/rescuer/events"}>My events</Link>
      </Menu.Item>
      <Menu.Item>
        <Link to={"/rescuer/applications"}>View applications</Link>
      </Menu.Item>
    </>
  );

  const MenuForAdmin = (
    <>
      <Menu.Item>
        <Link to={"/admin/dashboard"}>Dashboard</Link>
      </Menu.Item>
      <Menu.Item>
        <Link to={"/admin/rescuers"}>All rescuers</Link>
      </Menu.Item>
    </>
  );

  return (
    <Menu mode={mode} disabledOverflow={true} selectedKeys={[pathname]}>
      {!accountID
        ? MenuForPublic
        : accountType === "adopter"
        ? MenuForAdopter
        : accountType === "rescuer"
        ? MenuForRescuer
        : MenuForAdmin}
    </Menu>
  );
};


  /* <Menu.Item>
          <Link to={"/about"}>About us</Link>
        </Menu.Item> */



  /* <SubMenu title={<span>Blogs</span>}>
  <MenuItemGroup title="Item 1">
    <Menu.Item key="setting:1">Option 1</Menu.Item>
    <Menu.Item key="setting:2">Option 2</Menu.Item>
  </MenuItemGroup>
  <MenuItemGroup title="Item 2">
    <Menu.Item key="setting:3">Option 3</Menu.Item>
    <Menu.Item key="setting:4">Option 4</Menu.Item>
  </MenuItemGroup>
</SubMenu>; */


export default LeftMenu;
