import { mapModifiers } from "@client/libs/functions";
import React from "react";
import "./index.scss";

const iconList = {
  loading: "loading",
  search: "search",
  arrowLeft: "arrowLeft",
  arrowRight: "arrowRight",
  barcode: "barcode",
  home: "home",
  minimize: "minimize",
  menu: "menu",
  warehouse: "warehouse",
  delete: "delete",
  close: "close",
  packageImport: "packageImport",
  plus: "plus",
};

export type IconName = keyof typeof iconList;

export type IconSize = "12" | "16" | "20" | "24" | "34" | "38";
interface IconProps {
  iconName: IconName;
  size?: IconSize;
  color?: Color;
}
const Icon: React.FC<IconProps> = ({ iconName, size, color }) => (
  <div
    role="img"
    aria-label={iconName}
    className={mapModifiers("a-icon", iconName, size, color)}
  />
);

Icon.defaultProps = {
  size: "24",
};

export default Icon;
