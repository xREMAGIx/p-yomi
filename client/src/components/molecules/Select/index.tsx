import { mapModifiers } from "@client/libs/functions";
import ReactSelect, { GroupBase, Props } from "react-select";
import "./index.scss";

interface CustomSelectProps {
  label?: string;
  customClassname?: string;
  error?: string;
}

function Select<
  OptionType,
  IsMulti extends boolean = false,
  GroupType extends GroupBase<OptionType> = GroupBase<OptionType>,
>({
  id,
  label,
  required,
  error,
  customClassname,
  ...props
}: Props<OptionType, IsMulti, GroupType> & CustomSelectProps) {
  return (
    <div className="m-select">
      {label && (
        <div className="m-select_label">
          <label htmlFor={id}>{label}</label>
          {required && <span className="m-select_label-required">*</span>}
        </div>
      )}
      <ReactSelect
        {...props}
        styles={{
          control: (baseStyles) => ({
            ...baseStyles,
            borderRadius: "0.5rem",
          }),
        }}
        className={mapModifiers("m-select_input", customClassname ?? "")}
      />
      {error && <span className={"m-select_message-error"}>{error}</span>}
    </div>
  );
}

export default Select;
