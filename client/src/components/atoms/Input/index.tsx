import React, { forwardRef } from "react";
import "./index.scss";
import Icon from "@client/components/atoms/Icon";
import { mapModifiers } from "@client/libs/functions";

/**
 * USEFUL PROPS IN SCOPE
 * Attribute: name, id, disabled, placeholder, value, maxLength, autoComplete,
 * Events handler: onChange, onBlur, onFocus
 */
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  type?: "text" | "number" | "email" | "password";
  modifiers?: "default" | "outline" | "transparent";
  id: string;
  label?: string;
  error?: string;
  isSearch?: boolean;
}

const InputRef: React.ForwardRefRenderFunction<HTMLInputElement, InputProps> = (
  {
    type,
    modifiers,
    label,
    id,
    error,
    disabled,
    placeholder,
    value,
    maxLength,
    autoComplete,
    name,
    isSearch,
    onBlur,
    onFocus,
    onChange,
    required,
    ...props
  },
  ref
) => (
  <div
    className={mapModifiers(
      "a-input",
      type,
      modifiers,
      error && "error",
      disabled && "disabled",
      isSearch && "search"
    )}
  >
    {label && (
      <div className="a-input_label">
        <label htmlFor={id}>{label}</label>
        {required && <span className="a-input_label-required">*</span>}
      </div>
    )}
    <div className="a-input_wrap">
      <input
        {...props}
        className="a-input_input"
        type={type}
        ref={ref}
        disabled={disabled}
        placeholder={placeholder}
        maxLength={maxLength}
        autoComplete={autoComplete}
        value={value}
        onBlur={onBlur}
        onFocus={onFocus}
        onChange={onChange}
        name={name}
      />
      {isSearch && (
        <button className="a-input_searchBtn" type="submit">
          <Icon iconName="search" size="16" />
        </button>
      )}
    </div>
    {error && <span className={"a-input_message-error"}>{error}</span>}
  </div>
);
const Input = forwardRef(InputRef);

Input.defaultProps = {
  type: "text",
  error: undefined,
  modifiers: "default",
};

export default Input;
