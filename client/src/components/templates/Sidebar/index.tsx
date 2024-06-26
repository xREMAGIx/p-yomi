import Button from "@client/components/atoms/Button";
import Heading from "@client/components/atoms/Heading";
import Icon, { IconName } from "@client/components/atoms/Icon";
import Link from "@client/components/atoms/Link";
import Text from "@client/components/atoms/Text";
import { mapModifiers } from "@client/libs/functions";
import { RegisteredRouter, ToPathOption } from "@tanstack/react-router";
import React, { useState } from "react";
import "./index.scss";
import { useTranslation } from "@client/libs/translation";

type RT = RegisteredRouter["routeTree"];

interface SidebarProps {}

const sidebarMenu: {
  //TODO: Check later
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  path: ToPathOption<RT, "/", any>;
  titleCode: string;
  icon: IconName;
}[] = [
  {
    path: "/",
    titleCode: "dashboard",
    icon: "home",
  },
  {
    path: "/order",
    titleCode: "order",
    icon: "receipt",
  },
  {
    path: "/product",
    titleCode: "product",
    icon: "barcode",
  },
  {
    path: "/warehouse",
    titleCode: "warehouse",
    icon: "warehouse",
  },
  {
    path: "/goods-receipt",
    titleCode: "goodsReceipt",
    icon: "packageImport",
  },
  {
    path: "/customer",
    titleCode: "customer",
    icon: "customer",
  },
];

const Sidebar: React.FC<SidebarProps> = () => {
  //* Hooks
  const { t } = useTranslation();

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
              <Icon iconName="menu" color="violet-color" />
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
                  <Icon iconName={ele.icon} size="24" color="violet-color" />
                </div>
                <div className="t-sidebar_menu_title">
                  <Text>{t(`menu.${ele.titleCode}`)}</Text>
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
