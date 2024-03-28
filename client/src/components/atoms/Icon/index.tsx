import { mapModifiers } from "@client/libs/functions";
import React from "react";
import "./index.scss";

const iconList = {
  loading: "loading",
  search: "search",
  arrowLeft: "arrowLeft",
  arrowRight: "arrowRight",
};

export type IconName = keyof typeof iconList;

export type IconSize = "14" | "15" | "16" | "20" | "24" | "34" | "38";
interface IconProps {
  iconName: IconName;
  size?: IconSize;
}
const Icon: React.FC<IconProps> = ({ iconName, size }) => (
  <i className={mapModifiers("a-icon", iconName, size)} />
);

Icon.defaultProps = {
  size: "24",
};

export default Icon;
