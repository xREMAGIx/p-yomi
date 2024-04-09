import { mapModifiers } from "@client/libs/functions";
import React from "react";
import "./index.scss";

interface SwitchProps {
  isChecked: boolean;
  handleChange: () => void;
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
  <div className={mapModifiers("a-switch", isChecked && "isChecked")}>
    {firstLabel || secondLabel ? (
      <label htmlFor={inputId} className="a-switch_label">
        {isChecked ? firstLabel : secondLabel}
      </label>
    ) : (
      <div className="a-switch_display" />
    )}
    <input
      onChange={handleChange}
      type="checkbox"
      id={inputId}
      className="a-switch_input"
    />
  </div>
);

Switch.defaultProps = {};

export default Switch;
