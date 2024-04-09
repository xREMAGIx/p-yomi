import { mapModifiers } from "@client/libs/functions";
import React from "react";
import "./index.scss";

export type TagColor = "mayGreen" | "coral" | "radicalRed";
export type TagStyle = (GeneralTextStyle | TagColor | FontWeightStyle)[];

interface TagProps {
  modifiers?: TagStyle;
  label?: string;
}

const Tag: React.FC<TagProps> = ({ modifiers, label }) => {
  return (
    <div className={mapModifiers("a-tag", modifiers)}>
      <span>{label}</span>
    </div>
  );
};

Tag.defaultProps = {
  modifiers: undefined,
  label: undefined,
};

export default Tag;
