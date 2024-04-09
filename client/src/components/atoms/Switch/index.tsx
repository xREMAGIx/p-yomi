import { mapModifiers } from "@client/libs/functions";
import React from "react";
import "./index.scss";

interface SwitchProps {
  isChecked: boolean;
  handleClick?: () => void;
  handleChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  inputId: string;
  firstLabel?: string;
  secondLabel?: string;
}

const Switch: React.FC<SwitchProps> = ({
  isChecked,
  handleChange,
  inputId,
  firstLabel,
  secondLabel,
}) => (
  <div
    className={mapModifiers("a-switch", isChecked && "isChecked")}
    // onClick={handleClick}
  >
    {firstLabel || secondLabel ? (
      <label htmlFor={inputId} className="a-switch_label">
        {isChecked ? firstLabel : secondLabel}
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
