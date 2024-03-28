import React from "react";
import "./index.scss";
import { mapModifiers } from "@client/libs/functions";
import Icon from "@client/components/atoms/Icon";

export type VariantButton = "primary" | "secondary" | "outlinePrimary";
export type StyleButton = "md" | "lg" | "inline";
export type TextStyle = GeneralTextStyle;

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: VariantButton;
  modifiers?: (StyleButton | FontWeightStyle | TextStyle)[];
  isLoading?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant,
  modifiers,
  name,
  id,
  className,
  disabled,
  type = "button",
  isLoading,
  onClick,
}) => (
  <button
    id={id}
    name={name}
    type={type}
    disabled={disabled}
    onClick={onClick}
    className={mapModifiers(
      "a-button",
      variant,
      modifiers,
      className,
      isLoading && "loading"
    )}
  >
    {isLoading ? <Icon iconName="loading" /> : children}
  </button>
);

Button.defaultProps = {
  variant: "primary",
  modifiers: ["md"],
  isLoading: false,
};

export default Button;
