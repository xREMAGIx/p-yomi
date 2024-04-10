import React, { forwardRef, ChangeEvent } from "react";
import "./index.scss";

interface CheckboxProps {
  id: string;
  name?: string;
  checked: boolean;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  children?: React.ReactNode;
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ id, name = "", checked, onChange = () => {}, children }, ref) => (
    <div className="a-checkbox">
      <div className="a-checkbox_main">
        <input
          className="a-checkbox_main_input"
          type="checkbox"
          id={id}
          ref={ref}
          checked={checked}
          name={name}
          onChange={onChange}
        />
        <label className="a-checkbox_main_label" htmlFor={id}>
          {children}
        </label>
      </div>
    </div>
  )
);

export default Checkbox;
