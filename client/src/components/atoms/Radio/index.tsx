import React, { useId } from "react";
import "./index.scss";

interface RadioProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

const Radio = React.forwardRef<HTMLInputElement, RadioProps>(
  ({ label, type = "checkbox", ...inputProps }, ref) => {
    const id = useId();

    return (
      <label htmlFor={id} className="a-radio">
        <input
          {...inputProps}
          type={type}
          ref={ref}
          id={id}
          className="a-radio_input"
        />
        <span className="a-radio_holder" />
        <span className="a-radio_label">{label}</span>
      </label>
    );
  }
);

export default Radio;
