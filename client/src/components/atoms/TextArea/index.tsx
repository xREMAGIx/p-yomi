import { mapModifiers } from "@client/libs/functions";
import React, { forwardRef } from "react";
import "./index.scss";

interface TextAreaProps extends React.InputHTMLAttributes<HTMLTextAreaElement> {
  id: string;
  label?: string;
  required?: boolean;
  rows?: number;
  placeholder?: string;
  error?: string;
  colorError?: "white";
  value?: string;
  disabled?: boolean;
}

const TextAreaRef: React.ForwardRefRenderFunction<
  HTMLTextAreaElement,
  TextAreaProps
> = (
  {
    id,
    label,
    required,
    rows = 4,
    placeholder,
    error,
    colorError,
    value,
    disabled,
    ...rest
  },
  ref
) => (
  <div className="a-text-area">
    {label && (
      <div className="a-text-area_label">
        <label htmlFor={id}>{label}</label>
        {required && <span className="a-text-area_label-required">*</span>}
      </div>
    )}
    <textarea
      className={mapModifiers("a-text-area_inputele", error && "error")}
      value={value}
      ref={ref}
      rows={rows}
      disabled={disabled}
      placeholder={placeholder}
      id={id}
      {...rest}
    />
    {error && (
      <span className={mapModifiers("a-text-area_errorMessage", colorError)}>
        {error}
      </span>
    )}
  </div>
);

const TextArea = forwardRef(TextAreaRef);

export default TextArea;
