import Button from "@client/components/atoms/Button";
import Heading from "@client/components/atoms/Heading";
import Icon, { IconName } from "@client/components/atoms/Icon";
import Link from "@client/components/atoms/Link";
import Text from "@client/components/atoms/Text";
import { mapModifiers } from "@client/libs/functions";
import { RegisteredRouter, ToPathOption } from "@tanstack/react-router";
import React, { useState } from "react";
import "./index.scss";

type RT = RegisteredRouter["routeTree"];

interface SidebarProps {}

const sidebarMenu: {
  //TODO: Check later
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  path: ToPathOption<RT, "/", any>;
  title: string;
  icon: IconName;
}[] = [
  {
    path: "/",
    title: "Home",
    icon: "home",
  },
  {
    path: "/product",
    title: "Product",
    icon: "barcode",
  },
  {
    path: "/warehouse",
    title: "Warehouse",
    icon: "warehouse",
  },
  {
    path: "/goods-receipt",
    title: "Goods Receipt",
    icon: "packageImport",
  },
  {
    path: "/customer",
    title: "Customer",
    icon: "customer",
  },
];

const Sidebar: React.FC<SidebarProps> = () => {
  //* States
  const [isMinimized, setIsMinimized] = useState(false);

  //* Functions
  const handleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  return (
    <div className={mapModifiers("t-sidebar", isMinimized && "minimized")}>
      <div className="t-sidebar_background" />
      <div className="t-sidebar_content">
        <div className="t-sidebar_header u-m-t-16">
          <div className="t-sidebar_mini_icon">
            <Button
              variant="icon"
              modifiers={["inline"]}
              onClick={handleMinimize}
            >
              <Icon iconName="menu" color="soap" />
            </Button>
          </div>
          <div className="t-sidebar_heading">
            <Heading type="h6" modifiers={["italic", "center"]}>
              Yomi
            </Heading>
          </div>
        </div>
        <div className="u-m-t-24">
          {sidebarMenu.map((ele) => (
            <Link
              key={ele.path}
              to={ele.path}
              customClassName="t-sidebar_menu_link"
              activeClassName="t-sidebar_menu_link-active"
            >
              <div className="t-sidebar_menu_item">
                <div className="u-m-r-8 u-m-x-4">
                  <Icon iconName={ele.icon} size="24" color="soap" />
                </div>
                <div className="t-sidebar_menu_title">
                  <Text>{ele.title}</Text>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

Sidebar.defaultProps = {};

export default Sidebar;
