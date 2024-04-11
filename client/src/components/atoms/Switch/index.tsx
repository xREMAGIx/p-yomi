import { mapModifiers } from "@client/libs/functions";
import React from "react";
import "./index.scss";

interface SwitchProps {
  isChecked: boolean;
  handleClick?: () => void;
  handleChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  inputId: string;
  offElement?: React.ReactNode;
  onElement?: React.ReactNode;
}

const Switch: React.FC<SwitchProps> = ({
  isChecked,
  handleChange,
  inputId,
  offElement,
  onElement,
}) => (
  <div
    className={mapModifiers("a-switch", isChecked && "isChecked")}
    // onClick={handleClick}
  >
    {offElement || onElement ? (
      <label htmlFor={inputId} className="a-switch_label">
        {isChecked ? offElement : onElement}
      </label>
    ) : (
      <label htmlFor={inputId}>
        <div className="a-switch_display" />
      </label>
    )}
    <input
      onChange={handleChange}
      type="checkbox"
      id={inputId}
      className="a-switch_input"
      checked={isChecked}
    />
  </div>
);

Switch.defaultProps = {};

export default Switch;
