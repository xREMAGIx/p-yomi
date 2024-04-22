import Icon from "@client/components/atoms/Icon";
import { mapModifiers } from "@client/libs/functions";
import React from "react";
import "./index.scss";

export type ChipColor = "mayGreen" | "coral" | "radicalRed";
export type ChipVariant = "filled" | "outlined";
export type ChipStyle = (
  | GeneralTextStyle
  | ChipColor
  | FontWeightStyle
  | ChipVariant
)[];

interface ChipProps {
  frontEl?: React.ReactNode;
  modifiers?: ChipStyle;
  label?: string;
  onClick?: () => void;
  onDelete?: () => void;
}

const Chip: React.FC<ChipProps> = ({
  modifiers,
  label,
  frontEl,
  onClick,
  onDelete,
}) => {
  return (
    <div
      className={`${mapModifiers("a-chip", modifiers, onClick && "clickable")} u-d-flex u-flex-ai-center`}
      onClick={onClick}
    >
      {frontEl && <div className="u-m-r-8">{frontEl}</div>}
      <span>{label}</span>
      {onDelete && (
        <div className="u-m-l-8" onClick={onDelete}>
          <Icon iconName="close" />
        </div>
      )}
    </div>
  );
};

Chip.defaultProps = {
  modifiers: undefined,
  label: undefined,
};

export default Chip;
